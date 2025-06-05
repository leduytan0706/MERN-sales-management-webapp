import Order from "../models/order.model.js";
import Import from "../models/import.model.js";
import Product from "../models/product.model.js";
import OrderItem from "../models/orderItem.model.js";

const getOverviewData = async (req, res) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 13);
    const endDate = new Date();
    let overviewData;
    
    try {
        const results = await Promise.allSettled([
            getSalesByDate(startDate, endDate),
            getCostByDate(startDate, endDate),
            getLowStockProducts(),
            getCategorySales(startDate, endDate),
            getTopSellingProducts(startDate, endDate)
        ]);

        const salesByDate = results[0].status === "fulfilled"? results[0].value: null;
        const costByDate = results[1].status === "fulfilled"? results[1].value: null;
        const lowStockProducts = results[2].status === "fulfilled"? results[2].value: null;
        const categorySales = results[3].status === "fulfilled"? results[3].value: null;
        const topProducts = results[4].status === "fulfilled"? results[4].value: null;

        console.log(lowStockProducts);
        const yesterDayDate = new Date();
        yesterDayDate.setDate(yesterDayDate.getDate() - 1);
        // console.log(yesterDayDate);
        const yesterdaySales = salesByDate.find(sales => {
            // console.log(new Date(sales._id.date).toISOString().split("T")[0]);
            return new Date(sales._id).toISOString().split("T")[0] === new Date(yesterDayDate).toISOString().split("T")[0];
        });
        const yesterdayCost = costByDate.find(cost => {
            return new Date(cost._id).toISOString().split("T")[0] === new Date(yesterDayDate).toISOString().split("T")[0]; 
        });
        
        // console.log(salesByDate);

        overviewData = {
            yesterdayRevenue: yesterdaySales? yesterdaySales.totalAmount: 0,
            yesterdayOrders: yesterdaySales? yesterdaySales.totalQuantity: 0,
            yesterdayCost: yesterdayCost? yesterdayCost.totalAmount: 0,
            lowStockProducts: lowStockProducts.length > 0? [...lowStockProducts]: [],
            salesData: salesByDate.length > 0? [...salesByDate]: [],
            categorySalesData: categorySales.length > 0? [...categorySales]: [],
            topProducts: topProducts.length > 0? [...topProducts]: [],
        };
    } catch (error) {
        console.log(`Error in getOverviewData: ${error.message}`);
        return res.status(500).json({
            message: 'Lỗi máy chủ. Vui lòng thử lại sau'
        });
    }

    return res.status(200).json(overviewData);
};

const getReportsData = async (req, res) => {
    const {reportForm} = req.body;
    const {reportType, startDate, endDate} = reportForm;
    if (!reportType || reportType.length <= 0){
        return res.status(400).json({
            message: 'Bạn chưa chọn loại báo cáo.'
        });
    }
    let formattedStartDate = startDate;
    if (!startDate || startDate.length <= 0){
        formattedStartDate = new Date("1970-01-01").toISOString();
    }
    let formattedEnđate = endDate;
    if (!endDate || endDate.length <= 0){
        formattedEnđate = new Date().toISOString();
    }

    let reportsData;
    try {
        switch (reportType) {
            case "sales":
                reportsData = await getSalesByDate(formattedStartDate, formattedEnđate);
                break;
            case "cost":
                reportsData = await getCostByDate(formattedStartDate, formattedEnđate);
                break;
        
            default:
                break;
        }

    } catch (error) {
        console.log(`Error in getReportsData: ${error.message}`);
        return res.status(500).json({
            message: 'Lỗi máy chủ. Vui lòng thử lại sau'
        });
    }

    if (!reportsData || reportsData.length <= 0){
        return res.status(404).json({ message: 'Không tìm thấy dữ liệu cho báo cáo.' });
    }

    return res.status(200).json(reportsData);
};

const getSalesByDate = async (startDate, endDate) => {
    let salesByDate;
    // Convert startDate to beginning of the day
    const startOfDay = new Date(startDate);
    startOfDay.setHours(0, 0, 0, 0);

    // Convert endDate to end of the day (23:59:59.999)
    const endOfDay = new Date(endDate);
    endOfDay.setHours(23, 59, 59, 999);

    try {
        salesByDate = await Order.aggregate([
            {
                $match: { 
                    createdAt: { $gte: startOfDay, $lte: endOfDay }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    totalQuantity: { $sum: 1 },
                    totalAmount: { $sum: { $ifNull: ["$totalAmount", 0] } }
                }
            },
            { $sort: { _id: 1 } } // Sắp xếp theo ngày sau khi nhóm
            
        ]);
    } catch (error) {
        console.log(`Error in getSalesByDate: ${error.message}`);
        return error;
    }
    
    return salesByDate;
};

