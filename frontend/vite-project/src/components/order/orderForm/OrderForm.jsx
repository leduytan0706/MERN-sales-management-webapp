import React from 'react'
import {NavLink, useNavigate} from "react-router-dom";
import "./OrderForm.css"
import OrderTabBar from './OrderTabBar';
import OrderFormItems from './OrderFormItems';
import OrderFormCheckout from './OrderFormCheckout';
import useOrderStore from '../../../store/useOrderStore';
import { X } from 'lucide-react';

const OrderForm = ({onInputChange, onRemoveItem, onSubmit, activeOrder, submitTitle, isAddMode, onDiscountCodeChange}) => {
    const {newOrders, activeOrderId, addOrderTab, removeOrderTab, removeOrderItem, removeAddedOrder} = useOrderStore();
    const navigate = useNavigate();
    
    
  
    return (
    <form action="" onSubmit={onSubmit} className='order-form'>
        <div className="order-form-header">
            <OrderTabBar 
                newOrders={isAddMode? newOrders: [{...activeOrder}]}
                activeOrderId={isAddMode? activeOrderId: activeOrder.orderId}
                onRemoveTab={removeOrderTab}
                onAddTab={addOrderTab}
                isAddMode={isAddMode}
            />
            <div className="close-btn">
                <button 
                    type="button"
                    className="close-navlink"
                    onClick={() => {
                        removeAddedOrder();
                        navigate("/order");

                    }}>
                    <X  className='close-icon'/>
                </button>
            </div>
        </div>
        <div className='order-form-info'>
            <OrderFormItems 
                activeOrder={activeOrder}
                onRemoveItem={isAddMode? removeOrderItem: onRemoveItem}
                onInputChange={onInputChange}
            />
            <OrderFormCheckout 
                activeOrder={activeOrder}
                onInputChange={onInputChange}
                submitTitle={submitTitle}
                onDiscountCodeChange={onDiscountCodeChange}
            />
        </div>
    </form>
  )
}

export default OrderForm