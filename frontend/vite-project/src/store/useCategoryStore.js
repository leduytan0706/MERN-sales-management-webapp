import { create } from "zustand";
import axiosInstance from "../lib/axios";
import useAuthStore from "./useAuthStore";
import toast from "react-hot-toast";
import sortList from "../utils/sortList";


const useCategoryStore = create((set, get) => ({
    categories: [],
    sortedAndFilteredCategories: [],
    selectedCategory: null,
    sortAndFilter: {
        searchTerm: "",
        sortCriteria: "",
        sortOrder: "asc"
    },

    getCategories: async () => {
        useAuthStore.setState({isLoadingPage: true});
        try {
            const res = await axiosInstance.get('/category');
            set({categories: res.data});
            console.log(res.data);
        } catch (error) {
            console.log(`Error in getCategories: ${error.message}`);
            set({categories: []});
            if (error.response){
                toast.error(error.response.data.message);
            }
            else {
                toast.error(error.message);
            }
        }   finally {
            useAuthStore.setState({isLoadingPage: false});

        }
    },

    getCategoryById: (categoryId) => {
        const {categories} = get();
        return categories.find(category => category.id === categoryId);
    },

    sortCategories: (sortData) => {
        const {categories} = get();
        set({sortedAndFilteredCategories: sortList(categories, sortData)});
    },

    searchCategories: (searchTerm) => {
        console.log(searchTerm);
        const {categories} = get();
        set({sortedAndFilteredCategories: categories.filter(category => category.name.toLowerCase().includes(searchTerm.toLowerCase()))});
    },

    addCategory: async (formData) =>{
        set({isProcessing: true});
        const {categories} = get();
        // setTimeout(() => {
        //     set({isAddingCategory: false});
        // },3000);
        try {
            const res = await axiosInstance.post('/category/new', formData);
            set({categories: [...categories, res.data]});
            toast.success('Category added successfully!');
        } catch (error) {
            console.log(`Error in addCategory: ${error.message}`)
            if (error.response){
                toast.error(error.response.data.message);
            }
            else {
                toast.error(error.message);
            }
        } finally {
            set({isProcessing: false});
        }
    },

    updateCategory: async (formData) => {
        useAuthStore.setState({isProcessing: true});
        const {categories} = get();
        try {
            const categoryId = formData.id;
            const res = await axiosInstance.patch('/category/update/'+categoryId, formData);
            const updatedCategories = categories.filter(category => category.id !== categoryId);
            set({categories: [...updatedCategories, res.data]});
            toast.success('Category updated successfully!');
        } catch (error) {
            console.log(`Error in updateCategory: ${error.message}`)
            if (error.response){
                toast.error(error.response.data.message);
            }
            else {
                toast.error(error.message);
            }
        } finally {
            useAuthStore.setState({isProcessing: false});
            set({selectedCategory: null});
        }
    },

    deleteCategory: async (categoryId) =>{
        useAuthStore.setState({isProcessing: true});
        const {categories} = get();
        try {
            const res = await axiosInstance.delete('/category/delete/'+categoryId);
            const updatedCategories = categories.filter(category => category.id !== categoryId);
            set({categories: updatedCategories});
            toast.success('Category deleted successfully!');
        } catch (error) {
            console.log(`Error in updateCategory: ${error.message}`)
            if (error.response){
                toast.error(error.response.data.message);
            }
            else {
                toast.error(error.message);
            }
        } finally{
            useAuthStore.setState({isProcessing: false});
            set({selectedCategory: null});
        }
    }
}));

export default useCategoryStore;
