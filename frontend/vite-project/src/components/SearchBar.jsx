import React from 'react'
import "./SearchBar.css"
import { Search } from 'lucide-react';

const SearchBar = ({searchPlaceholder, searchTerm, onSearchChange}) => {
  return (
    <div className="search-section">
        <input 
            type="text" 
            placeholder={searchPlaceholder}
            className='search-input'
            id="search-input"
            name="search-input"
            value={searchTerm}
            onChange={(e) => {
                onSearchChange(e.target.value);
            }}
        />
        <button
            type="button"
            className='search-btn'
        >
            <Search className='search-icon' />
        </button>
    </div>
  )
}

export default SearchBar