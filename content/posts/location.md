---
type: posts
title: "Where you at? When gps alone doesn't cut it!  📍"
subtitle: "Navigating through the world of location data and all that shizz"
date: 2024-07-09T23:28:25+02:00
lastmod: 2024-07-09T23:28:25+02:00
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
lightgallery: true
license: ""
---

<!--more-->

## The modern miracle 🌎

Sometimes I pause for a moment and enjoy the simple things in life.

The fact that there are satellites flying around above head that we can openly/freely use to triangulate our position, and that I am walking around with a smartphone in my pocket that can pick up on the satellite signals and do the maths to show where I am on a map at the mere press of a consent button is pretty mind blowing.

[Screen recording of accepting a consent and the globe zooming to a cool position, maybe with a video of me being at brandenbrug tor]

I won't explain *the magic involved* in how these systems work together as there is a incredible blog post titled [GPS](https://ciechanow.ski/gps/) from the master [Bartosz Ciechanowski](https://ciechanow.ski) that goes into way more depth then I could. I recommend to take some time out and read it. If you haven't come across Bartosz' technical writing and self-rolled visualizations before, then my friend, you are in for a treat!

[Insert either a screen shot of Batosz gps post, or ask him for permission to reuse one of the animations]

Knowing the exact position of your device is incredibly useful for all sorts of things:

* showing your position on a map and ensuring you didn't take the wrong hiking path
* telling your uber driver where to pick you up you had a big night and can't read the street sign
* Finding the device when you inevitably lose it 

[Screenrecording of Komoot in action]()

## The problem with ~~GPS~~ GNSS 🛰️

GPS is short for Global Positioning System... However there is some confusion in this naming here, "GPS" specifically refers to the USA owned "brand" of satellites. Calling all satellite navigation systems "GPS" is like calling every phone an "iPhone" or every pen a "biro"... technically wrong, but everyone calls it this. It is what it is. Now that is out the way we can move on.


{{< admonition type=tip title="The extended GNSS family" open=false >}}

GPS is a specific system of US satellites, like the country, it can sometimes seem like it's the only system that matters. But GNSS which stands for global navigation satellite system is actually the whole family of different states satellite systems and they work collectively  (united in the pursuit of finding you the nearest coffee shop). These are free to the public to use, and what you connect with

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

~~GPS~~ GNSS is great, when it works and can be extremely accurate TODO: reference some videos about high precision gps., allowing a precision of <1m.

However there are many situations where GPS simply doesn't get the job done. If you are in a dense concrete jungle, a mountainous region, in a tunnel, or even just in a building with thick walls, then the signals coming from the satellite will be affected.

Yet another case of how the environment you are based in can have a big impact on your  "position" in life.

[TODO: Tunnel example]

[TODO: Industrial sky scraper example]

[TODO: Mountain example]

However we can do better! Thanks to the other sensors on our smart phones, we can improve things and get around these physical limitations of ~~GPS~~ GNSS.

## Do you "sense" where this is going? 🛜


A modern day smart phone is packed full of many sensors:

- GPS
- Network
- WiFi
- Accelerometer
- Gyroscope
- Magnetometer
- Barometer
- Bluetooth


There are more, but these are the main ones that get used for location tracking.

### Network Locating 📶

The cell towers/antennas that we use to talk to each other get internet from, a good source of location data as they do not move and our devices can defer how far they are from each one.

