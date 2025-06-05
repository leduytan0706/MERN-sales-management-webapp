import {create} from 'zustand';
import useAuthStore from './useAuthStore';
import axiosInstance from '../lib/axios';
import toast from 'react-hot-toast';
import formateDateVn from '../utils/formatDate';

const useAnalyticStore = create((set, get) => ({
    overviewData: {
        yesterdayRevenue: null,
        yesterdayOrders: null,
        yesterdayCost: null,
        lowStockProducts: null,
        salesData: [],
        categorySalesData: [],
        topProducts: []
    },
    reportsData: null,

    getOverviewData: async () => {
        useAuthStore.setState({isProcessing: true});
        try {
            const res = await axiosInstance.get("/reports/overview");
            const data = res.data;
            console.log(data);
            set({
                overviewData: {
                    yesterdayRevenue: data.yesterdayRevenue,
                    yesterdayOrders: data.yesterdayOrders,
                    yesterdayCost: data.yesterdayCost,
                    lowStockProducts: data.lowStockProducts,
                    salesData: data.salesData.map(sales => ({
                        date: formateDateVn(sales._id),
                        sales: sales.totalAmount
                    })),
                    categorySalesData: data.categorySalesData.map(sales => ({
                        name: sales.name,
                        sales: sales.totalAmount
                    })),
                    topProducts: data.topProducts,
                }
            });
        } catch (error) {
            console.log(`Error in getOverviewData: ${error.message}`);
            if (error.response){
                toast.error(error.response.data.message);
            }
            else {
                toast.error(error.message);
            }
            set({
                overviewData: {
                    yesterdayRevenue: null,
                    yesterdayOrders: null,
                    yesterdayCost: null,
                    lowStockProducts: null,
                    salesData: [],
                    categorySalesData: [],
                    topProducts: []
                }
            });
        } finally {
            useAuthStore.setState({isProcessing: false});
        }
    },

    getReportsData: async (formData) => {
        useAuthStore.setState({isProcessing: true});
        if (!formData) {
            toast('Thông tin nhập không hợp lệ!', {
                icon: '⚠️'
            });
            return;
        }
        try {
            const res = await axiosInstance.post("/reports",{reportForm: formData});
            set({
                reportsData: res.data
            });
        } catch (error) {
            console.log(`Error in getReportsData: ${error.message}`);
            if (error.response){
                toast.error(error.response.data.message);
            }
            else {
                toast.error(error.message);
            }
        } finally {
            useAuthStore.setState({isProcessing: false});
        }
    },
}));

export default useAnalyticStore;