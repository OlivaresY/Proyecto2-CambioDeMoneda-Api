import { OpenWeatherMapResponse, WeatherResponse } from '../../models/weather.model';

//API key mediante variable de entorno
const API_KEY = process.env.EXPO_PUBLIC_WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export const getWeatherByCoordinates = async (lat: number, lon: number): Promise<WeatherResponse> => {
  if (!API_KEY) {
    throw new Error('API Key no encontrada en .env');
  }

  const url = `${BASE_URL}?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${API_KEY}`;
  const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Error fetching weather data: ${response.status}`);
        }

        const data: OpenWeatherMapResponse = await response.json();
        const weatherInfo = data.weather && data.weather.length > 0 ? data.weather[0] : null;

        return {
            city: data.name ?? 'Current Location',
            temperature: Math.round(data.main?.temp ?? 0),
            description: weatherInfo?.description ?? 'No description',
            icon: weatherInfo?.icon ? `https://openweathermap.org/img/wn/${weatherInfo.icon}@2x.png` : '',
            humidity: data.main?.humidity ?? 0,
            feelsLike: Math.round(data.main?.feels_like ?? 0),
            windSpeed: data.wind?.speed ?? 0,
            lat: data.coord?.lat ?? lat,
            lon: data.coord?.lon ?? lon,

        };
    };
    
    export const getWeatherByCity = async (city: string): Promise<WeatherResponse> => {
        if (!API_KEY) {
            throw new Error('API Key not found in .env');
        }
    const url = `${BASE_URL}?q=${encodeURIComponent(city)}&units=metric&lang=es&appid=${API_KEY}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Error fetching weather data: ${response.status}`);
  }

  const data: OpenWeatherMapResponse = await response.json();
  const weatherInfo = data.weather && data.weather.length > 0 ? data.weather[0] : null;

  return {
    city: data.name ?? city,
    temperature: Math.round(data.main?.temp ?? 0),
    description: weatherInfo?.description ?? 'no description',
    icon: weatherInfo?.icon ? `https://openweathermap.org/img/wn/${weatherInfo.icon}@2x.png` : '',
    feelsLike: Math.round(data.main?.feels_like ?? 0),
    humidity: data.main?.humidity ?? 0,
    windSpeed: data.wind?.speed ?? 0,
    lat: data.coord?.lat ?? 0,
    lon: data.coord?.lon ?? 0,

  };
};   