{{< admonition 


[TODO: insert a map contating cell towers from https://www.opencellid.org/#zoom=12&lat=52.522&lon=13.4651]

Add an amimation of triangulating a position with 3 cell towers.

The concept is exactly the same as with satellites in space but with antennas on the surface of earth. Take at least 3 of these antennas, calculate how far you are away from each antenna, use the calculated distance and the known location of the antenna to triangulate the location. Boom!  Because of the number of antennas scattered around and type of signal used, these can get location data in sitatuions that GPS fails to . Network location still suffers from environmental features (eg. when your out of signal you have no chance) and is TODO: check: not as precise as the holy grail of  working gps data.



### Wifi location 

WIFI. There has been talks in conspiracy theorist circles about how the governments and big corps are tracking you with frequencies. I try to avoid the tin foil hats and prefer my rose tinted glasses. Anyhow, the friendly people at Google have spent a lot of resources mapping out where wifi routers are. They came up with some ground truth data as a sub project of driving cameras around for the street view



## The sensors

## We can use 


## Combining Sensors 


Each sensor has it's pros and cons... They are literally designed for different things. For example, GPS is great for getting a location when you are outside and have a clear view of the sky, but it doesn't work well indoors or in dense urban areas. On the other hand, WiFi can give you a location indoors, but it won't work when your in the mountains and there are no WiFi routers around.


{{< admonition type=tip title="Turn up the power?" open=false >}}

The whole is greater than the sum of the parts?

--- Aristotle (apparently) 👴

{{< /admonition >}}

{{< admonition type=tip title="The power of teamwork" open=false >}}

Alone we can do so little; together we can do so much.

--- Helen Keller 👩‍🎤

{{< /admonition >}}

{{< admonition type=tip title="The triangle inequality" open=false >}}

The sum of the lengths of any two sides of a triangle is greater than the length of the third side.

--- Euclid:  📐

{{< /admonition >}}

{{< admonition type=tip title="The power of sensor fusion" open=false >}}

{{< /admonition >}}

But if we combine the strong points of the different sensors we can always get a better result then a single sensor alone. TODO: insert some qoute about teamwork. 

We can combine or fuse the location data from all of these sensors to get a better result. This is known as sensor fusion.

It's quite simple in theory, but in practice it can be quite complex. However, as it is a thing which is very useful for many applications, there are open api's baked into our devices that do all the complicated stuff. This allows people like me, a lone wolf developer without much time or resources, to benefit from the combined sensors and have very good location data. 

There are a few apps which nicely demonstrate this. Gnss Logger is one of them from the team at Google. It has multiple screens displaying:

* A list of staellites your phone can connect to 
* a plot of the satelites overhead that the phone is listening to.
* a map, with 

In the android world, we can use the `FusedLocationProviderClient` API, which is part of the Google Play Services. This API combines the data from the different sensors and provides a single location result. It uses a combination of GPS, WiFi, and cell tower data to get the best possible location.



TODO: check this is correct...

Thanks to the
[https://android.googlesource.com/platform/frameworks/native/+/refs/heads/main/services/sensorservice/Fusion.cpp]

In the Apple world, we can use the `core-location` framework.

Thanks to these, it is very easy for a single app developer to 

## Acturate location

This section should talk about the different ways of getting a location.. Nothing about tracking a location with time, simply a point.. multiple points speed


## A higher frequency gives us more infomation

When we are tracking a location, we want to get the best possible results. This means that we want to get the most accurate location possible. But a single location point doesn't describe a journey, it is just a point in space. To understand a journey, we need to track the location over time. This means that we need to get multiple location points. The higher the frequency of the location updates, the more points we will have, and the more accurate our understanding of the journey will match reality.

[TODO:: add a maplibre visulation of a biker riding around a route, enable a slider to change the frequency of the updates, and for each value, show the points which would have been recorded at that given frequency, connect the points with a line to show how the recorded track would change with the frequency]

[TODO: add a graph showing the distance between points, and then the derivative to show the speed, and then the second derivative to show the acceleration. Mention how the higher the frequency, the more infomation we have to approximate the reality of the movement and gain insight into the actual journey of the person or object being tracked.]

TODO: add latex equations for how to calculate speed and acceleration from the location data. delta x over delta t, and then delta v over delta t.

Acceleration is the rate of change of velocity. At any point on a trajectory, the magnitude of the acceleration is given by the rate of change of velocity in both magnitude and direction at that point. The true acceleration at time t is found in the limit as time interval Δt → 0 of Δv/Δt.

In real life, we can only approximate this by taking a finite time interval Δt and measuring the change in velocity over that time interval. When we have a high frequency of location updates, we can get a better approximation of the acceleration, which can be useful for understanding the movement of the object being tracked.


TODO: talk about how understanding things like acceleration enables us to do things like detect when a person is riding, or stopping, and how that can be combined with other geospatial data to create a more complete picture of the real world that we are aproximating with our digital sensors.

TODO: Use the use case of the alleycat race with the denkmal in Berlin and combine it with open street map data to show how the location tracking can be used.

When we are tracking a location, we want to get the best possible results. This means that we want to get the most accurate location possible, and we want to do this as often as possible. The more often we get a location, the more accurate our results will be.

## Turn up the frequency

Accurate location, ok we got it, but 

Let's go on a journey, not some phiospical journey, but a litteral one.

TODO: add animation of something on a map, the frequency should map some points. 

You can see that the higher the frequency, the 

## Lets talk about (Battery) life 🪫

Now here is a picture of a gps tracker that I attached to my bike on a long distance mountain bike ride through the mountains of greece. The race took me a week and I didn't turn it off once or charge it. In fact it should work for more then 10 days without charging.

Now why is that so? It just some standard aa batteries, and not only tracked my location, but also sent the data to a server so my mum could follow my progress along on a map (love ya mum).

It did that by being smart about things, and how often it used them. The creators of these little devices know that battery life is important (as well as it working in muddy conditions), they made sure to optimize use the sensors in a way that would not drain the battery too quickly. It was more important to them that the device lasted the whole week, then that it was update the map every second. One producer of these devices is [Trackimo](https://trackimo.com/), and they have a great product that does just that.

When you are building a location tracking app, you have to be smart about how you use the sensors. You can use the sensors in a way that will not drain the battery too quickly, and you can also use the sensors in a way that will give you the best results for your situation.


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


### Lets test this on the ground (truth) 🏟 ️

So to test things out, we need some measurements and some ground truth. How can we do that? Take advantage of some football fields!

I got some satellite images of the local football fields, and I can use these to get some ground truth data. I can then compare the location data from my phone with the ground truth data to see how accurate it is.

[TODO: add a map with the satellite images of the football fields, and lines with the different location data from the different location providers and a legend]

[add a animation of the location data from my phone compared to the ground truth data, have the colors match the lines on the map, and with a legend and compare ]

[TODO: add graphs of the location data from my phone compared to the ground truth data, have the colors match the lines on the map, and with a legend and compare ]

## Conclusion

High grade location tracking is a complex topic, but given the tools we have at our disposal, it is possible to get a very accurate location.

A lot of the work is done for you, thanks to the open source community. A lot of the time you can glue off the shelf solutions together, and you can get a very good result.

What is important is to understand the limitations of the sensors, and how they work together and to tune the settings to get the best results for a given situation.

We are living at a great time, and we have some incredible tech in our pockets and floating above our heads.



[^gps-wiki]: https://en.wikipedia.org/wiki/Global_Positioning_System
[^gpx-wiki]: https://en.wikipedia.org/wiki/GPS_Exchange_Format
[^gpx-spec]: https://www.topografix.com/gpx.asp
[^gnss]: https://en.wikipedia.org/wiki/GNSS_augmentation
[^apple-core-location]: https://developer.apple.com/documentation/corelocation
[^android-fused-location]: https://developer.android.com/develop/sensors-and-location/location
[^android-sensor-fusion]: https://developer.android.com/reference/android/hardware/SensorManager#SENSOR_DELAY_FASTEST
[^kmp-location-provider]: https://medium.com/rapido-labs/building-a-kotlin-multiplatform-mobile-sdk-for-location-related-services-488a2855ab23
[^research-paper-on-multi-sensor-fusion-for-autonomous-last-mile-delivery]: https://www.researchgate.net/publication/335542466_Multi_Sensor_Fusion_for_Navigation_and_Mapping_in_Autonomous_Vehicles_Accurate_Localization_in_Urban_Environments
[^gsm-localisation]: https://en.wikipedia.org/wiki/GSM_localisation