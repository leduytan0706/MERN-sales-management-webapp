import {create} from 'zustand'
import axiosInstance from '../lib/axios';
import toast from 'react-hot-toast';

const useAuthStore = create((set,get) => ({
    isLoggingIn: false,
    isCheckAuth: false,
    isLoadingPage: false,
    isProcessing: false,
    isDeleteMode: false,
    authUser: null,
    users: [],
    selectedUser: null,

    checkAuth: async () => {
        set({isCheckAuth: true});
        try {
            const res = await axiosInstance.get('/auth/check');
            set({authUser: res.data});
        } catch (error) {
            console.log(`Error in signUp: ${error.message}`);
            set({authUser: null})
            // if (error.response){
            //     toast.error(error.response.data.message);
            // }
            // else {
            //     toast.error(error.message);
            // }
        } finally{
            set({isCheckAuth: false});
        }
    },

    logIn: async (formData) => {
        set({isLoggingIn: true});
        try {
            const res = await axiosInstance.post('/auth/login', formData);
            set({authUser: res.data});
            toast.success('Signed in successfully!');
        } catch (error) {
            console.log(`Error in logIn: ${error.message}`);
            if (error.response){
                toast.error(error.response.data.message);
            }
            else {
                toast.error(error.message);
            }
        } finally{
            set({isLoggingIn: false});
        }
    },

    logOut: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({authUser: null});
            toast.success("Logged out successfully");
        } catch (error) {
            console.log("Error in logOut: ", error);
            if (error.response){
                toast.error(error.response.data.message);
            }
            else {
                toast.error(error.message);
            }
        }
    },

    updateProfile: async (formData) => {
        set({isProcessing: true});
        try {
            const res = await axiosInstance.post("/auth/update-profile", {updateData: formData});
            set({authUser: res.data});
            toast.success('Cập nhật thông tin thành công!');
        } catch (error) {
            console.log(`Error in updateProfile: ${error.message}`);
            if (error.response){
                toast.error(error.response.data.message);
            }
            else {
                toast.error(error.message);
            }
        } finally{
            set({isProcessing: false});
        }

    },

    getUsers: async () => {
        set({isProcessing: true});
        try {
            const res = await axiosInstance.get('/auth/user');
            set({users: res.data});
        } catch (error) {
            console.log(`Error in getUsers: ${error.message}`);
            set({users: []});
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

    addUser: async (formData) => {
        set({isProcessing: true});
        const {users} = get();
        const userData = {...formData};
        if (formData.role === "manager"){
            userData.employeeRoles.push("manager");
        }
        let createdUser = null;
        try {
            
            const res = await axiosInstance.post('/auth/new-user', {userData: userData});
            createdUser = res.data;
            set({users: [...users, createdUser]});
            toast.success("Thêm người dùng thành công!");
        } catch (error) {
            console.log(`Error in addUser: ${error}`);
            if (error.response){
                toast.error(error.response.data.message);
            }
            else {
                toast.error(error.message);
            }
            
        } finally {
            set({isProcessing: false});
        }
        return createdUser;
    },

    deleteUser: async (userId) => {
        set({isProcessing: true});
        const {users} = get();
        try {
            const res = await axiosInstance.delete(`/auth/delete-user/${userId}`);
            set({users: users.filter(user => user._id!== userId)});
            toast.success("Xóa người dùng thành công!");
        } catch (error) {
            console.log(`Error in deleteUser: ${error.message}`);
            if (error.response){
                toast.error(error.response.data.message);
            }
            else {
                toast.error(error.message);
            }
        } finally {
            set({isProcessing: false});
        }
    }
}));

export default useAuthStore;