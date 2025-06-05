import { ArrowLeft, Banknote, Barcode, Blocks, Boxes, CircleAlert, Group, Shapes, Tag } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/useAuthStore';
import toast from 'react-hot-toast';
import "./AddProduct.css"
import useCategoryStore from '../../store/useCategoryStore';
import useProductStore from '../../store/useProductStore';
import { checkProductFormData } from '../../utils/checkFormData';
import { CircularProgress } from '@mui/material';
import AddUpdateHeader from '../AddUpdateHeader';
import ProductForm from './components/ProductForm';

const AddProduct = () => {
    const {isProcessing} = useAuthStore();
    const {categories, getCategories} = useCategoryStore();
    const {addProduct} = useProductStore();
    const [selectedImage, setSelectedImage] = useState(null);

    const [formData, setFormData] = useState({
        barcode: "",
        name: "",
        price: "",
        unit: "",
        stock: "",
        stockNorm: "",
        image: "",
        note: "",
        categoryId: "",
        categoryName: ""
    });
    const navigate = useNavigate();

    useEffect(() => {
        getCategories()
    }, [getCategories]);

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

        const validationResult = checkProductFormData(formData);
        if (validationResult){
            toast.error(validationResult);
            return;
        }

        await addProduct(formData);
        navigate("/product");
    };

  return (
    <div className='add-product'>
        <div className="add-product-title">
            <AddUpdateHeader 
                onReturn="/product"
                headerTitle="Thêm sản phẩm"
            />
        </div>
        

        <div className="add-product-section">
            <ProductForm 
                formData={formData}
                onInputChange={setFormData}
                categories={categories}
                selectedImage={selectedImage}
                onUploadImage={handleImage}
                onSubmit={handleSubmit}
            />
        </div>
        
    </div>
  )
}

export default AddProduct