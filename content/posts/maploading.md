---
title: "Map Loading... 🗺️📏🎨"
subtitle: "Experimenting with different vector map style loading times using maplibre-gl."
date: 2024-03-25T11:42:41+01:00
lastmod: 2024-03-25T11:42:41+01:00
draft: false
description: "Experimenting with different vector map style loading times using maplibre-gl."
summary: "Experimenting with different vector map style loading times using maplibre-gl."

tags: []
categories: []
series: []

hiddenFromHomePage: false
hiddenFromSearch: false

featuredImage: "/images/maploading/map_race.jpeg"
featuredImagePreview: ""

toc:
  enable: true
math:
  enable: false
lightgallery: false
license: ""
---
<!--more-->
## Introduction

When using a map on a digital device, it is important that it is fast to load and the map interactions are seamlessly smooth. A fast loading map will go by unnoticed as "everything works" leading to a natural feeling experience. A slow loading map will get in the way of a good user experience, leading to frustration, grief and a bad taste in the mouth.

![GIF of a slow loading map](/images/maploading/slowloading.gif)

Vector maps are being used more and more on the web. They offer a faster and more interactive experience and more ways of being styled.

{{< admonition type=question title="What is a vector map?" >}}

Vector maps use vector data, made up of points, lines and polygons with accompanying meta-data. This is downloaded to the device and the map you end up seeing on the screen, is as a result of rendering on the client side and certain styling instructions.

Vector maps are the opposite of raster maps, which are made up of pixel data pre-rendered on a server. Raster maps are harder to manipulate and style.

