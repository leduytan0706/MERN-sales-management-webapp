import React from 'react'
import "./ProductFilterForm.css";
import useProductStore from '../../../store/useProductStore';
import { Filter, FilterX, Minus } from 'lucide-react';

const ProductFilterForm = ({categories, onFormSubmit}) => {
    const {sortAndFilter} = useProductStore();

  return (
    <form action="" onSubmit={onFormSubmit} className='product-filter-form'>
        <div className='filter-field'>
            <label htmlFor='categoryId' className='filter-label filter-dropdown'>
            <span>Lọc:{' '}</span>
            <select 
                id="categoryId" 
                name="categoryId" 
                className='filter-category'
                onClick={(e) => useProductStore.setState({sortAndFilter: {...sortAndFilter, categoryId: e.target.value}})}
            >
                <option value="" defaultValue>Chọn danh mục</option>
                {categories.map((category) => (
                <option key={category[0]} value={category[0]}>{category[1]}</option>
                ))}
            </select>
            </label>
        </div>
        <div className="filter-field">
            <span className='align-center'>Giá:{' '}</span>
            <label htmlFor="minPrice" className='filter-label'>
            <input 
                type="number" 
                name="minPrice"
                id="minPrice"
                className='filter-input'
                value={sortAndFilter.minPrice}
                onChange={(e) => useProductStore.setState({sortAndFilter: {...sortAndFilter, minPrice: e.target.value}})}
            />
            </label>
            <Minus className='filter-icon'/>
            <label htmlFor="maxPrice" className='filter-label'>
            <input 
                type="number" 
                name="maxPrice"
                id="maxPrice"
                className='filter-input'
                value={sortAndFilter.maxPrice}
                onChange={(e) => useProductStore.setState({sortAndFilter: {...sortAndFilter, maxPrice: e.target.value}})}
            />
            </label>
        </div>
        <div className="filter-field">
            <span className='align-center'>Tồn:{' '}</span>
            <label htmlFor="minStock" className='filter-label'>
            <input 
                type="number" 
                name="minStock"
                id="minStock"
                className='filter-input'
                value={sortAndFilter.minStock}
                onChange={(e) => useProductStore.setState({sortAndFilter: {...sortAndFilter, minStock: e.target.value}})}
            />
            </label>
            <Minus className='filter-icon'/>
            <label htmlFor="maxStock" className='filter-label'>
            <input 
                type="number" 
                name="maxStock"
                id="maxStock"
                className='filter-input'
                value={sortAndFilter.maxStock}
                onChange={(e) => useProductStore.setState({sortAndFilter: {...sortAndFilter, maxStock: e.target.value}})}
            />
            </label>
        </div>
        <div className="filter-submit">
            <button
                type="submit"
                className='filter-btn'
            >
            {sortAndFilter.isFiltered? (
            <>
                <FilterX className='filter-icon' /> 
                Bỏ lọc
            </>
            
            ) : (
            <>
                <Filter className='filter-icon' /> 
                Lọc
            </>
            )}
            
            </button>
        </div>
    </form>
  )
}

export default ProductFilterForm