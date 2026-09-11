import * as Location from 'expo-location';
import { useCallback, useEffect, useState } from 'react';
import { WeatherResponse } from '../models/weather.model';
import { getWeatherByCity, getWeatherByCoordinates } from '../services/api/weatherService';

export const useWeatherViewModel = (city: string = 'San Jose') => {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);

    const fetchWeather = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();//permisos de ubicacion en primer plano

            //permiso denegado, usa por defecto SJ
            if (status !== 'granted') {
                const fallbackData = await getWeatherByCity('San Jose');
                setWeatherData(fallbackData);
                return;
            }

            //obtiene la posicion geografica actual de dispositivo
            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            });
            
            const { latitude, longitude } = location.coords;

            //clima por coordenadas
            const data = await getWeatherByCoordinates(latitude, longitude);

            //reverse de Geocoding para la provincia dinamica
            const geocode = await Location.reverseGeocodeAsync({ latitude, longitude});

            if (geocode && geocode.length > 0) {
                data.province = geocode[0].region || undefined;
            }

            setWeatherData(data);

        } catch (err) {
            console.error(err);
            setError('Failed to fetch weather data.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        queueMicrotask(() => {
            void fetchWeather();
        });
    }, [fetchWeather]);

    return {
        loading,
        error,
        weatherData,
        refreshWeather: fetchWeather,
    };
};