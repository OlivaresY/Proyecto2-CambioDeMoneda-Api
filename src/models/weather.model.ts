//interfas de estado y UI para la app
export interface WeatherResponse {
    city: string;
    temperature: number;
    description: string;
    icon: string;

}

//interfaz para la respuesta JSON de OpenWeatherMap
export interface OpenWeatherMapResponse {
    name: string;
    main: {
        temp: number;
    };
    weather: {
        description: string;
        icon: string;
    }[];
}