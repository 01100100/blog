---
type: posts
title: "High grade location fusion: when gps alone doesn't cut it!  📍"
subtitle: "Navigating through the world of location data and all that jazz"
date: 2024-07-09T23:28:25+02:00
lastmod: 2024-07-09T23:28:25+02:00
draft: true
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
lightgallery: true
license: ""
---

<!--more-->

## The modern miracle 🌎

Sometimes I pause for a moment and enjoy the simple things in life.

The fact that there are satellites 4500m above are head that we can openly use to triangulate our position, and that we are all walking round with this tech readily available at the mere consent is pretty mind blowing

This position data, can be useful for all sorts of things, like locating your position on a map and calculating your speed and distance travelled.

[Screenrecording of Komoot in action]()

However there are some situations where GPS alone doesn't get the job done. If you are in a dense concrete jungle, going in a tunnel, or even just in a building with thick walls, then the signals can be way off. 

[Tunnel example]

[Industrial sky scraper example]

However we can do better! thanks to the other sensors on our smart phones, we can improve things, and combine the strengths of a whole team of sensors to get a better result.

## The problem with ~~GPS~~ GNSS 🛰️

Lets get something out the way. Calling all satellite navigation systems "GPS" is like calling every smartphone an "iPhone" – technically wrong, but everyone calls it this, so whatever.

GPS is a specific system of US satellites, like the country, it can sometimes seem like it's the only system that matters. But GNSS which stands for global navigation satellite system is actually the whole family of different states satellite systems and they work collectively united (to help you find the nearest coffee shop).

{{< admonition type=tip title="The extended GNSS family" open=false >}}

#### 🇺🇸 GPS (USA)

- **Operator:** United States Space Force (Mission Delta 31)
- **Constellation:** 31 operational (nominal size 24)
- **Orbit:** MEO at ~20,180 km (orbital period ≈ 11h 58m)
- **First Launch:** February 22, 1978
- **Fully Operational:** July 17, 1995 (24 satellites in place by 1993)
- **Civilian Accuracy:** ~4.9 meters (95% confidence), ~5 meters typical

#### 🇷🇺 GLONASS (Russia)

- **Operator:** Roscosmos
- **Constellation:** 26 active (nominally 24)
- **Orbit:** MEO at ~19,130 km (orbital period ≈ 11h 16m)
- **First Launch:** October 12, 1982
- **Global Coverage Restored:** October 2011
- **Accuracy:** 5–10 meters standard; ~2.8–7.4 meters with modern signals

#### 🇪🇺 Galileo (EU)

- **Operator:** EUSPA & ESA
- **Constellation:** 30 on-orbit (24 active + 6 spares)
- **Orbit:** MEO at ~23,222 km (orbital period ≈ 14h 4m)
- **Initial Services:** December 15, 2016
- **Full Operational Capability:** June 2022
- **Public Accuracy:** < 1 meter (dual-frequency Open Service)

#### 🇨🇳 BeiDou (China)

- **Operator:** China National Space Administration (CNSA)
- **Constellation:** 30 core satellites (24 MEO + 3 IGSO + 3 GEO) + legacy (total ~35)
- **Orbits:**
  - MEO: ~21,528 km
  - IGSO/GEO: ~35,786 km
- **Global System Completed:** July 2020 (BDS-3)
- **Public Accuracy:** ~3.6 meters globally; ~2.6 meters in Asia-Pacific

#### 🇮🇳 NavIC (India)

- **Operator:** ISRO (IRNSS)
- **Constellation:** 7 satellites (3 GEO + 4 IGSO)
- **Orbit Altitude:** ~35,786 km
- **First Launch:** July 1, 2013
- **Coverage:** India + ~1,500 km beyond borders
- **Accuracy:**
  - < 10 meters over Indian landmass
  - < 20 meters in surrounding region (2σ)

#### 🇯🇵 QZSS (Japan)

- **Operator:** QZSS Services Inc. / Cabinet Office (Japan)
- **Constellation:** 4 operational (target: 7)
- **Orbit:** 
  - 3 satellites in inclined, elliptical geosynchronous quasi-zenith orbits
  - 1 satellite in GEO at 136°E (~35,786 km)
- **Initial Launches:** First in 2010; fourth in 2021
- **Service Area:** Augments GPS over Japan
- **Accuracy Improvement:** 
  - From meter-level (GPS alone) to sub-meter (SLAS)
  - Down to centimeter-level in Japan with CLAS/PPP

{{< /admonition >}}

## The sensors

A modern day smart phone can have the following sensors:

- GPS
- Accelerometer
- Gyroscope
- Magnetometer
- Barometer
- Network
- WiFi
- Bluetooth

There are more, but these are the main ones that get used for location tracking.

## Combining Sensors 

We can fuse the data from all of these sensors to get a better result. This is known as sensor fusion.

It's quite simple in theory, but in practice it can be quite complex.

## Lets talk about (Battery) life 🪫

More sensors on, means more battery usage. The sensors are all constantly sending data to the CPU, and the CPU is constantly processing that data.

