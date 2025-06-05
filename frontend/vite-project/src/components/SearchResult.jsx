import React, { useEffect, useRef } from 'react'
import "./SearchResult.css"
import useProductStore from '../store/useProductStore';

const SearchResult = ({onClose, searchTerm, onProductClick}) => {
    const searchRef = useRef(null);
    const {sortedAndFilteredProducts, products} = useProductStore();

    useEffect(() => {
        function handleClickOutside(e) {
        if (searchRef.current && !searchRef.current.contains(e.target)) {
            onClose(); // Close the dropdown
        }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);


    const searchResult = sortedAndFilteredProducts.length > 0? sortedAndFilteredProducts: products;

  return (
    <div 
        ref={searchRef}
        className='search-result-section'
    >
    {searchResult?.length !== 0 && (
        <ul className='search-result-list'>
            <li className='search-result-term'>
                Search Results for {`${searchTerm?.length === 0? "": "\""+searchTerm+"\""}`}
            </li>
        {searchResult?.map((product,index) => (
            <li 
            key={index}
            className="search-result-item"
            onClick={() => {
                onProductClick(product.id);
            }}  
            >
            
            <div className="search-result-title">
                <div className="search-result-img">
                <img src={`${product.image || "/image-holder2.svg"}`} alt="" />
                </div>
                <div className="search-result-id">
                <h4>{product.name}</h4>
                <h5>Barcode: {product.barcode}</h5>
                </div>
                
            </div>
            <div className="search-result-info">
                <h4>{product.price.toLocaleString()}đ</h4>
                <h5>In Stock: {product.stock}</h5>
            </div>
            </li>
        ))}
        </ul>
    )}
    </div>
  )
}

export default SearchResult