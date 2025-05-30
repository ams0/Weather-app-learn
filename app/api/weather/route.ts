import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get("city") || "New York"
    
    // Fetch weather data from wttr.in API in JSON format
    const response = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=j1`, {
      headers: {
        "User-Agent": "WeatherApp/1.0",
      },
      // Cache for 10 minutes to avoid too many requests
      next: { revalidate: 600 },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch weather data")
    }

    const data = await response.json()

    // Extract relevant data from wttr.in response
    const current = data.current_condition[0]
    const location = data.nearest_area[0]

    const cityName = location.areaName[0].value
    
    // Generate city-specific background image URL
    const getImageForCity = (city: string) => {
      const cityImages: { [key: string]: string } = {
        "New York": "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        "London": "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        "Tokyo": "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        "Paris": "https://images.unsplash.com/photo-1502602898536-47ad22581b52?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        "Sydney": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        "Dubai": "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        "Singapore": "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        "Toronto": "https://images.unsplash.com/photo-1517935706615-2717063c2225?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        "Mumbai": "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        "Berlin": "https://images.unsplash.com/photo-1560969184-10fe8719e047?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        "Rome": "https://images.unsplash.com/photo-1552832230-c0197c35d006?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        "Barcelona": "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        "Bangkok": "https://images.unsplash.com/photo-1508009603885-50cf7c579365?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        "Seoul": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        "Amsterdam": "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        "Zwolle": "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        "Utrecht": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        "Groningen": "https://images.unsplash.com/photo-1600298881974-6be191ceeda1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        "Eindhoven": "https://images.unsplash.com/photo-1590736969955-71cc94901144?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        "Maastricht": "https://images.unsplash.com/photo-1578165219176-ece04edbd053?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        "Den Haag": "https://images.unsplash.com/photo-1582562124811-c09040d0a901?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        "The Hague": "https://images.unsplash.com/photo-1582562124811-c09040d0a901?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        "Rotterdam": "https://images.unsplash.com/photo-1549893072-4c20687e10d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        "Nijmegen": "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      }
      
      // Return city-specific image or generic cityscape
      return cityImages[city] || "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    }

    const weatherData = {
      city: cityName,
      country: location.country[0].value,
      temperature: Number.parseInt(current.temp_C),
      feelsLike: Number.parseInt(current.FeelsLikeC),
      condition: current.weatherDesc[0].value,
      humidity: Number.parseInt(current.humidity),
      windSpeed: Number.parseInt(current.windspeedKmph),
      visibility: Number.parseInt(current.visibility),
      uvIndex: Number.parseInt(current.uvIndex || "0"),
      pressure: Number.parseInt(current.pressure),
      cloudCover: Number.parseInt(current.cloudcover),
      backgroundImage: getImageForCity(cityName),
    }

    return NextResponse.json(weatherData)
  } catch (error) {
    console.error("Error fetching weather data:", error)

    // Return fallback data if API fails
    return NextResponse.json({
      city: "Zwolle",
      country: "Netherlands",
      temperature: 15,
      feelsLike: 16,
      condition: "Partly Cloudy",
      humidity: 78,
      windSpeed: 13,
      visibility: 10,
      uvIndex: 3,
      pressure: 1013,
      cloudCover: 50,
      backgroundImage: "https://media.istockphoto.com/photos/zwolle-birds-eye-panoramic-springtime-view-during-sunset-picture-id1323463762?b=1&k=20&m=1323463762&s=170667a&w=0&h=bVXkLs2n46Xb67go46PyWioV3AOgkgnhl_lOUMPY-RQ=",
    })
  }
}
