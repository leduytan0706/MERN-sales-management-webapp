import { Filter, FilterX, Minus } from 'lucide-react'
import React from 'react'
import useImportStore from '../../../store/useImportStore'
import "./ImportFilterForm.css"

const ImportFilterForm = ({onFormSubmit, suppliers}) => {
    const {clearFilter, sortAndFilter} = useImportStore();

  return (
    <form action="" onSubmit={onFormSubmit} className='import-filter-form'>
        <div className='filter-supplier align-left'>
            <label htmlFor='supplierId' className='filter-label filter-dropdown'>
                <span>Lọc:{' '}</span>
                <select 
                    id="supplierId" 
                    name="supplierId" 
                    className='filter-input'
                    value={sortAndFilter.supplierId}
                    onChange={(e) => useImportStore.setState({sortAndFilter: {...sortAndFilter, supplierId: e.target.value}})}
                >
                    <option value="" defaultValue>Chọn nhà cung cấp</option>
                    {suppliers?.length > 0 && suppliers?.map(supplier => (
                    <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                    ))}
                </select>
            </label>
        </div>
        <div className="filter-field align-center">
            <span className='filter-name align-center'>Ngày tạo:{' '}</span>
            <label htmlFor="startDate" className='filter-label'>
                
                <input 
                    type="date" 
                    name="startDate"
                    id="startDate"
                    className='filter-input'
                    value={sortAndFilter.startDate}
                    onChange={(e) => useImportStore.setState({sortAndFilter: {...sortAndFilter, startDate: e.target.value}})}
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
                    className='filter-input'
                    value={sortAndFilter.endDate}
                    onChange={(e) => useImportStore.setState({sortAndFilter: {...sortAndFilter, endDate: e.target.value}})}
                />
            </label>
        </div>
        <div className="filter-field align-center">
            <span className='filter-name align-center'>Số Mặt Hàng:{' '}</span>
            <label htmlFor="minProductQuantity" className='filter-label'>
                
                <input 
                    type="number" 
                    name="minProductQuantity"
                    id="minProductQuantity"
                    className='filter-input'
                    value={sortAndFilter.minProductQuantity}
                    onChange={(e) => useImportStore.setState({sortAndFilter: {...sortAndFilter, minProductQuantity: e.target.value}})}
                />
            </label>
            <span className="align-center">
                <Minus className='filter-icon'/>
            </span>
            <label htmlFor="maxStock" className='filter-label'>
                <input 
                    type="number" 
                    name="maxStock"
                    id="maxStock"
                    className='filter-input'
                    value={sortAndFilter.maxProductQuantity}
                    onChange={(e) => useImportStore.setState({sortAndFilter: {...sortAndFilter, maxProductQuantity: e.target.value}})}
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
                Bỏ lọc
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

export default ImportFilterForm