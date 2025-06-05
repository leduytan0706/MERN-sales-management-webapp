import React, { useState } from 'react'
import './UpdateCategory.css'
import useCategoryStore from '../../store/useCategoryStore'
import { ArrowLeft, Box, Shapes } from 'lucide-react';
import { CircularProgress } from '@mui/material';
import useAuthStore from '../../store/useAuthStore';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import AddUpdateHeader from '../AddUpdateHeader';

const UpdateCategory = () => {
    const {id} = useParams();
    const {isProcessing} = useAuthStore();
    const {getCategoryById, updateCategory} = useCategoryStore();

    const selectedCategory = getCategoryById(id);
    const navigate = useNavigate();


    const [formData, setFormData] = useState({
        id: id,
        name: selectedCategory.name,
        product_quantity: selectedCategory.product_quantity
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        await updateCategory(formData);
        useAuthStore.setState({isUpdateMode: false});
        navigate("/category");
    }


  return (
    <div className='update-category'>
        <AddUpdateHeader 
            headerTitle="Cập nhật danh mục"
        />
        
        <form action="">
            <div className="form-field">
                <label htmlFor="name" className='input-label'>Tên danh mục</label>
                <div className='form-input'>
                    <Shapes className='form-icon' />
                    <input 
                        type="text" 
                        id='name' 
                        name='name' 
                        placeholder='E.q: Bread' 
                        className='input-field'
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({...prev, name: e.target.value}))}
                    />
                </div>  
            </div>
            <div className="form-field">
                <label htmlFor="quantity" className='input-label'>Số lượng sản phẩm</label>
                <div className='form-input'>
                    <Box className='form-icon' />
                    <input 
                        type="number" 
                        id='quantity' 
                        name='quantity' 
                        placeholder='0' 
                        className='input-field'
                        value= {formData.product_quantity}
                        onChange={(e) => setFormData((prev) => ({...prev, product_quantity: e.target.value}))}
                    />
                </div>  
            </div>
            <div className="form-submit">
                <button 
                    type="submit"
                    className="submit-button"
                    onClick={handleSubmit} 
                    disabled={isProcessing} 
                >
                    {isProcessing? (
                        <CircularProgress size={20} />
                    ) : (
                        'Cập nhật'
                    )}
                </button>
            </div>
        </form>
    </div>
  )
}

export default UpdateCategory