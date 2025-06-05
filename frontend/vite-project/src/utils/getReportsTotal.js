const getReportsTotal = (reportsData) => {
    const reportTotal = {
        totalQuantity: 0,
        totalAmount: 0
    };
    reportTotal.totalAmount = reportsData.reduce((total, data) => total + data.totalAmount, 0);
    reportTotal.totalQuantity = reportsData.reduce((total, data) => total + data.totalQuantity, 0);
    return reportTotal;
};

export default getReportsTotal;