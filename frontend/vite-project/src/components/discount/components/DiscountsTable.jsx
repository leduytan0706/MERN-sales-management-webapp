import React from 'react'
import "./DiscountsTable.css";
import PageTable from '../../PageTable';
import useDiscountStore from '../../../store/useDiscountStore';
import checkPermission from '../../../utils/checkPermission';
import useAuthStore from '../../../store/useAuthStore';
import toast from 'react-hot-toast';

const DiscountsTable = ({displayedDiscounts}) => {
  const {authUser} = useAuthStore();

  const handleDeleteClick = (selectedDiscount) => {
    if (!checkPermission(authUser.roles, ['sales','manager'])){
        toast.error("Bạn không có quyền thực hiện chức năng này.");
        return;
    }
    useDiscountStore.setState({selectedDiscount: selectedDiscount});
    useAuthStore.setState({
        isDeleteMode: true
    });
  };

  return (
    <div className='discount-table'>
      <PageTable 
        onDeleteClick={handleDeleteClick}
        pageData={displayedDiscounts || []}
        tableHeaders={tableHeaders}
        tableCellsAlignedLeft={["Tên chương trình", "Mã chương trình"]}
        tableRowStyle={{
          display: "grid",
          gridTemplateColumns: "auto 25% 10% 25% 25% 10%"
        }}
        pageName={"discount"}
        rowHoverable={true}
      />
    </div>
  )
}

const tableHeaders = [
  {
    title: "Tên chương trình",
    value: "name"
  },
  {
    title: "Mã chương trình",
    value: "code"
  },
  {
    title: "Ngày bắt đầu",
    value: "createdAt"
  },
  {
    title: "Ngày kết thúc",
    value: "endDate"
  }
];

export default DiscountsTable