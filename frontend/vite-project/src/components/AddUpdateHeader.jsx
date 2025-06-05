import React from 'react'
import "./AddUpdateHeader.css"
import { NavLink } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

const AddUpdateHeader = ({onReturn, headerTitle}) => {
  return (
    <div className="add-header">
      <div className='add-title'>
        <NavLink
            className='back-btn'
            onClick={() => navigate(-1)}
        >
            <ArrowLeft />
        </NavLink>
        <h1>{headerTitle}</h1>
      </div>
    </div>
  )
}

export default AddUpdateHeader