With location tracking, you probably want to have high frequency updates, but this will increase the battery drain.

There is a trade off that you have to make.

Basically can either have a more accurate location, or a longer battery life.

If you smart about how you want to track location, you can be smart about things. Use the full power of the sensors when you need it, and turn down the power when you don't.

{{< admonition type=tip title="Turn up the power?" open=false >}}

The candle that burns twice as bright burns half as long

--- A wise woman 👩‍🚀

{{< /admonition >}}

[https://developers.google.com/location-context/fused-location-provider](https://developers.google.com/location-context/fused-location-provider)



Google fusion sensor api actually does this for you has a lot of smart logic built in to it. It will turn on and off the sensors as needed, and it will also adjust the frequency of the updates based on the situation.

When you set it up, you get two options:

-- **Coarse location**: This will use only the GPS, and will give you a less accurate location. This will drain your battery the slowest.

## Storing location data

When you are tracking location, you will want to store the data somewhere. This can be done in a number of ways.
- **Local storage**: This is the simplest way to store data. You can use a local file or go in with SQLite. This is perfect for offline situations.
- **Remote storage**: This is where you send the data to a server. This can be done in a number of ways, but the most common is to use a REST API. This is perfect for online situations.
- **Hybrid storage**: This is where you use both local and remote storage. You can store the data locally, and then send it to the server when you are online. This is perfect for situations where you have a mix of online and offline situations. Offline first is the new buzzword, but the idea has been around for a whiel and is here to stay.

## Little demo

### Kotlin Multi Platform example

I whipped up a fresh kotlin multi platform project for android and ios with the help of the wizard. I went for compose for the UI, downloaded it, unzipped it and loaded it up in andorid studio.

![Kotlin MMP wizard](/media/location/image.png)


I then added the location permission to the manifest, and added the location dependency to the build.gradle file.

I also added [maplibre-compose](https://sargunv.github.io/maplibre-compose/getting-started/) from [sargunv](https://github.com/sargunv) as a dependency and made a little map screen to test out the setup. I paired my phone via wifi, hit the run button and watched the magic happen.

[TODO: add viddeo of my phone]

Ok lets do this! I want to first implement a "geolocation" control that when I press it, it will get my location and show it on the map and center + zoom the map.

```kotlin
// TODO: add code example
```
This was easy thanks to the incredible work done by the maplibre project. We live in good times to be a geo-spatial developer.

### GPS Exchange Format (better know as GPX)

A XML file format for storing GPS data, developed by TopoGrafix. It can be used to store waypoints, tracks, and routes. 

If you're interested in the format, you can read how it can help you in your projects. [https://www.topografix.com/gpx_for_developers.asp](https://www.topografix.com/gpx_for_developers.asp)



[screenrecording of the geo location button in action]

### Configuring the location settings

When you are using the location API, you can configure the settings to get the best results for your situation. You can set the following parameters:
- **Priority**: This is the most important setting. You can set it to high accuracy, balanced power, or low power. High accuracy will use all the sensors, and will give you the best results. Low power will use only the GPS, and will give you a less accurate location.
- **Interval**: This is the time between updates. You can set it to a specific time, or you can set it to the fastest interval. The fastest interval will give you the best results, but it will also drain your battery the fastest.
- **Fastest interval**: This is the fastest time between updates. You can set it to a specific time, or you can set it to the fastest interval. The fastest interval will give you the best results, but it will also drain your battery the fastest.
- **Smallest displacement**: This is the smallest distance between updates. You can set it to a specific distance, or you can set it to the smallest distance. The smallest distance will give you the best results, but it will also drain your battery the fastest.
- **Location request**: This is the location request object. You can set the priority, interval, fastest interval, and smallest displacement. This is the most important setting, and you should set it to the best results for your situation.

```kotlin
// AndroidManifest.xml
<?xml version="1.0" encoding="utf-8"?>
<manifest
    xmlns:android="http://schemas.android.com/apk/res/android">

    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />

</manifest>
```

[https://developer.android.com/develop/sensors-and-location/location/permissions#foreground](https://developer.android.com/develop/sensors-and-location/location/permissions#foreground)

[https://developer.android.com/develop/sensors-and-location/location/permissions#background](https://developer.android.com/develop/sensors-and-location/location/permissions#background)


## Conclusion

High grade location tracking is a complex topic, but given the tools we have at our disposal, it is possible to get a very accurate location.

A lot of the work is done for you, thanks to the open source community. A lot of the time you can glue off the shelf solutions together, and you can get a very good result.

What is important is to understand the limitations of the sensors, and how they work together and to tune the settings to get the best results for a given situation.

We are living at a great time, and we have some incredible tech in our pockets and floating above our heads.



[^gps-wiki]: https://en.wikipedia.org/wiki/Global_Positioning_System
[^gpx-wiki]: https://en.wikipedia.org/wiki/GPS_Exchange_Format
[^gpx-spec]: https://www.topografix.com/gpx.asp
[^gnss]: https://en.wikipedia.org/wiki/GNSS_augmentation