import { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import CustomButton from '../../src/components/CustomButton';
import CustomInput from '../../src/components/CustomInput';
import { useTheme } from '../../src/contexts/ThemeContext';
import { formatColons } from '../../src/utils/formatters';
import { useCalculatorViewModel } from '../../src/viewmodels/useCalculatorViewModel';

export default function CalculatorScreen() {
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';

    const [amount, setAmount] = useState('');
    const [result, setResult] = useState<{real: number; withSurcharge: number } | null>(null);

    const {
        loading,
        exchangeRate,
        calculate,
        error
    } = useCalculatorViewModel();

    const themeStyles = isDarkMode ? darkStyles : lightStyles;

    const handleCalculate = () => {
        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount)) 
            return;

        //llamamos a ViewModel pasando el monto y la moneda por defecto 'USD'
        const res = calculate(numericAmount, 'USD');
        if (res !== null) {
            setResult(res);
        }
    };

    if (loading) {
        return (
            <View style={[styles.centerContainer, themeStyles.background]}>
                <ActivityIndicator size="large" color="#2563EB" />
                <Text style={[styles.loadingText, themeStyles.text]}>Obtaining BAC exchange rate...</Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, themeStyles.background]}>
            <View style={[styles.card, themeStyles.cardBg]}>
                <Text style={[styles.label, themeStyles.text]}>Current Exchange Rate:</Text>
                <Text style={[styles.rate, themeStyles.accentText]}>
                    ₡{typeof exchangeRate === 'number' ? formatColons(exchangeRate) : exchangeRate}
                </Text>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <CustomInput
                placeholder="Amount To Convert (USD)"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
            />

            <CustomButton title="Convert" onPress={handleCalculate} />

            {result !== null && (
                <View style={styles.resultsContainer}>
                    <Text style={[styles.resultText, themeStyles.text]}>
                        Real Amount: ₡{formatColons(result.real)}
                    </Text>
                    <Text style={[styles.resultText, themeStyles.text]}>
                        Amount BAC+2: ₡{formatColons(result.withSurcharge)}
                    </Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    card: { padding: 20, borderRadius: 12, marginBottom: 20, alignItems: 'center' },
    label: { fontSize: 16, marginBottom: 5 },
    rate: { fontSize: 32, fontWeight: 'bold' },
    loadingText: { marginTop: 10, fontSize: 16 },
    resultsContainer: { marginTop: 30, padding: 20, borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.05)' },
    resultText: { fontSize: 18, marginVertical: 5, fontWeight: '500' },
    errorText: { color: 'red', marginBottom: 15, textAlign: 'center' }
});

const lightStyles = StyleSheet.create({
    background: { backgroundColor: '#F3F4F6' },
    cardBg: { backgroundColor: '#FFFFFF' },
    text: { color: '#1F2937' },
    accentText: { color: '#2563EB' }
});

const darkStyles = StyleSheet.create({
    background: { backgroundColor: '#111827' },
    cardBg: { backgroundColor: '#1F2937' },
    text: { color: '#F9FAFB' },
    accentText: { color: '#60A5FA' }
});
