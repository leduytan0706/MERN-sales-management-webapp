import React, { useEffect, useState } from 'react'
import "./UpdateDiscount.css";
import AddUpdateHeader from '../AddUpdateHeader';
import useAuthStore from '../../store/useAuthStore';
import LoadingSpinner from "../../components/LoadingSpinner";
import useCategoryStore from '../../store/useCategoryStore';
import { CircularProgress, Select } from '@mui/material';
import ProductSearch from '../ProductSearch';
import useProductStore from '../../store/useProductStore';
import toast from 'react-hot-toast';
import { formatDateForInput } from '../../utils/formatTime';
import { X } from 'lucide-react';
import { checkDiscountFormData } from '../../utils/checkFormData';
import useDiscountStore from '../../store/useDiscountStore';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateDiscount = () => {
  const {id} = useParams();
  const {isLoadingPage, isProcessing} = useAuthStore();
  const {sortedAndFilteredProducts, getProductById} = useProductStore();
  const {getCategories, categories} = useCategoryStore();
  const {getDiscountById, updateDiscount, selectedDiscount} = useDiscountStore();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState();
  const [formData, setFormData] = useState({
    autoApply: false,
    code: "",
    name: "",
    minQuantity: "",
    minAmount: "",
    maxDiscount: "",
    conditionType: "minQuantity",
    discountAmount: "",
    discountPercentage: "",
    applyType: "item",
    discountType: "percentage",
    startDate: new Date().toISOString(),
    endDate: new Date("2100-01-01").toISOString(),
    itemOption: "all",
    items: [],
    categoryId: "",
    note: ""
  });

  useEffect(() => {
    getCategories();
    getDiscountById(id);
  }, []);

  useEffect(() => {
    if (selectedDiscount){
      setFormData({
        autoApply: selectedDiscount?.autoApply || false,
        code: selectedDiscount?.code || "",
        name: selectedDiscount?.name || "",
        minQuantity: selectedDiscount?.minQuantity || "",
        minAmount: selectedDiscount?.minAmount || "",
        maxDiscount: selectedDiscount?.maxDiscount || "",
        conditionType: selectedDiscount?.minQuantity > 0? "minQuantity": "minAmount",
        discountAmount: selectedDiscount?.discountAmount || "",
        discountPercentage: selectedDiscount?.discountPercentage || "",
        applyType: selectedDiscount?.applyType || "",
        discountType: selectedDiscount?.discountPercentage > 0? "percentage": "amount",
        startDate: selectedDiscount?.createdAt || new Date().toISOString(),
        endDate: selectedDiscount?.endDate || new Date("2100-01-01").toISOString(),
        itemOption: selectedDiscount?.itemOption || "",
        items: selectedDiscount?.products || [],
        categoryId: selectedDiscount?.category?.id || "",
        note: ""
      });
    }
  }, [selectedDiscount]);

  const handleProductClick = async (productId) => {
    const {items: selectedItems} = formData;

    if (selectedItems.some(item => item.id === productId)){
      toast("Mặt hàng này đã được thêm.", {
        icon: '⚠️'
      });
      return;
    };

    let selectedProduct =  sortedAndFilteredProducts?.find(product => product.id === productId);
    if (!selectedProduct) {
      selectedProduct = await getProductById(productId);
    }

    selectedItems.push(selectedProduct);
    setFormData((prev) => ({
     ...prev,
      items: [...selectedItems]
    }));
  };

  const handleRemoveItem = (productId) => {
    const {items: selectedItems} = formData;

    if (!selectedItems.some(item => item.id === productId)){
      toast("Mặt hàng này không có trong danh sách.", {
        icon: '⚠️'
      });
      return;
    };

    const updatedItems = selectedItems.filter(item => item.id !== productId);
    setFormData((prev) => ({
     ...prev,
      items: [...updatedItems]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    const validationResult = checkDiscountFormData(formData);
    if (validationResult){
      toast.error(validationResult);
      return;
    }

    await updateDiscount(formData);
    navigate("/discount");
  };

  if (isLoadingPage){
    return <LoadingSpinner />
  }

  return (
    <div className='update-discount'>
      <AddUpdateHeader 
        headerTitle={"Cập nhật chương trình khuyến mãi"}
        onReturn="/discount"
      />

      <div className="update-discount-section">
        <form action="" onSubmit={handleSubmit} className="update-discount-form">
          
          <div className="input-section">
            <div className="basic-info">
              <div className='form-section-title align-center'>Thông tin cơ bản</div>
              <div className="form-field code-field">
                <label htmlFor="code" className="form-label">
                  <span className='form-name'>Mã chương trình:</span>
                  <input 
                    type='text'
                    id='code'
                    name='code'
                    value={formData.autoApply? "Tự động áp dụng": formData.code}
                    disabled={formData.autoApply}
                    className='form-input'
                    onChange={(e) => setFormData(prev => ({...prev, code: e.target.value}))}
                  />
                </label>
                <div className="auto-apply-checkbox">
                  <label htmlFor="autoApply">
                    
                    <input
                      type="checkbox"
                      id="autoApply"
                      name="autoApply"
                      checked={formData.autoApply}
                      onChange={(e) => setFormData((prev) => ({...prev, autoApply: e.target.checked}))}
                    />
                    <span>Tự động áp dụng</span>
                  </label>
                </div>
              </div>
              <div className="form-field">
                <label htmlFor="name" className="form-label">
                  <span className='form-name'>Tên chương trình:</span>
                  <input 
                    type='text'
                    id='name'
                    name='name'
                    value={formData.name}
                    className='form-input'
                    onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                  />
                </label>
              </div>
              <div className="form-field">
                <label htmlFor="note" className="form-label">
                  <span className='form-name'>Ghi chú:</span>
                  <input 
                    type='text'
                    id='note'
                    name='note'
                    value={formData.note}
                    className='form-input'
                    onChange={(e) => setFormData(prev => ({...prev, note: e.target.value}))}
                  />
                </label>
              </div>
              <div className="form-field date-field">
                <label htmlFor="startDate" className="form-label">
                  <span className='form-name'>Ngày bắt đầu:</span>
                  <input 
                    type='date'
                    id='startDate'
                    name='startDate'
                    value={formatDateForInput(formData.startDate)}
                    className='form-input'
                    onChange={(e) => setFormData(prev => ({...prev, startDate: e.target.value}))}
                  />
                </label>
              </div>
              <div className="form-field date-field">
                <label htmlFor="endDate" className="form-label">
                  <span className='form-name'>Ngày kết thúc:</span>
                  <input 
                    type='date'
                    id='endDate'
                    name='endDate'
                    value={formatDateForInput(formData.endDate)}
                    className='form-input'
                    onChange={(e) => setFormData(prev => ({...prev, endDate: e.target.value}))}
                  />
                </label>
              </div>
            </div>
            <div className="range-info">
              <div className='form-section-title align-center'>Thông tin khuyến mãi</div>
              <div className="form-field">
                <label htmlFor="applyType" className="form-label">
                  <span className="form-name">Khuyến mãi theo:{" "}</span>
                  <select 
                    name="applyType" 
                    id="applyType" 
                    className="form-select"
                    value={formData.applyType}
                    onChange={(e) => setFormData(prev => ({...prev, applyType: e.target.value}))}
                  >
                    <option value="">Chọn loại khuyến mãi</option>
                    <option value="item">Mặt hàng</option>
                    <option value="order">Đơn hàng</option>
                  </select>
                </label>
              </div>
              <div className="form-field">
                <label htmlFor="conditionType" className="form-label">
                  <span className="form-name">Điều kiện:{" "}</span>
                  <select 
                    name="conditionType" 
                    id="conditionType" 
                    className="form-select"
                    value={formData.conditionType}
                    onChange={(e) => setFormData(prev => ({...prev, conditionType: e.target.value}))}
                  >
                    <option value="">Chọn điều kiện</option>
                    {formData.applyType === "item" && (
                      <option value="minQuantity">Số lượng tối thiểu</option>
                    )}
                    <option value="minAmount">Giá trị tối thiểu</option>
                  </select>
                </label>
              </div>
              <div className="form-field">
                <label htmlFor="discountType" className="form-label">
                  <span className="form-name">Giảm giá theo:{" "}</span>
                  <select 
                    name="discountType" 
                    id="discountType" 
                    className="form-select"
                    value={formData.discountType}
                    onChange={(e) => setFormData(prev => ({...prev, discountType: e.target.value}))}
                  >
                    <option value="">Chọn loại giảm giá</option>
                    <option value="percentage">Phần trăm</option>
                    <option value="amount">Lượng tiền</option>
                  </select>
                </label>
              </div>
              <div className="form-field">
                {formData.conditionType === "minQuantity"? (
                  <label htmlFor="minQuantity" className="form-label">
                    <span className="form-name">Số lượng tối thiểu:</span>
                    <input 
                      type="number"
                      id="minQuantity"
                      name="minQuantity"
                      className='form-input'
                      value={formData.minQuantity} 
                      onChange={(e) => setFormData(prev => ({...prev, minQuantity: e.target.value}))}
                    />
                  </label>
                ): (
                  <label htmlFor="minAmount" className="form-label">
                    <span className="form-name">Giá trị tối thiểu:</span>
                    <input 
                      type="number"
                      id="minAmount"
                      name="minAmount"
                      className='form-input'
                      value={formData.minAmount} 
                      onChange={(e) => setFormData(prev => ({...prev, minAmount: e.target.value}))}
                    />
                  </label>
                )}
                
              </div>
              <div className="form-field">
                <label htmlFor="maxDiscount" className="form-label">
                  <span className='form-name'>Giảm giá tối đa (nếu có):</span>
                  <input 
                    type='number'
                    id='maxDiscount'
                    name='maxDiscount'
                    value={formData.maxDiscount}
                    className='form-input'
                    onChange={(e) => setFormData(prev => ({...prev, maxDiscount: e.target.value}))}
                  />
                </label>
              </div>
              <div className="form-field">
                {formData.discountType === "percentage"? (
                  <label htmlFor="discountPercentage" className="form-label">
                    <span className="form-name">Phần trăm giảm giá:</span>
                    <input 
                      type="number"
                      id="discountPercentage"
                      name="discountPercentage"
                      className='form-input'
                      value={formData.discountPercentage} 
                      onChange={(e) => setFormData(prev => ({...prev, discountPercentage: e.target.value}))}
                    />
                  </label>
                ): (
                  <label htmlFor="discountAmount" className="form-label">
                    <span className="form-name">Số tiền giảm giá cố định:</span>
                    <input 
                      type="number"
                      id="discountAmount"
                      name="discountAmount"
                      className='form-input'
                      value={formData.discountAmount} 
                      onChange={(e) => setFormData(prev => ({...prev, discountAmount: e.target.value}))}
                    />
                  </label>
                )}
              </div>
              {formData.applyType === "item" && (
              <div className="selection-field">
                <div className='align-left'>Áp dụng cho:</div>
                <div className='form-field'>
                  <label htmlFor="all" className="form-label">
                    <input 
                      type="radio"
                      name="discountFor"
                      id="allItems"
                      value={"all"}
                      defaultChecked={formData.itemOption === "all"}
                      onClick={(e) => setFormData(prev => ({...prev, itemOption: "all"}))}
                    />
                    <span className="form-name">Tất cả các mặt hàng</span>
                  </label>
                </div>
                <div className="form-field categorial-items-field">
                  <label htmlFor="categorialItems" className="form-label">
                    <input 
                      type="radio"
                      name="discountFor"
                      id="categorialItems"
                      value={"category"}
                      defaultChecked={formData.itemOption === "category"}
                      onClick={(e) => setFormData(prev => ({...prev, itemOption: "category"}))}
                    />
                    <span className="form-name">Các mặt hàng thuộc một danh mục</span>
                  </label>
                  {formData.itemOption === "category" && (
                    <label htmlFor="categoryId" className="form-label categorial-items-label">
                      <span className="form-name align-center">Giảm giá theo danh mục:{" "}</span>
                      <select 
                        name="categoryId" 
                        id="categoryId" 
                        className="form-select"
                        value={formData.categoryId}
                        onChange={(e) => setFormData(prev => ({...prev, categoryId: e.target.value}))}
                      >
                        <option value="">Chọn danh mục</option>
                        {categories?.map((category, index) => (
                          <option key={index} value={category.id}>{category.name}</option>
                        ))}
                      </select>
                  </label>
                  )}
                </div>
                <div className="form-field optional-items-field">
                  <label htmlFor="optionalItems" className="form-label">
                    <input 
                      type="radio"
                      name="discountFor"
                      value={"optional"}
                      defaultChecked={formData.itemOption === "optional"}
                      onClick={(e) => setFormData(prev => ({...prev, itemOption: "optional"}))}
                    />
                    <span className="form-name">Các mặt hàng tùy chọn</span>
                  </label>
                  {formData.itemOption === "optional" && (
                    <label htmlFor="" className="form-label optional-items-label">
                      <span className='form-name'>Tìm kiếm và chọn mặt hàng:</span>
                      <ProductSearch 
                        onProductClick={handleProductClick}
                        onInputFocus={() => setIsOpen(true)}
                        onClose={() => setIsOpen(false)}
                        isOpen={isOpen}
                      />
                      <div className="selected-items-list">
                        {formData?.items?.map((item,index) => (
                          <div 
                            key={index}
                            className="selected-item-card align-left"
                          >
                            <div className="item-info align-left">
                              <img src={item.image || "/image-holder2.svg"} alt="" />
                              <p>{item.name}</p>
                            </div>
                            <div 
                              className="rm-btn"
                              onClick={() => {
                                handleRemoveItem(item.id);
                              }}
                            >
                              <X className='rm-icon'/>
                            </div>
                          </div>
                        ) )}
                      </div>
                    </label>
                  )}
                </div>
              </div>         
              )}
            </div>   
          </div>
          <div className="submit-section align-center">
            <button
              type="submit"
              className="submit-btn"
            >
              {isProcessing? (
                <CircularProgress />
              ) : (
                "Cập nhật"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UpdateDiscount;