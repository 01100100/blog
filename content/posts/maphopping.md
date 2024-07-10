---
title: "Map Hopping Made Easy!  🗺️🦘🗺️"
subtitle: "Yet another useful tool in the modern mapping ecosystem."
date: 2024-07-09T23:28:25+02:00
lastmod: 2024-07-09T23:28:25+02:00
draft: false
authors: []
description: " Yet another useful tool in the modern mapping ecosystem."

tags: []
categories: []
series: []

hiddenFromHomePage: false
hiddenFromSearch: false

featuredImage: ""
featuredImagePreview: "/videos/maphopping_skiguru_komoot.gif"

toc:
  enable: true
math:
  enable: false
lightgallery: false
license: ""
---

<!--more-->

## The Problem

I use a lot of different maps applications and often end up "map hopping". That involves finding a place on one mapping app and then trying to locate the same place on another app for "reasons".

Sometimes this is a smooth and quick process, but other times it can be a real pain fumbling around to digitally triangulate[^triangulation] and locate the same place on both maps.

![Trying to line up Komoot with SkiGuru](/videos/maphopping_skiguru_komoot.gif)

You might encounter two very different looking basemaps, which oftern leads to squinting and searching for a uniquely-shaped river bend on both maps, using that to line things up and then inevitably finding another bend in a river and doubting if you're even looking at the same thing.

## The Solution

[MapSwap](https://mapswap.trailsta.sh/), is a  simple yet ingenious tool I recently discovered through the [OSM US Slack community](https://slack.openstreetmap.us/). It provides a way of switching being mapping application whilst preserving the viewport. This means no more time spent trying to manually align this and is a game changer 🔥.

![MapSwap Demo](/videos/mapswap.gif)

## Encoding the viewport in the URL

Many mapping services use a common pattern of encoding the viewport settings (latitude, longitude and zoom level) into the URL using the [hash property](https://developer.mozilla.org/en-US/docs/Web/API/URL/hash).

For the sake of some examples, lets use the undisputed arbitrarily-chosen center of the World[^prime-meridian-history], The Royal Observatory in Greenwich, London with co-ordinates `51.4769° N, 0.0000° E` and a arbitrary zoom level of `13`.


Here’s how different mapping services encode this information into the URL:

- OpenStreetMap: [`https://www.openstreetmap.org/#map=13/51.4769/0.0000`](https://www.openstreetmap.org/#map=13/51.4769/0.0000)
- Komoot: [`https://www.komoot.com/plan/@51.4769000,0.0000000,13.000z`](https://www.komoot.com/plan/@51.4769000,0.0000000,13.000z)
- Windy: [`https://www.windy.com/?51.477,0.000,13`](https://www.windy.com/?51.476,0.000,13)
- Google Maps: [`https://www.google.com/maps/@51.4769,0.0000,13z`](https://www.google.com/maps/@51.4769,0.0000,14z)

Most mapping libraries have built-in support for this feature out of the box.

{{< admonition type=tip >}} 

If your a developer using MapLibre and Mapbox, you can simply set the [`hash` mapOption](https://maplibre.org/maplibre-gl-js/docs/API/type-aliases/MapOptions/#hash) to `true` when initializing the map, and the library will automatically update the URL hash when the map is moved or zoomed.

```js
let map = new Map({
  container: 'map',
  center: [0, 51.4769],
  zoom: 13,
  hash: true // SET THIS TO TRUE!
})
```

If your using leaflet, there is a popular plugin that does this [https://github.com/mlevans/leaflet-hash](https://github.com/mlevans/leaflet-hash).

{{< /admonition >}}

## How MapSwap works

MapSwap parses the {x} and {y} coordinates and {z} zoom level from the URL using the `window.location`[^window.location] object. It then opens another tab, allowing you to select from various mapping applications. The selected application will open with the same coordinates and zoom level, essentially preserving the original viewport.

There is a [file](https://gitlab.com/trailstash/mapswap/-/blob/main/swap/maps.js?ref_type=heads) which contains a json array of "application" items.

Each item contains the name of the application, a template string for the URL, an icon URL and an array of tags.

A new entry for Komoot would look like this

```js
{
  name: "Komoot",
  template:
    "https://www.komoot.com/plan/@{y},{x},{z}",
  icon: "https://www.komoot.com/favicon.ico",
  tags: ["commercial", "outdoor", "osm", "bike", "routing"],
}
```

The template string uses the placeholders `{x}`, `{y}` and `{z}` to insert the coordinates and zoom level into the URL. The tags are used to filter the applications in the UI.

The full list of parameters is documented in the [MapSwap README](https://gitlab.com/trailstash/mapswap/-/blob/main/README.md).

- `{x}` - Longitude
- `{y}` - Latitude
- `{z}` - Mapbox & MapLibre style Floating-point Zoom level
- `{Z}` - Google style Floating-point Zoom level (one greater than Mapbox/MapLibre style zoom)
- `{Zr}` - Leaflet style integer Zoom level (one greater than Mapbox/Maplibre style zoom)
- `{zr}` - Integer Zoom level (don't know if any maps use this)

## The Mapping community

The online mapping community is incredibly welcoming and friendly. I am repeatedly impressed by the quality of the tools and the willingness of developers to help each other out.

I noticed that Komoot wasn't supported in MapSwap, so I messaged the creator [Daniel Schep](https://schep.me) and put in a [PR](https://gitlab.com/trailstash/mapswap/-/merge_requests/2) to add Koomot. It was a pleasure to chat with Daniel, and the PR was merged in no time.

## Conclusion

There are many different mapping applications out there, each having pros and cons. Combining them together can be incredibly useful, and MapSwap makes this easy. It means less fumbling between different maps trying to pinpoint the same location and that's a win in my book.


![Swapping maps in Greenwich](/videos/all_maps_greenwich.gif)

The next level would be syncing two maps in real-time. Imagine planning a big winter ski-bike packing trip with Komoot on the left side of the screen and snow conditions and ski touring routes on the right side screen, and everything moving in sync. That would be awesome. Browser security restrictions make this a bit tricky... But that's a topic for another post.

[^triangulation]: [https://en.wikipedia.org/wiki/Triangulation](https://en.wikipedia.org/wiki/Triangulation)
[^window.location]: [https://developer.mozilla.org/en-US/docs/Web/API/Window/location](https://developer.mozilla.org/en-US/docs/Web/API/Window/location)
[^prime-meridian-history]: [https://en.wikipedia.org/wiki/Prime_meridian#Prime_meridian_at_Greenwich](https://en.wikipedia.org/wiki/Prime_meridian#Prime_meridian_at_Greenwich)
