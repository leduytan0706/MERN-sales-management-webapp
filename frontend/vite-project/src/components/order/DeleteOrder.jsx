import React from 'react'
import useOrderStore from '../../store/useOrderStore'
import DeleteCard from '../DeleteCard';

const DeleteOrder = (props) => {
  const {deleteOrder, selectedOrder} = useOrderStore();

  return (
    <DeleteCard 
      itemId={selectedOrder?.id}
      text="đơn hàng"
      onDelete={deleteOrder}
    />
  )
}

export default DeleteOrder