import { ExchangeRateResponse } from '../../models/exchange.model';


const EXCHANGE_API_URL = 'https://api.hacienda.go.cr/indicadores/tc/dolar';

export const getBacExchangeRate = async (): Promise<ExchangeRateResponse> => {
  try {
    const response = await fetch(EXCHANGE_API_URL);
    const text = await response.text();

    //si el servidor responde con HTML por error, evitamos que colapse el JSON.parse
    if (text.trim().startsWith('<')) {
      throw new Error('El servidor devolvió HTML en lugar de JSON');
    }

    const data = JSON.parse(text);
    
    const compra = Number(data.compra?.valor || data.compra || 0);
    const venta = Number(data.venta?.valor || data.venta || 0);

    return {
      institution: 'Banco BAC San José',
      compra: compra > 0 ? compra : 500.00,
      venta: venta > 0 ? venta : 513.00,
    };
  } catch (error) {
    console.warn('Aviso: Usando tipo de cambio de respaldo por error de red:', error);
    
    //fallback seguro para que la app y la calculadora nunca se queden sin datos
    return {
      institution: 'Banco BAC San José (Respaldo)',
      compra: 500.00,
      venta: 513.00,
    };
  }
};