import React, { useEffect } from 'react'
import './ProductDetail.css'
import { ArrowLeft } from 'lucide-react'
import { NavLink, useParams } from 'react-router-dom'
import useProductStore from '../../store/useProductStore'
import AddUpdateHeader from '../AddUpdateHeader'

const ProductDetail = () => {
    const {id} = useParams();
    const {getProductById, selectedProduct} = useProductStore();

    useEffect(() => {
      const getProductDetail = async () => {
        if (id) {
          await getProductById(id);
        }
      };
      getProductDetail();
    }, [id])

    
  return (
    <div className='product-detail'>
        <AddUpdateHeader 
          onReturn="/product"
          headerTitle="Chi tiết sản phẩm"
        />
        
        <div className="detail-section">
            <div className="basic-info">
              <div className="product-card">
                <h3>Mã vạch</h3>
                <h4>{selectedProduct?.barcode}</h4>
              </div>
              <div className="product-card">
                <h3>Tên sản phẩm</h3>
                <h4>{selectedProduct?.name}</h4>
              </div>
              <div className="product-card">
                <h3>Đơn giá</h3>
                <h4>{selectedProduct?.price}</h4>
              </div>
              <div className="product-card">
                <h3>Đơn vị tính</h3>
                <h4>{selectedProduct?.unit}</h4>
              </div>
              <div className="product-card">
                <h3>Số lượng tồn</h3>
                <h4>{selectedProduct?.stock}</h4>
              </div>
              <div className="product-card">
                <h3>Định mức tồn</h3>
                <h4>{selectedProduct?.stockNorm}</h4>
              </div>
              <div className="product-card category-info">
                <h3>Danh mục</h3>
                <h4>{selectedProduct?.category?.name}</h4>
              </div>
            </div>
            <div className='added-info'>
              <div className="product-card product-image">
                <h3>Ảnh</h3>
                <img 
                  src={`${selectedProduct?.image || "/hao-hao.png"}`} 
                  alt="" 
                />
              </div>
              <div className="product-card">
                <h3>Ghi chú</h3>
                <h4>{selectedProduct?.note}</h4>
              </div>
            </div>
            {/*
            <h3>
                Supplied Products
            </h3>
            <div className="detail-products">
                {products.length === 0? (
                <h3>No products found.</h3>
                ):(
            <table>
                <thead>
                    <tr className='detail-table-header'>
                        <th>No</th>
                        <th>Image</th>
                        <th>Product Name</th>
                        <th>Price</th>
                        <th>Note</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product,index) => (
                    <tr 
                        key={index}
                        className='detail-table-data'
                    >
                        <td>{index+1}</td>
                        <td>
                            <img 
                                src={`${product.image || '/hao-hao.png'}`} 
                                alt=""
                            />
                        </td>
                        <td>{product.name}</td>
                        <td>{product.price}</td>
                        <td>{product.note}</td>
                    </tr>
                    ))}
                </tbody>
            </table>
            )}
            </div>
            */}
        </div>
        
    </div>
    )
}

export default ProductDetail