import { useCallback, useEffect, useState } from 'react';
import { getWeatherByCity } from '../services/api/weatherService';

export const useWeatherViewModel = (city: string = 'San Jose') => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [weatherData, setWeatherData] = useState<any | null>(null);//reemplazar 'any' con la interface real del clima

    const fetchWeather = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getWeatherByCity(city);
            setWeatherData(data);
        } catch (err) {
            setError('Failed to fetch weather data.');
        } finally {
            setLoading(false);
        }
    }, [city]);

    useEffect(() => {
        fetchWeather();
    }, [fetchWeather]);

    return {
        loading,
        error,
        weatherData,
        refreshWeather: fetchWeather,
    };
};