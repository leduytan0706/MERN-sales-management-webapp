import React, { useEffect, useState } from 'react'
import "./UpdateImport.css"
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import useImportStore from '../../store/useImportStore';
import ImportInputTable from './components/ImportInputTable';
import { CircularProgress } from '@mui/material';
import useAuthStore from '../../store/useAuthStore';
import useProductStore from '../../store/useProductStore';
import useSupplierStore from '../../store/useSupplierStore';
import AddedInfoInput from './components/AddedInfoInput';
import AddUpdateHeader from '../AddUpdateHeader';
import getTotalAmount from '../../utils/getTotalAmount';
import { checkImportFormData } from '../../utils/checkFormData';
import { addImportItem, updateImportItem } from '../../utils/addUpdateImport';
import ProductSearch from '../ProductSearch';
import LoadingSpinner from '../LoadingSpinner';

const UpdateImport = () => {
  const {id} = useParams();
  const {isProcessing, isLoadingPage} = useAuthStore();
  const {products, getProducts, getProductById} = useProductStore();
  const {suppliers, getSuppliers} = useSupplierStore();
  const {getImportById, selectedImport, importItems, updateImport} = useImportStore();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    supplierId: "",
    importDate: "",
    note: "",
    items: [],
    productQuantity: 0,
    totalAmount: 0
  });

  useEffect(() => { 
    getSuppliers();
    getProducts();
    getImportById(id);
  }, [id]);

  useEffect(() => {
    if (selectedImport) {
      console.log("Selected Import:", selectedImport); // Debugging
      setFormData({
        supplierId: selectedImport.supplier?.id || "",
        importDate: selectedImport.createdAt || "",
        note: selectedImport.note || "",
        items: importItems || [],
        productQuantity: selectedImport.productQuantity || 0,
        totalAmount: selectedImport.totalAmount || 0
      });
    }
  }, [selectedImport]); 

  
  const handleProductClick = async (productId) => {
    let importItems = formData.items;
    if (importItems.some((item) => item.product.id===productId)){
      toast("Mặt hàng này đã được thêm.", {
        icon: '⚠️'
      });
      return;
    }
    // Add code to add selected product to the import form data
    const selectedProduct = await getProductById(productId);
    importItems = addImportItem(importItems, selectedProduct); 
    setFormData({
      ...formData, 
      items: importItems,
      productQuantity: importItems.length,
      totalAmount: 0
    });
    setIsOpen(false);
  };

  const handleImportInput = (index, fieldName, fieldValue) => {
    let importItems = formData.items;
    importItems = updateImportItem(importItems, index, fieldName, fieldValue);

    setFormData((prev) => ({
      ...prev, 
      items: importItems,
      totalAmount: getTotalAmount(importItems) || prev.totalAmount
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add code to save changes to the selected import
    const validationResult = checkImportFormData(formData);
    if (validationResult){
      toast.error(validationResult);
      return;
    }

    const updatedImportId = await updateImport(id, formData);
    if (!updatedImportId){
      return;
    }
    navigate("/import/"+updatedImportId);
  };

  if (isLoadingPage || !selectedImport){
    return (
      <LoadingSpinner />
    )
  }

  return (
    <div className='update-import'>
      <AddUpdateHeader 
        onReturn="/import"
        headerTitle="Cập nhật phiếu nhập hàng"
      />
      <div className="update-section">
        <form action="" onSubmit={handleSubmit}>
          <AddedInfoInput 
            formData={formData}
            onInputChange={setFormData}
            suppliers={suppliers}
          />
          <div className='import-product-info'>
            <div className='import-product-title'>
              <h3 className='import-section-title'>Nhập hàng</h3>
            </div>
            <div className="import-product-search">
              <ProductSearch
                products={products} 
                onProductClick={handleProductClick} 
                onInputFocus={() => setIsOpen(true)}
                onClose={() => setIsOpen(false)}
                isOpen={isOpen}
              />
            </div>

            <div className='import-products-table'>
              <ImportInputTable
                importItems={formData.items}
                onInputChange={handleImportInput}
                totalAmount={formData.totalAmount}
              />
              
              
            </div>
          </div>
          <div className='update-import-submit'>
            <button
              type="submit"
            >
              {isProcessing? 
              <CircularProgress size={20} />
              : 
                "Cập nhật"
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UpdateImport