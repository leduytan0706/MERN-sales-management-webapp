import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import useAuthStore from "./useAuthStore";
import sortList from "../utils/sortList";

const useImportStore = create((set, get) =>({
    imports: [],
    sortedAndFilteredImports: [],
    sortAndFilter: {
        isFiltered: false,
        searchTerm: "",
        sortCriteria: "",
        sortOrder: "asc",
        startDate: "",
        endDate: "",
        minProductQuantity: "",
        maxProductQuantity: "",
        supplierId: ""
    },
    selectedImport: null,
    importItems: [],

    getImports: async () => {
        useAuthStore.setState({isProcessing: true});
        try {
            const res = await axiosInstance.get("/import");
            set({imports: res.data});            
        } catch (error) {
            console.log(`Error in getImports: ${error.message}`);
            set({imports: []});
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

    getImportById: async (importId) => {
        if (!importId){
            toast.error('Import not found');
            return;
        }
        useAuthStore.setState({isProcessing: true});
        try {
            const res = await axiosInstance.get("/import/"+importId);
            const {importData, importItems}= res.data;
            
            set({
                selectedImport: importData,
                importItems: importItems.map(item => ({
                    ...item,
                    importTotal: item.importQuantity*item.importPrice,
                    exportTotal: item.exportQuantity*item.exportPrice,
                    stockTotal: (item.importQuantity-item.exportQuantity)*item.importPrice
                }))
            });       
        } catch (error) {
            console.log(`Error in getImportById: ${error.message}`);
            set({importItems: []});
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

    searchImports: async (searchTerm) => {
        useAuthStore.setState({isProcessing: true});
        try {
            const res = await axiosInstance.get("/import/search?searchTerm="+searchTerm);
            const searchResult = res.data;
            if (searchResult.length <= 0) {
                set({sortedAndFilteredImports: []});
                toast.error("Không tìm thấy phiếu nhập.");
            }
            else {
                set({sortedAndFilteredImports: searchResult});
            }
        } catch (error) {
            console.log(`Error in getOrderById: ${error.message}`);
            toast.error(error.message);
        } finally{
            useAuthStore.setState({isProcessing: false});
        }
    },

    sortImports: () => {
        let imports = get().imports;
        const {sortAndFilter} = get();
        // console.log(sortAndFilter);
        let sortCriteria = sortAndFilter.sortCriteria;

        const sortOrder = sortAndFilter.sortOrder;
        if (!sortAndFilter.sortCriteria || sortAndFilter.sortCriteria.length === 0) {
            set({sortedAndFilteredImports: []});
            return imports;
        }
        
        if (sortCriteria === "supplier"){
            imports = imports.map((import_) => ({
                ...import_,
                supplierName: import_.supplier.name
            }));
            sortCriteria = "supplierName";
        }
        const sortData = {
            sortCriteria,
            sortOrder
        };
        set({sortedAndFilteredImports: sortList(imports, sortData)});
    },

    filterImports: async () => {
        const {sortAndFilter} = get();
        console.log(sortAndFilter);
        useAuthStore.setState({isProcessing: true});
        try {
            const res = await axiosInstance.post("/import/filter", {filterData: sortAndFilter});
            const searchResult = res.data;
            console.log(searchResult);
            if (searchResult.length <= 0) {
                set({sortedAndFilteredImports: []});
                toast.error("Không tìm thấy phiếu nhập.");
            }
            else {
                set({sortedAndFilteredImports: searchResult});
            }
        } catch (error) {
            console.log(`Error in getImportById: ${error.message}`);
            if (error.response){
                toast.error(error.response.data.message);
            }
            else {
                toast.error(error.message);
            }
            set({sortedAndFilteredImports: []});
        } finally {
            useAuthStore.setState({isProcessing: false});
            const updatedSortAndFilter = {
                ...sortAndFilter,
                isFiltered: true
            };
            set({sortAndFilter: updatedSortAndFilter});
        }
    },

    clearFilter: () => {
        const updatedSortAndFilter = {
            isFiltered: false,
            searchTerm: "",
            sortCriteria: "",
            sortOrder: "asc",
            startDate: "",
            endDate: "",
            minProductQuantity: "",
            maxProductQuantity: "",
            supplierId: ""
        };
        set({
            sortedAndFilteredImports: [],
            sortAndFilter: updatedSortAndFilter
        });
    },

    addImport: async (formData) => {
        useAuthStore.setState({isProcessing: true});
        const {imports} = get();
        let newImportId = null;
        try {
            const res = await axiosInstance.post("/import/new", {
                importData: formData
            });
            const {newImportData} = res.data;
            set({imports: [...imports, newImportData]});
            newImportId = newImportData.id;
            toast.success('Thêm phiếu nhập thành công!');
        } catch (error) {
            console.log(`Error in addImport: ${error.message}`);
            if (error.response){
                toast.error(error.response.data.message);
            }
            else {
                toast.error(error.message);
            }
        } finally{
            useAuthStore.setState({isProcessing: false});
            return newImportId;
        }
    },

    updateImport: async (importId, formData) => {
        useAuthStore.setState({isProcessing: true});
        console.log(formData);
        const {imports} = get();
        let updatedImportId = null;
        try {
            const res = await axiosInstance.patch("/import/update/"+importId, {
                importData: formData
            });
            const {updatedImportData} = res.data;
            const updatedImports = imports.filter(import_ => import_.id !== importId);
            set({imports: [...updatedImports, updatedImportData]});
            updatedImportId = updatedImportData.id;
            toast.success('Phiếu nhập được cập nhật thành công!');
        } catch (error) {
            console.log(`Error in updateImport: ${error.message}`);
            if (error.response){
                toast.error(error.response.data.message);
            }
            else {
                toast.error(error.message);
            }
        } finally{
            useAuthStore.setState({isProcessing: false});
            return updatedImportId;
        }
    },

    deleteImport: async (importId) => {
        useAuthStore.setState({isProcessing: true});
        const {imports} = get();
        try {
            const res = await axiosInstance.delete("/import/delete/"+importId);
            const updatedImports = imports.filter(import_ => import_.id !== importId);
            set({imports: [...updatedImports]});
            toast.success('Phiếu nhập được xóa thành công!');
        } catch (error) {
            console.log(`Error in deleteImport: ${error.message}`);
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

export default useImportStore;