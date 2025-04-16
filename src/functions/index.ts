
export const formatNumberToCurrency = (amount: number) => {
    const formatted = new Intl.NumberFormat('en-IN', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
    }).format(amount);
    
    return `₹${formatted}`;
}

export const formatNumberToString = (num: number) => {
    const formatted = new Intl.NumberFormat('en-IN', { 
        minimumFractionDigits: 0, 
        maximumFractionDigits: 0 
    }).format(num);
    
    return formatted
}