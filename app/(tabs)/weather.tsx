import { Cloud, Droplets, Thermometer, Wind } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, UrlTile } from 'react-native-maps';
import { useTheme } from '../../src/contexts/ThemeContext';
import { useWeatherViewModel } from '../../src/viewmodels/useWeatherViewModel';


export default function WeatherScreen() {
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';
    const { weatherData, loading, error } = useWeatherViewModel();
    const themeStyles = isDarkMode ? darkStyles : lightStyles;

    const currentDate = new Date().toLocaleDateString('es-CR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    });

    const [currentTime, setCurrentTime] = useState(
        new Date().toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit', second: '2-digit'})
    );

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(
                new Date().toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit', second: '2-digit'})
                );
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    if (loading) {
        return (
            <View style={[styles.centerContainer, themeStyles.background]}>
                <ActivityIndicator size="large" color="#2563EB" />
                <Text style={[themeStyles.text, {marginTop: 10 }]}>Loading Weather...</Text>
            </View>
        );
    }

    if (error){
        return (
            <View style={[styles.centerContainer, themeStyles.background]}>
                <Text style={[styles.errorText, { color: 'red' }]}>{error}</Text>
            </View>
        );

    }

    //si aun no hay datos, no rendereiza nada
    if (!weatherData) 
        return null;

    //provincia, canton
    const locationText = weatherData.province
    ? `${weatherData.province}, ${weatherData.city}`
    :weatherData.city;

    return (
        <ScrollView style={[styles.container, themeStyles.background]} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <Text style={[styles.locationTitle, themeStyles.text]}>{locationText}</Text>
                <Text style={[styles.dateSubtitle, themeStyles.subText]}>Updated today at: {currentDate}</Text>

                <View style={[styles.clockContainer, themeStyles.clockBg]}>
                    <Text style={[styles.clockText, themeStyles.text]}>{currentTime}</Text>
                </View>
            </View>

            {/*Clima*/}
            <View style={[styles.card, themeStyles.cardBg]}>
                {weatherData.icon ? (
                    <Image source={{ uri: weatherData.icon }} style={styles.weatherIcon} />
                ) : (
                    <Cloud size={64} color={isDarkMode ? '#60A5FA' : '#2563EB'} />
                )}
                <Text style={[styles.temp, themeStyles.text]}>{weatherData.temperature}°C</Text>
                <Text style={[styles.description, themeStyles.text]}>{weatherData.description}</Text>
            </View>

            {/*detalles extra (sensación, humedad, viento)*/}
            <View style={[styles.detailsRow, themeStyles.cardBg]}>
                <View style={styles.detailItem}>
                    <Thermometer size={24} color={isDarkMode ? '#9CA3AF' : '#4B5563'} />
                    <Text style={[styles.detailValue, themeStyles.text]}>{weatherData.feelsLike}°C</Text>
                    <Text style={[styles.detailLabel, themeStyles.subText]}>Feels like</Text>
                </View>
                <View style={styles.detailItem}>
                    <Droplets size={24} color={isDarkMode ? '#9CA3AF' : '#4B5563'} />
                    <Text style={[styles.detailValue, themeStyles.text]}>{weatherData.humidity}%</Text>
                    <Text style={[styles.detailLabel, themeStyles.subText]}>Humidity</Text>
                </View>
                <View style={styles.detailItem}>
                    <Wind size={24} color={isDarkMode ? '#9CA3AF' : '#4B5563'} />
                    <Text style={[styles.detailValue, themeStyles.text]}>{weatherData.windSpeed} m/s</Text>
                    <Text style={[styles.detailLabel, themeStyles.subText]}>Wind</Text>
                </View>
            </View>

            {/*mapa*/}
            <View style={[styles.mapContainer, themeStyles.cardBg]}>
                <Text style={[styles.mapTitle, themeStyles.text]}>Current location</Text>
                <MapView 
                    style={styles.map}
                    mapType="none"
                    region={{
                        latitude: weatherData.lat,
                        longitude: weatherData.lon,
                        latitudeDelta: 0.05,
                        longitudeDelta: 0.05,
                    }}
                >
                    <UrlTile
                    urlTemplate="https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png"
                        maximumZ={19}
                        flipY={false}
                        tileSize={256}
                        zIndex={1}
                    />

                    <Marker 
                        coordinate={{ latitude: weatherData.lat, longitude: weatherData.lon }}
                        title={locationText}
                    />
                </MapView>
            </View>
            
            {/*espacio al final*/}
            <View style={{ height: 40 }} /> 
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 20 },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { alignItems: 'center', marginBottom: 20, marginTop: 20 },
    locationTitle: { fontSize: 22, fontWeight: 'bold', textAlign: 'center' },
    dateSubtitle: { fontSize: 14, marginTop: 4, textTransform: 'capitalize' }, // Añadido
    clockContainer: {
        marginTop: 10, 
        paddingHorizontal: 16, 
        paddingVertical: 6, 
        borderRadius: 20,
        alignSelf: 'center'
    },
    clockText: { fontSize: 16, fontWeight: '600', letterSpacing: 1 },
    card: { alignItems: 'center', padding: 30, borderRadius: 16, marginBottom: 20 },
    weatherIcon: { width: 100, height: 100, resizeMode: 'contain' },
    temp: { fontSize: 56, fontWeight: 'bold', marginVertical: 10 },
    description: { fontSize: 20, textTransform: 'capitalize' },
    detailsRow: { flexDirection: 'row', justifyContent: 'space-around', padding: 20, borderRadius: 16, marginBottom: 20 },
    detailItem: { alignItems: 'center' },
    detailValue: { fontSize: 18, fontWeight: 'bold', marginTop: 8 },
    detailLabel: { fontSize: 14, marginTop: 4 },
    mapContainer: { padding: 15, borderRadius: 16, overflow: 'hidden' },
    mapTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
    map: { width: '100%', height: 200, borderRadius: 12 },
    errorText: { color: 'red', fontSize: 16 }
});

const lightStyles = StyleSheet.create({
    background: { backgroundColor: '#F3F4F6' },
    cardBg: { backgroundColor: '#FFFFFF' },
    text: { color: '#1F2937' },
    subText: { color: '#6B7280' },
    clockBg: { backgroundColor: '#E5E7EB' }
});

const darkStyles = StyleSheet.create({
    background: { backgroundColor: '#111827' },
    cardBg: { backgroundColor: '#1F2937' },
    text: { color: '#F9FAFB' },
    subText: { color: '#9CA3AF' },
    clockBg: { backgroundColor: '#374151' }
});