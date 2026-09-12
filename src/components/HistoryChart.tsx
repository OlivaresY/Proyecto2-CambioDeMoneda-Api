import { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';

interface HistoryChartProps {
    isDarkMode?: boolean;
    currentRate: number | null;
}

export default function HistoryChart({ isDarkMode = false, currentRate }: HistoryChartProps) {
    const [activeFilter, setActiveFilter] = useState('1 M');
    const [chartData, setChartData] = useState<{ value: number; date: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [chartBounds, setChartBounds] = useState({ minValue: 0, maxValue: 10 });
    const filters = ['1D', '5D', '1 M', '1A', 'Max.'];

    const screenWidth = Dimensions.get('window').width;
    const textColor = isDarkMode ? '#F9FAFB' : '#1F2937';
    const subTextColor = isDarkMode ? '#9CA3AF' : '#6B7280';
    const cardBgColor = isDarkMode ? '#1F2937' : '#FFFFFF';

    useEffect(() => {
        if (typeof currentRate !== 'number') return;
            
        const timer = setTimeout(() => {
            let simulatedData = [];
            const base = currentRate;

            if (activeFilter === '1D') {
                simulatedData = [
                    { value: 521.40, date: 'Ayer' },
                    { value: 521.60, date: '6:00' },
                    { value: 521.20, date: '12:00' },
                    { value: Number(base.toFixed(2)), date: 'Hoy' },
                ];
            } else if (activeFilter === '5D') {
                simulatedData = [
                    { value: 523.00, date: 'Hace 5 días' },
                    { value: 522.70, date: 'Hace 4 días' },
                    { value: 521.90, date: 'Hace 3 días' },
                    { value: 521.40, date: 'Ayer' },
                    { value: Number(base.toFixed(2)), date: 'Hoy' },
                ];
            } else if (activeFilter === '1 M') {
                simulatedData = [
                    { value: Number((base + 3.20).toFixed(2)), date: '1 ago' },
                    { value: Number((base + 1.50).toFixed(2)), date: '7 ago' },
                    { value: Number((base + 2.80).toFixed(2)), date: '14 ago' },
                    { value: Number((base - 1.40).toFixed(2)), date: '21 ago' },
                    { value: Number((base + 0.60).toFixed(2)), date: '28 ago' },
                    { value: Number(base.toFixed(2)), date: 'Hoy' },
                ];
            } else if (activeFilter === '1A') {
                simulatedData = [
                    { value: Number((base - 14.00).toFixed(2)), date: 'Sep' },
                    { value: Number((base - 8.20).toFixed(2)), date: 'Dic' },
                    { value: Number((base - 4.50).toFixed(2)), date: 'Mar' },
                    { value: Number((base + 6.00).toFixed(2)), date: 'Jun' },
                    { value: Number((base + 2.10).toFixed(2)), date: 'Ago' },
                    { value: Number(base.toFixed(2)), date: 'Hoy' },
                ];
            } else {
                simulatedData = [
                    { value: Number((base - 28.00).toFixed(2)), date: '2023' },
                    { value: Number((base - 16.50).toFixed(2)), date: '2024' },
                    { value: Number((base + 10.00).toFixed(2)), date: '2025 Q1' },
                    { value: Number((base - 6.00).toFixed(2)), date: '2025 Q3' },
                    { value: Number((base + 4.50).toFixed(2)), date: '2026' },
                    { value: Number(base.toFixed(2)), date: 'Hoy' },
                ];
            }

            const rawMin = Math.min(...simulatedData.map(item => item.value));
            const rawMax = Math.max(...simulatedData.map(item => item.value));

            const padding = (rawMax - rawMin) * 0.2 || 1.5;
            const calculatedMin = Number((rawMin - padding).toFixed(2));
            const calculatedMax = Number((rawMax + padding).toFixed(2));

            setChartBounds({
                minValue: calculatedMin,
                maxValue: calculatedMax > calculatedMin ? calculatedMax : calculatedMin + 10
            });

            setChartData(simulatedData);
            setLoading(false);
        }, 150);

        return () => clearTimeout(timer);
    }, [activeFilter, currentRate]);

    return (
        <View style={[styles.container, { backgroundColor: cardBgColor }]}>

            {/* Fila de botones de tiempo */}
            <View style={styles.filterContainer}>
                {filters.map((filter) => (
                    <TouchableOpacity
                        key={filter}
                        onPress={() => {
                            setLoading(true);
                            setActiveFilter(filter);
                        }}
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
                        maxValue={chartBounds.maxValue}
                        yAxisOffset={chartBounds.minValue}
                        height={180}
                        width={screenWidth - 80}
                        thickness={2}
                        color="#22C55E"
                        areaChart
                        startFillColor="#22C55E"
                        startOpacity={0.2}
                        endFillColor="#22C55E"
                        endOpacity={0.02}
                        noOfSections={4}
                        yAxisTextStyle={{ color: subTextColor, fontSize: 11 }}
                        xAxisLabelTextStyle={{ color: subTextColor, fontSize: 11, width: 55, marginLeft: -12 }}
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
                                            {items[0]?.value?.toFixed(2)}
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
        marginLeft: -20,
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