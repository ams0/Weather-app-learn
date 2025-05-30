# Weather Dashboard

A sleek, modern weather application built with Next.js that provides real-time weather information with stunning city visuals.

## ✨ Features

- 🌤️ **Live Weather Data** - Real-time conditions via wttr.in API
- 🎨 **Modern Interface** - Clean design with Tailwind CSS and shadcn/ui
- 🏙️ **Dynamic Backgrounds** - City-specific imagery that changes with location
- 📊 **Complete Weather Metrics** - Temperature, humidity, wind, UV index, pressure, and more
- 🔄 **Auto-refresh** - Data updates every 10 minutes automatically
- 📱 **Fully Responsive** - Optimized for all screen sizes
- ⚡ **Smart Loading** - Graceful error handling and loading states

## 🛠️ Built With

- **Next.js 15** - React framework with App Router
- **React 19** - Latest React features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Beautiful component library
- **Lucide React** - Modern icon set
- **Docker** - Containerization support

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- npm, yarn, or pnpm

### Development Setup

```bash
# Clone the project
git clone <your-repo-url>
cd Weather-app-learn

# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your app.

### Docker Setup

```bash
# Build image
docker build -t weather-dashboard .

# Run container
docker run -p 3000:3000 weather-dashboard
```

## 📁 Project Structure

```
Weather-app-learn/
├── app/
│   ├── api/weather/         # Weather API routes
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # App layout
│   └── page.tsx             # Home page
├── components/
│   └── ui/                  # Reusable UI components
├── lib/
│   └── utils.ts             # Shared utilities
└── README.md
```

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm start` | Run production server |
| `npm run lint` | Check code quality |

## 🌐 API Reference

**GET** `/api/weather`

Returns current weather data for Zwolle, Netherlands with:
- 10-minute response caching
- Automatic fallback handling
- Structured JSON response
- All essential weather metrics

## 📄 License

MIT License - feel free to use this project for learning and development.