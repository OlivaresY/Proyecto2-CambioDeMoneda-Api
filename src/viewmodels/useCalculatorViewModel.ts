import { useCallback, useEffect, useState } from 'react';
import { CalculationHistoryItem } from '../models/exchange.model';
import { getBacExchangeRate } from '../services/api/exchangeService';
import { localDatabase } from '../services/storage/localDatabase';


interface CalculationResult {
    real: number;
    withSurcharge: number;
}

export const useCalculatorViewModel = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [exchangeRate, setExchangeRate] = useState<number | null>(null);
    const [history, setHistory] = useState<CalculationHistoryItem[]>([]);

    const fetchExchangeRate = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            //inyeccion y llamada al servicio para obtener la tasa de cambio BAC
            const data = await getBacExchangeRate();
            const rate = data.sale;
            setExchangeRate(rate); //o tambien se usa date.compra dependiendo la tasa qu se necesita calcular
        } catch {
            setError('Failed to fetch exchange rate from Banco BAC San José.');
        } finally {
            setLoading(false);
        }
    }, []);

    const loadHistory = useCallback(async () => {
        try { 
            const storedHistory = await localDatabase.getItem<CalculationHistoryItem[]>('CALC_HISTORY');
            if (storedHistory) {
                setHistory(storedHistory);
            }
        } catch (err) {
            console.error('Error loading history from storage:', err);
        }
    }, []);

    //llamada al inicializarse usando queueMicrotask para evitar renderizados en cascada síncronos
    useEffect(() => {
        queueMicrotask(() => {
            void fetchExchangeRate();
            void loadHistory();
        });
    }, [fetchExchangeRate, loadHistory]);

    const calculate = (amount: number, currency: 'USD' | 'CRC'): CalculationResult | null => {
        if (!exchangeRate) {
            return null; //no se puede calcular si no hay tasa de cambio
        }
    const rateWithSurcharge = exchangeRate + 2;//interes requerido para el negocio
    let realResult = 0;
    let surchargeResult = 0;

    if (currency === 'USD') {
        // si se recibe dolares, se convierte a colones
        realResult = amount * exchangeRate;
        surchargeResult = amount * rateWithSurcharge;
    } else {
        // si se recibe colones, se convierte a dolares
        realResult = amount / exchangeRate;
        surchargeResult = amount / rateWithSurcharge;
    }

    const newItem: CalculationHistoryItem = {
        id: Date.now().toString(), //se genera ID unico
        amount,
        currency,
        realResult,
        surchargeResult,
        date: new Date().toISOString(),
    };
    //colocamos el calculo mas reciente al inicio
    const updateHistory = [newItem, ...history];
    setHistory(updateHistory);

    localDatabase.setItem('CALC_HISTORY', updateHistory).catch(console.error);//se guarda en AsyncStorage

    return {
        real: realResult,
        withSurcharge: surchargeResult,
    };
};

//eliminar item especifico o todo el historial
const deleteHistoryItem = async (id: string) => {
    const updateHistory = history.filter(item => item.id !== id);
    setHistory(updateHistory);
    await localDatabase.setItem('CALC_HISTORY', updateHistory);
}

const clearHistory = async () => {
    setHistory([]);
    await localDatabase.removeItem('CALC_HISTORY');
};

return {
    loading,
    error,
    exchangeRate,
    history,
    calculate,
    retryFetch: fetchExchangeRate,
    deleteHistoryItem,
    clearHistory,
};
};
