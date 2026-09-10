import { Cloud } from "lucide-react-native";
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../src/contexts/ThemeContext';
import { useWeatherViewModel } from '../../src/viewmodels/useWeatherViewModel';

export default function WeatherScreen() {
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';
    const { weatherData, loading, error } = useWeatherViewModel();
    const themeStyles = isDarkMode ? darkStyles : lighStyles;

    if (loading) {
        return (
            <View style={[styles.centerContainer, themeStyles.background]}>
                <ActivityIndicator size="large" color="#2563EB" />
                <Text style={[styles.text, themeStyles.text, {marginTop: 10 }]}>Loading Weather...</Text>
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

    return (
        <View style={[styles.container, themeStyles.background]}>
            {weatherData && (
                <View style={[styles.card, themeStyles.cardBg]}>
                    {weatherData.icon ? (
                        <Image source={{ uri: weatherData.icon }} style={styles.weatherIcon} />
                    ) : (
                        <Cloud size={64} color={isDarkMode ? '#60A5FA' : '#2563EB'} />
                    )}
                    <Text style={[styles.city, themeStyles.text]}>{weatherData.city}</Text>
                    <Text style={[styles.temp, themeStyles.text]}>{weatherData.temperature}°C</Text>
                    <Text style={[styles.description, themeStyles.text]}>{weatherData.description}</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    card: { alignItems: 'center', padding: 30, borderRadius: 16, marginTop: 20 },
    weatherIcon: { width: 100, height: 100, resizeMode: 'contain' },
    city: { fontSize: 24, fontWeight: 'bold', marginTop: 15 },
    temp: { fontSize: 48, fontWeight: 'bold', marginVertical: 10 },
    description: { fontSize: 18, textTransform: 'capitalize' },
    errorText: { color: 'red', fontSize: 16 },
    text: {}
});

const lighStyles = StyleSheet.create({
    background: { backgroundColor: '#F3F4F6' },
    cardBg: { backgroundColor: '#FFFFFF' },
    text: { color: '#1F2937' }
});

const darkStyles = StyleSheet.create({
    background: { backgroundColor: '#111827' },
    cardBg: { backgroundColor: '#1F2937' },
    text: { color: '#F9FAFB' }
});