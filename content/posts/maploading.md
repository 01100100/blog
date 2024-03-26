---
title: "Map Loading... 🗺️📏🎨"
subtitle: "Profiling different vector map style loading times with maplibre-gl."
date: 2024-03-25T11:42:41+01:00
lastmod: 2024-03-25T11:42:41+01:00
draft: false
authors: []
description: ""

tags: []
categories: []
series: []

hiddenFromHomePage: false
hiddenFromSearch: false

featuredImage: "/images/maploading/map_timing.jpeg"
featuredImagePreview: ""

toc:
  enable: true
math:
  enable: false
lightgallery: false
license: ""
---

## Introduction

When using a map on a digital device, it is important that it is fast to load and that the interactions are as seamless. A fast loading map will go by unnoticed as "everything works" leading to a natural feeling experience. A slow loading map will get in the way of a good user experience, leading to frustration, grief and a bad taste in the mouth.

![GIF of a slow loading map](/images/maploading/slowloading.gif)

Vector maps are being used more and more on the web. They offer a faster and more interactive experience and can be styled in a endless amount of ways.

{{< admonition type=question title="What even is a vector map?" >}}

The best resource out there to to have a refresh on web maps is [mapschool.io](https://mapschool.io/). It explains the difference between raster and vector maps and much more.

{{< /admonition >}}

I am using [`maplibre-gl`](https://maplibre.org/maplibre-gl-js/docs/), which is a vector map library in a hobby project and got interested in finding out what map style would be the fastest to load. Struggling to find any resources online to answer my question, I decided to profile some different styles and write about it.

## Map drawing 101

A vector map library needs a recipe to draw a map on the screen. The recipe will have instructions telling the mapping library where exactly to request the vector data from and how exactly to then render that data to the screen. Rendering instructions include what parts of the data to draw, what colors to use and what order to draw the layers of data in.

When you pan and zoom to a specific part of a vector map, the library will know based on this recipe, where to request the body of data that should fill up the screen and how to style it.

This recipe is whats included in a `style` document, this is usually a json file that adhears to a specification (in my case the [Maplibre style spec](https://maplibre.org/maplibre-style-spec/)).

A good designer aka a cartograpaher, will design this style in a way that it shows off the best parts of the data with certain balance of space and color, producing something that looks appalling and allows easy reading of the data.

![A artist painting a map](/images/maploading/painting_map.jpeg)

## What makes things fast or slow?

The time taken to display a map on the screen will depend on where the data comes from and how complex the rendering instructions are.

It makes sense that a style that is simple and requests a little data from somewhere close to the user will load faster than a style that is complex and requests a lot of data from somewhere far away from the user.

## Where can you get a style recipe from?

There are many different places to get vector map styles. Providers offer them. Some of them are free, some of them are paid. Some of them are open source, some of them are closed source. Some of them result in a fast loading experience, some do not.

Different providers offer different styles and it is not always clear which one is the fastest, the Usain Bolt of map styles.

It is also possible to write a custom style, and there are many tools out there that can help you. Maplibre-gl has a [style spec](https://github.com/maplibre/maplibre-style-spec) that you can use to write your own style. MapTiler has a [online style editor](https://cloud.maptiler.com/maps/editor) that you can use to create your own style.

## Where does the actual vector data get served from?

The ideal place to get the data is the clients device storage. This is fast as the data is ready to be used straight away without requesting and downloading it over a internet connection. But this is not practical for most use cases.

The next best thing is a server vector tile server. This server can be hosted by a tile service provider, or it can be hosted by yourself. There are lots of tools out there to roll your own solution. The [Awesome vector tiles](https://github.com/mapbox/awesome-vector-tiles) repo on github is a good place to start.

Most people will use a third party provider for ease and other reasons instead of DIYing. These providers will have servers all over the world that will serve the data to the user close to where they are.

### A Peek inside a Style document

Example: a taste of a style à la MapTiler bàsic (note: I have omitted some parts for brevity)

```json
{
  "version": 8,
  "id": "basic",
  "name": "Basic",
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

TODO: explain the file above

## Experiment Setup

I used playwright, a browser automation library to launch a chromium browser, initialize a map with a style and time how long it took for the [relevant loaded event](https://maplibre.org/maplibre-gl-js/docs/API/types/MapEventType/) to fire. This was done for a number of different styles.

The experiment was run on my local machine (A 10 year old HP Pavilion) with a 50mbps internet connection somewhere in Germany.

## The Providers tested

The [Open Street Map Wiki](https://wiki.openstreetmap.org/wiki/Vector_tiles#Providers) lists different vector tile providers. I tested the following:

* [MapTiler](https://www.maptiler.com/)
* [Stadia Maps](https://stadiamaps.com/)

## The styles

I tested the following styles:

| Provider | Style   | URL |
| -------- | ------- | ---- |
| MapTiler  | basic | <https://api.maptiler.com/maps/basic/style.json?key={YOUR_API_KEY}> |
| MapTiler  | backdrop | <https://api.maptiler.com/maps/backdrop/style.json?key={YOUR_API_KEY}> |
| StadiaMaps | Alidade Smooth | <https://tiles.stadiamaps.com/styles/alidade_smooth.json?api_key={YOUR_API_KEY}> |
| StadiaMaps | Alidade Smooth Dark | <https://tiles.stadiamaps.com/styles/alidade_smooth_dark.json?api_key={YOUR_API_KEY}> |
| StadiaMaps | Alidade Satellite | <https://tiles.stadiamaps.com/styles/alidade_satellite.json?api_key={YOUR_API_KEY}> |
| StadiaMaps | Stadia Outdoors | <https://tiles.stadiamaps.com/styles/stadia_outdoors.json?api_key={YOUR_API_KEY}> |
| StadiaMaps | Stamen Toner | <https://tiles.stadiamaps.com/styles/stamen_toner.json?api_key={YOUR_API_KEY}> |
| StadiaMaps | Stamen Terrain | <https://tiles.stadiamaps.com/styles/stamen_terrain.json?api_key={YOUR_API_KEY}> |
| StadiaMaps | Stamen Watercolor | <https://tiles.stadiamaps.com/styles/stamen_watercolor.json?api_key={YOUR_API_KEY}> |
| StadiaMaps | OSM Bright | <https://tiles.stadiamaps.com/styles/osm_bright.json?api_key={YOUR_API_KEY}> |

## The code

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
    "MapTiler - backdrop": f"https://api.maptiler.com/maps/backdrop/style.json?key={MAPTILER_API_KEY}",
    "MapTiler - basic": f"https://api.maptiler.com/maps/basic/style.json?key={MAPTILER_API_KEY}",
    "Maptiler - bright": f"https://api.maptiler.com/maps/bright/style.json?key={MAPTILER_API_KEY}",
    "Maptiler - dataviz": f"https://api.maptiler.com/maps/dataviz/style.json?key={MAPTILER_API_KEY}",
    "Maptiler - landscape": f"https://api.maptiler.com/maps/landscape/style.json?key={MAPTILER_API_KEY}",
    "Maptiler - ocean": f"https://api.maptiler.com/maps/ocean/style.json?key={MAPTILER_API_KEY}",
    "Maptiler - openstreetmap": f"https://api.maptiler.com/maps/openstreetmap/style.json?key={MAPTILER_API_KEY}",
    "Maptiler - outdoor": f"https://api.maptiler.com/maps/outdoor/style.json?key={MAPTILER_API_KEY}",
    "Maptiler - satellite": f"https://api.maptiler.com/maps/satellite/style.json?key={MAPTILER_API_KEY}",
    "Maptiler - streets": f"https://api.maptiler.com/maps/streets/style.json?key={MAPTILER_API_KEY}",
    "Maptiler - toner": f"https://api.maptiler.com/maps/toner/style.json?key={MAPTILER_API_KEY}",
    "Maptiler - topo": f"https://api.maptiler.com/maps/topo/style.json?key={MAPTILER_API_KEY}",
    "Maptiler - winter": f"https://api.maptiler.com/maps/winter/style.json?key={MAPTILER_API_KEY}",
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

This code is available in the [mapStyleProfile github repository](https://github.com/01100100/mapStyleProfile)

## Don't take my word for it, test it out yourself

{{< admonition type=idea title="A tool that will let you time different map styles 🗺️" >}}

I made a tool that lets you paste a style url into it and it will time how long it takes to load the map.

![Screenshot](/images/maploading/screenshot_frame.png)

{{% center %}}
[https://01100100.github.io/mapStyleProfile/](https://01100100.github.io/mapStyleProfile/)
{{% /center %}}

All source code is available in this [github repository](https://github.com/01100100/mapStyleProfile)

{{< /admonition >}}

## The Results

| Provider - Style   | Time to load (ms) |
| ------------------ | ------------ |
| MapTiler - backdrop | 2692.300000000745 |
| MapTiler - basic | 2324.199999999255 |
| Maptiler - bright | 3005 |
| Maptiler - dataviz | 1702.5999999996275 |
| Maptiler - landscape | 4513.0999999996275 |
| Maptiler - ocean | 3679.9000000003725 |
| Maptiler - openstreetmap | 2954.2000000011176 |
| Maptiler - outdoor | 4030.300000000745 |
| Maptiler - satellite | 2368.2999999988824 |
| Maptiler - streets | 2694.2999999988824 |
| Maptiler - toner | 2156.800000000745 |
| Maptiler - topo | 4629.5999999996275 |
| Maptiler - winter | 5827.200000001118 |
| StadiaMaps - Alidade Smooth | 2181.7000000011176 |
| StadiaMaps - Alidade Smooth Dark | 3169.800000000745 |
| StadiaMaps - Stadia Outdoors | 2990.300000000745 |
| StadiaMaps - Stamen Toner | 2573.699999999255 |
| StadiaMaps - Stamen Terrain | 5670 |
| StadiaMaps - Stamen Watercolor | 709.0999999996275 |
| StadiaMaps - OSM Bright | 2848.9000000003725 |

TODO: add a graph

## Conclusion

Now there are some numbers to quantify the different map styles speed. Remeber speed isn't everything, and the quality of the map and that a decision should be made based on the use case.

## Future ideas

TODO: put some idea here about having a repo which runs using on github actions for pull requests to add new styles from the community and uploads the results to a website. Also talk about how you could go much more into depth with the different "parts" that load and how you could profile them.