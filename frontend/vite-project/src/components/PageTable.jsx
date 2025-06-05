import { SquarePen, Trash2 } from 'lucide-react';
import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import "./PageTable.css"
import { formatDateForDetail } from '../utils/formatTime';
import isValidISODate from "../utils/isValidISODate";

const PageTable = ({onDeleteClick, pageData, tableHeaders, tableCellsAlignedLeft, tableRowStyle, pageName, rowHoverable}) => {
    const navigate = useNavigate();
    
    return (
    <table className='page-table'>
        <thead>
            <tr className='page-table-header' style={tableRowStyle}>
                <th className='align-left'>STT</th>
                {tableHeaders?.map((header, index) => (
                    <th
                        key={index}
                        className={tableCellsAlignedLeft?.some(title => header.title == title)? "align-left" : (header.title.toLowerCase().includes("ngày")? "align-center": "align-right")}
                    >
                        {header.title}
                    </th>
                ))}
                <th style={{textAlign: 'center'}}>Thao tác</th>
            </tr>
        </thead>
        <tbody>
        {pageData?.length > 0 && pageData?.map((data,index) => (
            <tr 
                key={index}
                className={`page-table-data ${rowHoverable? "page-table-data-hovered": ""}`}
                style={tableRowStyle}
                onClick={() => {
                    if (rowHoverable){
                        navigate(`/${pageName}/${data.id}`);
                    }
                }}
            >
                <td className='align-left'>{index+1}</td>
                {tableHeaders?.map((header,index) => (
                    <td
                        key={index}
                        className={tableCellsAlignedLeft?.some(title => header.title == title)? "align-left" : (isValidISODate(data[header.value])? "align-center": "align-right")}
                    >
                        {isValidISODate(data[header.value])? formatDateForDetail(data[header.value]): data[header.value]}
                    </td>
                ))}
                <td className='page-item-action align-center'>
                    <NavLink
                        className='page-item-btn edit-btn'
                        to={`/${pageName}/update/${data.id}`}
                        onClick={(e) => {
                            e.stopPropagation();
                        }} 
                    >
                    <SquarePen 
                        className='page-item-icon'
                    /> 
                    </NavLink>
                    <button className='page-item-btn delete-btn'>
                    <Trash2 
                        className='page-item-icon' 
                        onClick={(e) => {
                            e.stopPropagation();
                            onDeleteClick(data);
                        }}                   
                    />
                    </button>
                </td>
            </tr>
        ))}
        </tbody>
    </table>
  )
}

export default PageTable