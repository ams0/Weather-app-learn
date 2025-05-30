# Weather App

A modern weather dashboard built with Next.js that displays real-time weather information with beautiful city imagery.

## Features

- **Real-time Weather Data**: Fetches current weather conditions from wttr.in API
- **Beautiful UI**: Modern design with Tailwind CSS and shadcn/ui components
- **City-specific Imagery**: Dynamic background images for different cities
- **Comprehensive Weather Info**: Temperature, humidity, wind speed, visibility, UV index, pressure, and cloud cover
- **Auto-refresh**: Updates weather data every 10 minutes
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Loading & Error States**: Graceful handling of loading and error conditions

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Icons**: Lucide React
- **API**: wttr.in weather service
- **Deployment**: Docker support included

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Weather-app-learn
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Docker

Build and run with Docker:

```bash
docker build -t weather-app .
docker run -p 3000:3000 weather-app
```

## Project Structure

```
├── app/
│   ├── api/route.ts          # Weather API endpoint
│   ├── page.tsx              # Main weather dashboard
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   └── ui/                   # shadcn/ui components
├── lib/
│   └── utils.ts              # Utility functions
└── README.md
```

## API

The app includes a built-in API endpoint at `/api/weather` that:
- Fetches data from wttr.in for Zwolle, Netherlands
- Caches responses for 10 minutes to optimize performance  
- Provides fallback data if the external API is unavailable
- Returns structured JSON with all weather metrics

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## License

This project is open source and available under the MIT License. 