import React from 'react'
import "./SortForm.css"
import { ArrowDownAZ, ArrowDownUp, ArrowUpZA } from 'lucide-react'
import useImportStore from '../store/useImportStore'

const SortForm = ({onFormSubmit, sortAndFilter, useStore, criterias}) => {
  return (
    <form action="" className='sort-form' onSubmit={onFormSubmit}>
      <label htmlFor='sortCriteria' className='sort-dropdown'>
        <span>Sắp xếp:{' '}</span>
        <select 
          id="sort-criteria" 
          name="sortCriteria"
          value={sortAndFilter?.sortCriteria}
          onChange={(e) => useStore?.setState({sortAndFilter: {...sortAndFilter, sortCriteria: e.target.value}})}
        >
          <option value="" defaultValue>Chọn tiêu chí</option>
          {criterias?.map((criteria, index) => (
            <option key={index} value={criteria.value}>{criteria.label}</option>
          ))}
        </select>
      </label>
      <label htmlFor="sort-order-asc" className='sort-radio'>
        <input 
          type="radio" 
          name="sortOrder"
          id="sort-order-asc"
          className='sort-radio-input'
          value="asc"
          defaultChecked
          onClick={(e) => useStore?.setState({sortAndFilter: {...sortAndFilter, sortOrder: e.target.value}})}
        />
        <ArrowDownAZ className='sort-icon'  />
      </label>
      <label htmlFor="sort-order-desc" className='sort-radio'>
        <input 
          type="radio" 
          name="sortOrder"
          id="sort-order-desc"
          className='sort-radio-input'
          value="desc"
          onClick={(e) => useStore?.setState({sortAndFilter: {...sortAndFilter, sortOrder: e.target.value}})}
        />
        <ArrowUpZA className='sort-icon' />
      </label>
      <div className='sort-submit'>
        <button
          type="submit"
          className='sort-btn'
          
        >
          <ArrowDownUp className='sort-icon' />
          Sắp xếp
        </button>
      </div>
    </form>
  )
}

export default SortForm