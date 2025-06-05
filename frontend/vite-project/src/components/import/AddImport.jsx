import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import { CircularProgress } from '@mui/material';
import useImportStore from '../../store/useImportStore';
import "./AddImport.css";
import useProductStore from '../../store/useProductStore';
import useSupplierStore from '../../store/useSupplierStore';
import ProductSearch from '../ProductSearch';
import getTotalAmount from '../../utils/getTotalAmount';
import { checkImportFormData } from '../../utils/checkFormData';
import toast from 'react-hot-toast';
import ImportInputTable from './components/ImportInputTable';
import AddUpdateHeader from '../AddUpdateHeader';
import AddedInfoInput from './components/AddedInfoInput';
import { addImportItem, updateImportItem } from '../../utils/addUpdateImport';

const AddImport = () => {
  const {isProcessing, isLoadingPage} = useAuthStore();
  const {products, getProducts, getProductById} = useProductStore();
  const {suppliers, getSuppliers} = useSupplierStore();
  const {addImport} = useImportStore();
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
    
  }, [getSuppliers, getProducts]);

  
  const handleProductClick = async (productId) => {
    let importItems = formData.items;
    if (importItems.some((item) => item.product.id===productId)){
      toast("Mặt hàng này đã được thêm.", {
        icon: '⚠️'
      });
      return;
    }
    // Add the product to the import table
    const selectedProduct = await getProductById(productId);
    if (!selectedProduct) {
      toast.error("Không tìm thấy sản phẩm này.");
      return;
    }
    importItems = addImportItem(importItems, selectedProduct);

    setFormData((prev) => ({
      ...prev, 
      items: importItems,
      productQuantity: importItems.length,
      totalAmount: getTotalAmount(importItems)
    }));
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

  const handleDeleteItem = (index) =>{
    const importItems = formData.items;
    const deletedItem = importItems[index];
    importItems.splice(index, 1);
    setFormData({
      ...formData, 
      items: importItems,
      productQuantity: importItems.length,
      totalAmount: formData.totalAmount - deletedItem.importQuantity*deletedItem.importPrice
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add code to save changes to the selected import
    const validationResult = checkImportFormData(formData);
    if (validationResult){
      toast.error(validationResult);
      return;
    }

    const newImportId = await addImport(formData);
    if (!newImportId){
      toast.error("Something went wrong");
      return;
    }
    navigate("/import/"+newImportId);
  };

  return (
    <div className='add-import'>
      <AddUpdateHeader
        onReturn="/import"
        headerTitle="Thêm phiếu nhập hàng"
      />
      <div className="add-import-section">
        <form className='add-import-form' onSubmit={handleSubmit}>
          <AddedInfoInput 
            formData={formData}
            onInputChange={setFormData}
            suppliers={suppliers}
          />
          <div className='import-product-info'>
            <div className='import-product-title'>
              <h3 className='section-title'>Nhập hàng</h3>
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
                onDeleteItem={handleDeleteItem}
              />
              
              
            </div>
          </div>
          <div className='add-import-submit'>
            <button
              type="submit"
            >
              {isProcessing? 
              <CircularProgress size={20} />
              : 
                "Thêm mới"
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddImport