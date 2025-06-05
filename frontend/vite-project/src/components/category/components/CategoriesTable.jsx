import React from 'react'
import { formatDateForDetail } from '../../../utils/formatTime';
import { NavLink } from 'react-router-dom';
import { SquarePen, Trash2 } from 'lucide-react';
import useAuthStore from '../../../store/useAuthStore';
import DeleteCategory from '../DeleteCategory';
import "./CategoriesTable.css"
import useCategoryStore from '../../../store/useCategoryStore';
import checkPermission from '../../../utils/checkPermission'
import PageTable from '../../PageTable';

const CategoriesTable = ({displayedCategories}) => {
    const {authUser} = useAuthStore();


    const handleDeleteClick = (selectedCategory) => {
        if (!checkPermission(authUser.roles, ['inventory','manager'])){
            toast.error("Bạn không có quyền thực hiện chức năng này.");
            return;
        }
        useCategoryStore.setState({selectedCategory: selectedCategory})
        useAuthStore.setState({
            isDeleteMode: true
        });
    };

  return (
    <PageTable 
        onDeleteClick={handleDeleteClick}
        pageData={displayedCategories}
        tableHeaders={tableHeaders}
        tableCellsAlignedLeft={["Tên danh mục"]}
        pageName="category"
        tableRowStyle={{
            display: "grid",
            gridTemplateColumns: "auto 40% 15% 20% 20%",

        }}
    />
  )
}

const tableHeaders = [
    {
        title: "Tên danh mục",
        value: "name"
    },
    {
        title: "Số lượng",
        value: "product_quantity"
    },
    {
        title: "Ngày tạo",
        value: "createdAt"
    }
]

export default CategoriesTable