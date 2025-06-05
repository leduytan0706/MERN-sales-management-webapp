import React from 'react'
import useImportStore from '../../store/useImportStore'
import DeleteCard from '../DeleteCard';

const DeleteImport = (props) => {
  const {deleteImport, selectedImport} = useImportStore();

  return (
    <DeleteCard 
      itemId={selectedImport?.id} 
      text="phiếu nhập"
      onDelete={deleteImport}
    />
  )
}

export default DeleteImport