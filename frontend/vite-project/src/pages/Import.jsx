import React, { useEffect, useState } from 'react'
import {NavLink, useNavigate} from 'react-router-dom'
import "./Import.css"
import useAuthStore from '../store/useAuthStore'
import { Backdrop, CircularProgress } from '@mui/material'
import { ArrowDownAZ, ArrowDownUp, ArrowUpZA, Filter, FilterX, Minus, Plus, Search, SquarePen, Trash2, Upload } from 'lucide-react'
import useDebounce from '../lib/useDebounce'
import useImportStore from '../store/useImportStore'
import useSupplierStore from '../store/useSupplierStore'
import DeleteImport from '../components/import/DeleteImport'
import {formatDateForDetail} from '../utils/formatTime'
import PageHeader from '../components/PageHeader'
import SearchBar from '../components/SearchBar'
import SortForm from '../components/SortForm'
import useOrderStore from '../store/useOrderStore'
import ImportFilterForm from '../components/import/components/ImportFilterForm'
import ImportsTable from '../components/import/components/ImportsTable'
import LoadingSpinner from '../components/LoadingSpinner'

const Import = () => {
  const {isProcessing, isLoadingPage, isDeleteMode} = useAuthStore();
  const {getSuppliers, suppliers} = useSupplierStore();
  const {imports, getImports, sortedAndFilteredImports, sortAndFilter, searchImports, sortImports, filterImports, clearFilter} = useImportStore(); 
  const [searchTerm, setSearchTerm] = useState(""); 
  const debouncedSearch = useDebounce(searchTerm);

  useEffect(() => {
    getSuppliers();
    getImports();
  },[getImports, getSuppliers]);

  useEffect(() => {
    const loadSearchResults = async () => {
      if (searchTerm.length <= 0){
        useImportStore.setState({sortedAndFilteredImports: []});
        return;
      }
      await searchImports(debouncedSearch);
    };

    loadSearchResults();
  },[debouncedSearch]);

  const displayedImports = sortedAndFilteredImports.length === 0? imports: sortedAndFilteredImports;

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

  const handleSort = (e) => {
    e.preventDefault();
    sortImports();
  } 

  const handleFilter = async (e) => {
    e.preventDefault();
    if (sortAndFilter.isFiltered) {
      clearFilter();
      return;
    }

    await filterImports();
  }

  if (isLoadingPage){
    return <CircularProgress color="primary" />;
  }

  return (
    <div className='import-page'>
      
      
      
      <PageHeader 
        pageTitle="Nhập hàng"
        addButtonTitle="Thêm mới"
        addRoute="/import/new"
      />
      <div className="import-search-section">
        <SearchBar 
          searchTerm={searchTerm}
          onSearchChange={(value) => {
            setSearchTerm(value);
          }}
          searchPlaceholder="Nhà cung cấp hoặc mặt hàng"
        />
        <div className="import-sort-section">
          <SortForm 
            onFormSubmit={handleSort}
            sortAndFilter={sortAndFilter}
            useStore={useImportStore}
            criterias={sortCriterias}
          />
        </div>
        <div className="import-filter-section">
          <ImportFilterForm 
            onFormSubmit={handleFilter}
            suppliers={suppliers}
          />
        </div>

      </div>
      <div className="import-table-section">
        {displayedImports.length === 0? (
          <h3>Chưa có phiếu nhập.</h3>
        ):(
          isLoadingPage || isProcessing? (
            <LoadingSpinner />
          ) : (
            <ImportsTable 
              displayedImports={displayedImports}
            />
          )
        
        )}
        
      </div>
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={isDeleteMode}
        onClick={() => {useAuthStore.setState({isDeleteMode: false})}}
      >
        <DeleteImport />
      </Backdrop>
    </div>
  )
}

const sortCriterias = [
  {
    label: "Nhà cung cấp",
    value: "supplier"
  },
  {
    label: "Số mặt hàng",
    value: "productQuantity"
  },
  {
    label: "Tổng tiền",
    value: "totalAmount"
  },
  {
    label: "Ngày nhập",
    value: "createdAt"
  }
];

export default Import