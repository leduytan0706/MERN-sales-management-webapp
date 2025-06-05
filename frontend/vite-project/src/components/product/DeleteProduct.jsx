import React from 'react'
import DeleteCard from '../DeleteCard';
import { useParams } from 'react-router-dom';
import useProductStore from '../../store/useProductStore';

const DeleteProduct = () => {
  const {deleteProduct, selectedProduct} = useProductStore();

  return (
    <DeleteCard 
      itemId={selectedProduct?.id}
      text="sản phẩm"
      onDelete={deleteProduct}
    />
  )
}

export default DeleteProduct