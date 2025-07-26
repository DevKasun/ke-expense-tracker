export const APP_NAME = 'KeExpense Tracker';

export const CURRENCY = {
    symbol: 'Rs.',
    code: 'LKR',
    locale: 'si-LK'
};

export const formatCurrency = (amount: number): string => {
    return `${CURRENCY.symbol} ${amount.toLocaleString(CURRENCY.locale)}`;
};