const getCostByDate = async (startDate, endDate) => {
    let costByDate;
    // Convert startDate to beginning of the day
    const startOfDay = new Date(startDate);
    startOfDay.setHours(0, 0, 0, 0);

    // Convert endDate to end of the day (23:59:59.999)
    const endOfDay = new Date(endDate);
    endOfDay.setHours(23, 59, 59, 999);

    try {
        costByDate = await Import.aggregate([
            {
                $match: { 
                    createdAt: { $gte: startOfDay, $lte: endOfDay }
                }
            },
            {
                $group: {
                    _id: {$dateToString: { format: "%Y-%m-%d", date: "$createdAt" }},
                    totalQuantity: { $sum: 1 },
                    totalAmount: {$sum: { $ifNull: ["$totalAmount", 0] }}
                }
            },
            { $sort: { _id: 1 } } // Sắp xếp theo ngày sau khi nhóm
        ]);
    } catch (error) {
        console.log(`Error in getCostByDate: ${error.message}`);
        return error;
    }
    
    return costByDate;
};

const getLowStockProducts = async () => {
    let lowStockProducts;
    try {
        lowStockProducts = await Product.aggregate([
            {
                $match: {
                    $expr: {
                      $lte: ["$stock", "$stockNorm"]
                    }
                }
            }
        ]);
        console.log(lowStockProducts);
    } catch (error) {
        console.log(`Error in getLowStockProduct: ${error.message}`);
        return error;
    }
    return lowStockProducts;
};

const getCategorySales = async (startDate, endDate) => {
    let categorySales;

    // Convert startDate to beginning of the day
    const startOfDay = new Date(startDate);
    startOfDay.setHours(0, 0, 0, 0);

    // Convert endDate to end of the day (23:59:59.999)
    const endOfDay = new Date(endDate);
    endOfDay.setHours(23, 59, 59, 999);

    try {
        categorySales = await OrderItem.aggregate([
            {
                $match: {
                    $and: [
                        {createdAt: {$gte: new Date(startDate)} },
                        {createdAt: {$lte: new Date(endDate)}}
                    ]
                }
            },
            {
                $group: {
                    _id: "$product",
                    totalSold: {$sum: "$productQuantity"}
                }
            },
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "productDetails"
                }
            },
            { $unwind: "$productDetails"},
            {
                $group: {
                    _id: "$productDetails.category",
                    totalAmount: {$sum: "$totalSold"}
                }
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "_id",
                    foreignField: "_id",
                    as: "categoryDetails"
                }
            },
            { $unwind: "$categoryDetails"},
            {
                $project: {
                    _id: 0,
                    categoryId: "$_id",
                    name: "$categoryDetails.name",
                    totalAmount: 1
                }
            }
        ]);
    } catch (error) {
        console.log(`Error in getCategorySales: ${error.message}`);
        return error;
    }

    return categorySales;
};



const getTopSellingProducts = async (startDate, endDate, limit = 30) => {
    let topSellingProducts;
    // Convert startDate to beginning of the day
    const startOfDay = new Date(startDate);
    startOfDay.setHours(0, 0, 0, 0);

    // Convert endDate to end of the day (23:59:59.999)
    const endOfDay = new Date(endDate);
    endOfDay.setHours(23, 59, 59, 999);
    try {
        topSellingProducts = await OrderItem.aggregate([
            { 
                $match: {
                    $and: [
                        {createdAt: {$gte: new Date(startDate)} },
                        {createdAt: {$lte: new Date(endDate)}}
                    ]
                }
   
            },
            {
                $group: {
                    _id: "$product",
                    totalSold: {$sum: "$productQuantity"}
                }
            },
            {$sort: {totalSold: -1}},
            {$limit: limit},
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "productDetails"
                }
            },
            { $unwind: "$productDetails"},
            {
                $project: {
                    _id: 0,
                    productId: "$_id",
                    name: "$productDetails.name",
                    image: "$productDetails.image",
                    unit: "$productDetails.unit",
                    totalSold: 1,
                    totalAmount: {$multiply: ["$productDetails.price","$totalSold"]}
                }
            }
        ]);
    } catch (error) {
        console.log(`Error in getTopSellingProduct: ${error.message}`);
        return error;
    }

    return topSellingProducts;
};

export {getOverviewData, getReportsData};
