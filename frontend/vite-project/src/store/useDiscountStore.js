
import { create } from "zustand";
import useAuthStore from "./useAuthStore";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

const useDiscountStore = create((set, get) => ({
    discounts: [],
    selectedDiscount: null,
    sortAndFilter: {
        searchTerm: "",
        sortCriteria: "",
        sortOrder: "asc",
    },

    getDiscounts: async () => {
        useAuthStore.setState({isLoadingPage: true});
        try {
            const res = await axiosInstance.get("/discount");
            set({discounts: res.data});
        } catch (error) {
            console.log(`Error in getDiscounts: ${error.message}`);
            if (error.response){
                toast.error(error.response.data.message);
            }
            else {
                toast.error(error.message);
            }
        } finally{
            useAuthStore.setState({isLoadingPage: false});
        }
    },

    getDiscountById: async (discountId) => {
        useAuthStore.setState({isLoadingPage: true});
        // console.log(discountId);
        try {
            const res = await axiosInstance.get(`/discount/${discountId}`);
            if (!res.data){
                set({selectedDiscount: null});
            }
            else {
                set({selectedDiscount: res.data});
            }
            
        } catch (error) {
            console.log(`Error in getDiscountById: ${error.message}`);
            if (error.response){
                toast.error(error.response.data.message);
            }
            else {
                toast.error(error.message);
            }
        } finally{
            useAuthStore.setState({isLoadingPage: false});
        }
    },

    getProductDiscount: async (productId, quantity) => {
        useAuthStore.setState({isProcessing: true});
        let productDiscount;
        try {
            const res = await axiosInstance.get(`/discount?productId=${productId}&quantity=${quantity}`);
            if (res.data.productDiscount){
                productDiscount = res.data.productDiscount;
            }
            else {
                productDiscount = 0;
            }
        } catch (error) {
            console.log(`Error in getProductAmount: ${error.message}`);
            if (error.response){
                toast.error(error.response.data.message);
            }
            else {
                toast.error(error.message);
            }
            productDiscount = 0;
        } finally{
            useAuthStore.setState({isProcessing: false});
            return productDiscount;
        }
    },

    getOrderDiscount: async (code, order) => {
        useAuthStore.setState({isProcessing: true});
        let orderDiscount;
        try {
            const res = await axiosInstance.post("/discount/order", {
                code,
                order
            });
            if (res.data.orderDiscount){
                orderDiscount = res.data.orderDiscount;
            }
            else {
                orderDiscount = 0;
            }
        } catch (error) {
            console.log(`Error in getOrderAmount: ${error.message}`);
            if (error.response){
                toast.error(error.response.data.message);
            }
            else {
                toast.error(error.message);
            }
            orderDiscount = 0;
        } finally{
            useAuthStore.setState({isProcessing: false});
            return orderDiscount;
        }
    },

    addDiscount: async (formData) => {
        useAuthStore.setState({isProcessing: true});
        const {discounts} = get();
        try {
            const res = await axiosInstance.post("/discount/new", {discountData: formData});
            if (res.data) {
                if (discounts.length > 0){
                    set({discounts: [...discounts, res.data]});
                }
                else {
                    set({discounts: [res.data]});
                }
                
            }
            toast.success("Thêm chương trình giảm giá thành công!");
        } catch (error) {
            console.log(`Error in addDiscount: ${error.message}`);
            if (error.response){
                toast.error(error.response.data.message);
            }
            else {
                toast.error(error.message);
            }
        } finally{
            useAuthStore.setState({isProcessing: false});
        }
    },

    updateDiscount: async (formData) => {
        useAuthStore.setState({isProcessing: true});
        const {discounts, selectedDiscount} = get();
        try {
            const res = await axiosInstance.post("/discount/update/"+selectedDiscount.id, {discountData: formData});
            const updatedDiscounts = discounts.filter(discount => discount.id !== selectedDiscount.id);
            if (res.data) {
                if (updatedDiscounts.length > 0){
                    set({discounts: [...updatedDiscounts, res.data]});
                }
                else {
                    set({discounts: [res.data]});
                }
                toast.success("Cập nhật chương trình giảm giá thành công!");
            }
            
        } catch (error) {
            console.log(`Error in updateDiscount: ${error.message}`);
            if (error.response){
                toast.error(error.response.data.message);
            }
            else {
                toast.error(error.message);
            }
        } finally{
            useAuthStore.setState({isProcessing: false});
            set({selectedDiscount: null});
        }
    },

    deleteDiscount: async (discountId) => {
        useAuthStore.setState({isProcessing: true});
        const {discounts} = get();
        try {
            const res = await axiosInstance.delete(`/discount/delete/${discountId}`);
            const updatedDiscounts = discounts.filter(discount => discount.id !== discountId);
            set({discounts: updatedDiscounts});
            toast.success("Xóa chương trình giảm giá thành công!");
        } catch (error) {
            console.log(`Error in deleteDiscount: ${error.message}`);
            if (error.response){
                toast.error(error.response.data.message);
            }
            else {
                toast.error(error.message);
            }
        } finally{
            useAuthStore.setState({isProcessing: false});
            set({selectedDiscount: null});
        }
    }

}));

export default useDiscountStore;