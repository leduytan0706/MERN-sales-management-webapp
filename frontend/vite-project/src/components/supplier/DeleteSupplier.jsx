import React from 'react'
import useAuthStore from '../../store/useAuthStore'
import useSupplierStore from '../../store/useSupplierStore'
import DeleteCard from '../DeleteCard'

const DeleteSupplier = () => {
    const { deleteSupplier, selectedSupplier } = useSupplierStore();

  return (
    <DeleteCard 
        itemId={selectedSupplier?.id}
        onDelete={deleteSupplier}
        text="nhà cung cấp"
    />
  )
}

export default DeleteSupplier