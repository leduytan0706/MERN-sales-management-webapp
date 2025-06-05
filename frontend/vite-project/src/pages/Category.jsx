import { Upload, Plus, Search, ArrowDownAZ, ArrowUpZA, SquarePen, Trash2 } from 'lucide-react'
import React, {useEffect, useState} from 'react'
import './Category.css'
import AddCategory from '../components/category/AddCategory';
import { Backdrop, CircularProgress } from '@mui/material';
import useCategoryStore from '../store/useCategoryStore';
import {formatDateForDetail} from '../utils/formatTime';
import UpdateCategory from '../components/category/UpdateCategory';
import DeleteCategory from '../components/category/DeleteCategory';
import useAuthStore from '../store/useAuthStore';
import { NavLink } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import useDebounce from '../lib/useDebounce';
import CategoriesTable from '../components/category/components/CategoriesTable';
import SortForm from '../components/SortForm';
import SearchBar from '../components/SearchBar';

const Category = () => {
  const {isProcessing, isLoadingPage, isDeleteMode} = useAuthStore();
  const {getCategories, categories, sortAndFilter, sortCategories, sortedAndFilteredCategories, searchCategories } = useCategoryStore();
  const debouncedSearch = useDebounce(sortAndFilter.searchTerm);


  useEffect(() => {
    getCategories();
   
  }, [getCategories]);

  useEffect(() => {
    const loadSearchResults = () => {
      if (sortAndFilter.searchTerm.length <= 0){
        useCategoryStore.setState({sortedAndFilteredCategories: []});
        return;
      }
      searchCategories(debouncedSearch);
    };
    loadSearchResults();
  },[debouncedSearch])

  const displayedCategories = sortedAndFilteredCategories.length >0? sortedAndFilteredCategories: categories;

  const handleSort = (e) => {
    e.preventDefault();
    sortCategories({
      sortCriteria: sortAndFilter.sortCriteria,
      sortOrder: sortAndFilter.sortOrder
    });
  }

  if (isLoadingPage){
    return <CircularProgress color="primary" />;
  }

  return (
    <>
      <div className='category-page'>
        <Backdrop
          sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
          open={isDeleteMode}
        >
          <DeleteCategory />
        </Backdrop>
        
        <PageHeader 
          pageTitle="Danh mục"
          addRoute="/category/new"
          addButtonTitle="Thêm mới"
        />
        <div className="category-search">
          <SearchBar 
            searchPlaceholder="Nhập tên danh mục"
            searchTerm={sortAndFilter.searchTerm}
            onSearchChange={(value) => useCategoryStore.setState({sortAndFilter: {...sortAndFilter, searchTerm: value}})}
          />
          <div className="category-sort-section">
            <SortForm 
              criterias={sortCriterias}
              useStore={useCategoryStore}
              sortAndFilter={sortAndFilter}
              onFormSubmit={handleSort}
            />
          </div>

        </div>
        <div className="category-table-section">
          {displayedCategories?.length === 0? (
            <h3>No categories found.</h3>
          ):(
          <CategoriesTable 
            displayedCategories={displayedCategories}
          />
          )}
        </div>
      </div>
    </>
  );
}

const sortCriterias = [
  {
    label: "Tên danh mục",
    value: "name"
  },
  {
    label: "Số lượng",
    value: "product_quantity"
  }
];

export default Category