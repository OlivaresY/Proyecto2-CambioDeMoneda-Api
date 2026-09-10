//interfas de estado y UI para la app
export interface WeatherResponse {
    city: string;
    province?: string
    temperature: number;
    description: string;
    icon: string;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    lat: number;
    lon: number;

}

//interfaz para la respuesta JSON de OpenWeatherMap
export interface OpenWeatherMapResponse {
    name: string;
    coord: {
        lat: number;
        lon: number;
    };
    main: {
        temp: number;
        feels_like: number;
        humidity: number;
    };
    wind: {
        speed: number;
    };
    weather: {
        description: string;
        icon: string;
    }[];
}