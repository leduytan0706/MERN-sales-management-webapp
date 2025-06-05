import React from 'react'
import "./ProductSearchResult.css"
import useOrderStore from '../../../store/useOrderStore';
import useProductStore from '../../../store/useProductStore';
import toast from 'react-hot-toast';
import LoadingSpinner from "../../LoadingSpinner"

const ProductSearchResult = ({searchTerm, onProductClick}) => {
    const {products, sortedAndFilteredProducts} = useProductStore();

    const searchResult = sortedAndFilteredProducts.length > 0? sortedAndFilteredProducts: products;

  return (
    <div className='product-search-result'>
        {searchTerm.length > 0 && (
        <div className='result-title'>
            <h5>Search results for "{searchTerm}"</h5>
        </div>
        )}
        <div className='product-list'>
        {searchResult?.length > 0 ? searchResult?.map((product, index) => (
        <div 
            key={index}
            className="product-card"
            onClick={() => onProductClick(product.id)}
        >
            <div className='product-image'>
                <img src={product.image || "/image-holder2.svg"} alt="" />
                <div className='product-price'>
                <h4>{product.price.toLocaleString()}đ</h4>
                </div>
            </div>
            <div className="product-info">
                <div className='product-name'>
                    {product.name}
                </div>
                <div className='product-barcode'>
                    Mã vạch: {product.barcode}
                </div>
            </div>
        </div>
        )) : (
            <LoadingSpinner />
        )}
        
        </div>
    </div>
  )
}

export default ProductSearchResult