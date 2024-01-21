---
title: "Kreuzungen"
subtitle: ""
date: 2024-01-11T21:41:55+01:00
lastmod: 2024-01-11T21:41:55+01:00
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

# Kreuzungen

<a title="Hennessy, CC BY-SA 1.0 &lt;https://creativecommons.org/licenses/by-sa/1.0&gt;, via Wikimedia Commons" href="https://commons.wikimedia.org/wiki/File:Gaoliang_Bridge.JPG"><img width="512" alt="Gaoliang Bridge" src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Gaoliang_Bridge.JPG/512px-Gaoliang_Bridge.JPG"></a>

## Naming

Kreuzungen is the German word for crossings.

> [https://de.wiktionary.org/wiki/Kreuzung](https://de.wiktionary.org/wiki/Kreuzung)

## Website

[https://01100100.github.io/kreuzungen/](https://01100100.github.io/kreuzungen/)

Repository [https://github.com/01100100/kreuzungen](https://github.com/01100100/kreuzungen)

## Preface

I recently rode my bike home (Berlin) from a [geo-spatial-data-conference](spatial-data-science-conference.com) in London.

I used [Komoot](https://www.komoot.com) to navigate and record my ride. Komoot is a great app that, among other things, allows you to super easily calculate a route between given points and adheres to your riding style preference. I set the start from my hotel in London, set the endpoint to Berlin (with intermediate points being the ferry ports of Harwich and Hook of Holland), choose "Road cycling" as my preferred style of riding and hit the "Let's go" button. Life is easy in 2023! Komoot offer a free version and a paid for premium version with many useful features including offline maps and weather forecasts. I am a big fan of this app and highly recommend it to all my friends.

The ride took a few days and let me think about the world. I crossed many rivers, which I paid little attention to until a thought was triggered... "How cool would it be to have the statistics of how many rivers I crossed along the way... much like the stats you can see in a video game". Realizing that I was recording data of the ride, had the great asset of open street maps at my fingertips, and was in the geo-spatial-data tech bubble, I put a plan together.

I would write a program that could be fed with the .gpx file created by Komoot and output the list of rivers that were crossed along the ride from London to Berlin.

This program could easily be extended to give back a list of other landmarks I passed on my ride, all thanks to the free OSM data provided by the community (Thanks to everyone who contributed!!).

I could wrap this all up in a little web app, that lets users upload a .gpx file, and displays the stats for landmarks passed as well as a map showing the route and passed landmarks.

As a geospatial data engineer, and a endurance cyclist, the problem doesn't sound so hard.

## What is Geospatial Data

## Not all geo data files are created equally

### .gpx

A  standard "open" geo data format also known as GPS exchange format. The format uses a [XML schema](https://en.wikipedia.org/wiki/XML) to stores waypoints, tracks, and routes plus metadata describing the data. The tracks data type includes the co-ordinates

ref: [https://en.wikipedia.org/wiki/GPS_Exchange_Format](https://en.wikipedia.org/wiki/GPS_Exchange_Format)

TODO: add example .gpx code

### .geojson

TODO: add example geojson code

### .OSM

TODO: add example openstreetmap code

## Converting between the formats

### Why?

### Libraries

## How to get the open data on rivers

### OpenStreetMaps (aka OSM)

### OSM Overpass API

[http://overpass-api.de](http://overpass-api.de)

We can use the Overpass Query langauge to search for OSM features in the proximity of a polyline [https://dev.overpass-api.de/overpass-doc/en/full_data/polygon.html](https://dev.overpass-api.de/overpass-doc/en/full_data/polygon.html).

This API reduces the problem to simply encoding the gpx file as a polyline, constructing a valid overpass query, and parsing the response.

#### Overpass Turbo

TODO: explain overpass turbo
[https://overpass-turbo.eu/](https://overpass-turbo.eu/)



NB: I have come across the polyline format before when working with geospatial data, usually the term referees to the **encoded polyline format** which abides to the [spec from google maps](https://developers.google.com/maps/documentation/utilities/polylineutility). There are good libraries available that deal with this in JS [https://github.com/mapbox/polyline](https://github.com/mapbox/polyline) and Python [https://pypi.org/project/polyline/](https://pypi.org/project/polyline/). The Overpass query langauge expects a decoded format.

TODO: add the query and explain it

```
async function fetchRivers(bbox) {
  const response = await fetch(
    "https://www.overpass-api.de/api/interpreter?",
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: `rel["waterway"](${bbox[1]},${bbox[0]},${bbox[3]},${bbox[2]});way["waterway"](${bbox[1]},${bbox[0]},${bbox[3]},${bbox[2]});out geom;`,
    }
  );
  return await response.text();
}
```

## Frontend

Everything should be done on the client side, to avoid the need of hosting any backend. Therefore we will use the language of the browser, javascript.

- Upload by drag and drop

[https://developer.mozilla.org/en-US/docs/Web/API/File_API/Using_files_from_web_applications#selecting_files_using_drag_and_drop](https://developer.mozilla.org/en-US/docs/Web/API/File_API/Using_files_from_web_applications#selecting_files_using_drag_and_drop)

- Display gpx file on a map

[https://github.com/mpetazzoni/leaflet-gpx](https://github.com/mpetazzoni/leaflet-gpx)

- Parse gpx file

[https://github.com/Luuka/GPXParser.js](https://github.com/Luuka/GPXParser.js)

- Construct OverpassQL

- Parse results
