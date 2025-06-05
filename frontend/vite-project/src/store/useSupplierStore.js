import {create} from 'zustand'
import axiosInstance from '../lib/axios'
import useAuthStore from './useAuthStore';
import toast from 'react-hot-toast'

const useSupplierStore = create((set,get) => ({
    suppliers: [],
    selectedSupplier: null,
    sortedAndFilteredSuppliers: [],
    sortAndFilter: {
        searchTerm: "",
        sortField: "",
        sortOrder: "",
    },

    getSuppliers: async () => {
        useAuthStore.setState({isProcessing: true});
        try {
            const res = await axiosInstance.get('/supplier');
            set({suppliers: res.data});
            // console.log(res.data);
        } catch (error) {
            console.log(`Error in getSuppliers: ${error.message}`);
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

    getSupplierById: (supplierId) => {
        const {suppliers} = get();
        return suppliers.find(supplier => supplier.id === supplierId);
    },

    getProductsForSupplier: async () => {
        // fetch products for supplier
        useAuthStore.setState({isProcessing: true});
        const {selectedSupplier} = get();
        try {
            const res = await axiosInstance.get('/products/supplier/'+selectedSupplier.id);
            set({supplierProducts: res.data});
        } catch (error) {
            console.log(`Error in getProductsForSupplier: ${error.message}`);
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

    sortSuppliers: (sortData) => {
        const {suppliers} = get();
        set({sortedAndFilteredSuppliers: sortList(suppliers, sortData)});
    },

    searchSuppliers: (searchTerm) => {
        const {suppliers} = get();
        set({sortedAndFilteredSuppliers: suppliers.filter(supplier => supplier.name.toLowerCase().includes(searchTerm.toLowerCase()))});
    },

    addSupplier: async (formData) => {
        useAuthStore.setState({isProcessing: true});
        const {suppliers} = get();
        try {
            const res = await axiosInstance.post('/supplier/new', formData);
            set({suppliers: [...suppliers, res.data]});
            toast.success('Supplier added successfully!');
        } catch (error) {
            console.log(`Error in addSupplier: ${error.message}`);
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

    updateSupplier: async (formData) => {
        useAuthStore.setState({isProcessing: true});
        const {suppliers} = get();
        try {
            const supplierId = formData.id;
            const res = await axiosInstance.patch('/supplier/update/'+supplierId, formData);
            const updatedSuppliers = suppliers.filter(supplier => supplier.id !== supplierId);
            set({suppliers: [...updatedSuppliers, res.data]});
            toast.success('Supplier updated successfully!');
        } catch (error) {
            console.log(`Error in updateSupplier: ${error.message}`);
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

    deleteSupplier: async (supplierId) => {
        useAuthStore.setState({isProcessing: true});
        const {suppliers} = get();
        try {
            const res = await axiosInstance.delete('/supplier/delete/'+supplierId);
            const updatedSuppliers = suppliers.filter(supplier => supplier.id != supplierId);
            set({suppliers: updatedSuppliers});
            toast.success('Supplier deleted successfully!');
        } catch (error) {
            console.log(`Error in deleteSupplier: ${error.message}`);
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

export default useSupplierStore;