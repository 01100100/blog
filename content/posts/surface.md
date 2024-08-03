---
title: "Surface"
subtitle: "Analysing OSM roads with the surface tag"
date: 2024-08-03T02:01:24+02:00
lastmod: 2024-08-03T02:01:24+02:00
draft: false
authors: []
description: "TODO:"

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
lightgallery: true
license: ""
---

<!--more-->

TODO: This blog will be about the surface tag in OSM. 

It will do a case study between germany and poland and include overpass-api queries to get the numbers for how many roads are tagged with the surface tag in each country.

Including:

* completeness of the surface tag in germany and poland
  * Charts
  * Map visualizations
  * What about unknown roads?
  * why might this be?
    * look into the history. Who imported the data. ect. 
* distribution of the surface tag in germany and poland
  * Charts
  * Map visualizations

* talk about the temporal aspect of the surface tag
  * how many roads are tagged with the surface tag in germany and poland over time due to renovations and new roads
  * Do roads degrade over time?
  * How long does it take for a road to disappear?

## Getting the data

### What is a road?

In OSM the highway tag defines roads and other paths like cycleways, footpaths .

### What is the surface tag?
The data will be obtained using the overpass-api. 

It will also include overpass ultra queries to visualize the data on a map using [https://overpass-ultra.us/](https://overpass-ultra.us/)

## Visualizing the results

### Overpass Ultra

Introducing the new, next level overpass-turbo. While the predecessor is a great tool that never failed, *Ultra* is based on MaplbireGL, and allows for vector tiles and styling the layers. Next level shit!

Overpass-turbo was a great and useful interface backed by the powerful overpass-api and many things possible with the Overpass Query Language. Ultra really does take this to the next level by keeping everything iin the vector worlds, and  avoid rasterization noise.

Thats a long way of saying the Overpass Ultra is a very nicely put together versatile tool. It fits beautifully on top of a rich planet amount of OpenStreetMap data. With this alone you can write some really good gis analysis and visualizations, which helps tell the story of geospatial data.


TODO: add a global analysis of the surface tag in OSM
TODO: add a table of countries and how they score in terms of the surface tag, completeness, and distribution, area of the country, population, and offical road network size.

### The problem with Poland

{{< image src="/images/portland.png" caption="This looks more like Portland then Poland" >}}
