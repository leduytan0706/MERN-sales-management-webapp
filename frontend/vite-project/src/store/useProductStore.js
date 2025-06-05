import { create } from "zustand";
import toast from "react-hot-toast";
import axiosInstance from "../lib/axios";
import useAuthStore from "./useAuthStore";
import sortList from "../utils/sortList";


const useProductStore = create((set, get) => ({
    products: [],
    sortedAndFilteredProducts: [],
    selectedProduct: null,
    sortAndFilter: {
        isFiltered: false,
        search: "",
        sortCriteria: "",
        sortOrder: "asc",
        minPrice: "",
        maxPrice: "",
        minStock: "",
        maxStock: "",
        categoryId: ""
    },
    
    getProducts: async () => {
        useAuthStore.setState({isProcessing: true});
        try {
            const res = await axiosInstance.get('/product');
            set({products: res.data});
            // console.log(res.data);
        } catch (error) {
            console.log(`Error in getProducts: ${error.message}`);
            set({products: []});
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

    getProductById: async (productId) => {
        useAuthStore.setState({isProcessing: true});
        console.log(productId);
        let foundProduct;
        try {
            const res = await axiosInstance.get('/product/'+productId);
            set({selectedProduct: res.data});
            // console.log(res.data);
            foundProduct = res.data;
        } catch (error) {
            console.log(`Error in getProductById: ${error.message}`);
            set({selectedProduct: null});
            if (error.response){
                toast.error(error.response.data.message);
            }
            else {
                toast.error(error.message);
            }
        } finally {
            useAuthStore.setState({isProcessing: false});
        } 
        return foundProduct;   
    },

    searchProducts: async (searchTerm) => {
        useAuthStore.setState({isProcessing: true});
        console.log(searchTerm);
        try {
            const res = await axiosInstance.get("/product/search?searchTerm="+searchTerm);
            const searchResult = res.data;
            set({sortedAndFilteredProducts: searchResult});
        } catch (error) {
            console.log(`Error in getProducts: ${error.message}`);
            set({sortedAndFilteredProducts: []});
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

    sortProducts: (sortData) => {
        const {products} = get();
        set({sortedAndFilteredProducts: sortList(products, sortData)});
    },

    filterProducts: async () => {
        const {sortAndFilter} = get();
        useAuthStore.setState({isProcessing: true});
        try {
            const res = await axiosInstance.post("/product/filter", {filterData: sortAndFilter});
            const searchResult = res.data;
            if (searchResult.length <= 0){
                set({sortedAndFilteredOrders: []});
                toast.error("Không tìm thấy sản phẩm.");
            }
            else {
                set({
                    sortedAndFilteredProducts: searchResult,
                    sortAndFilter: {
                        ...sortAndFilter,
                        isFiltered: true
                    }
                });
            }
        } catch (error) {
            console.log(`Error in filterProducts: ${error.message}`);
            set({sortedAndFilteredProducts: []});
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

    clearFilter: () => {
        const updatedSortAndFilter = {   
            isFiltered: false,
            search: "",
            sortCriteria: "",
            sortOrder: "asc",
            minPrice: "",
            maxPrice: "",
            minStock: "",
            maxStock: "",
            categoryId: ""
        };
        set({
            sortedAndFilteredProducts: [],
            sortAndFilter: updatedSortAndFilter
        });
    },

    addProduct: async (formData) => {
        useAuthStore.setState({isProcessing: true});
        const {products} = get();
        try {
            const res = await axiosInstance.post('/product/new', formData);
            set({products: [...products, res.data]});
            toast.success('Thêm sản phẩm thành công!');
        } catch (error) {
            console.log(`Error in addProduct: ${error.message}`);
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

    addProductsFromUpload: async (productData) => {
        useAuthStore.setState({isProcessing: true});
        const {products} = get();
        try {
            const res = await axiosInstance.post('/product/new-upload', {productData});
            set({products: [...products,...res.data]});
            toast.success('Thêm sản phẩm từ file thành công!');
        } catch (error) {
            console.log(`Error in addProductsFromUpload: ${error.message}`);
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

    updateProduct: async (formData) => {
        useAuthStore.setState({isProcessing: true});
        const {products} = get();
        try {
            const productId = formData.id;
            const res = await axiosInstance.post('/product/update/'+productId, formData, {
                headers: { 'Content-Type': 'application/json' }
            });
            const updatedProducts = products.filter(product => product.id !== productId);
            set({products: [...updatedProducts, res.data]});
            toast.success('Cập nhật sản phẩm thành công!');
        } catch (error) {
            console.log(`Error in updateProduct: ${error.message}`);
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

    deleteProduct: async (productId) => {
        useAuthStore.setState({isProcessing: true});
        const {products} = get();
        try {
            const res = await axiosInstance.delete('/product/delete/'+productId);
            const updatedProducts = products.filter(product => product.id != productId);
            set({products: updatedProducts});
            toast.success('Supplier deleted successfully!');
        } catch (error) {
            console.log(`Error in deleteProduct: ${error.message}`);
            if (error.response){
                toast.error(error.response.data.message);
            }
            else {
                toast.error(error.message);
            }
        } finally{
            useAuthStore.setState({isProcessing: false});
        }
    }
}));

export default useProductStore;