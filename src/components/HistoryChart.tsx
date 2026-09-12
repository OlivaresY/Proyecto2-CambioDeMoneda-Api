import { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { getBacExchangeRate } from '../services/api/exchangeService';

interface HistoryChartProps {
    isDarkMode?: boolean;
}

export default function HistoryChart({ isDarkMode = false }: HistoryChartProps) {
    const [activeFilter, setActiveFilter] = useState('1 M');
    const [chartData, setChartData] = useState<{ value: number; date: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const filters = ['1D', '5D', '1 M', '1A', 'Max.'];

    const screenWidth = Dimensions.get('window').width;
    const textColor = isDarkMode ? '#F9FAFB' : '#1F2937';
    const subTextColor = isDarkMode ? '#9CA3AF' : '#6B7280';
    const cardBgColor = isDarkMode ? '#1F2937' : '#FFFFFF';

    useEffect(() => {
        async function loadChartData() {
            try {
                setLoading(true);
                const rateResponse = await getBacExchangeRate()
                const currentRate = rateResponse.compra //trae el historico

                //serie historica basada em el valor actual de la API
                let simulatedData = [];
                if (activeFilter === '1D') {
                    simulatedData = [
                        { value: Number((currentRate - 1.5). toFixed(2)), date: 'Ayer' },
                        { value: Number((currentRate - 0.8).toFixed(2)), date: '6:00' },
                        { value: Number((currentRate - 1.2).toFixed(2)), date: 'Hoy' },
                    ];
                } else if (activeFilter === '5D') {
                    simulatedData = [
                        { value: Number((currentRate - 2.0).toFixed(2)), date: 'Hace 5 días' },
                        { value: Number((currentRate - 1.5).toFixed(2)), date: 'Hace 4 días' },
                        { value: Number((currentRate - 0.5).toFixed(2)), date: 'Hace 3 días' },
                        { value: Number((currentRate - 1.0).toFixed(2)), date: 'Ayer' },
                        { value: Number(currentRate.toFixed(2)), date: 'Hoy' },
                    ];
                } else {
                    // 1 M, 1A, Max: Simulamos una curva completa conectando con el valor real actual
                    simulatedData = [
                        { value: Number((currentRate - 4.0).toFixed(2)), date: '21 ago' },
                        { value: Number((currentRate - 2.5).toFixed(2)), date: '23 ago' },
                        { value: Number((currentRate - 3.0).toFixed(2)), date: '25 ago' },
                        { value: Number((currentRate - 1.0).toFixed(2)), date: '27 ago' },
                        { value: Number((currentRate - 2.0).toFixed(2)), date: '29 ago' },
                        { value: Number((currentRate - 0.5).toFixed(2)), date: '31 ago' },
                        { value: Number(currentRate.toFixed(2)), date: '2 sept' },
                    ];
                }

                setChartData(simulatedData);

            } catch (error) {
                console.error("Error loading data for the chart:", error);
            } finally {
                setLoading(false);
            }
        }

        loadChartData();
    }, [activeFilter]); //recarga si el usuario cambia el filtro de tiempo

    return (
        <View style={[styles.container, { backgroundColor: cardBgColor }]}>

        {/* Fila de botones de tiempo */}
            <View style={styles.filterContainer}>
                {filters.map((filter) => (
                    <TouchableOpacity
                        key={filter}
                        onPress={() => setActiveFilter(filter)}
                        style={[
                            styles.filterButton,
                            activeFilter === filter && styles.activeFilterButton
                        ]}
                    >
                        <Text style={[
                            styles.filterText,
                            { color: subTextColor },
                            activeFilter === filter && styles.activeFilterText
                        ]}>
                            {filter}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Gráfica o indicador de carga */}
            {loading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="small" color="#22C55E" />
                    <Text style={[styles.loadingText, { color: subTextColor }]}>Actualizando gráfica...</Text>
                </View>
            ) : (
                <View style={styles.chartWrapper}>
                    <LineChart
                        data={chartData}
                        height={180}
                        width={screenWidth - 80}
                        thickness={2}
                        color="#22C55E"
                        areaChart
                        startFillColor="#22C55E"
                        startOpacity={0.2}
                        endFillColor="#22C55E"
                        endOpacity={0.02}
                        yAxisTextStyle={{ color: subTextColor, fontSize: 12 }}
                        xAxisLabelTextStyle={{ color: subTextColor, fontSize: 12, width: 60, marginLeft: -10 }}
                        yAxisColor="transparent"
                        xAxisColor={isDarkMode ? '#374151' : '#E5E7EB'}
                        hideRules
                        initialSpacing={10}
                        endSpacing={10}
                        pointerConfig={{
                            pointerStripHeight: 180,
                            pointerStripColor: subTextColor,
                            pointerStripWidth: 1,
                            pointerStripUptoDataPoint: true,
                            strokeDashArray: [5, 5],
                            pointerColor: '#22C55E',
                            radius: 4,
                            pointerLabelWidth: 100,
                            pointerLabelHeight: 40,
                            activatePointersOnLongPress: false,
                            autoAdjustPointerLabelPosition: true,
                            pointerLabelComponent: (items: any) => {
                                return (
                                    <View style={[styles.tooltip, { backgroundColor: isDarkMode ? '#374151' : '#FFFFFF' }]}>
                                        <Text style={[styles.tooltipValue, { color: textColor }]}>
                                            {items[0]?.value}
                                        </Text>
                                        <Text style={styles.tooltipDate}>
                                            {items[0]?.date}
                                        </Text>
                                    </View>
                                );
                            },
                        }}
                    />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 16,
        paddingVertical: 20,
        paddingHorizontal: 10,
        marginTop: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 25,
        paddingHorizontal: 10,
    },
    filterButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 16,
    },
    activeFilterButton: {
        backgroundColor: '#E0E7FF',
    },
    filterText: {
        fontSize: 14,
        fontWeight: '500',
    },
    activeFilterText: {
        color: '#2563EB',
        fontWeight: 'bold',
    },
    chartWrapper: {
        marginLeft: -10,
    },
    loaderContainer: {
        height: 180,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 8,
        fontSize: 12,
    },
    tooltip: {
        padding: 8,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginLeft: -40,
    },
    tooltipValue: {
        fontWeight: 'bold',
        fontSize: 14,
        marginRight: 6,
    },
    tooltipDate: {
        fontSize: 12,
        color: '#6B7280',
    }
});