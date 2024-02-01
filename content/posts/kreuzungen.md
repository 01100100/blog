---
title: "Kreuzungen 🗺️"
subtitle: "Where open geospatial data and cycling intersect."
date: 2024-01-11T21:41:55+01:00
lastmod: 2024-01-11T21:41:55+01:00
draft: false
description: "Where open geospatial data and cycling intersect."

tags: []
categories: []
series: []

hiddenFromHomePage: false
hiddenFromSearch: false

featuredImage: ""
featuredImagePreview: ""


math: true
lightgallery: false
license: ""
---
<!--more-->
{{< figure src="<https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Gaoliang_Bridge.JPG/512px-Gaoliang_Bridge.JPG>" title="Lighthouse (figure)" >}}

<a title="Hennessy, CC BY-SA 1.0 &lt;https://creativecommons.org/licenses/by-sa/1.0&gt;, via Wikimedia Commons" href="https://commons.wikimedia.org/wiki/File:Gaoliang_Bridge.JPG"><img width="512" alt="Gaoliang Bridge" src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Gaoliang_Bridge.JPG/512px-Gaoliang_Bridge.JPG"></a>

## Naming

Kreuzungen is the German word for crossings.

> [https://de.wiktionary.org/wiki/Kreuzung](https://de.wiktionary.org/wiki/Kreuzung)

## Website

{{< admonition type=example >}}

[https://01100100.github.io/kreuzungen/](https://01100100.github.io/kreuzungen/)
{{< /admonition >}}


Repository [https://github.com/01100100/kreuzungen](https://github.com/01100100/kreuzungen)

## Preface

Last year I rode my bike home (Berlin) from a [geo-spatial-data-conference](spatial-data-science-conference.com) in London.

I used [Komoot](https://www.komoot.com) to navigate and record my ride. Komoot is a great app that, among other things, allows you to super easily calculate a route between given points and adheres to your riding style preference. I set the start from my hotel in London, set the endpoint to Berlin (with intermediate points being the ferry ports of Harwich and Hook of Holland), choose "Road cycling" as my preferred style of riding and hit the "Let's go" button. Life is easy in 2023! Komoot offer a free version and a paid for premium version with many useful features including offline maps and weather forecasts. I am a big fan of this app and highly recommend it to all my friends.

The ride took a few days and let me think about the world. I crossed many rivers, which I paid little attention to which until a thought was triggered... "How cool would it be to have the statistics of how many rivers I crossed along the way... much like the stats you can see in a video game". Realizing that I was recording data of the ride, had the great asset of open street maps at my fingertips, and was in the geo-spatial-data tech bubble, I put a plan together.

I would write a program that could be fed with the .gpx file created by Komoot and output the list of rivers that were crossed along the ride from London to Berlin.

This program could easily be extended to give back a list of other landmarks I passed on my ride, all thanks to the free OSM data provided by the community (Thanks to everyone who contributed!!).

I could wrap this all up in a little web app, that lets users upload a .gpx file, and displays the stats for landmarks passed as well as a map showing the route and passed landmarks.

As a geospatial data engineer, and a endurance cyclist, the problem doesn't sound so hard.

## What is Geospatial Data

TODO: explain what geospatial data is (a file representing real world objects on a globe using co-ordinates and metadata)

TODO: explain that a point, string, and polygon combined with a map projection are the building blocks of geo data.

## What is a river?

TODO: explain what a real world river is and how its different from a stream, and how as your mental geographical model "zoom out" you don't need so much precision with the smaller waterways. Eg when you thinking of a route the whole way across england, you probably don't care for all the tiny streams and ditches you went over, but in contrast if you do a hike around a small town, you might be interested in each of the tiny streams you went over.

### Where to get the river data from?

TODO: explain about open street maps and how great it is to have a community resource and that this was not available 25 years ago. Explain how a waterway relation is available for all main rivers from contributors, explain the problem about getting the smaller waterways, and querying osm for ways as well as relations.

TODO: link to and explain the points from: https://wiki.openstreetmap.org/wiki/Waterways, explain about the tags and properties of a OSM data type


### Talk about time complexity, as the route size grows.

Finding out which rivers intersect with the uploaded route is taken care of by turf.js, using the [`booleanIntersects()`](https://github.com/Turfjs/turf/tree/master/packages/turf-boolean-intersects) function.

```js
function filterIntersectingWaterways(waterwaysGeoJSON, routeGeoJSON) {
  return waterwaysGeoJSON.features.filter((feature) =>
    turf.booleanIntersects(feature, routeGeoJSON)
  );
}
```

The `turf.booleanIntersects()` implementation uses the [sweepline-intersections](https://github.com/rowanwins/sweepline-intersections?tab=readme-ov-file#algorithm-steps) algorithm, and although it is optimized to blaze through co-ordinate pairs super fast, it has quadratic [time complexity](https://en.wikipedia.org/wiki/Time_complexity).

$$ \mathcal{O}(n^2) $$


{{< admonition type=tip open=true >}}
That's a fancy way of saying as the input data gets big (number of waterways to check for intersections), the time is takes to compute gets realllllly big.
{{< /admonition >}}

The key to solving the problem involves keeping the input data "somewhat" small such that device doing the computation does not melt and crash.


TODO: explain about the size of the OSM planet-files, and that they are rather large (currently over 60GB), and that a big part of solving this problem is filtering for as little data as possible before running the computations.

Once the newest planet-file is on the openrouteservice-servers, it needs to be preprocessed before the openrouteservice can start building the graphs used for routing.

The build process in itself is rather resource-intensive. It takes roughly two days for any one of the nine profiles. For the mentioned resource requirements, this means that it will take roughly a week for all profiles to be re-built.

## Not all geo data files are created equally

### .gpx

A  standard "open" geo data format also known as GPS exchange format. The format uses a [XML schema](https://en.wikipedia.org/wiki/XML) to stores waypoints, tracks, and routes plus metadata describing the data. The tracks data type includes the co-ordinates

ref: [https://en.wikipedia.org/wiki/GPS_Exchange_Format](https://en.wikipedia.org/wiki/GPS_Exchange_Format)

If you open a gpx file with a editor, you will seen some lines of code
TODO: add example .gpx code

```xml

```

### .geojson

[Specification](https://geojson.org/)

[geojson.io](http://geojson.io)

[Wiki](https://en.wikipedia.org/wiki/GeoJSON)

```json
{
  "type": "Feature",
  "properties": {},
  "geometry": {
    "coordinates": [
      [
        13.3957,
        52.4771
      ],
      [
        13.3965,
        52.4715
      ],
      [
        13.4005,
        52.4741
      ],
      [
        13.4081,
        52.4722
      ],
      [
        13.4103,
        52.4687
      ]
    ],
    "type": "LineString"
  }
}
```

### .OSM

TODO: add example openstreetmap code

TODO: link to https://wiki.openstreetmap.org/wiki/OSM_XML

## Converting between the formats

### Why?

By converting the OSM and route geographic data to the geojson, I could use turf.js to do all spatial analytics in the js code, the computing would be done client side. Meaning no backend is needed.

### Libraries

## How to get the open data on rivers

### OpenStreetMaps (aka OSM)

TODO: talk about the OSM data model https://wiki.openstreetmap.org/wiki/Elements and how they map to points, linestrings, polygons.


### OSM Overpass API

[http://overpass-api.de](http://overpass-api.de)

We can use the Overpass Query langauge to search for OSM features in the proximity of a polyline [https://dev.overpass-api.de/overpass-doc/en/full_data/polygon.html](https://dev.overpass-api.de/overpass-doc/en/full_data/polygon.html).

This API reduces the problem to simply encoding the gpx file as a polyline, constructing a valid overpass query, and parsing the response.

#### Overpass Turbo

TODO: explain overpass turbo
[https://overpass-turbo.eu/](https://overpass-turbo.eu/)

TODO: add the query and explain it

```js
async function fetchRivers(bbox) {
  const response = await fetch(
    "https://www.overpass-api.de/api/interpreter?",
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: `rel["waterway"](${bbox[1]},${bbox[0]},${bbox[3]},${bbox[2]});out geom;`,
    }
  );
  return await response.text();
}
```

TODO: talk about the response https://wiki.openstreetmap.org/wiki/OSM_XML#Overpass_API_out_geom

## Frontend

Although I am most comfortable programming in python, I wanted everything to run locally on the client. Everything should be done on the client side, to avoid the need of hosting any backend. Therefore we will use the language of the browser, javascript.

### Maplibre gl

<!-- TODO: write about slippy maps, how good maplibre is because of vector tiles, allowing for zooming in and out without pixelation and ability to render features conditionally on the client side -->

---

#### Diving deeper with the style color

<!-- TODO: write about how to rivers are rendered from the tiles. That the blue river is made up of a way which is a polygon, and a linestring that is the waterway relation or way

https://www.openstreetmap.org/relation/412169#map=19/52.45659/13.39513

https://www.openstreetmap.org/way/307632376#map=16/52.4725/13.4564

  -->

  ![Screen shot of river geometry intersection](image.png)
  <https://www.openstreetmap.org/way/307632376> is the polygon for the osm water body
  <https://www.openstreetmap.org/way/160175124> is the linestring for the osm waterway way
