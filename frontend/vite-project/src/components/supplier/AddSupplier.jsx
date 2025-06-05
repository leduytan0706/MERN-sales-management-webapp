import { ArrowLeft, LetterText, MapPinHouse, Phone, Shapes } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import useSupplierStore from '../../store/useSupplierStore';
import useAuthStore from '../../store/useAuthStore';
import toast from 'react-hot-toast';
import "./AddSupplier.css"
import useCategoryStore from '../../store/useCategoryStore';
import { checkSuppplierFormData } from '../../utils/checkFormData';
import CircularProgress from '@mui/material/CircularProgress';
import AddUpdateHeader from '../AddUpdateHeader';


const AddSupplier = () => {
    const {isProcessing} = useAuthStore();
    const {addSupplier} = useSupplierStore();
    const [selectedImage, setSelectedImage] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        address: "",
        image: "",
        note: ""
    });
    const navigate = useNavigate();

    const handleImage = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        // create a file reader
        const reader = new FileReader();

        // read file into image url
        reader.readAsDataURL(file);

        reader.onload = async () => {
            // get the result from the file reader
            const base64Image = reader.result;

            setSelectedImage(base64Image);

            // update form data with the new image
            setFormData({...formData, image: base64Image });
        };
    }

    
    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationResult = checkSuppplierFormData(formData);
        if (validationResult){
            toast.error(validationResult)
            return;
        }

        await addSupplier(formData);
        navigate("/supplier");
    };

  return (
    <div className='add-supplier'>
        <AddUpdateHeader 
            onReturn="/supplier"
            headerTitle="Thêm nhà cung cấp"
        />
        
        <form action="" className='add-supplier-form'>
            <div
                className='input-section'
            >
                <div className="form-field">
                    <label htmlFor="name" className='input-label'>Tên nhà cung cấp
                        <div className='form-input'>
                            <LetterText className='form-icon' />
                            <input 
                                type="text" 
                                id='name' 
                                name='name' 
                                placeholder='Ví dụ: Sơn Trang' 
                                className='input-field'
                                value={formData.name}
                                onChange={(e) => setFormData((prev) => ({...prev, name: e.target.value}))}
                            />
                        </div> 
                    </label> 
                </div>

                <div className="form-field">
                    <label htmlFor="phone" className='input-label'>Số điện thoại
                        <div className='form-input'>
                            <Phone className='form-icon' />
                            <input 
                                type="text" 
                                id='phone' 
                                name='phone' 
                                placeholder='Ví dụ: 0123456789' 
                                className='input-field'
                                value={formData.phone}
                                onChange={(e) => setFormData((prev) => ({...prev, phone: e.target.value}))}
                            />
                        </div> 
                    </label> 
                </div>

                <div className="form-field address-field">
                    <label htmlFor="address" className='input-label'>Địa chỉ
                        <div className='form-input address-input'>
                            <MapPinHouse className='form-icon' />
                            <input 
                                type="text" 
                                id='address' 
                                name='address' 
                                placeholder='Ví dụ: Hà Nội' 
                                className='input-field'
                                value={formData.address}
                                onChange={(e) => setFormData((prev) => ({...prev, address: e.target.value}))}
                            />
                        </div>  
                    </label>
                </div>

                <div className="form-field">
                    <label htmlFor="image" className='input-label'>Ảnh đại diện
                        <div className='form-input image-input'>
                            <input 
                                type="file" 
                                id='image' 
                                name='image' 
                                placeholder='E.q: Bread' 
                                className='input-field'
                                style={{display: "none"}}
                                onChange={handleImage}
                                disabled={isProcessing}
                            />
                            <img 
                                src={selectedImage || "/image-holder2.svg"}
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
                                rows={9}
                                cols={80}
                                onChange={(e) => setFormData((prev) => ({...prev, note: e.target.value}))}
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

export default AddSupplier