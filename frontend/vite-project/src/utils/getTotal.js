const getOrderTotalItem = (orderItems) => {
    if (orderItems.length === 0){
        return 0;
    }
    return orderItems.reduce((totalItem, item) => totalItem + item.productQuantity, 0);
};

const getOrderTotalAmount = (orderItems) => {
    if (orderItems.length === 0){
        return 0;
    }
    return orderItems.reduce((totalAmount, item) => totalAmount + (item.productQuantity * item.product.price - item.itemDiscount), 0);
};

export {getOrderTotalItem, getOrderTotalAmount};