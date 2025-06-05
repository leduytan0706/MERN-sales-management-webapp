import { create } from "zustand";
import axiosInstance from "../lib/axios";
import useAuthStore from "./useAuthStore";
import { getOrderTotalAmount, getOrderTotalItem } from "../utils/getTotal";
import toast from "react-hot-toast";
import sortList from "../utils/sortList";
import useDiscountStore from "./useDiscountStore";

const useOrderStore = create((set, get) => ({
    orders: [],
    selectedOrder: null,
    selectedItems: [],
    sortedAndFilteredOrders: [],
    sortAndFilter: {
        isFiltered: false,
        searchTerm: "",
        sortCriteria: "",
        sortOrder: "asc",
        minItemQuantity: "",
        maxItemQuantity: "",
        minTotalAmount: "",
        maxTotalAmount: "",
        startDate: "",
        endDate: "",
    },
    newOrders: [
        {
            orderId: 1,
            customerName: "",
            orderDate: "",
            totalAmount: 0,
            totalItem: 0,
            itemQuantity: 0,
            discountAmount: "",
            debtAmount: "",
            paymentAmount: "",
            discountCode: "",
            note: "",
            items: [],
            isAdded: false
        }
    ],
    activeOrderId: 1,

    getOrders: async () => {
        useAuthStore.setState({isProcessing: true});
        try {
            const res = await axiosInstance.get("/order");
            set({orders: res.data});
        } catch (error) {
            console.log(`Error in getOrders: ${error.message}`);
            set({orders: []});
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

    getOrderById: async (orderId) => {
        // console.log(orderId);
        useAuthStore.setState({isProcessing: true});
        try {
            const res = await axiosInstance.get("/order/"+orderId);
            const orderData = res.data;
            // console.log(orderData);
            const selectedItems = orderData.items.map(item => ({
                ...item,
                itemTotal: item.product.price*item.productQuantity
            }));
            set({
                selectedOrder: orderData,
                selectedItems: selectedItems
            });
        } catch (error) {
            console.log(`Error in getOrderById: ${error.message}`);
            set({
                selectedOrder: null,
                selectedItems: []
            });
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

    searchOrders: async (searchTerm) => {
        useAuthStore.setState({isProcessing: true});
        try {
            const res = await axiosInstance.get("/order/search?searchTerm="+searchTerm);
            const searchResult = res.data;
            if (searchResult.length <= 0){
                set({sortedAndFilteredOrders: []});
                toast.error("Không tìm thấy đơn hàng.");
            }
            else {
                set({sortedAndFilteredOrders: searchResult});
            }
        } catch (error) {
            console.log(`Error in getOrderById: ${error.message}`);
            if (error.response){
                toast.error(error.response.data.message);
            }
            else {
                toast.error(error.message);
            }
            set({sortedAndFilteredOrders: []});
        } finally{
            useAuthStore.setState({isProcessing: false});
        }
    },

    sortOrders: (displayedOrders) => {
        const {sortAndFilter} = get();
        const sortCriteria = sortAndFilter.sortCriteria;
        const sortOrder = sortAndFilter.sortOrder;
        if (!sortCriteria || sortCriteria.length === 0) {
            return;
        }

        const sortData = {
            sortCriteria,
            sortOrder
        };

        const updatedSortAndFilter = {
            ...sortAndFilter,
            isFiltered: true
        };
        set({
            sortedAndFilteredOrders: sortList(displayedOrders, sortData),
            sortAndFilter: updatedSortAndFilter
        });
    },

    filterOrders: async () => {
        const {sortAndFilter} = get();
        console.log(sortAndFilter);
        useAuthStore.setState({isProcessing: true});
        try {
            const res = await axiosInstance.post("/order/filter",{filterData: sortAndFilter});
            const searchResult = res.data;
            console.log(searchResult);
            if (searchResult.length <= 0){
                set({sortedAndFilteredOrders: []});
                toast.error("Không tìm thấy đơn hàng.");
            }
            else {
                set({sortedAndFilteredOrders: searchResult});
            }
        } catch (error) {
            console.log(`Error in filterOrder: ${error.message}`);
            toast.error(error.message);
            set({sortedAndFilteredOrders: []});
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
            sortCriteria: "",
            sortOrder: "asc",
            minItemQuantity: "",
            maxItemQuantity: "",
            minTotalAmount: "",
            maxTotalAmount: "",
            startDate: "",
            endDate: "",
        };
        set({
            sortedAndFilteredOrders: [],
            sortAndFilter: updatedSortAndFilter
        });
    },

    removeAddedOrder: () => {
        const {newOrders} = get();
        const updatedOrders = newOrders.filter(order => order.isAdded === false);
        if (updatedOrders.length <= 0) {
            updatedOrders.push({
                orderId: 1,
                customerName: "",
                orderDate: "",
                totalAmount: 0,
                totalItem: 0,
                itemQuantity: 0,
                discountAmount: 0,
                debtAmount: 0,
                paymentAmount: 0,
                note: "",
                items: [],
                isAdded: false
            });
        }
        set({
            newOrders: updatedOrders,
            activeOrderId: updatedOrders[0].orderId
        });
    },

    addOrderTab: () => {
        const {newOrders} = get();
        const lastOrderTabId = newOrders.at(-1).orderId;
        const newOrderTab = {
            orderId: lastOrderTabId+1,
            customerName: "",
            orderDate: "",
            totalAmount: 0,
            totalItem: 0,
            itemQuantity: 0,
            discountCode: "",
            discountAmount: "",
            debtAmount: "",
            paymentAmount: "",
            note: "",
            items: [],
            isAdded: false
        };
        set({
            newOrders: [...newOrders, newOrderTab],
            activeOrderId: newOrderTab.orderId
        });
        console.log(get().newOrders, get().activeOrderId);
        
    },

    removeOrderTab: (newOrderId) => {
        const {newOrders} = get();
        const filteredOrders = newOrders.filter((order) => order.orderId !== newOrderId);
        // console.log("Before setState:", get().newOrders, get().activeOrderId);
        set(() => ({
            newOrders: filteredOrders,
            activeOrderId: filteredOrders.length > 0 ? filteredOrders[0].orderId : ""
        }));
        console.log("After setState:", get().newOrders, get().activeOrderId);

    },

    addOrderItem: async (selectedProduct, orderIndex, itemIndex, itemDiscount) => {
        const {newOrders} = get();
        let updatedOrders = [...newOrders];
        const activeOrder = newOrders[orderIndex];
        try {
            if (itemIndex >= 0){
                const activeItems = [...activeOrder.items];
                activeItems[itemIndex].productQuantity = activeItems[itemIndex].productQuantity + 1 ;
                activeItems[itemIndex].itemTotal = activeItems[itemIndex].product.price*activeItems[itemIndex].productQuantity;
                activeItems[itemIndex].itemDiscount = itemDiscount;
                activeOrder.items = [...activeItems];
            }
            else {
                const newItem = {
                    product: selectedProduct,
                    productQuantity: 1,
                    itemTotal: selectedProduct.price,
                    itemDiscount: itemDiscount,
                };
                newItem.itemDiscount = itemDiscount;
                activeOrder.items.push(newItem);
                
            }
        } catch (error) {
            console.log(`Error in addOrderItem: ${error.message}`);
            if (error.response){
                toast.error(error.response.data.message);
            }
            else {
                toast.error(error.message);
            }
        }
        
        updatedOrders[orderIndex] = {
            ...activeOrder,
            totalItem: getOrderTotalItem(activeOrder.items),
            totalAmount: getOrderTotalAmount(activeOrder.items)
        }
        
        // console.log(newOrders);
        set({newOrders: updatedOrders});
        return updatedOrders[orderIndex];
    },

    removeOrderItem: (productId) => {
        const {activeOrderId, newOrders} = get();
        const index = newOrders.findIndex(newOrder => newOrder.orderId === activeOrderId);
        if (index < 0){
            toast.error("Failed to remove item from order.");
            return;
        }
        const activeOrder = newOrders[index];
        const updatedItems = activeOrder.items.filter(item => item.product.id !== productId);
        const updatedOrders = [...newOrders];
        updatedOrders[index] = {
            ...activeOrder,
            items: updatedItems,
            totalItem: getOrderTotalItem(updatedItems),
            totalAmount: getOrderTotalAmount(updatedItems)
        };
        // console.log(newOrders[index]);
        set({newOrders: updatedOrders});
        return updatedOrders[index];
    },

    addOrder: async () => {
        useAuthStore.setState({isProcessing: true});
        const {newOrders, activeOrderId} = get();
        try {
            const index = newOrders.findIndex(newOrder => newOrder.orderId === activeOrderId);
            if (index < 0){
                throw new Error("Order not found.");
            }
            const newOrder = newOrders[index];
            console.log(newOrder);
            const res = await axiosInstance.post("/order/new", {orderData: newOrder});
            const updatedOrders = [...newOrders];
            updatedOrders[index] = {
                ...newOrder,
                isAdded: true
            };
            set({newOrders: updatedOrders});
            toast.success("Order added successfully.");
        } catch (error) {
            console.log(`Error in addOrder: ${error.message}`);
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

    updateOrder: async (id, formData) => {
        useAuthStore.setState({isProcessing: true});
        const {orders} = get();
        let updatedId = null;
        try {
            const res = await axiosInstance.patch("/order/update/"+id, {orderData: formData});
            const updatedOrders = orders.filter(order => order.id !== id);
            const updatedOrder = {
                ...res.data.updatedOrderData,
                items: [...res.data.items]
            };
            set({newOrders: [...updatedOrders, updatedOrder]});
            updatedId = id;
        } catch (error) {
            console.log(`Error in addOrder: ${error.message}`);
            if (error.response){
                toast.error(error.response.data.message);
            }
            else {
                toast.error(error.message);
            }
        } finally {
            useAuthStore.setState({isProcessing: false});
            return updatedId;
        }
    },

    deleteOrder: async (orderId) => {
        useAuthStore.setState({isProcessing: true});
        const {orders} = get();
        try {
            const res = await axiosInstance.delete("/order/delete/"+orderId);
            const updatedOrders = orders.filter(order => order.id !== orderId);
            set({orders: [...updatedOrders]});
            toast.success('Order deleted successfully!');
        } catch (error) {
            console.log(`Error in deleteOrder: ${error.message}`);
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

export default useOrderStore;