import { ExchangeRateResponse } from '../../models/exchange.model';


const EXCHANGE_API_URL = 'https://api.hacienda.go.cr/indicadores/tc/dolar';

export const getBacExchangeRate = async (): Promise<ExchangeRateResponse> => {
  try {
    const response = await fetch(EXCHANGE_API_URL);
    const text = await response.text();

    //si el servidor responde con HTML por error, evitamos que colapse el JSON.parse
    if (text.trim().startsWith('<')) {
      throw new Error('The server returned HTML instead of JSON');
    }

    const data = JSON.parse(text);
    
    const purchase = Number(data.purchase?.valor || data.purchase || 0);
    const sale = Number(data.sale?.valor || data.sale || 0);

    return {
      institution: 'Banco BAC San José',
      purchase: purchase > 0 ? purchase : 500.00,
      sale: sale > 0 ? sale : 513.00,
    };
  } catch (error) {
    console.warn('Notice: Using fallback exchange rate due to network:', error);
    
    //fallback seguro para que la app y la calculadora nunca se queden sin datos
    return {
      institution: 'Bank BAC San José (fallback)',
      purchase: 500.00,
      sale: 513.00,
    };
  }
};