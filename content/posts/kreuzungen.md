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

## Show me the good stuff!

{{< admonition type=example >}}

[https://01100100.github.io/kreuzungen/](https://01100100.github.io/kreuzungen/)
{{< /admonition >}}


Repository [https://github.com/01100100/kreuzungen](https://github.com/01100100/kreuzungen)

## Preface

Last year I rode my bike home (Berlin) from a [geo-spatial-data-conference](spatial-data-science-conference.com) in London.

I used [Komoot](https://www.komoot.com) to navigate and record my ride. Komoot is a great app that, among other things, allows you to super easily calculate a route between given points and adheres to your riding style preference. I set the start from my hotel in London, set the endpoint to Berlin (with intermediate points being the ferry ports of Harwich and Hook of Holland), choose "Road cycling" as my preferred style of riding and hit the "Let's go" button. Life is easy in 2023! Komoot offer a free version and a paid for premium version with many useful features including offline maps and weather forecasts. I am a big fan of this app and highly recommend it to all my friends.

The ride took a few days and let me think about the world. I crossed many rivers, which I paid little attention to which until a thought was triggered... "How cool would it be to have the statistics of how many rivers I crossed along the way... much like the stats you can see in a video game". Realizing that I was recording data of the ride, had the great asset of open street maps at my fingertips, and was in the geo-spatial-data tech bubble, I put a plan together.

The problem was to answer the question "Which rivers did I cross based on this .gpx file?"

I would write a program that could be fed with the .gpx file created by Komoot and output the list of rivers that were crossed along the ride from London to Berlin.

This program could easily be extended to give back a list of other landmarks I passed on my ride, all thanks to the free OSM data provided by the community (Thanks to everyone who contributed!!).

I could wrap this all up in a little web app, that lets users upload a .gpx file, and displays the stats for landmarks passed as well as a map showing the route and higlighting the passed landmarks.

As a geospatial data engineer, and a endurance cyclist, the problem doesn't sound so hard. It turns out that it was much more interesting then I first thought.
, as the route size grows.
## What is Geospatial Data

Geospatial data in its simplest form is information that describes a object on earth. It has two parts, one describes the "where" and the other describes the "what". The "where" part has information about the geometry of the object and its location, while the "what" part has information about the non-geometric properties/attributes of the object, which bring meaning to the objects.

### Example: Dicke Marie

If you go into Tegel Forest in the east of Berlin, you might bump into the so called "Fat Marie". This is the name given to a really old, award winning Oak tree, estimated to be over 800 years old.

<a title="Quaster64, CC BY-SA 4.0 &lt;https://creativecommons.org/licenses/by-sa/4.0&gt;, via Wikimedia Commons" href="https://commons.wikimedia.org/wiki/File:Dicke_Marie_01.jpg"><img width="256" alt="Dicke Marie 01" src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Dicke_Marie_01.jpg/256px-Dicke_Marie_01.jpg"></a>

<!-- https://commons.wikimedia.org/wiki/File:Dicke_Marie_01.jpg -->
Let's imagine what the geospatial data would look like that describes this great tree...

First we should define the location or the "where" of Dicke Marie. We could use words to do this, prehaps "North East of Berlin" or "about 300m south.." However we can do much better if we define with the position with a single set of co-ordinates `(52.5935770, 13.2649068)` locating the point where the centre of the tree trunk comes out of the ground. These numbers are much more powerful then the wordy descriptions. It fixes it to a set position in the world, and the numbers can be quickly and efficiently compared to other geospatial data types to answer questions like.. "How far is this point east of point x" "Does this point lie within polygon z?". Ohhh, I feel the power of this geospatial stuff.

Now we can add some "what" properties describe Fat Marie. Perhaps we can add the properties `type=tree`, `name=Dicke Marie`, `species=Quercus robur` and `height=23` and maybe we could add a link to the wikipedia article `wikipedia=https://de.wikipedia.org/wiki/de:Dicke Marie`

As a geojson, the data could be written like this

```json
{
    "type": "Feature",
    "properties": {
        "name": "Dicke Marie",
        "natural": "tree",
        "species": "Quercus robur",
        "height": "23",
        "wikipedia": "de:Dicke Marie"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [
            13.2649068,
            52.593577
        ]
    }
}
```

Infact someone already defined Dicke Marie using geospatial data and added it to Open Street Maps

[https://www.openstreetmap.org/node/205066401](https://www.openstreetmap.org/node/205066401)

### Geometry


TODO: explain that a point, string, and polygon combined with a map projection are the building blocks of geo data.

The primitive types of geometry are points, lines and polygons. The are the building blocks of geospatial data.

The

TODO: explain what geospatial data is (a file representing real world objects on a globe using co-ordinates and metadata)


## What is a river?

A river is a natural flowing watercourse that typically moves towards an ocean, sea, lake, or another river. It plays a vital role in the Earth's hydrological cycle and supports various ecosystems and human activities.

When working with geospatial data, it's important to distinguish between different types of watercourses based on their scale and characteristics. For example, major rivers like the Amazon or the Nile are considered distinct rivers at a global scale. However, when zooming in to a specific region, smaller watercourses such as streams, canals, and even ditches may also be identified as rivers.

The level of precision and detail required for identifying rivers depends on the context and purpose. In the case of a long-distance cycling route from London to Berlin, the focus may be on major rivers rather than smaller waterways. However, for a hike around a small town, even tiny streams or ditches could be of interest.

TODO: explain what a real world river is and how its different from a stream, and how as your mental geographical model "zoom out" you don't need so much precision with the smaller waterways. Eg when you thinking of a route the whole way across england, you probably don't care for all the tiny streams and ditches you went over, but in contrast if you do a hike around a small town, you might be interested in each of the tiny streams you went over.

### Where to get the river data from?

TODO: explain about open street maps and how great it is to have a community resource and that this was not available 25 years ago. Explain how a waterway relation is available for all main rivers from contributors, explain the problem about getting the smaller waterways, and querying osm for ways as well as relations.

TODO: link to and explain the points from: https://wiki.openstreetmap.org/wiki/Waterways, explain about the tags used for waterways and properties of a OSM data type.

TODO: explain about the difference between the [https://wiki.openstreetmap.org/wiki/Relation:waterway](https://wiki.openstreetmap.org/wiki/Relation:waterway) and 

TODO: add examples of the different waterways

```text
waterway=river
waterway=stream
waterway=tidal_channel
waterway=canal
waterway=ditch
waterway=drain
waterway=pressurised
natural=water
water=* 
```

## Open Street Maps

TODO: explain what OSM is, in terms of a dataset, open data, community driven. Talk about contributions from users like wikipedia for maps. Talk about apps like street complete and how most mapping providers use OSM data.

TODO: link to the OSM iceberg meme [https://www.openstreetmap.org/user/Xvtn/diary/403236](https://www.openstreetmap.org/user/Xvtn/diary/403236) and explainer 

### OSM Elements

TODO: explain about the different elements and how they map to the primative geometry types [https://wiki.openstreetmap.org/wiki/Elements](https://wiki.openstreetmap.org/wiki/Elements)

### OSM tagging 

TODO: explain about OSM tagging [https://wiki.openstreetmap.org/wiki/Tags](https://wiki.openstreetmap.org/wiki/Tags)

### Let's talk about time complexity

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

## Not all geo data files are created equally

TODO: explain about differences between geodata formats and the tradeoff's different formats make. 

### WKT 


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

By converting the OSM and route geographic data to geojson, I could use turf.js to do all spatial analytics in the js code, meaning the computing would be done client side and no backend would be required! Being in geojson format also means that it can be easily added to the map using [https://maplibre.org/maplibre-style-spec/sources/#geojson]()

### Ok enough theory, lets solve the problem.

## How to get the open data on rivers

### OpenStreetMaps (aka OSM)

TODO: talk about the OSM data model elements https://wiki.openstreetmap.org/wiki/Elements and how they map to points, linestrings, polygons.


### OSM Overpass API

[http://overpass-api.de](http://overpass-api.de)

We can use the Overpass Query langauge to search for OSM features in the proximity of a polyline [https://dev.overpass-api.de/overpass-doc/en/full_data/polygon.html](https://dev.overpass-api.de/overpass-doc/en/full_data/polygon.html).

This API reduces the problem to simply encoding the gpx file as a polyline, constructing a valid overpass query, and parsing the response.

#### Overpass Turbo

TODO: explain overpass turbo
[https://overpass-turbo.eu/](https://overpass-turbo.eu/)

TODO: explain the following query

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

TODO: explain how when we have a bigger region, we want to look at the ways and relations.

TODO: talk about the response https://wiki.openstreetmap.org/wiki/OSM_XML#Overpass_API_out_geom

## Application

Although I am most comfortable programming in python, I wanted everything to run locally on the client. Everything should be done on the client side, to avoid the need of hosting any backend. Therefore we will use the language of the browser, javascript.

### Maplibre gl

TODO: write about slippy maps, how good maplibre is because of vector tiles, allowing for zooming in and out without pixelation and ability to render features conditionally on the client side.

eg)

> Vector tiles represent a significant advancement in how map data is processed and presented. Unlike traditional raster tiles, which are static images with pixels, vector tiles are like the ‘SVGs’ of the mapping world: you get lines and points. This stores geodata in a format that allows for dynamic styling and interactivity, enabling the user to adapt the visual appearance of the map without altering the data. If that sounds like what you’ve seen on other maps, you are right! Vector tiles have become industry standard in interactive maps that, unlike openstreetmap.org, don’t get updated often, and where you can simply recalculate your whole database occasionally.

TODO: include some history of webmaps.

TODO: talk about the tradeoffs between vector and raster maps, and explain why vector maps are the best for this project.

TODO: Link to and explain that even OSM are going to vector based maps this year because they are so much better. [https://blog.openstreetmap.org/2024/02/11/2024-announcing-the-year-of-the-openstreetmap-vector-maps/](https://blog.openstreetmap.org/2024/02/11/2024-announcing-the-year-of-the-openstreetmap-vector-maps/)

### Upload file

### Creating a high quality user experience 

TODO: talk about being happy with the look and feel of maplibre, and reusing the css for displaying info.

#### Custom controllers

TODO: talk about the code to make the upload and strava controller.

#### Contain yourself

### Killer feature: Strava integration

TODO: explain that while some people do, most people don't know what a .gpx file is and don'
t have files laying stored on there local device. The typical cyclist/hiker would likely have activities on strava. Explain that you implemented a "connect with strava" button and wrote the code to fetch activities from strava and display them in a menu withing the app. Explain how this lets users circumvent  needing to know what a .gpx file or uploading anything and leads to a streamlined experiance for the user. 

### Strava Oauth

TODO: talk about the decision/impossible to avoid situation of adding a backend to implement strava oauth. Explain that it is needed to hide the client secret from being leaked. Explain how you keep it as lightweight as possible, and much could be improved.

TODO: talk about using flask and cors, and serving it with waitress because security reasons.

```python
import requests
from flask import Flask, request
from waitress import serve

from config import get_config_values, get_logger

### SET UP ENVIRONMENT ###
logger = get_logger()
CONFIG = get_config_values()

app = Flask(__name__)


@app.after_request
def after_request(response):
    # TODO: restrict this to only the hosted origin.
    # https://01100100.github.io/kreuzungen/index.html
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
    response.headers.add("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS")
    return response


@app.route("/oauth", methods=["POST"])
def oauth_callback():
    code = request.form.get("code")
    response = requests.post(
        f"{CONFIG.STRAVA_API_URL}/oauth/token",
        data={
            "client_id": CONFIG.STRAVA_CLIENT_ID,
            "client_secret": CONFIG.STRAVA_API_CLIENT_SECRET,
            "code": code,
            "grant_type": "authorization_code",
        },
    )
    if response.status_code != 200:
        raise Exception(
            f"Error fetching access token, status code {response.status_code}"
        )
    response.json()

    return response.json()


@app.route("/reoauth", methods=["POST"])
def refresh_token():
    refresh_token = request.form.get("refreshToken")
    response = requests.post(
        f"{CONFIG.STRAVA_API_URL}/oauth/token",
        data={
            "client_id": CONFIG.STRAVA_CLIENT_ID,
            "client_secret": CONFIG.STRAVA_API_CLIENT_SECRET,
            "refresh_token": refresh_token,
            "grant_type": "refresh_token",
        },
    )
    if response.status_code != 200:
        raise Exception(
            f"Error refreshing access token, status code {response.status_code}"
        )
    response.json()

    return response.json()


if __name__ == "__main__":
    serve(app, listen="*:8080")
```

TODO: talk about using this dockerfile to build the backend service

```Dockerfile
FROM python:3.11-slim-buster

COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

COPY src src

ENTRYPOINT ["python", "src/auth.py"]
```

TODO: talk about deploying this on fly.io using the following config

```toml
# See https://fly.io/docs/reference/configuration/ for information about how to use this file.
#

app = 'kreuzungen'
primary_region = 'ams'

[http_service]
  internal_port = 8080
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 0
  processes = ['app']

[[vm]]
  cpu_kind = 'shared'
  cpus = 1
  memory_mb = 256
```

TODO: talk about how you set the secrets on fly.io using the commands

``` bash
fly secrets set STRAVA_API_CLIENT_SECRET=$STRAVA_API_CLIENT_SECRET
fly secrets set STRAVA_REDIRECT_URI=$STRAVA_REDIRECT_URI
fly deploy
```
### Answering the community**: Sharing


---

#### Diving deeper with the style color

https://maplibre.org/maputnik/

<!-- TODO: write about how to rivers are rendered from the tiles. That the blue river is made up of a way which is a polygon, and a linestring that is the waterway relation or way

https://www.openstreetmap.org/relation/412169#map=19/52.45659/13.39513

https://www.openstreetmap.org/way/307632376#map=16/52.4725/13.4564

  -->

  ![Screen shot of river geometry intersection](image.png)
  <https://www.openstreetmap.org/way/307632376> is the polygon for the osm water body
  <https://www.openstreetmap.org/way/160175124> is the linestring for the osm waterway way


### Shout outs

[https://www.paulnorman.ca/](https://www.paulnorman.ca/)

### Future imrpovements

Use this lib for having gpx and osm stuff straight onto the map.
[https://github.com/jimmyrocks/maplibre-gl-vector-text-protocol](https://github.com/jimmyrocks/maplibre-gl-vector-text-protocol)