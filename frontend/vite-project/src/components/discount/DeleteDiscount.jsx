import React from 'react'
import useDiscountStore from '../../store/useDiscountStore';
import DeleteCard from '../DeleteCard';

const DeleteDiscount = () => {
  const {deleteDiscount, selectedDiscount} = useDiscountStore();

  return (
    <DeleteCard 
        itemId={selectedDiscount?.id}
        onDelete={deleteDiscount}
        text="chương trình khuyến mại"
    />
  )
}

export default DeleteDiscount