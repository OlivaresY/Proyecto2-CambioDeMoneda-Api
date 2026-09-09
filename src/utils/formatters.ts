export const formatColons = (amount: number): string => {
    return new Intl.NumberFormat('es-CR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
};