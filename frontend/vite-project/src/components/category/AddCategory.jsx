import React, {useState} from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import './AddCategory.css'
import { ArrowLeft, Shapes } from 'lucide-react';
import useCategoryStore from '../../store/useCategoryStore';
import toast from 'react-hot-toast';
import CircularProgress from '@mui/material/CircularProgress';
import useAuthStore from '../../store/useAuthStore';
import AddUpdateHeader from '../AddUpdateHeader';

const AddCategory = (props) => {
    const {isProcessing} = useAuthStore();
    const {addCategory} = useCategoryStore();
    const [formData, setFormData] = useState({
            name: ''
    });
    const navigate = useNavigate();


    
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || formData.name.length === 0){
            toast.error("Category name is required");
            return;
        }

        await addCategory(formData);
        navigate("/category");
    };

  return (
    <div className='add-category'>
        <AddUpdateHeader 
            headerTitle="Thêm danh mục"
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
                        placeholder='Ví dụ: Đồ ăn vặt' 
                        className='input-field'
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({...prev, name: e.target.value}))}
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
                        'Thêm mới'
                    )}
                </button>
            </div>
        </form>
    </div>
  )
}

export default AddCategory