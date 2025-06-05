
const getTotalAmount = (option, items) => {
    if (!items || items.length === 0)
        return 0;
    

    if (option === "import"){
        return items.reduce((total, item) => total + (item.importQuantity * item.importPrice), 0);
    }
    else if (option === "order"){
        return items.reduce((total, item) => total + (item.productQuantity * item.productPrice), 0);
    }
    
};

const getTotalItem = (option, items) => {
    if (!items || items.length === 0)
        return 0;
    
    if (option === "import"){
        return items.reduce((total, item) => total + item.importQuantity, 0);
    }
    else if (option === "order"){
        return items.reduce((total, item) => total + item.productQuantity, 0);
    }
    
};

export {getTotalAmount, getTotalItem};