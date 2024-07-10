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
featuredImagePreview: "/videos/all_maps_greenwich.gif"

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

You might encounter two very different looking basemaps, which often leads to squinting and searching for a uniquely-shaped river bend on both maps, using that to line things up and then inevitably finding another bend in a river and doubting if you're even looking at the same thing.

## The Solution

[MapSwap](https://mapswap.trailsta.sh/), is a  simple yet ingenious tool I recently discovered through the [OSM US Slack community](https://slack.openstreetmap.us/). It provides a way of switching between mapping application whilst preserving the viewport. This means no more time spent manually aligning things and is a game changer 🔥.

![MapSwap Demo](/videos/mapswap.gif)

## Encoding the viewport in the URL

Many mapping services use a common pattern of encoding the viewport settings (latitude, longitude and zoom level) into the URL using the [hash property](https://developer.mozilla.org/en-US/docs/Web/API/URL/hash).

Consider for the sake of some examples, the undisputed arbitrarily-chosen center of the World[^prime-meridian-history], The Royal Observatory in Greenwich, London with co-ordinates `51.4769° N, 0.0000° E` and a arbitrary zoom level of `13`.

Here’s how different mapping services encode this information into the URL:

- OpenStreetMap: [`https://www.openstreetmap.org/#map=13/51.4769/0.0000`](https://www.openstreetmap.org/#map=13/51.4769/0.0000)
- Komoot: [`https://www.komoot.com/plan/@51.4769000,0.0000000,12.000z`](https://www.komoot.com/plan/@51.4769000,0.0000000,12.000z)
- Windy: [`https://www.windy.com/?51.477,0.000,13`](https://www.windy.com/?51.476,0.000,13)
- Google Maps: [`https://www.google.com/maps/@51.4769,0.0000,13z`](https://www.google.com/maps/@51.4769,0.0000,14z)

Most mapping libraries have built-in support for this feature out of the box.

{{< admonition type=tip >}}

If you're a developer using [MapLibre](https://maplibre.org/maplibre-gl-js/docs) or [Mapbox](https://www.mapbox.com/mapbox-gljs), you can simply set the [`hash` mapOption](https://maplibre.org/maplibre-gl-js/docs/API/type-aliases/MapOptions/#hash) to `true` when initializing the map, and the library will automatically update the URL hash when the map is moved or zoomed.

```js
let map = new Map({
  container: 'map',
  center: [0, 51.4769],
  zoom: 13,
  hash: true // SET THIS TO TRUE!
})
```

If you're using [Leaflet](https://leafletjs.com), there is a popular plugin that does this [https://github.com/mlevans/leaflet-hash](https://github.com/mlevans/leaflet-hash).

{{< /admonition >}}

## How MapSwap works

MapSwap is a little utility that you can add to your web browser, a Bookmarklet[^bookmarklet]. When you click the "MapSwap" bookmark, the browser executes a bit of javascript that parses the {x} and {y} coordinates and {z} zoom level from a map via the URL, using the `window.location`[^window.location] object. It then opens another tab, allowing you to select from various mapping applications. The selected application will open configured with the same coordinates and zoom level, essentially preserving the original viewport.

The file [`map.js`](https://gitlab.com/trailstash/mapswap/-/blob/main/swap/maps.js?ref_type=heads) houses a JSON array of mapping application entries.

Each entry contains the name of the application, a URL template string, an icon URL, and an array of tags.

A entry for Komoot would look something like this:

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

I noticed that [Komoot](https://www.komoot.com) wasn't supported in MapSwap, so I messaged the creator [Daniel Schep](https://schep.me) and put in a [PR](https://gitlab.com/trailstash/mapswap/-/merge_requests/2) to add Komoot to the tool. It was a pleasure to chat with Daniel, and the PR was merged in no time.

## Conclusion

There are many different mapping applications out there, each having pros and cons. Combining them together is incredibly useful, and MapSwap makes this easy. It means less fumbling between different maps trying to pinpoint the same location and that's a win in my book.

![Swapping maps in Greenwich](/videos/all_maps_greenwich.gif)

The next level to this would be syncing different maps viewports in real-time.

Imagine planning a big winter ski-touring-bike-packing trip using Komoot on the left side of the screen and then both snow conditions and ski touring routes on the right side, and everything moving in sync.

Sounds awesome, however browser security restrictions make this a bit tricky... a topic for another post.

[^triangulation]: [https://en.wikipedia.org/wiki/Triangulation](https://en.wikipedia.org/wiki/Triangulation)
[^window.location]: [https://developer.mozilla.org/en-US/docs/Web/API/Window/location](https://developer.mozilla.org/en-US/docs/Web/API/Window/location)
[^prime-meridian-history]: [https://en.wikipedia.org/wiki/Prime_meridian#Prime_meridian_at_Greenwich](https://en.wikipedia.org/wiki/Prime_meridian#Prime_meridian_at_Greenwich)
[^bookmarklet]: [https://en.wikipedia.org/wiki/Bookmarklet](https://en.wikipedia.org/wiki/Bookmarklet)
