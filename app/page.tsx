"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Cloud, Droplets, Eye, Wind, Thermometer, MapPin, Gauge } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"

interface WeatherData {
  city: string
  country: string
  temperature: number
  feelsLike: number
  condition: string
  humidity: number
  windSpeed: number
  visibility: number
  uvIndex: number
  pressure: number
  cloudCover: number
  backgroundImage: string
}

export default function WeatherPage() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCity, setSelectedCity] = useState("Zwolle")

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/weather?city=${encodeURIComponent(selectedCity)}`)
        if (!response.ok) {
          throw new Error("Failed to fetch weather data")
        }
        const data = await response.json()
        setWeatherData(data)
        setError(null)
      } catch (err) {
        setError("Failed to load weather data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchWeather()

    // Refresh data every 10 minutes
    const interval = setInterval(fetchWeather, 10 * 60 * 1000)
    return () => clearInterval(interval)
  }, [selectedCity])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 via-green-500 to-green-600 flex items-center justify-center">
        <div className="text-white text-xl">Loading weather data...</div>
      </div>
    )
  }

  if (error || !weatherData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 via-green-500 to-green-600 flex items-center justify-center">
        <div className="text-white text-xl">Error loading weather data</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-green-500 to-green-600 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <h1 className="text-4xl font-bold text-white mb-2">Live Weather Dashboard</h1>
          <p className="text-green-100 mb-6">Real-time conditions from wttr.in</p>
          
          {/* City Selection */}
          <div className="max-w-xs mx-auto">
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="bg-white/90 backdrop-blur-sm">
                <SelectValue placeholder="Select a city" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Zwolle">Zwolle, Netherlands</SelectItem>
                <SelectItem value="Amsterdam">Amsterdam, Netherlands</SelectItem>
                <SelectItem value="Utrecht">Utrecht, Netherlands</SelectItem>
                <SelectItem value="Groningen">Groningen, Netherlands</SelectItem>
                <SelectItem value="Eindhoven">Eindhoven, Netherlands</SelectItem>
                <SelectItem value="Maastricht">Maastricht, Netherlands</SelectItem>
                <SelectItem value="Den Haag">Den Haag, Netherlands</SelectItem>
                <SelectItem value="Rotterdam">Rotterdam, Netherlands</SelectItem>
                <SelectItem value="Nijmegen">Nijmegen, Netherlands</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Main Weather Card */}
        <Card className="mb-6 overflow-hidden shadow-2xl">
          <CardContent className="p-0">
            <div className="grid md:grid-cols-2 gap-0">
              {/* City Image */}
              <div className="relative h-64 md:h-auto">
                <Image
                  src={weatherData.backgroundImage}
                  alt={`${weatherData.city} cityscape`}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    // Fallback to a generic image if the specific city image fails
                    e.currentTarget.src = "https://images.unsplash.com/photo-1580996449330-c4fd2597d27b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  }}
                />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-5 w-5" />
                    <span className="text-lg font-semibold">{weatherData.city}</span>
                  </div>
                  <p className="text-sm opacity-90">{weatherData.country}</p>
                </div>
              </div>

              {/* Weather Info */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Thermometer className="h-6 w-6 text-orange-500" />
                      <span className="text-5xl font-bold text-gray-900">{weatherData.temperature}°C</span>
                    </div>
                    <p className="text-gray-600 mb-2">Feels like {weatherData.feelsLike}°C</p>
                    <Badge variant="secondary" className="text-sm">
                      {weatherData.condition}
                    </Badge>
                  </div>
                  <Cloud className="h-16 w-16 text-gray-400" />
                </div>

                {/* Weather Details Grid */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-green-500" />
                    <div>
                      <p className="text-sm text-gray-600">Humidity</p>
                      <p className="font-semibold">{weatherData.humidity}%</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Wind className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Wind Speed</p>
                      <p className="font-semibold">{weatherData.windSpeed} km/h</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-green-500" />
                    <div>
                      <p className="text-sm text-gray-600">Visibility</p>
                      <p className="font-semibold">{weatherData.visibility} km</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full bg-yellow-400" />
                    <div>
                      <p className="text-sm text-gray-600">UV Index</p>
                      <p className="font-semibold">{weatherData.uvIndex}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info Cards */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Thermometer className="h-5 w-5 text-red-500" />
                Temperature
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Current</span>
                  <span className="font-semibold">{weatherData.temperature}°C</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Feels like</span>
                  <span className="font-semibold">{weatherData.feelsLike}°C</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Wind className="h-5 w-5 text-green-500" />
                Wind & Air
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Wind Speed</span>
                  <span className="font-semibold">{weatherData.windSpeed} km/h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Humidity</span>
                  <span className="font-semibold">{weatherData.humidity}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Eye className="h-5 w-5 text-green-500" />
                Visibility
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Distance</span>
                  <span className="font-semibold">{weatherData.visibility} km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">UV Index</span>
                  <span className="font-semibold">{weatherData.uvIndex}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Gauge className="h-5 w-5 text-purple-500" />
                Atmosphere
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Pressure</span>
                  <span className="font-semibold">{weatherData.pressure} hPa</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Cloud Cover</span>
                  <span className="font-semibold">{weatherData.cloudCover}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 pb-8">
          <p className="text-green-100 text-sm">Last updated: {new Date().toLocaleTimeString()} • Data from wttr.in</p>
        </div>
      </div>
    </div>
  )
}
