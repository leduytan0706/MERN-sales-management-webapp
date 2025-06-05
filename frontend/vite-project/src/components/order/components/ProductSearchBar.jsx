import React from 'react'
import "./ProductSearchBar.css"
import { Search } from 'lucide-react';

const ProductSearchBar = ({searchTerm, onSearchChange}) => {

  return (
    <div className='product-search-bar'>
        <label htmlFor="searchProduct" className='search-label'>
        <Search className='search-icon'/>
        <input 
            type="text"
            id="searchProduct" 
            name="searchProduct" 
            placeholder="Nhập tên sản phẩm hoặc mã vạch"
            value={searchTerm} 
            onChange={(e) => {
                onSearchChange(e.target.value);
            }}
        />
        </label>
    </div>
  )
}

export default ProductSearchBar