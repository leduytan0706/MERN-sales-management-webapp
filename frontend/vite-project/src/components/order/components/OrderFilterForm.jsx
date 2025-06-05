import React from 'react'
import useOrderStore from '../../../store/useOrderStore'
import "./OrderFilterForm.css"
import { Filter, FilterX, Minus } from 'lucide-react';

const OrderFilterForm = ({onFormSubmit}) => {
    const {sortAndFilter} = useOrderStore();

  return (
    <form action="" onSubmit={onFormSubmit} className='order-filter-form'>
        <div className='filter-field align-left date-field'>
            <span className='align-left filter-name'>Ngày:{' '}</span>
            <label htmlFor="startDate" className='filter-label'>
                <input 
                    type="date" 
                    name="startDate"
                    id="startDate"
                    className='filter-input-date'
                    value={sortAndFilter.startDate}
                    onChange={(e) => useOrderStore.setState({sortAndFilter: {...sortAndFilter, startDate: e.target.value}})}
                />
            </label>
            <span className="align-center">
                <Minus className='filter-icon'/>
            </span>
            
            <label htmlFor="endDate" className='filter-label'>
                <input 
                    type="date" 
                    name="endDate"
                    id="endDate"
                    className='filter-input-date'
                    value={sortAndFilter.endDate}
                    onChange={(e) => useOrderStore.setState({sortAndFilter: {...sortAndFilter, endDate: e.target.value}})}
                />
            </label>
        </div>
        <div className="filter-field align-left">
            <span className='align-center filter-name'>Số mặt hàng:{' '}</span>
            <label htmlFor="minItemQuantity" className='filter-label'>
                <input 
                    type="number" 
                    name="minItemQuantity"
                    id="minItemQuantity"
                    className='filter-input-number'
                    value={sortAndFilter.minItemQuantity}
                    onChange={(e) => useOrderStore.setState({sortAndFilter: {...sortAndFilter, minItemQuantity: e.target.value}})}
                />
            </label>
            <span className="align-center">
                <Minus className='filter-icon'/>
            </span>
            <label htmlFor="maxItemQuantity" className='filter-label'>
                <input 
                    type="number" 
                    name="maxItemQuantity"
                    id="maxItemQuantity"
                    className='filter-input-number'
                    value={sortAndFilter.maxItemQuantity}
                    onChange={(e) => useOrderStore.setState({sortAndFilter: {...sortAndFilter, maxItemQuantity: e.target.value}})}

                />
            </label>
        </div>
        <div className="filter-field align-left">
            <span className='align-center filter-name'>Tổng tiền:{' '}</span>
            <label htmlFor="minTotalAmount" className='filter-label'>
                <input 
                    type="number" 
                    name="minTotalAmount"
                    id="minTotalAmount"
                    className='filter-input-number'
                    value={sortAndFilter.minTotalAmount}
                    onChange={(e) => useOrderStore.setState({sortAndFilter: {...sortAndFilter, minTotalAmount: e.target.value}})}

                />
            </label>
            <span className='align-center'>
                <Minus className='filter-icon'/>
            </span>
            
            <label htmlFor="maxTotalAmount" className='filter-label'>
                <input 
                    type="number" 
                    name="maxTotalAmount"
                    id="maxTotalAmount"
                    className='filter-input-number'
                    value={sortAndFilter.maxTotalAmount}
                    onChange={(e) => useOrderStore.setState({sortAndFilter: {...sortAndFilter, maxTotalAmount: e.target.value}})}

                />
            </label>
        </div>
        <div className="filter-submit align-right">
            <button
                type="submit"
                className='filter-btn'
            >
            {sortAndFilter.isFiltered? (
            <>
                <FilterX className='filter-icon' /> 
                Bỏ lọc/sắp xếp
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

export default OrderFilterForm