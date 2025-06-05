import React from 'react'
import "./ProductsTable.css";
import { NavLink, useNavigate } from 'react-router-dom';
import { SquarePen, Trash2 } from 'lucide-react';
import useAuthStore from '../../../store/useAuthStore';
import DeleteProduct from '../DeleteProduct';
import useProductStore from '../../../store/useProductStore';
import checkPermission from '../../../utils/checkPermission'

const ProductsTable = ({displayedProducts}) => {
    const navigate = useNavigate();
    const {authUser} = useAuthStore();


    const handleDeleteClick = (selectedProduct) => {
        if (!checkPermission(authUser.roles, ['inventory','manager'])){
            toast.error("Bạn không có quyền thực hiện chức năng này.");
            return;
        }
        useProductStore.setState({selectedProduct: selectedProduct})
        useAuthStore.setState({
            isDeleteMode: true
        });
    };

  return (
    <table className='product-table'>
        <thead>
            <tr className='product-table-header'>
                <th>STT</th>
                <th>Ảnh</th>
                <th>Tên sản phẩm</th>
                <th>Danh mục</th>
                <th>Đơn giá</th>
                <th>Đơn vị</th>
                <th>Tồn</th>
                <th style={{justifyContent: 'center'}}>Actions</th>
            </tr>
        </thead>
        <tbody>
        {displayedProducts?.map((product,index) => (
            <tr 
                key={index}
                className='product-table-data'
                onClick={() => {
                    navigate('/product/'+product.id);
                }}
            >
                <td>{index+1}</td>
                <td>
                    <img 
                    src={`${product.image || "/image-holder2.svg"}`} 
                    alt={`${product.name} image`} 
                    />
                </td>
                <td>{product.name.length > 35? product.name.slice(0,35)+"...": product.name}</td>
                <td>{product.category?.name}</td>
                <td>{product.price}</td>
                <td>{product.unit}</td>
                <td>{product.stock}</td>
                <td 
                    className='product-item-action'
                    onClick={(e) => {
                    e.stopPropagation();
                    }}
                >
                    <NavLink 
                    className='product-item-btn edit-btn'
                    to={`/product/update/${product.id}`}
                    >
                        <SquarePen
                            className='product-item-icon'
                        /> 
                    </NavLink>
                    <button className='product-item-btn delete-btn'>
                        <Trash2
                            className='product-item-icon' 
                            onClick={() => {
                                handleDeleteClick(product);
                            }}                    
                        />
                    </button>
                </td>
            </tr>
        ))}
        </tbody>
    </table>
  )
}

export default ProductsTable