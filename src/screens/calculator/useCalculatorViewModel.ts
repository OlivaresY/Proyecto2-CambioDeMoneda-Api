import { useCallback, useEffect, useState } from 'react';
import { getBacExchangeRate } from '../../services/api/exchangeService';

interface CalculationResult {
    real: number;
    withSurcharge: number;
}

export const useCalculatorViewModel = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [exchangeRate, setExchangeRate] = useState<number | null>(null);

    const fetchExchangeRate = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            //inyeccion y llamada al servicio para obtener la tasa de cambio BAC
            const data = await getBacExchangeRate();
            setExchangeRate(data.venta); //o tambien se usa date.compra dependiendo la tasa qu se necesita calcular
        } catch (err) {
            setError('Failed to fetch exchange rate from Banco BAC San José.');
        } finally {
            setLoading(false);
        }
    }, []);

    //llamada al inicializarse
    useEffect(() => {
        fetchExchangeRate();
    }, [fetchExchangeRate]);

    const calculate = (amount: number, currency: 'USD' | 'CRC'): CalculationResult | null => {
        if (!exchangeRate) {
            return null; // No se puede calcular si no hay tasa de cambio
        }
    const rateWithSurcharge = exchangeRate + 2;
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

    return {
        real: realResult,
        withSurcharge: surchargeResult,
    };
};

return {
    loading,
    error,
    exchangeRate,
    calculate,
    retryFetch: fetchExchangeRate,
};
};
