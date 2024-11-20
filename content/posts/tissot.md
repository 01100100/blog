---
title: "Tissot"
subtitle: ""
date: 2024-11-17T17:32:09+01:00
lastmod: 2024-11-17T17:32:09+01:00
draft: false
authors: []
description: ""

tags: []
categories: []
series: []

hiddenFromHomePage: false
hiddenFromSearch: false

featuredImage: ""
featuredImagePreview: ""

toc:
  enable: true
math:
  enable: false
lightgallery: false
license: ""
---

<!--more-->

I listened to a very interesting talk from @javi called "Mercator is your friend". It was great and talked about, amongst other things, how different map projections distort the world in different ways. How the measured properties associated with projecting a 3d globe onto a 2d plane change with different projections. And finally, how Mercator has it's flaws like us all, but is a great projection fit for many roles.

Afterwards, Konstantin Käfer, the OG behind Mapbox-gl (and the forked Maplibre GL) made a very good point, that thanks to the mapping libs, we can change between projections on the fly, and are not constrained to a single projection. it's a solid point and made me think a little about how you could use the interactivity in web maps to demonstrate how the projections differ in there representation of the world.

This is not a new idea, Geraradus Mercator would have pondered this in the 16th century.  
you can date it back to the 19th century, when a French mathematican called Nicolas Auguste Tissot

