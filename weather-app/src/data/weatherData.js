// Dummy weather data for 3 cities (MVP)
export const weatherData = {
  "san-francisco": {
    location: {
      city: "San Francisco",
      region: "California",
      country: "United States",
    },
    current: {
      temp: 68,
      feelsLike: 65,
      condition: "Partly Cloudy",
      icon: "partly-cloudy",
      humidity: 72,
      windSpeed: 12,
      windDirection: "NW",
      uvIndex: 5,
      sunrise: "06:45 AM",
      sunset: "07:30 PM",
    },
    forecast: [
      { day: "Monday", date: "Feb 12", high: 70, low: 58, condition: "Sunny", precipitation: 10 },
      { day: "Tuesday", date: "Feb 13", high: 68, low: 56, condition: "Partly Cloudy", precipitation: 20 },
      { day: "Wednesday", date: "Feb 14", high: 65, low: 54, condition: "Cloudy", precipitation: 40 },
      { day: "Thursday", date: "Feb 15", high: 67, low: 55, condition: "Partly Cloudy", precipitation: 15 },
      { day: "Friday", date: "Feb 16", high: 72, low: 57, condition: "Sunny", precipitation: 5 },
    ],
  },
  "new-york": {
    location: {
      city: "New York",
      region: "New York",
      country: "United States",
    },
    current: {
      temp: 35,
      feelsLike: 28,
      condition: "Snowy",
      icon: "snowy",
      humidity: 85,
      windSpeed: 18,
      windDirection: "N",
      uvIndex: 1,
      sunrise: "06:55 AM",
      sunset: "05:15 PM",
    },
    forecast: [
      { day: "Monday", date: "Feb 12", high: 38, low: 28, condition: "Snowy", precipitation: 70 },
      { day: "Tuesday", date: "Feb 13", high: 36, low: 26, condition: "Cloudy", precipitation: 30 },
      { day: "Wednesday", date: "Feb 14", high: 42, low: 30, condition: "Partly Cloudy", precipitation: 10 },
      { day: "Thursday", date: "Feb 15", high: 40, low: 32, condition: "Cloudy", precipitation: 50 },
      { day: "Friday", date: "Feb 16", high: 45, low: 34, condition: "Partly Cloudy", precipitation: 20 },
    ],
  },
  "miami": {
    location: {
      city: "Miami",
      region: "Florida",
      country: "United States",
    },
    current: {
      temp: 82,
      feelsLike: 88,
      condition: "Sunny",
      icon: "sunny",
      humidity: 65,
      windSpeed: 8,
      windDirection: "SE",
      uvIndex: 9,
      sunrise: "06:55 AM",
      sunset: "06:25 PM",
    },
    forecast: [
      { day: "Monday", date: "Feb 12", high: 84, low: 72, condition: "Sunny", precipitation: 5 },
      { day: "Tuesday", date: "Feb 13", high: 86, low: 74, condition: "Partly Cloudy", precipitation: 15 },
      { day: "Wednesday", date: "Feb 14", high: 83, low: 73, condition: "Rainy", precipitation: 60 },
      { day: "Thursday", date: "Feb 15", high: 85, low: 74, condition: "Partly Cloudy", precipitation: 25 },
      { day: "Friday", date: "Feb 16", high: 87, low: 75, condition: "Sunny", precipitation: 10 },
    ],
  },
};

export const cityIds = Object.keys(weatherData);
