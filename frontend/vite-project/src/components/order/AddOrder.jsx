import React, { useCallback, useEffect, useState } from 'react';
import {NavLink} from "react-router-dom";
import useOrderStore from '../../store/useOrderStore';
import useProductStore from '../../store/useProductStore';
import "./AddOrder.css"

import useAuthStore from '../../store/useAuthStore';
import { CircularProgress } from '@mui/material';
import toast from 'react-hot-toast';
import useDebounce from '../../lib/useDebounce';
import ProductSearchBar from './components/ProductSearchBar';
import ProductSearchResult from './components/ProductSearchResult';
import { getOrderTotalAmount, getOrderTotalItem } from "../../utils/getTotal";
import OrderForm from './orderForm/OrderForm';
import { checkOrderFormData } from '../../utils/checkFormData';
import LoadingSpinner from '../LoadingSpinner';
import useDiscountStore from '../../store/useDiscountStore';


const AddOrder = () => {
  const {isLoadingPage} = useAuthStore();
  const {getProducts, products, searchProducts, getProductById} = useProductStore();
  const {addOrder, newOrders, activeOrderId, addOrderItem} = useOrderStore();
  const {getProductDiscount, getOrderDiscount} = useDiscountStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeOrder, setActiveOrder] = useState(null);
  const debouncedSearch = useDebounce(searchTerm);

  // console.log(newOrders);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  useEffect(() => {
    const foundOrder = newOrders.find(newOrder => newOrder.orderId === activeOrderId);
    setActiveOrder(foundOrder);
  }, [activeOrderId, newOrders]);

  useEffect(() => {
    const loadSearchResults = async () => {
      if (searchTerm === ""){
        useProductStore.setState({sortedAndFilteredProducts: []});
        return;
      }
      else {
        await searchProducts(debouncedSearch);
      }
    }

    loadSearchResults();
  }, [debouncedSearch]);

  const handleOrderInputChange = async (option = "data", itemProductId, fieldName, fieldValue) => {
    // console.log(fieldName, fieldValue);
    const newOrders_ = [...newOrders];
    const index = newOrders.findIndex(order => order.orderId === activeOrder.orderId);
    if (index < 0){
      toast.error("Không tìm thấy đơn hàng này.");
      return;
    }
    const selectedOrder = newOrders_[index];
    if (option === "data") {
      newOrders_[index] = {
        ...selectedOrder,
        [fieldName]: fieldValue
      };
    }
    else if (option === "item"){
      if (fieldValue < 0){
        return;
      }
      const itemIndex = selectedOrder.items.findIndex(item => item.product.id === itemProductId);
      if (itemIndex < 0){
        toast.error("Order not found.");
        return;
      }
      const selectedItems = [...selectedOrder.items];
      selectedItems[itemIndex]["productQuantity"] = fieldValue === ""? 0: parseInt(fieldValue);
      const productDiscount = await getProductDiscount(itemProductId, fieldValue);
      selectedItems[itemIndex]["itemDiscount"] = productDiscount;
      selectedItems[itemIndex]["itemTotal"] = selectedItems[itemIndex]["productQuantity"]*selectedItems[itemIndex].product.price;
      selectedOrder.totalItem = getOrderTotalItem(selectedOrder.items);
      selectedOrder.totalAmount = getOrderTotalAmount(selectedOrder.items);
      newOrders_[index] = {
        ...selectedOrder,
        items: [...selectedOrder.items]
      };

    }
    useOrderStore.setState({
      newOrders: newOrders_
    });
};

  const handleAddItem = async (productId) => {
    const selectedProduct = await getProductById(productId);
    // console.log(selectedProduct);
    if (!selectedProduct){
      toast.error("Mặt hàng này không tồn tại.");
      return;
    }
    const index = newOrders.findIndex(newOrder => newOrder.orderId === activeOrderId);
    // console.log(index);
    if (index < 0){
        toast.error("Không tìm thấy đơn hàng này.");
        return;
    }
    const activeOrder = newOrders[index];
    const itemIndex = activeOrder.items.findIndex(item => item.product.id === selectedProduct.id);
    console.log(selectedProduct);
    let itemDiscount;
    if (itemIndex < 0){
      itemDiscount = await getProductDiscount(productId, 1);
    }
    else {
      const selectedItem = activeOrder.items[itemIndex];
      itemDiscount = await getProductDiscount(productId, selectedItem.productQuantity + 1)
    }
    await addOrderItem(selectedProduct, index, itemIndex, itemDiscount);
  };

  const handleDiscountCode = async () => {
    const code = activeOrder.discountCode;
    if (!code || code.length === 0){
      toast.error("Bạn chưa nhập mã giảm giá.");
      return;
    }

    const orderDiscount = await getOrderDiscount(code, activeOrder);
    if (!orderDiscount){
      toast.error("Mã giảm giá không hợp lệ.");
      return;
    }

    const newOrders_ = [...newOrders];
    const index = newOrders.findIndex(order => order.orderId === activeOrder.orderId);
    if (index < 0){
      toast.error("Không tìm thấy đơn hàng này.");
      return;
    }
    newOrders_[index]["discountAmount"] = orderDiscount;
    useOrderStore.setState({
      newOrders: newOrders_
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationResult = checkOrderFormData(activeOrder);
    if (validationResult){
      toast.error(validationResult);
      return;
    }

    await addOrder();
    // toast.success("Order added successfully");
  }

  if (isLoadingPage) {
    return (
      <LoadingSpinner />
    );
  }

  return (
    <div className='add-order-page' >
      <div className='search-product-section'>
        <ProductSearchBar 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
        <ProductSearchResult 
          searchTerm={searchTerm}
          onProductClick={handleAddItem}
        />
      </div>
      <div className="order-form-section">
        <OrderForm 
          activeOrder={activeOrder}
          activeOrderId={activeOrderId}
          newOrders={newOrders}
          onInputChange={handleOrderInputChange}
          onSubmit={handleSubmit}
          onDiscountCodeChange={handleDiscountCode}
          submitTitle="Thanh toán"
          isAddMode={true}
        />
      </div>
      <div className='space-holder'></div>
    </div>
  )
}

export default AddOrder