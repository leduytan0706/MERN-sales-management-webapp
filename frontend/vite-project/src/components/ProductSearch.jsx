import React, { useEffect, useState } from 'react'
import "./ProductSearch.css"
import { Search } from 'lucide-react';
import useDebounce from "../lib/useDebounce";
import useProductStore from '../store/useProductStore';
import SearchResult from './SearchResult';

const ProductSearch = ({onProductClick, onClose, onInputFocus, isOpen}) => {
    const {searchProducts, sortedAndFilteredProducts, products} = useProductStore();
    const [searchTerm, setSearchTerm] = useState("");
    
    const debouncedSearch = useDebounce(searchTerm);


    useEffect(() => {
        const loadSearchResult = async () => {
            if (searchTerm.length <= 0){
                return;
            }
            await searchProducts(debouncedSearch);

        };
        loadSearchResult();
    }, [debouncedSearch]);
    

    const handleSelectProduct = async (productId) => {
        await onProductClick(productId);
        setSearchTerm("");
        onClose();
    };

    
  return (
    <div className="product-search">
        <div className='search-bar'>
            <div className="search-field align-left">
                <label htmlFor="searchProduct" className='search-label'>
                    <Search className='search-icon' />
                    <input 
                    type="text" 
                    id="searchProduct" 
                    name="searchProduct" 
                    placeholder="Nhập tên sản phẩm hoặc mã vạch" 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => {
                        onInputFocus();
                    }}
                    className="search-input"
                    />
                </label>
            </div>
        <div className='clear-section align-center'>
            <button
                type="button"
                onClick={() => setSearchTerm("")}
                className='clear-btn'
            >
            Clear Search
            </button>
        </div>
        <div className='search-result'>
            {isOpen && (
            <SearchResult 
                searchTerm={searchTerm}
                onProductClick={handleSelectProduct}
                onClose={onClose}
            />
            )}
        </div>
        
        
        
        </div>
        
    </div>
  )
}

export default ProductSearch