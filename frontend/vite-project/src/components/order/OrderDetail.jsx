import React, { useEffect } from 'react'
import {NavLink, useParams} from 'react-router-dom'
import useOrderStore from '../../store/useOrderStore';
import useAuthStore from '../../store/useAuthStore';
import { ArrowLeft, Printer } from 'lucide-react';
import "./OrderDetail.css"
import { CircularProgress } from '@mui/material';
import { formatDateForDetail } from '../../utils/formatTime';

const OrderDetail = () => {
  const {id} = useParams();
  const {isLoadingPage} = useAuthStore();
  const {getOrderById, selectedOrder, selectedItems} = useOrderStore();

  useEffect(() => {
    getOrderById(id);
  }, [id]);


  if (isLoadingPage) {
    return <CircularProgress color="primary" />;
  }

  return (
    <div className='order-detail'>
      <div className="detail-header">
        <div className='detail-title'>
          <NavLink
              className='back-btn'
              to="/order"
          >
              <ArrowLeft />
          </NavLink>
          <h1>Chi tiết đơn hàng</h1>
        </div>
        <div className='print-section'>
          <button className='print-btn'>
            <Printer className='print-icon' />
            <span>In</span>
          </button>
        </div>
      </div>
      <div className="detail-section">
        <div className="added-info">
          <div className="detail-card">
            <h3>
              Tên Khách Hàng
            </h3>
            <h4>{selectedOrder?.customerName?.length === 0? "Guest": selectedOrder?.customerName}</h4>
          </div>
          <div className="detail-card">
            <h3>
              Ngày Tạo
            </h3>
            <h4>{formatDateForDetail(selectedOrder?.createdAt)}</h4>
          </div>
          <div className="detail-card">
            <h3>
              Số Mặt Hàng
            </h3>
            <h4>{selectedOrder?.itemQuantity}</h4>
          </div>
          <div className="detail-card">
            <h3>
              Tổng Số Lượng
            </h3>
            <h4>{selectedOrder?.totalItem}</h4>
          </div>
          <div className="detail-card note">
            <h3>
              Ghi chú
            </h3>
            <h4>{selectedOrder?.note}</h4>
          </div>
        </div>
        <div className="item-info">
          <h3 className="item-info-title">Chi Tiết Mặt Hàng</h3>
          <table className='item-info-table'>
            <thead>
              <tr className='item-info-head'>
                <th className='align-left'>STT</th>
                <th className='align-left'>Tên Sản Phẩm</th>
                <th className='align-left'>Đơn vị</th>
                <th className='align-right'>Đơn Giá</th>
                <th className='align-right'>Số Lượng</th>
                <th className='align-right'>Thành Tiền</th>
              </tr>
            </thead>
            <tbody>
              {selectedItems?.length <= 0? (
                <tr>
                  <td colSpan='6'>Chưa có sản phẩm nào trong hóa đơn này.</td>
                </tr>
              ) : (
                selectedItems?.map((item, index) => (
                  <tr 
                    key={index}
                    className='item-info-data'
                  >
                    <td className='align-left'>{index + 1}</td>
                    <td className='align-left'>{item.product.name}</td>
                    <td className='align-left'>{item.product.unit}</td>
                    <td className='align-right'>{item.product.price.toLocaleString()}đ</td>
                    <td className='align-right'>{item.productQuantity}</td>
                    <td className='align-right'>{(item.product.price * item.productQuantity).toLocaleString()}đ</td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot>
              <tr className='item-info-foot'>
                <td></td>
                <td className='item-info-checkout'>
                  <span>Thành tiền:</span>
                  <span>{selectedOrder?.totalAmount?.toLocaleString()}đ</span>
                </td>
              </tr>
              <tr className='item-info-foot'>
                <td></td>
                <td className='item-info-checkout'>
                  <span>Khuyến mãi:</span>
                  <span>{selectedOrder?.discountAmount?.toLocaleString()}đ</span>
                </td>
              </tr>
              <tr className='item-info-foot'>
                <td></td>
                <td className='item-info-checkout'>
                  <span>Tổng tiền:</span>
                  <span>{(selectedOrder?.totalAmount-selectedOrder?.discountAmount).toLocaleString()}đ</span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  )
}

export default OrderDetail