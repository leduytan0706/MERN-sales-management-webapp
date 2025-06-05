const getTotalAmount = (importItems) => {
    return importItems.reduce((total, item) => total + item.importQuantity*item.importPrice, 0);
};

export default getTotalAmount;