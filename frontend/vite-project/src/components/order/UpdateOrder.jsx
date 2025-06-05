import React, { useEffect, useState } from 'react'
import ProductSearchBar from './components/ProductSearchBar'
import ProductSearchResult from './components/ProductSearchResult';
import OrderForm from './orderForm/OrderForm';
import { useNavigate, useParams } from 'react-router-dom';
import { getOrderTotalAmount, getOrderTotalItem } from '../../utils/getTotal';
import useAuthStore from '../../store/useAuthStore';
import useProductStore from '../../store/useProductStore';
import useOrderStore from '../../store/useOrderStore';
import useDebounce from '../../lib/useDebounce';
import { CircularProgress } from '@mui/material';
import { checkOrderFormData } from '../../utils/checkFormData';
import toast from 'react-hot-toast';

const UpdateOrder = () => {
  const {id} = useParams();
  const navigate = useNavigate();
  const {isLoadingPage} = useAuthStore();
  const {getProducts, products, searchProducts, sortedAndFilteredProducts} = useProductStore();
  const {getOrderById, selectedOrder, selectedItems, updateOrder, activeOrderId} = useOrderStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [formData, setFormData] = useState({
    orderId: 1,
    customerName: "",
    orderDate: "",
    note: "",
    totalAmount: "",
    debtAmount: "",
    paymentAmount: "",
    totalItem: 0,
    itemQuantity: 0,
    discountAmount: "",
    items: []
  });
  const debouncedSearch = useDebounce(searchTerm);

  
  useEffect(() => {
    getProducts();
    getOrderById(id);
    // if (products.length > 0){
    //   setSearchResult([...products]);
    // }
    
  },[getProducts, id]);

  useEffect(() => {
    if (selectedOrder && selectedItems.length > 0){
      setFormData({
        orderId: 1,
        customerName: selectedOrder?.customerName,
        orderDate: selectedOrder?.orderDate,
        note: selectedOrder?.note,
        totalAmount: selectedOrder?.totalAmount,
        debtAmount: selectedOrder?.debtAmount,
        paymentAmount: 0,
        totalItem: selectedOrder?.totalItem,
        itemQuantity: selectedOrder?.itemQuantity,
        discountAmount: selectedOrder?.discountAmount,
        items: [...selectedItems]
      });
    }
  }, [selectedOrder, selectedItems]);
  
  useEffect(() => {
    const loadSearchResults = () => {
      if (searchTerm === ""){
        setSearchResult([...products]);
        return;
      }
      else {
        searchProducts(debouncedSearch);
        setSearchResult(sortedAndFilteredProducts);
      }
    }

    loadSearchResults();
  }, [debouncedSearch]);

  const handleOrderInputChange = (option = "data", itemProductId, fieldName, fieldValue = "") => {
    const formItems = [...formData.items];
    if (option === "data"){
      setFormData((prev) => ({
        ...prev,
        [fieldName]: fieldValue
      }))
    }
    else if (option === "item"){
      const itemIndex = formItems.findIndex(item => item.product.id === itemProductId);
      if (itemIndex < 0){
        toast.error("Item not found.");
        return;
      }
      formItems[itemIndex]["productQuantity"] = fieldValue === ""?0: fieldValue;
      setFormData((prev) => ({
        ...prev,
        items: [...formItems],
        itemQuantity: formItems.length,
        totalItem: getOrderTotalItem(formItems),
        totalAmount: getOrderTotalAmount(formItems)
      }));
    }
  };

  const handleRemoveItem = (productId) => {
    const updatedItems = formData.items.filter(item => item.product.id !== productId);
    setFormData((prev) => ({
      ...prev,
      items: [...updatedItems],
      itemQuantity: updatedItems.length,
      totalItem: getOrderTotalItem(updatedItems),
      totalAmount: getOrderTotalAmount(updatedItems)
    }));
  };

  const handleAddItem = (productId) => {
    const selectedProduct = products.find(product => product.id === productId);
    const updatedItems = [...formData.items];
    const newItem = {
      product: selectedProduct,
      productQuantity: 1
    };
    updatedItems.push(newItem);
    setFormData((prev) => ({
      ...prev,
      items: [...updatedItems],
      itemQuantity: updatedItems.length,
      totalItem: getOrderTotalItem(updatedItems),
      totalAmount: getOrderTotalAmount(updatedItems)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationResult = checkOrderFormData(formData);
    if (validationResult){
      toast.error(validationResult);
      return;
    }

    const updatedId = await updateOrder(id, formData);
    if (!updatedId){
      return;
    }
    toast.success("Thêm đơn hàng thành công!");
    navigate(`/order/${updatedId}`);
  };


  if (isLoadingPage) {
    return <CircularProgress color="primary" />;
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
          searchResult={searchResult}
          onProductClick={handleAddItem}
        />
      </div>
      <div className="order-form-section">
        <OrderForm
          activeOrder={formData}
          activeOrderId={activeOrderId}
          newOrders={[formData]}
          onInputChange={handleOrderInputChange}
          onSubmit={handleSubmit}
          onRemoveItem={handleRemoveItem}
          submitTitle="Lưu"
          isAddMode={false}
        />
      </div>
      <div className='space-holder'></div>
    </div>
  )
}

export default UpdateOrder