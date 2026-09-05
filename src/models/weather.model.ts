export interface WeatherResponse {
    city: string;
    temperature: number;
    description: string;
    icon: string;

}

export interface OpenWeatherMapResponse {
    name: string;
    main: {
        temp: number;
    };
    weather: array<{
        description: string;
        icon: string;
    }>;
}