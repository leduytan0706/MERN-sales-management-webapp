import React, { useEffect, useState } from 'react'
import {NavLink, useLocation, useNavigate} from 'react-router-dom'
import './Product.css'
import useAuthStore from '../store/useAuthStore'
import { Backdrop, CircularProgress } from '@mui/material'
import { ArrowDownAZ, ArrowDownUp, ArrowUpZA, Filter, FilterX, Minus, Plus, Search, SquarePen, Trash2, Upload } from 'lucide-react'
import DeleteProduct from '../components/product/DeleteProduct'
import useProductStore from '../store/useProductStore'
import useDebounce from '../lib/useDebounce'
import * as XLSX from 'xlsx';
import UploadedFilePreview from '../components/UploadedFilePreview'
import SortForm from '../components/SortForm'
import PageHeader from '../components/PageHeader'
import SearchBar from '../components/SearchBar'
import ProductsTable from '../components/product/components/ProductsTable'
import ProductFilterForm from '../components/product/components/ProductFilterForm'
import LoadingSpinner from '../components/LoadingSpinner'

const Product = () => {
  const {isProcessing, isLoadingPage, isDeleteMode} = useAuthStore();
  const {products, sortedAndFilteredProducts, getProducts, sortProducts, sortAndFilter, filterProducts, searchProducts, addProductsFromUpload, clearFilter} = useProductStore();
  const [uploadedData, setUploadedData] = useState(null);
  const navigate = useNavigate();
  const debouncedSearch = useDebounce(sortAndFilter.search);
  
  const categories = [
    ...new Map(products?.map((p) => [p.category?.id, p.category?.name])),
  ];

  useEffect(() => {
    getProducts(); 
  },[getProducts]);

  useEffect(() => {
    const loadSearchResults = async () => {
      if (sortAndFilter.search.length <= 0){
        useProductStore.setState({sortedAndFilteredProducts: []});
        return;
      }
      await searchProducts(debouncedSearch);
    }

    loadSearchResults();
  }, [debouncedSearch]);

  const displayedProducts = sortedAndFilteredProducts.length === 0? products: sortedAndFilteredProducts;

  const handleSort = (e) => {
    e.preventDefault();
    sortProducts({
      sortCriteria: sortAndFilter.sortCriteria,
      sortOrder: sortAndFilter.sortOrder
    });
  } 

  const handleFilter = async (e) => {
    e.preventDefault();
    if (sortAndFilter.isFiltered) {
      clearFilter();
      return;
    }

    await filterProducts();
  }

  const handleUploadedFile = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.readAsArrayBuffer(file);
    reader.onload = () => {
      const data = reader.result;

      const workbook = XLSX.read(data, {type: "array"});
      // console.log(workbook);

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // convert sheet to json
      const parsedData = XLSX.utils.sheet_to_json(sheet);

      // console.log(parsedData);
      const importedData = parsedData.map(data => ({
        productId: data["MaSP"],
        name: data["TenSanPham"],
        barcode: data["MaVach"],
        price: data["DonGia"],
        unit: data["DonVi"],
        stock: data["Ton"],
        stockNorm: data["DinhMuc"],
        note: data["GhiChu"],
        categoryName: data["DanhMuc"],
        image: data["HinhAnh"] || ""
      }));
      setUploadedData(importedData);
    };
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    await addProductsFromUpload(uploadedData);
    setUploadedData(null);
    navigate('/product');
  }

  if (isLoadingPage){
    return <LoadingSpinner />
  }

  return (
    <div className='product-page'>
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={isDeleteMode}
        onClick={() => {useAuthStore.setState({isDeleteMode: false})}}
      >
        <DeleteProduct />
      </Backdrop>
      
      <PageHeader 
        pageTitle="Sản Phẩm"
        addRoute="/product/new"
        addButtonTitle="Thêm mới"
        uploadedFile={uploadedData}
        handleUploadedFile={(e) => {
          handleUploadedFile(e);
        }}
      />
      <div className="product-search">
        <SearchBar 
          searchPlaceholder="Nhập tên sản phẩm"
          searchTerm={sortAndFilter.search}
          onSearchChange={(value) => {
            useProductStore.setState({sortAndFilter: {...sortAndFilter, search: value}});
          }}
        />
        <div className="sort-section">
          <SortForm 
            criterias={sortCriterias}
            onFormSubmit={handleSort}
            sortAndFilter={sortAndFilter}
            useStore={useProductStore}
          />
        </div>
        <div className="product-filter-section">
          <ProductFilterForm 
            categories={categories}
            onFormSubmit={handleFilter}
          />
        </div>

      </div>
      <div className="product-table-section">
        {displayedProducts?.length === 0? (
          <h3>No products found.</h3>
        ):(
          isProcessing? (
            <LoadingSpinner />
          ) : (
            <ProductsTable 
              displayedProducts={displayedProducts}
            />
          )
        )}
      </div>
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={uploadedData? true: false}
      >
        <UploadedFilePreview
          tableHeaders={tableHeaders}
          uploadedData={uploadedData}
          onClose={() => setUploadedData(null)}
          tableRowStyle={tableRowStyle}
          tableCellAlignedLeft={["Ảnh", "Tên Sản Phẩm", "Phân loại", "Đơn vị"]}
          handleUploadFile={handleUploadSubmit}
        />
      </Backdrop>
      
    </div>
  )
}

const tableHeaders = [
  {
    title: "Ảnh",
    value: "image"
  },
  {
    title: "Tên Sản Phẩm",
    value: "name"
  },
  {
    title: "Phân loại",
    value: "categoryName"
  },
  {
    title: "Đơn vị",
    value: "unit"
  },
  {
    title: "Giá",
    value: "price"
  },
  
  {
    title: "Tồn",
    value: "stock"
  }
];

const tableRowStyle = {
  display: "grid",
  gridTemplateColumns: "auto 10% 40% 25% 5% 5% 10%",
};

const sortCriterias = [
  {
    label: "Tên sản phẩm",
    value: "name"
  },
  {
    label: "Giá",
    value: "price"
  },
  {
    label: "Tồn",
    value: "stock"
  }
];

export default Product