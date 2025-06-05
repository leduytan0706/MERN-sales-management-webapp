import { ArrowLeft, Banknote, Barcode, Blocks, Boxes, CircleAlert, Group, Shapes, Tag } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import useAuthStore from '../../store/useAuthStore';
import toast from 'react-hot-toast';
import "./UpdateProduct.css"
import useCategoryStore from '../../store/useCategoryStore';
import useProductStore from '../../store/useProductStore';
import { checkProductFormData } from '../../utils/checkFormData';
import LoadingSpinner from "../../components/LoadingSpinner";
import AddUpdateHeader from '../AddUpdateHeader';
import ProductForm from './components/ProductForm';

const UpdateProduct = () => {
    const {id} = useParams();
    const {isProcessing, isLoadingPage} = useAuthStore();
    const {categories, getCategories} = useCategoryStore();
    const {getProductById, selectedProduct, updateProduct} = useProductStore();
    const [selectedImage, setSelectedImage] = useState(null);
    const [formData, setFormData] = useState({
        id: id,
        barcode: selectedProduct?.barcode,
        name: selectedProduct?.name,
        price: selectedProduct?.price,
        unit: selectedProduct?.unit,
        stock: selectedProduct?.stock,
        stockNorm: selectedProduct?.stockNorm,
        image: selectedProduct?.image,
        note: selectedProduct?.note,
        categoryId: selectedProduct?.category?.id
    });
    const navigate = useNavigate();

    useEffect(() => {
        getCategories();
        getProductById(id);
    }, [id]);

    useEffect(() => {
        if (selectedProduct) {
            setFormData({
                id: selectedProduct?.id,
                barcode: selectedProduct?.barcode,
                name: selectedProduct?.name,
                price: selectedProduct?.price,
                unit: selectedProduct?.unit,
                stock: selectedProduct?.stock,
                stockNorm: selectedProduct?.stockNorm,
                image: selectedProduct?.image,
                note: selectedProduct?.note,
                categoryId: selectedProduct?.category?.id
            });
        }
    }, [selectedProduct])

    
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

        await updateProduct(formData);
        navigate("/product");
    };

    if (isLoadingPage) {
        return <LoadingSpinner />
    }

  return (
    <div className='update-product'>
        <div className="update-product-title">
            <AddUpdateHeader 
                onReturn="/product"
                headerTitle="Cập nhật sản phẩm"
            />
        </div>
        <div className="update-product-section">
            <ProductForm 
                onUploadImage={handleImage}
                formData={formData}
                onInputChange={setFormData}
                categories={categories}
                selectedImage={selectedImage}
                onSubmit={handleSubmit}
            />
        </div>
    </div>
  )
}

export default UpdateProduct