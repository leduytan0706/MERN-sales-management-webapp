const isValidISODate = (dateString) => {
    if ((!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/.test(dateString)) && (!/^\d{4}-\d{2}-\d{2}$/.test(dateString))) return false;
    
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date) && dateString === date.toISOString();
};

export default isValidISODate;