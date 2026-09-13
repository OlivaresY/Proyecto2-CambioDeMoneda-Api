import { useState } from "react";
import { ActivityIndicator, Keyboard, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CustomButton from '../../src/components/CustomButton';
import CustomInput from '../../src/components/CustomInput';
import HistoryChart from '../../src/components/HistoryChart';
import { useTheme } from '../../src/contexts/ThemeContext';
import { formatColons } from '../../src/utils/formatters';
import { useCalculatorViewModel } from '../../src/viewmodels/useCalculatorViewModel';

export default function CalculatorScreen() {
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';

    const [amount, setAmount] = useState('');
    const [submittedAmount, setSubmittedAmount] = useState<number | null>(null);
    const [result, setResult] = useState<{real: number; withSurcharge: number } | null>(null);
    const [showHistory, setShowhistory] = useState(false);

    const {
        loading,
        exchangeRate,
        calculate,
        error,
        history,
        deleteHistoryItem,
        clearHistory
    } = useCalculatorViewModel();

    const themeStyles = isDarkMode ? darkStyles : lightStyles;

    const handleCalculate = () => {
        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount)) 
            return;

        Keyboard.dismiss();//se ceirra teclado al darle convert

        //llamamos a ViewModel pasando el monto y la moneda por defecto 'USD'
        const res = calculate(numericAmount, 'USD');
        if (res !== null) {
            setResult(res);
            setSubmittedAmount(numericAmount); //se guarda el monto para la cabezara del resultado
            setAmount(''); //borra el contenido del input
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
        <ScrollView
            style={themeStyles.background} 
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
        >
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
                returnKeyLabel="done"
                onSubmitEditing={handleCalculate}//permite calcular al tocar realizado del teclado
            />

            <CustomButton title="Convert" onPress={handleCalculate} />

            {result !== null &&  submittedAmount !== null && (
                <View style={[styles.resultsContainer, themeStyles.cardBg]}>
                    <Text style={[styles.inputEchoText, themeStyles.accentText]}>
                        ${formatColons(submittedAmount)} Are:
                    </Text>
                    <Text style={[styles.resultText, themeStyles.text]}>
                        Real Amount: ₡{formatColons(result.real)}
                    </Text>
                    <Text style={[styles.resultText, themeStyles.text]}>
                        Amount BAC+2: ₡{formatColons(result.withSurcharge)}
                    </Text>
                </View>
            )}
            {/*grafica*/}
            <HistoryChart 
            isDarkMode={isDarkMode}
            currentRate={exchangeRate}
            />

            <View style={styles.historyToggleContainer}>
                <CustomButton
                title={showHistory ? "hide History" : "Show History"}
                onPress={() => setShowhistory(!showHistory)}
                />
            </View>

            {showHistory && (
                <View style={styles.historySection}>
                    <View style={styles.historyHeader}>
                        <Text style={[styles.historTitle, themeStyles.text]}>Saved Calculations</Text>
                        {history.length > 0 && (
                            <TouchableOpacity onPress={clearHistory}>
                                <Text style={styles.clearText}>Clear All</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    {history.length === 0 ? (
                        <Text style={[styles.emptyText, themeStyles.text]}>No history available</Text>

                    ) :(
                        history.map((item) => (
                            <View key={item.id} style={[styles.historyItemCard, themeStyles.cardBg]}>
                                <View style={styles.historyItemContent}>
                                    <Text style={[styles.historyItemText, themeStyles.text]}>
                                        Amount to Convert ({item.currency}): ${formatColons(item.amount)}
                                    </Text>
                                    <Text style={[styles.historyItemText, themeStyles.text]}>
                                        Real Amount: ₡{formatColons(item.realResult)}
                                    </Text>
                                    <Text style={[styles.historyItemText, themeStyles.text]}>
                                        Amount BAC+2: ₡{formatColons(item.surchargeResult)}
                                    </Text>
                                </View>
                                <TouchableOpacity 
                                    style={styles.deleteBtn} 
                                    onPress={() => deleteHistoryItem(item.id)}
                                >
                                    <Text style={styles.deleteBtnText}>X</Text>
                                </TouchableOpacity>
                            </View>
                        ))
                    )}
                </View>
            )}
    
        </ScrollView>
            
    );
}

const styles = StyleSheet.create({
    container: { flexGrow: 1, padding: 20 },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    card: { padding: 20, borderRadius: 12, marginBottom: 20, alignItems: 'center' },
    label: { fontSize: 16, marginBottom: 5 },
    rate: { fontSize: 32, fontWeight: 'bold' },
    loadingText: { marginTop: 10, fontSize: 16 },
    resultsContainer: { marginTop: 30, padding: 20, borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.05)' },
    inputEchoText: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    resultText: { fontSize: 18, marginVertical: 5, fontWeight: '500' },
    errorText: { color: 'red', marginBottom: 15, textAlign: 'center' },

    historyToggleContainer: { marginTop: 20 },
    historySection: { marginTop: 10, marginBottom: 30 },
    historyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    historyTitle: { fontSize: 20, fontWeight: 'bold' },
    clearText: { color: '#EF4444', fontWeight: 'bold', fontSize: 14 },
    emptyText: { fontStyle: 'italic', opacity: 0.6, textAlign: 'center', marginTop: 10 },
    historyItemCard: { flexDirection: 'row', padding: 15, borderRadius: 10, marginBottom: 10, alignItems: 'center', justifyContent: 'space-between' },
    historyItemContent: { flex: 1 },
    historyItemText: { fontSize: 14, marginVertical: 2, fontWeight: '500' },
    deleteBtn: { backgroundColor: '#EF4444', width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginLeft: 10 },
    deleteBtnText: { color: 'white', fontWeight: 'bold', fontSize: 14 }
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