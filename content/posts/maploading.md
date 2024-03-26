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

I am using `maplibre-gl`, which is a vector map library in a hobby project and got interested in finding out what map style would be the fastest to load. Struggling to find any resources online to answer my question, I decided to profile some different styles and write about it.

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
      "url": "https://api.maptiler.com/tiles/v3/tiles.json?key=ykqGqGPMAYuYgedgpBOY",
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
  "glyphs": "https://api.maptiler.com/fonts/{fontstack}/{range}.pbf?key=ykqGqGPMAYuYgedgpBOY",
  "bearing": 0,
  "pitch": 0,
  "center": [0, 0],
  "zoom": 1
}
```

TODO: explain the file above

## Experiment Setup

I used the following code to initialize the map with different styles and time how long it took for the [relevant loaded event](https://maplibre.org/maplibre-gl-js/docs/API/types/MapEventType/) to fire.

This was run on my local machine (A 10 year old HP Pavilion) with a 50mbps internet connection based somewhere in Germany. Cache was both enabled and disabled. Each style was ran 3 times and the average time was noted.

## The Providers tested

The [Open Street Map Wiki](https://wiki.openstreetmap.org/wiki/Vector_tiles#Providers) lists different vector tile providers. I tested the following:

* [MapTiler](https://www.maptiler.com/)
* [Stadia Maps](https://stadiamaps.com/)
* [Thunderforest](https://www.thunderforest.com/)

## The styles

I tested the following styles:

| Provider | Style   | URL |
| -------- | ------- | ---- |
| MapTiler  | basic | <https://api.maptiler.com/maps/basic/style.json?key=ykqGqGPMAYuYgedgpBOY> |
| MapTiler  | backdrop | <https://api.maptiler.com/maps/backdrop/style.json?key=ykqGqGPMAYuYgedgpBOY> |
| StadiaMaps | Alidade Smooth | <https://tiles.stadiamaps.com/styles/alidade_smooth.json?api_key=a3fbd557-2a52-4d91-88ca-af58e52cf345> |
| StadiaMaps | Alidade Smooth Dark | <https://tiles.stadiamaps.com/styles/alidade_smooth_dark.json?api_key=a3fbd557-2a52-4d91-88ca-af58e52cf345> |
| StadiaMaps | Alidade Satellite | <https://tiles.stadiamaps.com/styles/alidade_satellite.json?api_key=a3fbd557-2a52-4d91-88ca-af58e52cf345> |
| StadiaMaps | Stadia Outdoors | <https://tiles.stadiamaps.com/styles/stadia_outdoors.json?api_key=a3fbd557-2a52-4d91-88ca-af58e52cf345> |
| StadiaMaps | Stamen Toner | <https://tiles.stadiamaps.com/styles/stamen_toner.json?api_key=a3fbd557-2a52-4d91-88ca-af58e52cf345> |
| StadiaMaps | Stamen Terrain | <https://tiles.stadiamaps.com/styles/stamen_terrain.json?api_key=a3fbd557-2a52-4d91-88ca-af58e52cf345> |
| StadiaMaps | Stamen Watercolor | <https://tiles.stadiamaps.com/styles/stamen_watercolor.json?api_key=a3fbd557-2a52-4d91-88ca-af58e52cf345> |
| StadiaMaps | OSM Bright | <https://tiles.stadiamaps.com/styles/osm_bright.json?api_key=a3fbd557-2a52-4d91-88ca-af58e52cf345> |
| Thunderforest | Outdoors V2 | <https://tile.thunderforest.com/thunderforest.outdoors-v2.json?apikey=eb7590a9ff744fcba93c4e0147d21129> |

## The code

```html
TODO: add the code
```

## Don't take my word for it, test it out yourself

{{< admonition type=idea title="A tool that will let you time different map styles 🗺️" >}}
I made a tool that lets you paste a style url into it and it will time how long it takes to load the map.

![Screenshot](/images/maploading/screenshot_frame.png)

{{% center %}}
[https://01100100.github.io/mapStyleProfile/](https://01100100.github.io/mapStyleProfile/)
{{% /center %}}

All source code is available in this [github repository](https://github.com/01100100/mapStyleProfile)

{{< /admonition >}}

## The Breakdown

TODO: add a graph of the results

## Conclusion

TODO: talk about it not just being about speed, but also about the quality of the map and that a decision should be made based on the use case.

## future online setup with github repo and pull requests
