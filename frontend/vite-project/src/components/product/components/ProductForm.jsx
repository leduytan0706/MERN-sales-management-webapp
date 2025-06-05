import React from 'react'
import "./ProductForm.css";
import useAuthStore from '../../../store/useAuthStore';
import { Banknote, Barcode, Blocks, Boxes, CircleAlert, Group, Tag } from 'lucide-react';
import { CircularProgress } from '@mui/material';

const ProductForm = ({formData, onInputChange, onSubmit, onUploadImage, selectedImage, categories}) => {
    const {isProcessing} = useAuthStore();

  return (
    <form action="" className='product-form' >
        <div
            className='product-basic-info'
        >
            <div className="form-field">
                <label htmlFor="barcode" className='input-label'>Mã vạch
                    <div className='form-input'>
                        <Barcode className='form-icon' />
                        <input 
                            type="text" 
                            id='barcode' 
                            name='barcode' 
                            placeholder='Ví dụ: 0123456789' 
                            className='input-field'
                            value={formData.barcode}
                            onChange={(e) => onInputChange((prev) => ({...prev, barcode: e.target.value}))}
                        />
                    </div> 
                </label> 
            </div>

            <div className="form-field">
                <label htmlFor="name" className='input-label'>Tên sản phẩm
                    <div className='form-input'>
                        <Tag className='form-icon' />
                        <input 
                            type="text" 
                            id='name' 
                            name='name' 
                            placeholder='Ví dụ: Nước Pepsi 330ml' 
                            className='input-field'
                            value={formData.name}
                            onChange={(e) => onInputChange((prev) => ({...prev, name: e.target.value}))}
                        />
                    </div> 
                </label> 
            </div>

            <div className="form-field">
                <label htmlFor="price" className='input-label'>Đơn giá
                    <div className='form-input'>
                        <Banknote className='form-icon' />
                        <input 
                            type="number" 
                            id='price' 
                            name='price' 
                            placeholder='0' 
                            className='input-field'
                            value={formData.price}
                            onChange={(e) => onInputChange((prev) => ({...prev, price: e.target.value}))}
                        />
                    </div>  
                </label>
            </div>

            <div className="form-field">
                <label htmlFor="unit" className='input-label'>Đơn vị tính
                    <div className='form-input'>
                        <Boxes className='form-icon' />
                        <input 
                            type="text" 
                            id='unit' 
                            name='unit' 
                            placeholder='VD: Hộp' 
                            className='input-field'
                            value={formData.unit}
                            onChange={(e) => onInputChange((prev) => ({...prev, unit: e.target.value}))}
                        />
                    </div>  
                </label>
            </div>

            <div className="form-field">
                <label htmlFor="stock" className='input-label'>Số lượng tồn
                    <div className='form-input'>
                        <Blocks className='form-icon' />
                        <input 
                            type="number" 
                            id='stock' 
                            name='stock' 
                            placeholder='0' 
                            className='input-field'
                            value={formData.stock}
                            onChange={(e) => onInputChange((prev) => ({...prev, stock: e.target.value}))}
                        />
                    </div>  
                </label>
            </div>

            <div className="form-field">
                <label htmlFor="stock-norm" className='input-label'>Định mức tồn
                    <div className='form-input'>
                        <CircleAlert className='form-icon' />
                        <input 
                            type="number" 
                            id='stock-norm' 
                            name='stock-norm' 
                            placeholder='0' 
                            className='input-field'
                            value={formData.stockNorm}
                            onChange={(e) => onInputChange((prev) => ({...prev, stockNorm: e.target.value}))}
                        />
                    </div>  
                </label>
            </div>

            <div className="form-field category-option">
                <label htmlFor="category" className='input-label'>Danh mục
                    <div className='form-input'>
                        <Group className='form-icon' />
                        <select 
                            id='category' 
                            name='category' 
                            className='category-input'
                            value={formData.categoryId || ""}
                            onChange={(e) => onInputChange((prev) => ({...prev, categoryId: e.target.value}))}
                        >
                            <option value="">Chọn danh mục</option>
                            {categories.map(category => (
                            <option 
                                key={category.id} 
                                value={category.id}>
                                    {category.name}
                            </option>
                            ))}
                        </select>
                    </div>  
                </label>
            </div>
        </div>

        <div className="product-added-info">
            <div className="form-field">
                <label htmlFor="image" className='input-label'>Ảnh
                    <div className='form-input image-input'>
                        <input 
                            type="file" 
                            id='image' 
                            name='image' 
                            className='input-field'
                            style={{display: "none"}}
                            onChange={onUploadImage}
                        />
                        <img 
                            src={selectedImage || formData.image || "/image-holder2.svg"}
                            alt="product image"
                            className='image-preview'
                        />
                    </div>  
                </label>
            </div>

            <div className="form-field">
                <label htmlFor="note" className='input-label'>Ghi chú
                    <div className='form-input note-input'>
                        <textarea 
                            type="text" 
                            id='note' 
                            name='note' 
                            placeholder='Ghi chú' 
                            value={formData.note}
                            onChange={(e) => onInputChange((prev) => ({...prev, note: e.target.value}))}
                        >

                        </textarea>
                    </div> 
                </label> 
            </div>
        </div>
        
        
        <div className="form-submit">
            <button 
                type="submit"
                className="submit-button"
                onClick={onSubmit} 
                disabled={isProcessing} 
            >
                {isProcessing? (
                    <CircularProgress size={20} />
                ) : (
                    'Thêm mới'
                )}
            </button>
        </div>
    </form>

  )
}

export default ProductForm