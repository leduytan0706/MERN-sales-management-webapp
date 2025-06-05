import React from 'react'

import useCategoryStore from '../../store/useCategoryStore'
import DeleteCard from '../DeleteCard'

const DeleteCategory = (props) => {
    const {deleteCategory, selectedCategory} = useCategoryStore();

  return (
    <DeleteCard 
        itemId={selectedCategory?.id}
        onDelete={deleteCategory}
        text="danh mục"
    />
  )
}

export default DeleteCategory