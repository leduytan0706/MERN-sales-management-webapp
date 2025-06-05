import React from 'react'
import { formatDateForInput } from '../../../utils/formatTime'
import "./OrderFormCheckout.css"
import { CircularProgress } from '@mui/material'
import useAuthStore from '../../../store/useAuthStore'

const OrderFormCheckout = ({activeOrder, onInputChange, submitTitle, onDiscountCodeChange}) => {
    const {isProcessing} = useAuthStore();
  
    return (
    <div className="order-form-checkout">
        <div className="order-added-info">
            <div className='order-form-field'>
                <label htmlFor="discountCode" className='order-form-label order-form-code'>
                    Mã giảm giá:
                    <div className='align-left code-input'>
                        <input 
                            type="text"
                            name="discountCode" 
                            id="discountCode" 
                            placeholder="Mã giảm giá"
                            className='order-form-input input-text'
                            value={activeOrder?.discountCode}
                            onChange={(e) => onInputChange("data", "", "discountCode", e.target.value)}
                        />
                        <button 
                            type='button'
                            className='discount-code-btn'
                            onClick={onDiscountCodeChange}
                        >
                            Áp dụng
                        </button>
                    </div>
                    
                </label>
            </div>
            <div className='order-form-field'>
                <label htmlFor="customerName" className='order-form-label'>
                Tên khách hàng:
                <input 
                    type="text"
                    name="customerName" 
                    id="customerName" 
                    placeholder="Tên khách hàng"
                    className='order-form-input input-text'
                    value={activeOrder?.customerName}
                    onChange={(e) => onInputChange("data", "", "customerName", e.target.value)}
                />
                </label>
            </div>
            <div className='order-form-field'>
                <label htmlFor="orderDate" className='order-form-label'>
                Ngày tạo:
                <input 
                    type="date" 
                    name="orderDate" 
                    id="orderDate" 
                    className='order-form-input input-date'
                    value={formatDateForInput(activeOrder?.orderDate)}
                    onChange={(e) => onInputChange("data", "", "orderDate", e.target.value)}
                />
                </label>
            </div>
            <div className='order-form-field'>
                <label htmlFor="note" className='order-form-label'>
                Ghi chú
                <textarea 
                    type="text" 
                    name="note" 
                    id="note" 
                    placeholder='Ghi chú tại đây'
                    className='order-form-input input-textarea'
                    value={activeOrder?.note}
                    onChange={(e) => onInputChange("data", "", "note", e.target.value)}
                >

                </textarea>
                </label>
            </div>
        </div>
        <div className="order-total-info">
            <table className='order-total-table'>
                <tbody>
                    <tr className='order-total-data'>
                        <td className='align-left'>Thành tiền:</td>
                        <td className='align-right'>{activeOrder?.totalAmount?.toLocaleString()}đ</td>
                    </tr>
                    <tr className='order-total-data'>
                        <td className='align-left'>Khuyến mãi:</td>
                        <td className='align-right checkout-cell'>
                        <input 
                            type="number" 
                            name="discountAmount" 
                            placeholder="0" 
                            id="discountAmount" 
                            className='checkout-input input-number' 
                            value={activeOrder?.discountAmount}
                            onChange={(e) => onInputChange("data", "", "discountAmount", e.target.value)}
                        />
                        <span>đ</span>
                        </td>
                    </tr>
                    <tr className='order-total-data'>
                        <td className='align-left'>Tổng tiền:</td>
                        <td className='align-right'>{(activeOrder?.totalAmount - activeOrder?.discountAmount).toLocaleString()}đ</td>
                    </tr>
                    <tr className='order-total-data'>
                        <td className='align-left'>Thanh toán:</td>
                        <td className='align-right checkout-cell'>
                        <input 
                            type="number" 
                            name="paymentAmount" 
                            placeholder="0" 
                            id="paymentAmount" 
                            className='checkout-input input-number' 
                            value={activeOrder?.paymentAmount}
                            onChange={(e) => onInputChange("data", "", "paymentAmount", e.target.value)}
                        />
                        <span>đ</span>
                        </td>
                    </tr>
                    <tr className='order-total-data'>
                        <td className='align-left'>Tiền thừa:</td>
                        <td className='align-right'>{(activeOrder?.paymentAmount > 0? activeOrder?.paymentAmount - (activeOrder?.totalAmount - activeOrder?.discountAmount): 0).toLocaleString()}đ</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div className='order-form-submit'>
            <button className="order-btn print-btn">
                In Hóa Đơn
            </button>
            <button 
                className={`order-btn ${activeOrder?.isAdded? "order-added": "add-btn"}`}
                disabled={activeOrder?.isAdded}
            >
                {isProcessing? (
                <CircularProgress size={20} />
                ): (
                    submitTitle
                )}
            </button>
        </div>
    </div>
  )
}

export default OrderFormCheckout