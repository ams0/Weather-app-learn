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
        "Zwolle": "https://images.unsplash.com/photo-1626803409359-6defcde3b39e?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "Eindhoven": "https://images.unsplash.com/photo-1619977509372-47a5330af3c6?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "Nijmegen": "https://images.unsplash.com/photo-1568724794676-a6dbfb6e3100?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
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
