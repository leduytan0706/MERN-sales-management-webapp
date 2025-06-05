import React, { useEffect, useState } from 'react'
import DataTable from '../DataTable';
import useAnalyticStore from '../../store/useAnalyticStore';
import getReportsTotal from '../../utils/getReportsTotal';

const tableHeaders = [
    {
        title: "Ngày",
        value: "_id"
    },
    {
        title: "Số lượng",
        value: "totalQuantity"
    },
    {
        title: "Doanh thu",
        value: "totalAmount"
    }
];

const ReportsTable = ({reportType}) => {
    const {reportsData} = useAnalyticStore();
    const [reportsTotal, setReportsTotal] = useState();

    useEffect(() => {
        if (reportsData) {
            setReportsTotal(getReportsTotal(reportsData));
        }
    },[reportsData])

    if (reportType == "cost"){
        tableHeaders[2].title = "Chi phí";
    }
    else if (reportType == "sales"){
        tableHeaders[2].title = "Doanh số";
    }

  return (
    <DataTable 
        tableHeaders={tableHeaders}
        tableFootTitle={reportType === "sales"? "Tổng doanh thu": "Tổng chi phí"}
        tableData={reportsData}
        tableCellAlignedLeft={["Ngày"]}
        tableRowStyle={{
            display: "grid",
            gridTemplateColumns: "auto 50% 20% 20%",
        }}
        showTotal={true}
        totalData={reportsTotal}
        tableFootStyle={{
            display: "grid",
            gridTemplateColumns: "auto 50% 20% 20%"
        }}
    />
  )
};



export default ReportsTable