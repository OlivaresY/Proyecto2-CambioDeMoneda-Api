export interface ExchangeRateResponse {
    institution: string;
    purchase: number;
    sale: number;
}

export interface CalculationHistoryItem {
    id: string;
    amount: number;
    currency: string;
    realResult: number;
    surchargeResult: number;
    date: string;
}