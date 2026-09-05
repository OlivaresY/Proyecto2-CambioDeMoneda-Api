import { OpenWeatherMapResponse, WeatherResponse } from '../../models/weather.model';

//API key mediante variable de entorno
const API_KEY = 'TY_API_KEY_DE_OPENWEATHERMAP';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export const getWeatherByCity = async (city: string): Promise<WeatherResponse> => {
    try {
        const response = await fetch(`${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric&lang=es`);

        if (!response.ok) {
            throw new Error(`Error fetching weather data: ${response.statusText}`);
        }

        const data: OpenWeatherMapResponse = await response.json();

        return {
            city: data.name,
            temperature: data.main.temp,
            description: data.weather[0].description || 'Without description',
            icon: data.weather[0]?.icon || ''
        };
    } catch (error) {
        console.error('Error fetching weather data:', error);
        throw error;
    }
};
            

