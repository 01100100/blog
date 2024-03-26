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

featuredImage: "/images/oil_crossings.jpeg"
featuredImagePreview: ""

toc:
  enable: true
  auto: false


math: true
lightgallery: false
license: ""
---
<!--more-->

{{< admonition type=abstract title="Introducing Kreuzungen 🗺️" >}}
I recently made a website that reveals rivers and streams encountered on recent cycling or hiking adventures.
![](/images/screenshot_frame.png)
{{% center %}}
[https://kreuzungen.world](https://kreuzungen.world)
{{% /center %}}

The site is powered by OpenStreetMap data and open source technologies.

All source code is available in this [github repository](https://github.com/01100100/kreuzungen)

{{< /admonition >}}

## Introduction

Last year I embarked on a ride bike from a [geo-spatial-data-conference](spatial-data-science-conference.com) in London to my home in Berlin.

I used [Komoot](https://www.komoot.com) to plan, navigate and record my journey. I set my start point to the Royal Albert hall in London and my end point to Brandenburg Tor in Berlin, with intermediate points being the international ferry ports of Harwich and Hook of Holland. I choose "Road cycling" as my preferred style of riding and hit the "Let's go" button. It was that easy! I am a huge fan of the [Komoot](https://www.komoot.com) app and highly recommend it.

![Komoot Screenshot](/images/komoot_screenshot.png)

During my multi-day ride, crossing various rivers, a thought struck me:

{{% center %}}
***How many waterways have I crossed and what are they called?***
{{% /center %}}

Realizing that I had recorded data of the ride, had the great asset of open street maps at my fingertips, and the geo-spatial-data know how, I put a plan together...

{{< admonition type=tip title="The Plan" >}}

{{% center %}}
**To develop a tool that could be fed with a .gpx recording. It should list all the waterways crossed en route and display a map with the journey and highlight all crossed waterways.**

{{% /center %}}
{{< /admonition >}}

As a geospatial data engineer, and a lover of long cycles in really remote places, this challenge doesn't sound too hard.

Little did I know that this project would turn out to be much more interesting than first expected and lead me down many new roads, just like the bike journey.

{{< admonition type=tip title=Naming >}}
The word "Kreuzungen" is German for "crossings"...

{{% center %}}
[https://de.wiktionary.org/wiki/Kreuzung](https://de.wiktionary.org/wiki/Kreuzung)
{{% /center %}}
{{< /admonition >}}

## Geospatial Data 101

Geospatial data, in its simplest form, refers to information that describes an object in space.

It consists of two parts: the "where" and the "what". The "where" part includes spatial information describing the geometry and location of an object, while the "what" part includes non-geometric properties/attributes that describe and give meaning to an object.

### Geometry

The spatial part is composed of different types of geometries. The primitive types of geometry are points, lines and polygons. These are the building blocks of geospatial data, and out of them we can build some amazing things.

- A Point: represents a specific location on the Earth's surface, defined by its latitude and longitude coordinates. It is often used to mark a point of interest, such as a atm, traffic light or water fountain.
- A LineSting: represents a path made up of a ordered series of connected points. A hiking path, road or a river.
- A Polygon: A polygon is a closed shape with the vertices defined by a ordered series of points. It is used to represent areas like countries, cities, or lakes. Polygons are defined by a list of coordinates that outline their boundaries.


```goat
                             *-----*
    *    *---*-*            /       \ 
                \          /         \
                 *---*    *-----------*
```

### An Example: Dicke Marie (Fat Mary)

If you go into Tegel Forest in the east of Berlin, you might bump into the so called "Fat Mary". This is the name given to a really old, award winning Oak tree, estimated to be over 800 years old.


[https://berlindoodleblog.blogspot.com/2015/02/dicke-marie.html](https://berlindoodleblog.blogspot.com/2015/02/dicke-marie.html)

![Dicke Marie](/images/dickemarie.jpg)
Let's imagine what the geospatial data would look like that describes this great tree...

First we should define the location or the "where" of Dicke Marie. We could use words to do this, perhaps "North East of Berlin", "" or "about 300m south of " However we can do much better if we define with the position with a single set of co-ordinates `(52.5935770, 13.2649068)` locating the point where the centre of the tree trunk comes out of the ground. These numbers are much more powerful then the wordy descriptions. It fixes it to a set position in the world, and the numbers can be quickly and efficiently compared to other geospatial data types to answer questions like.. "How far is this point east of point x" "Does this point lie within polygon z?". Ohhh, I feel the power of this geospatial stuff.

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

In fact someone already defined Dicke Marie using geospatial data and added it to Open Street Maps

[https://www.openstreetmap.org/node/205066401](https://www.openstreetmap.org/node/205066401)

### Geometry


TODO: explain what geospatial data is (a file representing real world objects on a globe using co-ordinates and metadata)

TODO: talk about invalid geometries and problems around holes (https://en.wikipedia.org/wiki/Even%E2%80%93odd_rule vs https://en.wikipedia.org/wiki/Nonzero-rule) ect... link to https://mapshaper.org


## What is a river?

A river is a natural flowing watercourse that typically moves towards an ocean, sea, lake, or another river. It plays a vital role in the Earth's hydrological cycle and supports various ecosystems and human activities. 

<iframe style="border-radius:12px" src="https://open.spotify.com/embed/episode/2Azu2f93hikPGcwQJ876QK?utm_source=generator&theme=0" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>

<iframe style="border-radius:12px" src="https://open.spotify.com/embed/episode/2Azu2f93hikPGcwQJ876QK?utm_source=generator" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>

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
TODO: include points about human readability, compression, metadata 

| datatype | Description |
|:------:| -----------:|
| data   | path to data files to supply the data that will be passed into templates. |
| engine | engine to be used for processing templates. Handlebars is the default. |
| ext    | extension to be used for dest files. |
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

### .parquet

### Polyline

https://developers.google.com/maps/documentation/utilities/polylinealgorithm

https://www.twistedape.me.uk/2014/04/20/google-polyline-encoding/

### ProtoMap tiles

The new kid on the block.

This is cutting edge stuff. New take on serving vector content involving classic comp sci and math concepts (range headers,). Includes some cool ideas from my fave space filling curve from German Mathmatician Mr Hillbert

### Vector tiles

> Compared to a tiled raster map, data transfer is also greatly reduced, as vector data is typically much smaller than a rendered bitmap. Also, styling can be applied later in the process, or even in the browser itself, allowing much greater flexibility in how data is presented. It is also easy to provide interactivity with map features, as their vector representation already exists within the client.[2] Yet another benefit is that less centralised server processing power is required, since rasterisation can be performed directly in the client. This has been described as making "rendering ... a last-mile problem, with fast, high-quality GPU[s] in everyone’s pocket".[3]

https://en.wikipedia.org/wiki/Vector_tiles

https://github.com/protomaps/PMTiles/blob/master/spec/v3/spec.md

There is a really good paper which benchmarks and compares the loading and interaction time of vector and raster basemaps [Performance Testing on Vector vs. Raster Map Tiles—Comparative Study on Load Metrics](https://www.mdpi.com/634908)

### Geoparquet

TODO: link to https://geoparquet.org/

## Converting between the formats

### Why?

By converting the OSM and route geographic data to geojson, I could use turf.js to do all spatial analytics in the js code, meaning the computing would be done client side and no backend would be required! Being in geojson format also means that it can be easily added to the map using [https://maplibre.org/maplibre-style-spec/sources/#geojson]()

### Ok enough theory, lets solve the problem.

## How to get the open data on rivers

### OpenStreetMaps (aka OSM)

TODO: talk about the OSM data model elements https://wiki.openstreetmap.org/wiki/Elements and how they map to points, linestrings, polygons.


### OSM Overpass API

[http://overpass-api.de](http://overpass-api.de)

OpenStreetMap offer a read-only public API called the Overpass API, perfect for this project.

Its possible to use the Overpass Query langauge to search for OSM features in the proximity of a polyline [https://dev.overpass-api.de/overpass-doc/en/full_data/polygon.html](https://dev.overpass-api.de/overpass-doc/en/full_data/polygon.html).

This API reduces the problem to simply encoding the gpx file as a polyline, constructing a valid overpass query, and parsing the response.

#### Overpass Turbo

TODO: explain overpass turbo and how its useful for testing out queries.
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

> Background¶
  What are raster tiles?¶

  As we mentioned in the intro, map tiles can be broadly classified as either raster or vector. Raster tiles are the simplest to understand, as they are just PNG or JPG images that get stitched together in a grid, so we'll start here.
  Advantages¶

  Raster tiles have been around for a long time, and even today, they have a number of unique advantages.

      Simplicity - Just about every device can render a PNG or JPG image, and it's very easy to build a performant renderer around these. Additionally, raster tiles don't require any other resources (such as fonts or icons) or special logic to render.
      Specificity - Map tiles simplify a lot of data into a form that's useful for the user. If you are working with a minimalist map style (like our Alidade Smooth family), raster tiles can be more bandwidth efficient, as they only contain the raw visible pixels.

  Limitations¶

  While raster tiles are battle tested and supported pretty much everywhere, they also have some inherent limitations.

  Inflexibility - You cannot change much about raster tiles. If you want to hide a certain layer, change the language of labels, or do just about anything else to alter the appearance of the tiles, you're out of luck.
  Scalability - Raster map tiles cannot be scaled up and down, meaning you need to send 4x as many pixels over the network for your maps to look good on modern "high DPI" displays. This problem also shows up when zooming in to a raster map as the tiles become blurry until the new ones are loaded.

  What are vector tiles?¶

  Vector tiles are a newer development, and are broadly viewed as the future of digital interactive maps. Rather than pixels, vector tiles contain a mathematical description of the geometry as well as structured data about each feature on the map.
  Advantages¶

  Flexibility - Vector tiles aren't just raw pixels; the actual data is preserved in the tile. This means that you can seamlessly change the language of text labels, change the color scheme to suit your brand, or even switch styles dynamically based on the time of day or the user's device preferences. You can even completely change the camera angle for a 3D perspective.
  Scalability - Since vector shapes are expressed in mathematical terms, they can be scaled up and down smoothly. For example, when the user zooms in, they'll get a smooth scale-in without any pixelation. This is especially relevant on mobile devices, where users are used to continuous zoom for most applications rather than discrete steps.
  Cost - Many vendors, including Stadia Maps, charge per tile request. Switching to vector tiles can mean significant savings, as vector tiles cover a larger area. On average, we see users switching to vector making approximately 60% fewer tile requests.

  A vector map showing a 3D perspective view of Midtown, Atlanta
  Limitations¶

  Complexity - While vector tiles provide a lot of flexibility, this comes at the cost of complexity. Tiles need to be rendered client-side, and this may create performance concerns for older or embedded applications. Additionally, since vector maps require additional resources to be present, the initial map load typically involves a greater number of network requests.
  Size - For applications only requiring a low level of detail that don't utilize any of the 3D perspective features of vector tiles, the vector tiles can weigh a bit more. However, this is somewhat offset since all zooming past level 14 can use the information in the z14 tile.

  Recap: Which should I use?¶

  We've covered a lot of ground. To summarize, vector tiles offer greater flexibility, look great on any screen, and typically reduce costs by around 60%. However, if your application is targeting older devices or doesn't need a high level of detail (for example, our Alidade Smooth and Alidade Smooth Dark styles), raster tiles are not necessarily a bad option.

TODO: include some history of webmaps.


https://en.wikipedia.org/wiki/Web_mapping 

TODO: talk about the tradeoffs between vector and raster maps, and explain why vector maps are the best for this project.

TODO: Link to and explain that even OSM are going to vector based maps this year because they are so much better. [https://blog.openstreetmap.org/2024/02/11/2024-announcing-the-year-of-the-openstreetmap-vector-maps/](https://blog.openstreetmap.org/2024/02/11/2024-announcing-the-year-of-the-openstreetmap-vector-maps/)

### Vector tile provider 

TODO: talk about how it would be possible to generate these using open data and a machine, but it is not needed as there are many shops offering this product, in a way thats been optimally distibuted (CDN)

eg) The complete OSM vector tile data set is >110gb https://data.maptiler.com/downloads/dataset/osm.

https://wiki.openstreetmap.org/wiki/Vector_tiles#Providers

TODO: Talk about maptiler and stadia maps both offering free tiers for serving vector map tiles. Maptiler give 100,000 requests per month for free. 

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

TODO: we want users to connect with strava and then request the activites data from Strava. give a brief explination of what a oauth flow is and  explain why it is impossible to avoid situation of adding a backend to implement strava oauth. Explain that a backend is needed to hold the client secret and avoid it being in the front end and thus leaked into the world. Explain the intention to keep the backend as lightweight as possible using flask and point to the codein `src/auth.py`, and mention much could be improved.

> All developers need to register their application before getting started. A registered application will be assigned a client ID and client secret. The secret is used for authentication and should never be shared.
- https://developers.strava.com/docs/authentication/

Putting the client secret in the frontend would compromise the security of the application.

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

### Answering the community**: Make it easy to share the good stuff

A *early-beta-tester* (you know who you are) gave me some feedback that they would like to share the site with friends. This  which gave me a few ideas:

- Have the website preview displayed nicely when shared in a messaging app or on social media by using the [Open Graph protocol](https://ogp.me/)
- Have a share-with-social-media* button.
- Create a url link to a actual activity from a user which they could send to a mate to explore.
  - Encode the a users activity into a string.
  - Add it to a sharable link with a url parameter.
  - Parse the route and decode it on the new client.

#### What the OPG?

> The Open Graph protocol enables any web page to become a rich object in a social graph**

That sounds pretty good! Basically you can add some specific `<meta>` tags to the `<head>` of a website, and when you share a url in social-media/messaging apps will render the content and display a little preview.

This was a easy one to implement after reading the spec on [https://ogp.me](https://ogp.me). I looked up the optimal image dimensions and according to *reasons* this was **1200px x 630px**. The result was added in the following code

```html {linenos=table,hl_lines=["4-10"],linenostart=4}
<head>
  <title>Kreuzungen 🗺️</title>
  <!-- Metadata -->
  <meta property="og:title" content="Kreuzungen 🗺️" />
  <meta property="og:description" content="Upload a GPX file and see which waterways were crossed." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://kreuzungen.world/" />
  <meta property="og:image" content="https://kreuzungen.world/img/screenshot.jpg" />
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />

```

At first the image was not being displayed when I shared it via whatsapp, however a [quick stackoverflowing](https://stackoverflow.com/a/39182227) explained WhatsApp only supports images less than 300kb in size so I added a compressed image.

Everything worked, the internet is magic sometimes!

{{< admonition type=tip >}}
https://opengraph.dev is a nice site to test out how the content is rendered on different platforms.
{{< /admonition >}}

### Share button

> Thousands of candles can be lit from a single candle, And the life of the candle will not be shortened. Happiness never decreases by being shared. - The Buddha

I wanted to have a nice and easy way for people to share the map, because happiness is good. to implement this I created another control with the well known [share icon](https://en.wikipedia.org/wiki/Share_icon).

{{< admonition type=note >}}

TODO: put in the many different share icons that people are used to... talk about standardizing this [share icon](https://en.wikipedia.org/wiki/Share_icon)

{{</ admonition >}}

When the control is clicked on, it should expand and show different options for quickly sharing on different platforms using as well as having a copy button that will copy the url to the clipboard.

The clickingaround-test showed that the copy-to-clipboard didn't feel like it was working because there was no user feedback. To fix that I implemented a message to signify that the copy action has been done, it fades out after 0.5s.

```js
class ShareControl {
      onAdd(map) {
        this._map = map;
        this._container = document.createElement('div');
        this._container.className = 'maplibregl-ctrl maplibregl-ctrl-group';
        this._container.style.margin = '0 10px'

        const urlButton = document.createElement('button');
        urlButton.id = 'urlButton'
        urlButton.type = 'button';
        urlButton.style.display = 'none'
        urlButton.title = 'Copy url to clipboard';
        urlButton.style.borderRadius = "4px";
        urlButton.onclick = () => {
          navigator.clipboard.writeText(shareableUrl)
            .then(() => {
              console.log('URL copied to clipboard: ' + shareableUrl);
              const mapContainer = document.getElementById("map");
              const messageContainer = document.createElement("div");
              messageContainer.className = "url-copied-message";
              const icon = document.createElement("i");
              icon.className = "fa-solid fa-link";
              const text = document.createTextNode("URL copied to clipboard.");
              messageContainer.appendChild(icon);
              messageContainer.appendChild(text);
              mapContainer.appendChild(messageContainer);

              // Fade out the message by setting opacity to 0
              setTimeout(() => {
                messageContainer.style.opacity = 0;
                setTimeout(() => {
                  mapContainer.removeChild(messageContainer);
                }, 500); // Fade out for 500 milliseconds
              }, 500); // Displayed solid for 500 milliseconds
            })
            .catch(err => {
              console.error('Unable to copy URL to clipboard', err);
            });
        };

        const urlIcon = document.createElement('i');
        urlIcon.className = 'fa-solid fa-link';
        urlButton.appendChild(urlIcon);

        const emailButton = this.createShareButton('email', 'fa-solid fa-envelope');
        emailButton.addEventListener('click', () => {
          window.open(`mailto:?subject=Check out what has been crossed on my latest adventure!&amp;body=Check out this site ${shareableUrl}`, '_blank');
        });
        const whatsappButton = this.createShareButton('whatsapp', 'fa-brands fa-whatsapp');
        whatsappButton.addEventListener('click', () => {
          // https://faq.whatsapp.com/5913398998672934
          if (isRouteDisplayed) {
            var whatsappMessage = `Check out the waters I crossed on a recent adventure.. ${shareableUrl}`
          } else { var whatsappMessage = `Check out this site for you recent adventures.. ${shareableUrl}` }
          let whatsappShareLink = `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`
          window.open(whatsappShareLink, '_blank');
        });
        const facebookButton = this.createShareButton('facebook', 'fa-brands fa-facebook');
        facebookButton.addEventListener('click', () => {
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareableUrlEncoded}`, '_blank');
        });
        const twitterButton = this.createShareButton('twitter', 'fa-brands fa-twitter');
        // https://developer.twitter.com/en/docs/twitter-for-websites/tweet-button/guides/web-intent
        twitterButton.addEventListener('click', () => {
          if (isRouteDisplayed) {
            var twitterMessage = `Check out the waters I crossed on a recent adventure..`
          } else { var twitterMessage = `Check out this site for you recent adventures..` }
          window.open(`https://twitter.com/intent/tweet?url=${shareableUrlEncoded}&text=${twitterMessage}`, '_blank');
        });
        this._container.appendChild(urlButton);
        this._container.appendChild(emailButton);
        this._container.appendChild(whatsappButton);
        this._container.appendChild(facebookButton);
        this._container.appendChild(twitterButton);

        const shareButton = document.createElement('button');
        shareButton.type = 'button';
        shareButton.title = 'Share';
        shareButton.style.borderRadius = "4px";
        shareButton.onclick = () => {
          if (isShareExpanded) { this.minimizeShareControl() } else { this.expandShareControl(); }
        };

        const shareIcon = document.createElement('i');
        shareIcon.className = 'fa-solid fa-share-nodes'; // Assuming you are using FontAwesome for icons
        shareButton.appendChild(shareIcon);

        this._container.appendChild(shareButton);

        return this._container;
      }

      createShareButton(id, faIcon) {
        const button = document.createElement('button');
        button.id = `${id}Button`
        button.type = 'button';
        button.style.display = 'none'
        button.title = id;
        button.style.borderRadius = "4px";
        const icon = document.createElement('i');
        icon.className = faIcon;
        button.appendChild(icon);
        return button;
      }

      minimizeShareControl() {
        const urlButton = document.getElementById("urlButton");
        urlButton.style.display = 'none';
        const emailButton = document.getElementById("emailButton");
        emailButton.style.display = 'none';
        const whatsappButton = document.getElementById("whatsappButton");
        whatsappButton.style.display = 'none';
        const twitterButton = document.getElementById("twitterButton");
        twitterButton.style.display = 'none';
        const facebookButton = document.getElementById("facebookButton");
        facebookButton.style.display = 'none';
        isShareExpanded = false
      }

      expandShareControl() {
        const urlButton = document.getElementById("urlButton");
        urlButton.style.display = 'block';
        const emailButton = document.getElementById("emailButton");
        emailButton.style.display = 'block';
        const whatsappButton = document.getElementById("whatsappButton");
        whatsappButton.style.display = 'block';
        const twitterButton = document.getElementById("twitterButton");
        twitterButton.style.display = 'block';
        const facebookButton = document.getElementById("facebookButton");
        facebookButton.style.display = 'block';
        isShareExpanded = true
      }

      onRemove() {
        this._container.parentNode.removeChild(this._container);
        this._map = undefined;
      }
    }
```

Going deeper

### ✨ Route shared with magic link ✨

I want to avoid adding a backend and having to deal with user data storage. So this must be done on the client side. The site so far is stateless, so the problem is simply how to share the route data from one user to another.

One way is to enocde it and add it to the url parameters. The polyline format is a perfect choice for this for this, it enocodes a line, or more specifically a series of coordinates into a single string

Let have a look at how the walk from Brandenburg Tor to the Reichstag would be encoded.
```json
{
  "type": "LineString",
  "coordinates": [
    [
      13.37749,
      52.51626
    ],
    [
      13.3772,
      52.51624
    ],
    [
      13.37703,
      52.5164
    ],
    [
      13.37651,
      52.51638
    ],
    [
      13.37674,
      52.51664
    ],
    [
      13.37442,
      52.51769
    ]
  ]
}
```

```text
sap_IixspABx@_@`@BfBs@m@qEnM
```


TODO: add codesandbox to let the reader play around.

That looks much better. This is almost good enough to be used in a url that someone could share through an app. To improve things a little I will avoid them pesky characters `backticks` that mess up the url displaying in whatsapp.

Anytime a route is processed I update the `shareableUrl` variable with a `route` parameter equal to the encoded polyline.

```js
shareableUrl = `https://kreuzungen.world/index.html?route=${encodeURIComponent(polyline.fromGeoJSON(displayedRouteGeoJSON))}`
```
Then 
```js
if (urlParams.has('route')) {
  var route = urlParams.get('route')
  coordinates = polyline.decode(route);
  geojson =  polyline.toGeoJSON(route)
  geojson.properties = { "name":  "✨ Route shared with magic link ✨"};
  // Ensure the map style is loaded before processing the route.
  if (mapInstance.isStyleLoaded()) {
      processGeojson(geojson);
    } else {
      mapInstance.once('style.load', () => {
        processGeojson(geojson);
      });
    }
}
```

### But how long can a url be?



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


### Speeding things up.

I want this app to be as fast as possible. Everything feels better when there is a instant reaction, and in the modern "short-attention-span" age, it's kind of a given that things should work quickly and if not people assume something is broken.

#### First things first, lets profile

## Build it and they will come, right?

Ok so the app is built, and it's working. The next step is to share it with the world, and ensure that people can find it when they are looking for it.

### Memorable domain name

I already settled on the name Kreuzungen. It's a German word that means "crossings" or "intersections". It's subjectively short, easy to remember, and it's meaning  is used in the context of the app.

To no surprise, the domain kreuzungen.com was already taken and a short call to the owner assured me that it was not up for sale, ces't la internet.

I looked at what other top level domains were not taken, and although there was not `.en` top level domain so that I could do the cool thing where the fully qualified domain is the world (like `bit.ly`, `redd.it`) I saw that **`krezungen.world`** was available. I liked the way it sounded, so I bought it.

### DNS

Setting up github pages with my new shiny domain was pretty easy. I followed the [docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site) and configured my DNS with some A records pointing to github servers.

After waiting a few mins, I checked that the records had propagated through the network.

```bash
➜  ~ dig kreuzungen.world +noall +answer -t A
kreuzungen.world.	195	IN	A	185.199.109.153
kreuzungen.world.	195	IN	A	185.199.110.153
kreuzungen.world.	195	IN	A	185.199.108.153
kreuzungen.world.	195	IN	A	185.199.111.153
```

Then I updated the github repo with the custom domain and all seemed good.

![Github notification saying "Your site is live at https://kreuzungen.world/"](/images/github_pages_custom_domain.png)

A last sanity check with the browser showed that [https://kreuzungen.world](https://kreuzungen.world) was live!

### SEO

I am no SEO expert, and everything I implement was based on a few google searches, if any SEO pro's are reading and have some tips, I would love to hear them.

#### Google

It is 2024 and people google things, that is a fact of life and if I want people to be able to find my site, I need to make sure it is displayed on google. Therefore I need to get google to crawl and index it!

{{< admonition type=tip title="Google 101" >}}
Generally, google finds all website and will automatically index them, but this can take time

There are a few things you can do to speed up the process.
{{< /admonition >}}

#### Crawl first before you walk

I added the site to the [google search console](https://search.google.com/search-console/about) and verified that I was the owner of the domain by adding a TXT record to my DNS.

TODO: add a screen shot of it on google.

#### Description

TODO: talk about how you imrpoved the description/snippet [https://developers.google.com/search/docs/appearance/snippet](https://developers.google.com/search/docs/appearance/snippet)

### Shout outs

[https://www.paulnorman.ca/](https://www.paulnorman.ca/)

### Future imrpovements

Use this lib for having gpx and osm stuff straight onto the map.
[https://github.com/jimmyrocks/maplibre-gl-vector-text-protocol](https://github.com/jimmyrocks/maplibre-gl-vector-text-protocol)

#### Known issues

When asking OSM for ways and joining together ways with the same name, there might be some common name used for them both (), meaning there will be a .

Sometimes the name fo the relation willbe different from the ways resulting in two unique objects.

![](image-1.png)

### TODO:

[ ] - add diagrams https://hugodoit.pages.dev/create-diagrams/#complicated
[ ] - add contents on the right hand side