import React, { useEffect } from 'react'
import "./Discount.css"
import PageHeader from '../components/PageHeader'
import DiscountsTable from '../components/discount/components/DiscountsTable'
import useDiscountStore from '../store/useDiscountStore'
import SearchBar from '../components/SearchBar'
import SortForm from '../components/SortForm'
import LoadingSpinner from '../components/LoadingSpinner'
import useAuthStore from '../store/useAuthStore'
import { Backdrop } from '@mui/material'
import DeleteDiscount from "../components/discount/DeleteDiscount";


const Discount = () => {
    const {isLoadingPage, isProcessing, isDeleteMode} = useAuthStore();
    const {getDiscounts, discounts, sortAndFilter} = useDiscountStore();

    useEffect(() => {
        getDiscounts();
    }, []);

    const displayedDiscounts = discounts;

    const handleSort = (e) => {
        e.preventDefault();
    };

    if (isLoadingPage) {
        return <LoadingSpinner />
    }

  return (
    <div className="discount-page">
        <PageHeader 
            pageTitle={"Khuyến mãi"}
            addRoute={"/discount/new"}
            addButtonTitle={"Thêm mới"}
        />
        <div className="discount-search-section">
            <SearchBar 
                searchPlaceholder={"Nhập mã hoặc tên chương trình"}
                searchTerm={sortAndFilter.searchTerm}
                onSearchChange={(value) => useDiscountStore.setState({sortAndFilter: {...sortAndFilter, searchTerm: value}})}
            />
            <div className="discount-sort-section">
                <SortForm 
                    onFormSubmit={handleSort}
                    sortAndFilter={sortAndFilter}
                    useStore={useDiscountStore}
                    criterias={sortCriterias}
                />
            </div>
    
        </div>
        <div className="discount-table-section">
            {displayedDiscounts?.length === 0? (
                <h3>No categories found.</h3>
            ):(
                <DiscountsTable
                    displayedDiscounts={displayedDiscounts}
                />
            )}
        </div>
        <Backdrop
          sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
          open={isDeleteMode}
        >
          <DeleteDiscount />
        </Backdrop>
    </div>
  )
}

const sortCriterias = [
    {
        label: "Ngày tạo",
        value: "createdAt"
    },
    {
        label: "Ngày kết thúc",
        value: "endDate"
    },
];

export default Discount