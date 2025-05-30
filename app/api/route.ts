import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Fetch weather data from wttr.in API in JSON format
    const response = await fetch("https://wttr.in/Zwolle?format=j1", {
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
        "Amsterdam": "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        "Zwolle": "https://media.istockphoto.com/photos/zwolle-birds-eye-panoramic-springtime-view-during-sunset-picture-id1323463762?b=1&k=20&m=1323463762&s=170667a&w=0&h=bVXkLs2n46Xb67go46PyWioV3AOgkgnhl_lOUMPY-RQ=",
        "Utrecht": "https://images.unsplash.com/photo-1543699936-c901eca2047c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        "Rotterdam": "https://images.unsplash.com/photo-1573160103600-9dc03e9c1e1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        "The Hague": "https://images.unsplash.com/photo-1602096329154-6a31b7b76253?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
      }
      
      // Return city-specific image or generic Dutch cityscape
      return cityImages[city] || "https://images.unsplash.com/photo-1580996449330-c4fd2597d27b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
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