The best resource out there to to have a refresh on web maps is [mapschool.io](https://mapschool.io/). It explains the difference between raster and vector maps and much more.

{{< /admonition >}}

I am using [`maplibre-gl`](https://maplibre.org/maplibre-gl-js/docs/), which is a vector map library in a hobby project and  interested in finding out which map style is the fastest to load.

### Map drawing 101

A vector map library needs a _recipe_ to draw a map on the screen. The _recipe_ will have instructions telling the mapping library **where to request** the vector data from and **how to render** that data to the screen. Rendering instructions include what parts of the data to draw, what colors to use and what order to draw the layers of data in.

When you pan and zoom to a specific part of a vector map, the library will know based on this _recipe_, where to request the body of data that should fill up the screen and how to style it.

{{< admonition type=tip title="What else is it called?" >}}

This _recipe_ is often called a `style` document, which is usually a json file conforming to a specification (in my case the [Maplibre style spec](https://maplibre.org/maplibre-style-spec/)).

{{</admonition >}}

A good designer aka a cartograpaher, will design a style in a way that it shows off the best parts of the data with certain balance of space and color, producing something that looks appealing and allows easy reading of the data.

![A artist painting a map](/images/maploading/painting_map.jpeg)

### What makes things fast or slow?

The time taken to display a map on the screen will depend on where the data comes from and how complex the rendering instructions are.

It makes sense that a style that is simple and requests a little data from somewhere close to the user will load faster than a style that is complex and requests a lot of data from somewhere far away from the user.

#### A Peek inside a Style document

Here is a taste of a style à la MapTiler Basic Light**

(note: I have omitted most parts to simplify the example)

```json
{
  "version": 8,
  "id": "basic",
  "name": "Basic Light**",
  "sources": {
    "openmaptiles": {
      "url": "https://api.maptiler.com/tiles/v3/tiles.json?key={YOUR_API_KEY}",
      "type": "vector"
    },
    "maptiler_attribution": {
      "attribution": "<a href=\"https://www.maptiler.com/copyright/\" target=\"_blank\">&copy; MapTiler</a> <a href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\">&copy; OpenStreetMap contributors</a>",
      "type": "vector"
    }
  },
  "layers": [
    {
      "id": "background",
      "type": "background",
      "paint": { "background-color": "rgba(224, 224, 208, 1)" }
    },
    {
      "id": "landcover_grass",
      "type": "fill",
      "source": "openmaptiles",
      "source-layer": "landcover",
      "paint": { "fill-color": "rgba(192, 213, 169, 1)", "fill-opacity": 0.4 },
      "filter": ["==", "class", "grass"]
    },
    {
      "id": "landcover_wood",
      "type": "fill",
      "source": "openmaptiles",
      "source-layer": "landcover",
      "paint": { "fill-color": "hsl(82, 46%, 72%)", "fill-opacity": 0.8 },
      "filter": ["==", "class", "wood"]
    },
    {
      "id": "water",
      "type": "fill",
      "source": "openmaptiles",
      "source-layer": "water",
      "layout": { "visibility": "visible" },
      "paint": { "fill-color": "hsl(205, 56%, 73%)" },
      "filter": ["all", ["!=", "intermittent", 1], ["!=", "brunnel", "tunnel"]]
    },
    {
      "id": "building",
      "type": "fill",
      "source": "openmaptiles",
      "source-layer": "building",
      "paint": {
        "fill-color": "rgba(212, 204, 176, 1)",
        "fill-opacity": 0.6,
        "fill-antialias": true
      }
    },
  ],
  "glyphs": "https://api.maptiler.com/fonts/{fontstack}/{range}.pbf?key={YOUR_API_KEY}",
  "bearing": 0,
  "pitch": 0,
  "center": [0, 0],
  "zoom": 1
}
```

It a very simple style that only shows a few of the features you would expect of a map. It has a background color, grass and wood areas, water, buildings and some text.

There are two sources of data, one for the map data and one for the attribution. This informs the library where to request data from the tile server with address `https://api.maptiler.com/tiles/v3/tiles.json?key={YOUR_API_KEY}`.

The layers key is where the rendering instructions are. Each layer has an id, a type, a source (in our case it is always the single `openmaptiles` source) and some paint instructions.


The background gets loaded, polygons of grass gets drawn with a opaque green, water gets drawn in blue, but not when it goes through a tunnel, building footprints rise up.

Paint instructions can get quite complex, and contain many conditional rules and transformations. Things that can be controlled are the size lines, opacity of fills and the font of the text.

{{< admonition type=info title="The combination of vector and raster" >}}

Vector maps can also contain raster data layers. The raster data is delivered pre-rendered and is ready to be drawn on the screen. This is useful for things like satellite imagery, where the data is too complex to be drawn on the fly.

{{< /admonition >}}

#### Where does the actual vector data get served from?

See the `sources` key in the above style document. This is where the vector data is served from. The data is served in a format called vector tiles. These are small chunks of data that are ready to be drawn on the screen. The data is normally served in a format that is easy to draw and easy to style.

{{< admonition type=info title="What format is the data in?" >}}

Mapbox created the [Mapbox Vector Tile Specification](https://github.com/mapbox/vector-tile-spec).

The data is encoded in a format called [Protocol Buffers](https://developers.google.com/protocol-buffers). This is a fast to parse and is easy to compress binary format. This is why it is used for vector tiles.

There are many tools out there to generate and serve vector tiles. The [Awesome vector tiles](https://github.com/mapbox/awesome-vector-tiles)

{{< /admonition >}}

The ideal place to get the data is the clients device storage. This is fast as the data is ready to be used straight away without requesting and downloading it over a internet connection. But this is not practical for most use cases.

The next best thing is a server vector tile server. This server can be hosted by a tile service provider, or it can be hosted by yourself. There are lots of tools out there to roll your own solution. The [Awesome vector tiles](https://github.com/mapbox/awesome-vector-tiles) repo on github is a good place to start.

Most people will use a third party provider for ease and other reasons instead of DIYing. These providers will have servers all over the world that will serve the data to the user close to where they are.

### Where can you get one of these style recipe from?

There are many different places to get vector map styles. Providers offer them. Some of them are free, some of them are paid. Some of them are open source, some of them are closed source. Some of them result in a fast loading experience, some do not.

Different providers offer different styles and it is not always clear which one is the fastest, the Usain Bolt of map styles.

It is also possible to write a custom style, and there are many tools out there that can help you. Maplibre-gl has a [style spec](https://github.com/maplibre/maplibre-style-spec) that you can use to write your own style. MapTiler has a [online style editor](https://cloud.maptiler.com/maps/editor) that you can use to create your own style.

## The Experiment

I used playwright, a browser automation library to launch a chromium browser, initialize a map with a style and time how long it took for the [relevant loaded event](https://maplibre.org/maplibre-gl-js/docs/API/types/MapEventType/) to fire. This was done for a number of different styles.

The experiment was run on my local machine (A 10 year old HP Pavilion) with a 50mbps internet connection somewhere in Germany.

All [the code](#show-me-the-code) is available in [this repo](https://github.com/01100100/mapStyleProfile) if you want to replicate the experiment.

Note: Your mileage may vary depending on your hardware and internet connection.

### Styles tested

The [Open Street Map Wiki](https://wiki.openstreetmap.org/wiki/Vector_tiles#Providers) lists different vector tile providers. I tested the following:

* [MapTiler](https://www.maptiler.com/)
* [Stadia Maps](https://stadiamaps.com/)

{{< admonition type=abstract title="The styles tested" open=false >}}

| Provider | Style   | URL |
| -------- | ------- | ---- |
| MapTiler  | Backdrop | [https://api.maptiler.com/maps/backdrop/style.json?key={API_KEY}](https://api.maptiler.com/maps/backdrop/style.json?key={API_KEY}) |
| MapTiler  | Basic | [https://api.maptiler.com/maps/basic/style.json?key={API_KEY}](https://api.maptiler.com/maps/basic/style.json?key={API_KEY}) |
| MapTiler  | Bright | [https://api.maptiler.com/maps/bright/style.json?key={API_KEY}](https://api.maptiler.com/maps/bright/style.json?key={API_KEY}) |
| MapTiler  | Dataviz | [https://api.maptiler.com/maps/dataviz/style.json?key={API_KEY}](https://api.maptiler.com/maps/dataviz/style.json?key={API_KEY}) |
| MapTiler  | Landscape | [https://api.maptiler.com/maps/landscape/style.json?key={API_KEY}](https://api.maptiler.com/maps/landscape/style.json?key={API_KEY}) |
| MapTiler  | Ocean | [https://api.maptiler.com/maps/ocean/style.json?key={API_KEY}](https://api.maptiler.com/maps/ocean/style.json?key={API_KEY}) |
| MapTiler  | OpenStreetMap | [https://api.maptiler.com/maps/openstreetmap/style.json?key={API_KEY}](https://api.maptiler.com/maps/openstreetmap/style.json?key={API_KEY}) |
| MapTiler  | Outdoor | [https://api.maptiler.com/maps/outdoor/style.json?key={API_KEY}](https://api.maptiler.com/maps/outdoor/style.json?key={API_KEY}) |
| MapTiler  | Satellite | [https://api.maptiler.com/maps/satellite/style.json?key={API_KEY}](https://api.maptiler.com/maps/satellite/style.json?key={API_KEY}) |
| MapTiler  | Streets | [https://api.maptiler.com/maps/streets/style.json?key={API_KEY}](https://api.maptiler.com/maps/streets/style.json?key={API_KEY}) |
| MapTiler  | Toner | [https://api.maptiler.com/maps/toner/style.json?key={API_KEY}](https://api.maptiler.com/maps/toner/style.json?key={API_KEY}) |
| MapTiler  | Topo | [https://api.maptiler.com/maps/topo/style.json?key={API_KEY}](https://api.maptiler.com/maps/topo/style.json?key={API_KEY}) |
| MapTiler  | Winter | [https://api.maptiler.com/maps/winter/style.json?key={API_KEY}](https://api.maptiler.com/maps/winter/style.json?key={API_KEY}) |
| StadiaMaps | Alidade Smooth | [https://tiles.stadiamaps.com/styles/alidade_smooth.json?api_key={API_KEY}](https://tiles.stadiamaps.com/styles/alidade_smooth.json?api_key={API_KEY}) |
| StadiaMaps | Alidade Smooth Dark | [https://tiles.stadiamaps.com/styles/alidade_smooth_dark.json?api_key={API_KEY}](https://tiles.stadiamaps.com/styles/alidade_smooth_dark.json?api_key={API_KEY}) |
| StadiaMaps | Alidade Satellite | [https://tiles.stadiamaps.com/styles/alidade_satellite.json?api_key={API_KEY}](https://tiles.stadiamaps.com/styles/alidade_satellite.json?api_key={API_KEY}) |
| StadiaMaps | Stadia Outdoors | [https://tiles.stadiamaps.com/styles/stadia_outdoors.json?api_key={API_KEY}](https://tiles.stadiamaps.com/styles/stadia_outdoors.json?api_key={API_KEY}) |
| StadiaMaps | Stamen Toner | [https://tiles.stadiamaps.com/styles/stamen_toner.json?api_key={API_KEY}](https://tiles.stadiamaps.com/styles/stamen_toner.json?api_key={API_KEY}) |
| StadiaMaps | Stamen Terrain | [https://tiles.stadiamaps.com/styles/stamen_terrain.json?api_key={API_KEY}](https://tiles.stadiamaps.com/styles/stamen_terrain.json?api_key={API_KEY}) |
| StadiaMaps | Stamen Watercolor | [https://tiles.stadiamaps.com/styles/stamen_watercolor.json?api_key={API_KEY}](https://tiles.stadiamaps.com/styles/stamen_watercolor.json?api_key={API_KEY}) |
| StadiaMaps | OSM Bright | [https://tiles.stadiamaps.com/styles/osm_bright.json?api_key={API_KEY}](https://tiles.stadiamaps.com/styles/osm_bright.json?api_key={API_KEY}) |

{{< /admonition >}}

### Code used to profile the styles

```python
import asyncio
import os
from playwright.async_api import async_playwright

MAPTILER_API_KEY = os.environ.get("MAPTILER_API_KEY")
STADIA_API_KEY = os.environ.get("STADIA_API_KEY")

if MAPTILER_API_KEY is None or STADIA_API_KEY is None:
    raise ValueError(
        "MAPTILER_API_KEY and STADIA_API_KEY environment variables must be set"
    )

STYLES = {
    "MapTiler - Backdrop": f"https://api.maptiler.com/maps/backdrop/style.json?key={MAPTILER_API_KEY}",
    "MapTiler - Basic": f"https://api.maptiler.com/maps/basic/style.json?key={MAPTILER_API_KEY}",
    "Maptiler - Bright": f"https://api.maptiler.com/maps/bright/style.json?key={MAPTILER_API_KEY}",
    "Maptiler - Dataviz": f"https://api.maptiler.com/maps/dataviz/style.json?key={MAPTILER_API_KEY}",
    "Maptiler - Landscape": f"https://api.maptiler.com/maps/landscape/style.json?key={MAPTILER_API_KEY}",
    "Maptiler - Ocean": f"https://api.maptiler.com/maps/ocean/style.json?key={MAPTILER_API_KEY}",
    "Maptiler - OpenStreetMap": f"https://api.maptiler.com/maps/openstreetmap/style.json?key={MAPTILER_API_KEY}",
    "Maptiler - Outdoor": f"https://api.maptiler.com/maps/outdoor/style.json?key={MAPTILER_API_KEY}",
    "Maptiler - Satellite": f"https://api.maptiler.com/maps/satellite/style.json?key={MAPTILER_API_KEY}",
    "Maptiler - Streets": f"https://api.maptiler.com/maps/streets/style.json?key={MAPTILER_API_KEY}",
    "Maptiler - Toner": f"https://api.maptiler.com/maps/toner/style.json?key={MAPTILER_API_KEY}",
    "Maptiler - Topo": f"https://api.maptiler.com/maps/topo/style.json?key={MAPTILER_API_KEY}",
    "Maptiler - Winter": f"https://api.maptiler.com/maps/winter/style.json?key={MAPTILER_API_KEY}",
    "StadiaMaps - Alidade Smooth": f"https://tiles.stadiamaps.com/styles/alidade_smooth.json?api_key={STADIA_API_KEY}",
    "StadiaMaps - Alidade Smooth Dark": f"https://tiles.stadiamaps.com/styles/alidade_smooth_dark.json?api_key={STADIA_API_KEY}",
    "StadiaMaps - Alidade Satellite": f"https://tiles.stadiamaps.com/styles/alidade_satellite.json?api_key={STADIA_API_KEY}",
    "StadiaMaps - Stadia Outdoors": f"https://tiles.stadiamaps.com/styles/outdoors.json?api_key={STADIA_API_KEY}",
    "StadiaMaps - Stamen Toner": f"https://tiles.stadiamaps.com/styles/stamen_toner.json?api_key={STADIA_API_KEY}",
    "StadiaMaps - Stamen Terrain": f"https://tiles.stadiamaps.com/styles/stamen_terrain.json?api_key={STADIA_API_KEY}",
    "StadiaMaps - Stamen Watercolor": f"https://tiles.stadiamaps.com/styles/stamen_watercolor.json?api_key={STADIA_API_KEY}",
    "StadiaMaps - OSM Bright": f"https://tiles.stadiamaps.com/styles/osm_bright.json?api_key={STADIA_API_KEY}",
}

async def time_style(style_name, style_url):
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>Vector Map Style Profiler</title>
        <script src="https://unpkg.com/maplibre-gl@3.6.2/dist/maplibre-gl.js"></script>
        <link href="https://unpkg.com/maplibre-gl@3.6.2/dist/maplibre-gl.css" rel="stylesheet">
    </head>

    <style>
        html {{
            height: 100%;
        }}

        body {{
            height: 100%;
            align-items: stretch;
            margin: 0;
            padding: 0;
        }}

        #map {{
            flex-grow: 1;
            min-height: 100%;
            max-height: 100%;
        }}
    </style>

    <body>
        <div id="map" style="width: 100%; height: 100%;"></div>
        <script>
            const startTime = performance.now();
            const map = new maplibregl.Map({{
                container: "map",
                style: "{style_url}",
                center: [0, 51.4769], // Greenwich meridian
                zoom: 10,
                maxZoom: 18,
                minZoom: 5,
            }});

            map.on('load', (e) => {{
                const endLoadTime = performance.now();
                loadTime = endLoadTime - startTime;
                window.loadTime = loadTime;
            }});

        </script>
    </body>

    </html>
    """

    async with async_playwright() as p:
        browser_type = p.chromium
        browser = await browser_type.launch()
        page = await browser.new_page()

        try:
            await page.set_content(html_content)
            await page.wait_for_function("window.loadTime", timeout=30000)
            load_time = await page.evaluate("() => { return window.loadTime; }")
            print(f"{style_name}: {load_time}")

        except asyncio.TimeoutError:
            print(f"Timeout occurred for {style_name}")

        except Exception as e:
            print(f"An error occurred for {style_name}: {str(e)}")

        finally:
            await browser.close()


for k, v in STYLES.items():
    asyncio.run(time_style(k, v))
```

All code is available in the [mapStyleProfile github repository](https://github.com/01100100/mapStyleProfile).


## The Results

{{< echarts >}}
{
  "dataset": [
    {
      "dimensions": ["style", "time"],
      "source": [
        [2692, "MapTiler - Backdrop"],
        [2324, "MapTiler - Basic"],
        [3005, "Maptiler - Bright"],
        [1702, "Maptiler - Dataviz"],
        [4513, "Maptiler - Landscape"],
        [3679, "Maptiler - Ocean"],
        [2954, "Maptiler - OpenStreetMap"],
        [4030, "Maptiler - Outdoor"],
        [2368, "Maptiler - Satellite"],
        [2694, "Maptiler - Streets"],
        [2156, "Maptiler - Toner"],
        [4629, "Maptiler - Topo"],
        [5827, "Maptiler - Winter"],
        [2181, "StadiaMaps - Alidade Smooth"],
        [3169, "StadiaMaps - Alidade Smooth Dark"],
        [2990, "StadiaMaps - Stadia Outdoors"],
        [2573, "StadiaMaps - Stamen Toner"],
        [5670, "StadiaMaps - Stamen Terrain"],
        [709, "StadiaMaps - Stamen Watercolor"],
        [2848, "StadiaMaps - OSM Bright"]
      ]
    },
    {
      "transform": {
        "type": "sort",
        "config": { "dimension": "style", "order": "desc" }
      }
    }
  ],
  "xAxis": {
    "name": "loading time (ms)",
    "nameLocation": "center",
    "nameGap": 30,
    "type": "value",
    "max": 8000,
    "splitNumber": 8
  },
  "yAxis": {
    "type": "category",
    "show": true,
    "axisTick": {
      "show": false
    }
  },
  "series": {
    "type": "bar",
    "encode": { "x": "style", "y": "time" },
    "datasetIndex": 1,
    "label": {
          "show": true,
          "precision": 1,
          "position": "right",
          "valueAnimation": true,
          "fontFamily": "monospace",
          "formatter": "{b}"
    }
  },
  "grid": {
    "left": "1%",
    "right": "1%",
    "bottom": "10%",
    "top": "0%"
  },
  "visualMap": {
    "show": false,
    "min": 1000,
    "max": 5000,
    "dimension": 0,
    "inRange": {
      "color": ["#65B581", "#FFCE34", "#FD665F"]
    }
  },
  "tooltip": {
  }
}
{{< /echarts >}}

{{< admonition type=abstract title="The Results Table" open=false >}}
| Provider - Style   | Time to load (ms) |
| ------------------ | ------------ |
| MapTiler - Backdrop | 2692 |
| MapTiler - Basic | 2324 |
| Maptiler - Bright | 3005 |
| Maptiler - Dataviz | 1702 |
| Maptiler - Landscape | 4513 |
| Maptiler - Ocean | 3679 |
| Maptiler - OpenStreetMap | 2954 |
| Maptiler - Outdoor | 4030 |
| Maptiler - Satellite | 2368 |
| Maptiler - Streets | 2694 |
| Maptiler - Toner | 2156 |
| Maptiler - Topo | 4629 |
| Maptiler - Winter | 5827 |
| StadiaMaps - Alidade Smooth | 2181 |
| StadiaMaps - Alidade Smooth Dark | 3169 |
| StadiaMaps - Stadia Outdoors | 2990 |
| StadiaMaps - Stamen Toner | 2573 |
| StadiaMaps - Stamen Terrain | 5670 |
| StadiaMaps - Stamen Watercolor | 709 |
| StadiaMaps - OSM Bright | 2848 |

{{< /admonition >}}

## Conclusion

Now there are some numbers to quantify the different map styles speed.

Remember speed isn't everything, and a good map experience is a combination of many things. A fast loading map is just one part of the puzzle, along with space and color, compromises may have to be made to get the best overall experience.

## Don't just take my word for it, test styles out yourself online now!

{{< admonition type=idea title="A online tool for DIY testing 💻📏" >}}

I made a online tool that lets you paste a style url into it and it will time how long it takes to load the map.

![Screenshot](/images/maploading/screenshot_frame.png)

{{% center %}}
[https://01100100.github.io/mapStyleProfile/](https://01100100.github.io/mapStyleProfile/)
{{% /center %}}

All source code is available in the same [github repository](https://github.com/01100100/mapStyleProfile).

{{< /admonition >}}

## Future ideas

This was a simple experiment to get some numbers on the different map styles, only looking at two providers.

There are a few things that could be done to improve the experiment:

- [ ] Add more styles from different providers to get a better idea of the landscape.
- [ ] Profile the different parts of the map loading process to break down ingload time
- [ ] Add more "real world" interactions to the experiment and see how the  styles perform under different conditions.
- [ ] Set up a github action to run the experiment on pull requests and provided a central place to see the results.
