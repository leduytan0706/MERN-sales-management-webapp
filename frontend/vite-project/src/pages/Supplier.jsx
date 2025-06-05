import React, { useEffect, useState } from 'react'
import {NavLink, useNavigate} from 'react-router-dom'
import './Supplier.css'
import useSupplierStore from '../store/useSupplierStore'
import useAuthStore from '../store/useAuthStore'
import { Backdrop, CircularProgress } from '@mui/material'
import DeleteSupplier from '../components/supplier/DeleteSupplier'
import PageHeader from '../components/PageHeader'
import useDebounce from '../lib/useDebounce'
import SortForm from '../components/SortForm'
import SearchBar from '../components/SearchBar'
import SuppliersTable from '../components/supplier/components/SuppliersTable'
import LoadingSpinner from '../components/LoadingSpinner'

const Supplier = () => {
  const {isProcessing, isLoadingPage, isDeleteMode} = useAuthStore();
  const {suppliers, getSuppliers, searchSuppliers, sortAndFilter, sortSuppliers, sortedAndFilteredSuppliers} = useSupplierStore();
  const navigate = useNavigate();
  const debouncedSearch = useDebounce(sortAndFilter.searchTerm);

  useEffect(() => {
    getSuppliers();
  },[getSuppliers]);

  useEffect(() => {
    const loadSearchResult = () => {
      if (sortAndFilter.searchTerm.length <= 0){
        useSupplierStore.setState({sortedAndFilteredSuppliers: [...suppliers]});
        return;
      }
      searchSuppliers(debouncedSearch);
    }

    loadSearchResult();
  }, [debouncedSearch]);

  const displayedSuppliers = sortedAndFilteredSuppliers.length > 0? sortedAndFilteredSuppliers: suppliers;

  const handleSort = (e) => {
    e.preventDefault();
    sortSuppliers({
      sortCriteria: sortAndFilter.sortCriteria,
      sortOrder: sortAndFilter.sortOrder
    });
  } 

  if (isLoadingPage){
    return <LoadingSpinner />;
  }

  return (
    <div className='supplier-page'>
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={isDeleteMode}
      >
        <DeleteSupplier />
      </Backdrop>
      
      
      <PageHeader 
        pageTitle="Nhà Cung Cấp"
        addRoute="/supplier/new"
        addButtonTitle="Thêm mới"
      />
      <div className="supplier-search">
        <SearchBar 
          searchPlaceholder={"Nhập tên nhà cung cấp"}
          searchTerm={sortAndFilter.searchTerm}
          onSearchChange={(value) => useSupplierStore.setState({sortAndFilter: {...sortAndFilter, searchTerm: value}})}
        />
        <div className="sort-section">
          <SortForm 
            useStore={useSupplierStore}
            criterias={sortCriterias}
            sortAndFilter={sortAndFilter}
            onFormSubmit={handleSort}
          />
        </div>

      </div>
      <div className="supplier-table-section">
        {suppliers.length === 0? (
          <h3>Bạn chưa thêm nhà cung cấp nào.</h3>
        ):(
        <SuppliersTable 
          displayedSuppliers={displayedSuppliers}
        />
        )}
        
      </div>
      
    </div>
  )
}

const sortCriterias = [
  {
    label: "Tên nhà cung cấp",
    value: "name"
  }
];

export default Supplier