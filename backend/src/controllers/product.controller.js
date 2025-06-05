import Category from '../models/category.model.js';
import Product from '../models/product.model.js';
import cloudinary from '../lib/cloudinary.js';
import { getOrCreateCategory } from './category.controller.js';
import mongoose from 'mongoose';
import {updateCategoryQuantityById, updateAllCategoryQuantity} from '../utils/updateCategoryProducts.js';

const getProducts = async (req,res) => {
    let products;
    try {
        products = await Product.find().limit(100).populate('category');
        if (!products || products.length === 0){
            return res.status(404).json({ message: 'No products found.' });
        }


        return res.status(200).json(products.map(product => product.toObject({getters: true})));
    } catch (error) {
        console.log(`Error in getProducts controller: ${error.message}`);
        return res.status(500).json({
            message: 'Internal Server Error.'
        });
    }
};

const getProductById = async (req,res) => {
    const productId = req.params.id;
    try{
        const existingProduct = await Product.findById(productId).populate('category').populate('suppliers');
        if (!existingProduct){
            return res.status(404).json({ message: 'Product not found.' });
        }

        return res.status(200).json(existingProduct.toObject({getters: true}));
    } catch (error) {
        console.log(`Error in getProductById controller: ${error.message}`);
        return res.status(500).json({
            message: 'Internal Server Error.'
        });
    }
};

const getProductsBySearch = async (req,res) => {
    const searchTerm = req.query.searchTerm;
    // console.log(searchTerm);
    let existingProducts = [];
    if (!searchTerm || searchTerm.length ===0){
        return res.status(200).json(existingProducts);
    }
    try {
        existingProducts = await Product.find({
            $or : [
                {
                    name: new RegExp(searchTerm, "i")
                },
                {
                    barcode: new RegExp(searchTerm, "i")
                }
            ]
        }).populate('category');
    } catch (error) {
        console.log(`Error in getProductsBySupplier controller: ${error.message}`);
        return res.status(500).json({
            message: 'Internal Server Error.'
        });
    }
    // console.log(existingProducts);

    return res.status(200).json(existingProducts.map(product => product.toObject({getters: true})));
};

const getProductsByFilter = async (req, res) => {
    const {categoryId, minPrice, maxPrice, minStock, maxStock} = req.body.filterData;

    let existingProducts = [];

    try {
        existingProducts = await Product.find().populate('category');
    } catch (error) {
        console.log(`Error in getProductsByFilter controller: ${error.message}`);
        return res.status(500).json({
            message: 'Internal Server Error.'
        });
    }

    let filteredProducts = existingProducts.map(product => product.toObject({getters: true}));
    if (categoryId){
        filteredProducts = filteredProducts.filter(product => product.category.id === categoryId);
    }

    filteredProducts = filteredProducts.filter(product => {
        const price = product.price;
        return (
            (minPrice === "" || price >= minPrice) &&
            (maxPrice === "" || price <= maxPrice)
        );
    });

    filteredProducts = filteredProducts.filter(product => {
        const stock = product.stock;
        return (
            (minStock === "" || stock >= minStock) &&
            (maxStock === "" || stock <= maxStock)
        );
    });

    return res.status(200).json(filteredProducts);
};

const addProduct = async (req,res) => {
    const {barcode, name, price, unit, stock, stockNorm, image, note, categoryId} = req.body;
    if (!name || !unit || !categoryId) {
        return res.status(400).json({
            message: 'All fields are required.'
        });
    }


    try {
        
        const existingProduct = await Product.findOne({$or: [{barcode: barcode},{name: name}]});
        if (existingProduct){
            return res.status(409).json({ message: 'A product with this barcode or name already exists.' });
        }

        const existingCategory = await Category.findById(categoryId);
        if (!existingCategory){
            return res.status(404).json({ message: 'Category not found.' });
        }

        let imageUrl = "";
        if (image){
            const uploadResult = await cloudinary.uploader.upload(image);
            imageUrl = uploadResult.secure_url;
        }   

        const newProduct = new Product({
            barcode,
            name,
            price,
            unit,
            stock,
            stockNorm,
            note,
            category: existingCategory._id,
            image: imageUrl,
            supplier: []
        });

        await newProduct.save();
        const updateResult = await updateCategoryQuantityById(existingCategory._id);
        return res.status(201).json(newProduct.toObject({getters: true}));
        
    } catch (error) {
        console.log(`Error in addProduct controller: ${error.message}`);
        return res.status(500).json({
            message: 'Internal Server Error.'
        });
    }
};