In modern times we can visualize all this maths with the help of some [WebGL](https://en.wikipedia.org/wiki/WebGL) magic, and 

I am aware of the ongoing work in the Maplibre Project to make a globe projection and was checking out the pre-realse version when I had an idea!

I would make a nice side-by-side map and show how the viewport from one map, or better yet the bounds that the map projection has inside the viewport, is represented on the other map by highlighting an area. Any interactivity by moving and zooming should by synced such that the shape changes on the fly, giving a idea of how the mapping between the two projections distorts space. It's easier to understand when you see it, at least I hope, take a peak below to see if it makes sense.

So I started out with an idea and some vanilla-js. Maplibre has a really nice docs website, complete with many examples that show you how to build basic things. I took some inspiration from [Sync movement of multiple maps](https://maplibre.org/maplibre-gl-js/docs/examples/sync-move/) and created two maps side by side, synced with the 

To style the maps I used the MapLibre Demo Style and monkey patched it with a extra [Graticul](https://en.wikipedia.org/wiki/Graticule_(cartography)) layer as "hand rails" to accent the effect.  I also patched a version of the style to use the `globe` projection. I added a control to toggle projecting one maps bounds onto the other and voila, this was the result!

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <title>Sync movement of multiple maps</title>
    <meta property="og:description" content="Synchronize MapLibre GL JS maps with the sync-move plugin." />
    <meta charset='utf-8'>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel='stylesheet' href='https://unpkg.com/maplibre-gl@5.0.0-pre.1/dist/maplibre-gl.css' />
    <script src='https://unpkg.com/maplibre-gl@5.0.0-pre.1/dist/maplibre-gl.js'></script>

    <style>
        body {
            margin: 0;
            padding: 0;
        }

        html,
        body {
            height: 100%;
        }

        #map1,
        #map2 {
            height: 100%;
            width: 100%;
        }

        .maps {
            display: flex;
            width: 100%;
            height: 100%;
        }

@media (max-width: 768px) {
    .maps {
        flex-direction: column;
        height: 100vh;
    }

    #map1,
    #map2 {
        height: 100vh;
    }
}
    </style>
</head>

<body>
    <div class="maps" style="background-color: skyblue;">
        <div id="map1"></div>
        <div id="map2"></div>
    </div>
    <script>

        let map1, map2;
        let sourceProjection = 'none'
        let syncDisabled = false;

        function removeFootprints() {
            console.log('Removing all footprints');
            const maps = [map1, map2];
            maps.forEach(map => {
                if (map.getLayer('viewport-polygon')) {
                    map.removeLayer('viewport-polygon');
                }
                if (map.getSource('viewport-polygon')) {
                    map.removeSource('viewport-polygon');
                }
            });
        }

        function deselectAllButtons() {
            const buttons = document.querySelectorAll('button');
            buttons.forEach(button => {
                button.style.backgroundColor = '';
            });
        }

        function updatePolygon(source, destination) {
            const bounds = source.getBounds();
            const coordinates = [
                [bounds.getSouthWest().lng, bounds.getSouthWest().lat],
                [bounds.getNorthWest().lng, bounds.getNorthWest().lat],
                [bounds.getNorthEast().lng, bounds.getNorthEast().lat],
                [bounds.getSouthEast().lng, bounds.getSouthEast().lat],
                [bounds.getSouthWest().lng, bounds.getSouthWest().lat]
            ];
            if (destination.getSource('viewport-polygon')) {
                console.log(`Updating polygon on ${destination.getContainer().id}`);
                destination.getSource('viewport-polygon').setData({
                    'type': 'Feature',
                    'geometry': {
                        'type': 'Polygon',
                        'coordinates': [coordinates]
                    }
                });
            }
        }

        function addfootprint(source, destination) {
            syncDisabled = true;
            console.log(`Projecting ${source} onto ${destination}`);
            const bounds = source.getBounds();
            const coordinates = [
                [bounds.getSouthWest().lng, bounds.getSouthWest().lat],
                [bounds.getNorthWest().lng, bounds.getNorthWest().lat],
                [bounds.getNorthEast().lng, bounds.getNorthEast().lat],
                [bounds.getSouthEast().lng, bounds.getSouthEast().lat],
                [bounds.getSouthWest().lng, bounds.getSouthWest().lat]
            ];
            destination.addSource('viewport-polygon', {
                'type': 'geojson',
                'data': {
                    'type': 'Feature',
                    'geometry': {
                        'type': 'Polygon',
                        'coordinates': [coordinates]
                    }
                }
            });
            destination.addLayer({
                'id': 'viewport-polygon',
                'type': 'fill',
                'source': 'viewport-polygon',
                'layout': {},
                'paint': {
                    'fill-color': '#F08080',
                    'fill-opacity': 0.5
                }
            });
            source.on('render', () => {
                updatePolygon(source, destination);
            });
        }

        function moveToMapPosition(master, clones) {
            var center = master.getCenter();
            var zoom = master.getZoom();
            var bearing = master.getBearing();
            var pitch = master.getPitch();

            clones.forEach(function (clone) {
                clone.jumpTo({
                    center: center,
                    zoom: zoom,
                    bearing: bearing,
                    pitch: pitch
                });
            });
        }

        // Sync movements of two maps.
        //
        // All interactions that result in movement end up firing
        // a "move" event. The trick here, though, is to
        // ensure that movements don't cycle from one map
        // to the other and back again, because such a cycle
        // - could cause an infinite loop
        // - prematurely halts prolonged movements like
        //   double-click zooming, box-zooming, and flying
        function syncMaps() {
            var maps;
            var argLen = arguments.length;
            if (argLen === 1) {
                maps = arguments[0];
            } else {
                maps = [];
                for (var i = 0; i < argLen; i++) {
                    maps.push(arguments[i]);
                }
            }

            // Create all the movement functions, because if they're created every time
            // they wouldn't be the same and couldn't be removed.
            var fns = [];
            maps.forEach(function (map, index) {
                fns[index] = sync.bind(null, map, maps.filter(function (o, i) { return i !== index; }));
            });

            function on() {
                maps.forEach(function (map, index) {
                    map.on('move', fns[index]);
                });
            }

            function off() {
                maps.forEach(function (map, index) {
                    map.off('move', fns[index]);
                });
            }

            // When one map moves, we turn off the movement listeners
            // on all the maps, move it, then turn the listeners on again
            function sync(master, clones) {
                if (!syncDisabled) {
                    off();
                    moveToMapPosition(master, clones);
                    on();
                }
            }

            on();
            return function () { off(); fns = []; maps = []; };
        }

        class FootprintControl {
            constructor(otherMap) {
                this.otherMap = otherMap;
            }

            onAdd(map) {
                this._map = map;
                this._container = document.createElement("div");
                this._container.className = "maplibregl-ctrl maplibregl-ctrl-group";
                const button = document.createElement("button");
                button.type = "button";
                button.title = "Lock";
                button.style.borderRadius = "4px";
                button.style.padding = "8px";
                button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M208.5 62.3l28.1-36.9C248.8 9.4 267.8 0 288 0c28.5 0 53.6 18.7 61.8 46l17.8 59.4c10.3 34.4 36.1 62 69.8 74.6l39.8 14.9c20.9 7.9 34.8 27.9 34.8 50.2c0 16.9-7.9 32.8-21.5 42.9l-67.3 50.5c-24.3 18.2-37.2 47.9-33.8 78.1l2.5 22.7c4.3 38.7-26 72.6-65 72.6c-14.8 0-29.3-5.1-40.8-14.3l-55.4-44.3c-4.5-3.6-9.3-6.7-14.5-9.2c-15.8-7.9-33.7-10.4-51-7.3L82.4 451.9C47.8 458.2 16 431.6 16 396.5c0-13.2 4.7-26 13.1-36.2l11.2-13.4c14.6-17.4 22.6-39.4 22.6-62.1c0-18.8-5.5-37.2-15.8-53L8.8 173.5C3.1 164.7 0 154.4 0 143.9c0-33.4 30.1-58.8 63-53.2l51.3 8.7c35.9 6.1 72.2-8.2 94.2-37.1z"/></svg>`;
                button.addEventListener('click', () => {
                    console.log(`Footprint button clicked on ${this._map.getContainer().id}`);
                    removeFootprints();
                    deselectAllButtons();
                    if (sourceProjection === this._map.getContainer().id) {
                        sourceProjection = 'none';
                        syncDisabled = false;
                        moveToMapPosition(this._map, [this.otherMap]);
                    } else {
                        sourceProjection = this._map.getContainer().id;
                        button.style.backgroundColor = 'hotpink';
                        addfootprint(this._map, this.otherMap);
                    }
                });

                this._container.appendChild(button);
                return this._container;
            }

            onRemove() {
                this._container.parentNode.removeChild(this._container);
                this._map = undefined;
            }
        }

        fetch('https://demotiles.maplibre.org/style.json')
            .then(response => response.json())
            .then(style => {
                const gridStyle = {
                    ...style, sources: {
                        ...style.sources, grid: {
                            type: 'vector', tiles: [
                                "grid://{z}/{x}/{y}"
                            ]
                        },
                    }, layers: [
                        ...style.layers, {
                            "id": "background-grid",
                            "type": "line",
                            "source": "grid",
                            "source-layer": "lines",
                            "paint": {
                                "line-width": [
                                    "case",
                                    ["==", ["get", "width"], "wide"],
                                    2,
                                    1
                                ],
                                "line-color": "white",
                                "line-opacity": 0.3
                            },
                        },
                    ]
                }


                const globeStyle = { ...gridStyle, projection: { type: 'globe' } };

                const tileBase64 = 'GvwKeAIKBWxpbmVzKIAgGgV3aWR0aCIGCgR3aWRlIggKBm5hcnJvdxIRGAISAgAAIgkJgECAQAoA5T8SDxgCEgIAACIHCQAACoBAABIQGAISAgAAIggJAIBACgDlPxIQGAISAgABIggJAOQBCoBAABIRGAISAgABIgkJ5AGAQAoA5T8SEBgCEgIAASIICQDIAwqAQAASERgCEgIAASIJCcgDgEAKAOU/EhAYAhICAAEiCAkAqgUKgEAAEhAYAhICAAEiCAkAjgcKgEAAEhEYAhICAAEiCQmqBYBACgDlPxIRGAISAgABIgkJjgeAQAoA5T8SEBgCEgIAASIICQDyCAqAQAASEBgCEgIAASIICQDWCgqAQAASEBgCEgIAASIICQC4DAqAQAASEBgCEgIAASIICQCcDgqAQAASERgCEgIAASIJCfIIgEAKAOU/EhEYAhICAAEiCQnWCoBACgDlPxIRGAISAgABIgkJuAyAQAoA5T8SERgCEgIAASIJCZwOgEAKAOU/EhAYAhICAAAiCAkAgBAKgEAAEhAYAhICAAEiCAkA5BEKgEAAEhAYAhICAAEiCAkAyBMKgEAAEhAYAhICAAEiCAkAqhUKgEAAEhAYAhICAAEiCAkAjhcKgEAAEhAYAhICAAEiCAkA8hgKgEAAEhAYAhICAAEiCAkA1hoKgEAAEhAYAhICAAEiCAkAuBwKgEAAEhAYAhICAAEiCAkAnB4KgEAAEhEYAhICAAAiCQmAEIBACgDlPxIRGAISAgABIgkJ5BGAQAoA5T8SERgCEgIAASIJCcgTgEAKAOU/EhEYAhICAAEiCQmqFYBACgDlPxIRGAISAgABIgkJjheAQAoA5T8SERgCEgIAASIJCfIYgEAKAOU/EhEYAhICAAEiCQnWGoBACgDlPxIRGAISAgABIgkJuByAQAoA5T8SERgCEgIAASIJCZwegEAKAOU/EhAYAhICAAAiCAkAgCAKgEAAEhAYAhICAAEiCAkA5CEKgEAAEhAYAhICAAEiCAkAyCMKgEAAEhAYAhICAAEiCAkAqiUKgEAAEhAYAhICAAEiCAkAjicKgEAAEhAYAhICAAEiCAkA8igKgEAAEhAYAhICAAEiCAkA1ioKgEAAEhAYAhICAAEiCAkAuCwKgEAAEhAYAhICAAEiCAkAnC4KgEAAEhAYAhICAAAiCAkAgDAKgEAAEhAYAhICAAEiCAkA5DEKgEAAEhAYAhICAAEiCAkAyDMKgEAAEhAYAhICAAEiCAkAqjUKgEAAEhAYAhICAAEiCAkAjjcKgEAAEhAYAhICAAEiCAkA8jgKgEAAEhAYAhICAAEiCAkA1joKgEAAEhAYAhICAAEiCAkAuDwKgEAAEhAYAhICAAEiCAkAnD4KgEAAEhEYAhICAAAiCQmAIIBACgDlPxIRGAISAgABIgkJ5CGAQAoA5T8SERgCEgIAASIJCcgjgEAKAOU/EhEYAhICAAEiCQmqJYBACgDlPxIRGAISAgABIgkJjieAQAoA5T8SERgCEgIAASIJCfIogEAKAOU/EhEYAhICAAEiCQnWKoBACgDlPxIRGAISAgABIgkJuCyAQAoA5T8SERgCEgIAASIJCZwugEAKAOU/EhEYAhICAAAiCQmAMIBACgDlPxIRGAISAgABIgkJ5DGAQAoA5T8SERgCEgIAASIJCcgzgEAKAOU/EhEYAhICAAEiCQmqNYBACgDlPxIRGAISAgABIgkJjjeAQAoA5T8SERgCEgIAASIJCfI4gEAKAOU/EhEYAhICAAEiCQnWOoBACgDlPxIRGAISAgABIgkJuDyAQAoA5T8SERgCEgIAASIJCZw+gEAKAOU/EhAYAhICAAAiCAkAgEAKgEAA';

                maplibregl.addProtocol('grid', async (params, abortController) => {
                    const tileArrayBuffer = Uint8Array.from(atob(tileBase64), c => c.charCodeAt(0));
                    return { data: tileArrayBuffer };
                });

                map1 = new maplibregl.Map({
                    container: 'map1',
                    style: globeStyle,
                    center: [0, 0],
                    zoom: 1,
                });
                map2 = new maplibregl.Map({
                    container: 'map2',
                    style: gridStyle,
                    center: [0, 0],
                    zoom: 1,
                    renderWorldCopies: false,
                });

                map1.addControl(new maplibregl.NavigationControl(), 'top-right');
                map2.addControl(new maplibregl.NavigationControl(), 'top-right');
                map1.addControl(new FootprintControl(map2), 'top-right');
                map2.addControl(new FootprintControl(map1), 'top-right');
                syncMaps(map1, map2);

            })
            .catch(error => {
                console.error('Error:', error);
            });
    </script>
</body>

</html>
```

That almost works. As you can see the globe view was really well implemented and it didnt take much to get it to work when projecting the Mercator viewport onto the globe. You could be mistaken to think that the other way round works, its almost there but there is a hiccup. The viewport of the Globe projection returned by `map.getBounds()` doesn't take into bits in the map which are clipped by the horizon. Aka the bits on the back of the globe that you can't see. 

Intuition playing with the maps gives the feeling that the shaped should be clipped at a max of 180*. When you zoom out, the polygon on the Mercator

TODO: add gif of zooming out past 180* and how the polygon changes shape.

Also you can see that the roundness is the globe is not taken into account, the resulting polygon should not be rectangle but something more eplipsal and sineusoudal (nice words). 

I needed a solution. time to bust out the maths.

## Going into the code

Now that I am getting into the logic of the Maplibre codebase, I want to work in typeScript and have the ability to ctrl + click around in vscode to get to different parts of the globe code. I also want to keep the output as a optimized static site. Therefore I turned to the big gun of next-js for this little air-rifle pellet of a "webapp". I ran `npx create-next-app --ts` and got to work porting the code.

TODO: link to the repo

TODO: screenshot of vscode with highlighting and defentions ect..

## The maths

I read up on the [https://en.wikipedia.org/wiki/Orthographic_projection](https://en.wikipedia.org/wiki/Orthographic_projection) to refresh my maths (been drinking too much gpts) and understand how the globe projection works.

Also, thanks to a great developer, there was a lot of useful knowledge in the docs for the globe branch of Maplibre.

This gave me two options:

1. I could use the `map.getZoom()` and `map.getCenter()` to calculate the bounds of the viewport and project them onto
2. I could go down the rabbit hole and learn about shaders, and update the code that is used to render the globe to create a geojson polygon from that.

ref: [https://d3js.org/d3-geo/projection](https://d3js.org/d3-geo/projection)
ref: [https://github.com/maplibre/maplibre-gl-compare](https://github.com/maplibre/maplibre-gl-compare)
ref: [https://maplibre.org/maplibre-gl-js/docs/API/classes/Map/#getbounds](https://maplibre.org/maplibre-gl-js/docs/API/classes/Map/#getbounds)
