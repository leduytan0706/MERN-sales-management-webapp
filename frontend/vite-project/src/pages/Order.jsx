import React, { useEffect, useState } from 'react'
import {NavLink, useNavigate} from 'react-router-dom'
import "./Order.css"
import useAuthStore from '../store/useAuthStore'
import { Backdrop, CircularProgress } from '@mui/material'
import useDebounce from '../lib/useDebounce'

import SearchBar from '../components/SearchBar'
import SortForm from '../components/SortForm'
import DeleteOrder from '../components/order/DeleteOrder'
import useOrderStore from '../store/useOrderStore'
import PageHeader from '../components/PageHeader'
import OrderFilterForm from '../components/order/components/OrderFilterForm'
import OrdersTable from '../components/order/components/OrdersTable'
import useProductStore from '../store/useProductStore'
import LoadingSpinner from '../components/LoadingSpinner'

const Order = () => {
  const {isProcessing, isLoadingPage, isDeleteMode} = useAuthStore();
  const {getOrders, orders, sortAndFilter, sortedAndFilteredOrders, searchOrders, sortOrders, filterOrders, clearFilter} = useOrderStore();
  const [searchTerm, setSearchTerm] = useState(""); 
  const debouncedSearch = useDebounce(searchTerm);

  useEffect(() => {
    getOrders();
  },[]);

  useEffect(() => {
    const loadSearchResults = async () => {
      if (searchTerm.length <= 0){
        useOrderStore.setState({sortedAndFilteredOrders: []});
        return;
      }
      await searchOrders(debouncedSearch);
    }

    loadSearchResults();
  }, [debouncedSearch]);

  const displayedOrders = sortedAndFilteredOrders?.length > 0? sortedAndFilteredOrders: orders;

  const handleSort = (e) => {
    e.preventDefault();
    sortOrders(displayedOrders);
  };

  const handleFilter = async (e) => {
    e.preventDefault();
    if (sortAndFilter.isFiltered) {
      clearFilter();
      return;
    }

    await filterOrders();
  };

  if (isLoadingPage){
    return <CircularProgress color="primary" />;
  }

  return (
    <div className='order-page'>
      <PageHeader 
        pageTitle="Đơn hàng"
        addButtonTitle="Thêm mới"
        addRoute="/order/new"

      />
      <div className="order-search">
        <SearchBar 
          searchTerm={searchTerm}
          onSearchChange={(value) => {
            setSearchTerm(value);
          }}
          searchPlaceholder="Tên sản phẩm hoặc khách hàng"
        />
        <div className="order-sort-section">
          <SortForm 
            onFormSubmit={handleSort}
            sortAndFilter={sortAndFilter}
            useStore={useOrderStore}
            criterias={sortCriterias}
          />
        </div>
        <div className="order-filter-section">
          <OrderFilterForm 
            onFormSubmit={handleFilter}
          />
        </div>

      </div>
      <div className="order-table-section">
        {displayedOrders.length === 0? (
          <h3>Chưa có đơn hàng nào.</h3>
        ):(
          isProcessing? (
            <LoadingSpinner />
          ) : (
            <OrdersTable 
              displayedOrders={displayedOrders}
            />
          )
        )}
        
      </div>
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={isDeleteMode}
      >
        <DeleteOrder />
      </Backdrop>
    </div>
  )
}

const sortCriterias = [
  {
    label: "Số Mặt Hàng",
    value: "itemQuantity"
  },
  {
    label: "Tổng Số",
    value: "totalItem"
  },
  {
    label: "Tổng Tiền",
    value: "totalAmount"
  },
  {
    label: "Ngày Tạo",
    value: "createdAt"
  }
];

export default Order