import React, { useEffect } from 'react'
import './HomePage.css'
import { NavLink } from 'react-router-dom'
import { BadgeDollarSign } from 'lucide-react'
import useAnalyticStore from '../store/useAnalyticStore'
import useAuthStore from '../store/useAuthStore'
import LoadingSpinner from '../components/LoadingSpinner'
import {CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Text, Tooltip, XAxis, YAxis} from "recharts";
import DataTable from '../components/DataTable'

const HomePage = () => {
  const {isLoadingPage} = useAuthStore();
  const {overviewData, getOverviewData} = useAnalyticStore();

  useEffect(() => {
    getOverviewData();
  }, []);

  const pieChartColors = overviewData?.categorySalesData?.map(() => getRandomColor());


  if (isLoadingPage || !overviewData){
    return <LoadingSpinner />;
  }


  return (
    <div className='dashboard'>
      <div className='dashboard-header'>
        <div className='dashboard-header-title align-left'>
          Tổng quan
        </div>
        <div className='dashboard-header-action align-right'>
          <NavLink 
            className='dashboard-action-button order align-center'
            to='/order/new'
          >
            Thêm đơn hàng
          </NavLink>
          <NavLink 
            className='dashboard-action-button import align-center'
            to='/import/new'
          >
            Thêm phiếu nhập
          </NavLink>
          <NavLink 
            className='dashboard-action-button product align-center'
            to='/product/new'
          >
            Thêm sản phẩm
          </NavLink>
        </div>
      </div>
      <div className='dashboard-content'>
        
        <div className='overview-card'>
          <div className='overview-title'>
            <BadgeDollarSign className='overview-icon'/>
            <span>Doanh thu hôm qua</span>
          </div>
          <div className="overview-number">
            <span>{overviewData?.yesterdayRevenue?.toLocaleString() || 0}</span>
          </div>
        </div>
        <div className='overview-card'>
          <div className='overview-title'>
            <BadgeDollarSign className='overview-icon'/>
            <span>Số đơn hàng hôm qua</span>
          </div>
          <div className="overview-number">
            <span>{overviewData?.yesterdayOrders?.toLocaleString() || 0}</span>
          </div>
        </div>
        <div className='overview-card'>
          <div className='overview-title'>
            <BadgeDollarSign className='overview-icon'/>
            <span>Chi phí nhập hôm qua</span>
          </div>
          <div className="overview-number">
            <span>{overviewData?.yesterdayCost?.toLocaleString() || 0}</span>
          </div>
        </div>
        <div className='overview-card'>
          <div className='overview-title'>
            <BadgeDollarSign className='overview-icon'/>
            <span>Số lượng hàng tồn thấp</span>
          </div>
          <div className="overview-number">
            <span>{overviewData?.lowStockProducts?.length.toLocaleString() || 0}</span>
          </div>
        </div>
        <div className="overview-card revenue-graph">
          <div className="overview-title">
            <BadgeDollarSign className='overview-icon'/>
            <span>Tổng quan doanh thu trong 14 ngày qua</span>
          </div>
          <div className="overview-graph">
            <ResponsiveContainer width={"100%"} height={"100%"}>
              <LineChart width={"100%"} height={"100%"} data={overviewData.salesData}>
                <CartesianGrid strokeDasharray='3 3' stroke='#485563'/>
                <XAxis dataKey="date"/>
                <YAxis stroke='#9ca3af'/>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: 'none',
                    padding: '10px',
                    borderRadius: '4px',
                  }}
                  itemStyle={{color: 'rgba(255, 255, 255, 0.8}'}}
                />
                <Line 
                  type={'monotone'}
                  dataKey="sales"
                  stroke='#3178C6'
                  strokeWidth={3}
                  dot={{fill: "#3178C6", strokeWidth: 2, r: 6}}
                  activeDot={{r: 8, strokeWidth: 2}}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="overview-card categories-graph">
          <div className="overview-title">
            <BadgeDollarSign className='overview-icon'/>
            <span>Tổng quan doanh thu 14 ngày qua theo danh mục hàng</span>
          </div>
          <div className="overview-graph">
            <ResponsiveContainer width={"100%"} height={"100%"}>
              <PieChart >
                  <Pie 
                    data={overviewData?.categorySalesData}
                    cx={"50%"}
                    cy={"50%"}
                    labelLine={true}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey={"sales"}
                    label={({name, percent}) => `${(percent * 100).toFixed(0)}%`}
                  >
                    <Text
                      scaleToFit={true}
                    />
                    {overviewData?.categorySalesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={pieChartColors[index]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(0, 0, 0, 0.9)',
                      border: 'none',
                      padding: '10px',
                      borderRadius: '4px',
                    }}
                    itemStyle={{
                      color: 'rgba(255, 255, 255, 0.8)'
                    }}
                  />
                  <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="overview-card top-products">
          <div className="overview-title">
            <BadgeDollarSign className='overview-icon'/>
            <span>Sản phẩm bán chạy trong 14 ngày qua</span>
          </div>
          <div className="overview-table">
            <DataTable 
              tableHeaders={tableHeaders}
              tableData={overviewData.topProducts}
              tableRowStyle={{
                display: "grid",
                gridTemplateColumns: "auto 10% 40% 10% 10% 20%",
              }}
              tableCellAlignedLeft={["Ảnh","Tên sản phẩm","Đơn vị"]}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

const getRandomColor = () => {
  const r = Math.floor(Math.random() * 150); // Giới hạn từ 0 đến 150
  const g = Math.floor(Math.random() * 150);
  const b = Math.floor(Math.random() * 150);
  return `rgb(${r},${g},${b})`;
};

const tableHeaders = [
  {
    title: "Ảnh",
    value: "image"
  },
  {
    title: "Tên sản phẩm",
    value: "name"
  },
  {
    title: "Đơn vị",
    value: "unit"
  },
  {
    title: "Doanh số",
    value: "totalSold"
  },
  {
    title: "Doanh thu",
    value: "totalAmount"
  }
];


export default HomePage