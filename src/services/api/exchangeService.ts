import { ExchangeRateResponse } from '../../models/exchange.model';

const EXCHANGE_API_URL = 'https://tipodecambio.cr/api/rates';

export const getBacExchangeRate = async (): Promise<ExchangeRateResponse> => {
  try {
    const response = await fetch(EXCHANGE_API_URL);

    if (!response.ok) {
      throw new Error(`Error in the exchange rate request: HTTP ${response.status}`);
    }

    const data = await response.json();
    let bacData: any = null;

    if (Array.isArray(data)) {
      // Corrección: usar "data.find" en lugar de "values.find"
      bacData = data.find((item: any) => item.name === 'Banco BAC San José' || item.banco === 'Banco BAC San José');
    } else {
      // Corrección: estructura correcta del "else"
      const values = Object.values(data);
      bacData = values.find((item: any) => item.name === 'Banco BAC San José' || item.banco === 'Banco BAC San José');
    }

    if (!bacData) {
      throw new Error('Banco BAC San José data not found in the exchange rate response.');
    }
    
    return {
      institution: 'Banco BAC San José',
      // Corrección: minúsculas según la interfaz definida en el Paso 2
      compra: Number(bacData.compra || bacData.Compra),
      venta: Number(bacData.venta || bacData.Venta),
    };
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    throw error;
  }
};