const addProductsFromFile = async (req,res) => {
    const {productData} = req.body;
    if (!productData || productData.length === 0) {
        return res.status(400).json({
            message: 'Không tìm thấy dữ liệu sản phẩm.'
        });
    }

    const session = await mongoose.startSession();
    session.startTransaction();
    const newProducts = [];
    let savedProducts;
    try{
        for (const product of productData) {
            // console.log(product);
            const categoryId = await getOrCreateCategory(session, product.categoryName);
            const newProduct = {
                barcode: product.barcode,
                name: product.name,
                price: product.price,
                unit: product.unit,
                stock: product.stock,
                stockNorm: product.stockNorm,
                note: product.note,
                category: categoryId,
                image: product.image,
            };
            newProducts.push(newProduct);
        }

        savedProducts = await Product.insertMany(newProducts, {session});
        await updateAllCategoryQuantity();
        const saveProductsIds = savedProducts.map(product => product._id);
        savedProducts = await Product.find({_id: {$in: saveProductsIds}}).populate('category');
        await session.commitTransaction();
    } catch (error) {
        console.log(`Error in addProductsFromFile controller: ${error.message}`);
        return res.status(500).json({
            message: 'Internal Server Error.'
        });
    } finally{
        await session.endSession();
    }

    return res.status(201).json(savedProducts.map(product => product.toObject({getters: true})));
};

const updateProduct = async (req,res) => {
    const productId = req.params.id;

    const {barcode, name, price, unit, stock, stockNorm, image, note, categoryId} = req.body;
    if (!name ||!price ||!unit || !categoryId) {
        return res.status(400).json({
            message: 'All fields are required.'
        });
    }

    

    try {
        const existingCategory = await Category.findById(categoryId);
        if (!existingCategory){
            throw new Error('CategoryId not found');
        }

        const existingProduct = await Product.findById(productId);
        if (!existingProduct){
            return res.status(404).json({ message: 'Product not found.' });
        }

        let newImageUrl = "";
        if (image){
            const uploadResult = await cloudinary.uploader.upload(image);
            newImageUrl = uploadResult.secure_url;
        }

        const updatedProduct = await Product.findByIdAndUpdate(productId, {
            barcode,
            name,
            price,
            unit,
            stock,
            stockNorm,
            note,
            category: existingCategory._id,
            image: newImageUrl || existingProduct.image
        });

        const updateResult = await updateCategoryQuantityById(existingCategory._id);
        return res.status(200).json(updatedProduct.toObject({ getters: true }));
    } catch (error) {
        console.log(`Error in updateProduct controller: ${error.message}`);
        return res.status(500).json({
            message: 'Internal Server Error.'
        });
    }

};

const deleteProduct = async (req,res) => {
    const productId = req.params.id;
    try {
        const existingProduct = await Product.findById(productId);
        if (!existingProduct){
            return res.status(404).json({ message: 'Product not found.' });
        }

        await cloudinary.uploader.destroy(existingProduct.image, (error, result) => {
            if (error) {
                console.error("Error deleting image:", error);
                throw error;
            } else {
                console.log("Delete result:", result);
            }
        });

        await existingProduct.deleteOne();
        return res.status(200).json({
            message: 'Product deleted successfully.'
        });
    } catch (error) {
        console.log(`Error in deleteProduct controller: ${error.message}`);
        return res.status(500).json({
            message: 'Internal Server Error.'
        });
    }
};

export {getProducts, getProductById, getProductsBySearch, getProductsByFilter, addProduct, addProductsFromFile, updateProduct, deleteProduct};