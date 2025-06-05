import React from 'react'
import {X, Plus, Minus} from "lucide-react"
import "./OrderFormItems.css"
import shortenText from '../../../utils/shortenText'

const OrderFormItems = ({activeOrder, onRemoveItem, onInputChange}) => {
  return (
    <div className="order-form-items">
        <div className='h-break'></div>
        <table className='order-items-table'>
            <thead>
                <tr className='order-items-header'>
                    <th></th>
                    <th className='align-left'>STT</th>
                    <th className='align-left'>Tên Sản Phẩm</th>
                    <th className='align-left'>Đơn vị</th>
                    <th className='align-right'>Đơn Giá</th>
                    <th className='align-right'>Số Lượng</th>
                    <th className='align-right'>Giảm giá</th>
                    <th className='align-right'>Thành tiền</th>
                </tr>
            </thead>
            <tbody>
                {activeOrder?.items?.length > 0 && activeOrder?.items?.map((item, index) => (
                <tr 
                    key={index}
                    className='order-items-data'
                >

                    <td className='rm-item-btn align-left'>
                    <X  
                        className='rm-item-icon' 
                        onClick={() => {
                            onRemoveItem(item.product.id);
                        }}
                    />
                    </td>
                    <td className='align-left'>{index+1}</td>
                    <td className='align-left'>{shortenText(item.product.name, 20)}</td>
                    <td className='align-left'>{item.product.unit}</td>
                    <td className='align-right'>{item.product.price.toLocaleString()}</td>
                    <td className='align-right item-quantity-data'>
                    <Minus 
                        className='item-quantity-btn'
                        onClick={() => onInputChange("item", item.product.id, "", item.productQuantity - 1)}
                    />
                    <input 
                        type="number" 
                        min="0"
                        placeholder="0" 
                        value={item.productQuantity > 0? item.productQuantity: ""} 
                        className='item-quantity-input' 
                        onChange={(e) => onInputChange("item", item.product.id, "", e.target.value)}
                    />
                    <Plus 
                        className='item-quantity-btn'
                        onClick={() => onInputChange("item", item.product.id, "", item.productQuantity + 1)}
                    />
                    </td>
                    <td className='align-right'>{item.itemDiscount.toLocaleString() || 0}</td>
                    <td className='align-right'>{(item.itemDiscount? item.itemTotal - item.itemDiscount: item.itemTotal).toLocaleString()}</td>
                </tr>
                ))}
                
            </tbody>
        </table>
        <div className='h-break'></div>
    </div>
  )
}

export default OrderFormItems