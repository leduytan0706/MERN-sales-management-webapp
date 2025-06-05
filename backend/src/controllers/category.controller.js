import Category from "../models/category.model.js"

const getCategories = async(req, res) => {
    let categories;
    try {
        categories = await Category.find().exec();
    } catch (error) {
        return res.status(404).json({ message: "Internal Server Error." });
    }
    if (!categories || categories.length === 0){
        return res.status(404).json({ message: "No categories found." });
    }

    return res.status(200).json(categories.map(category => category.toObject({getters: true})));
};

const getOrCreateCategory = async (session, categoryName) => {
    let categoryId;
    try {
        const existingCategory = await Category.findOne({name: {$in: categoryName}});
        console.log(existingCategory);
        if (!existingCategory){
            const newCategory = new Category({
                name: categoryName,
            });
            await newCategory.save({session});
            categoryId = newCategory._id;
        }
        else {
            categoryId = existingCategory._id;
        }
    } catch (error) {
        console.log(`Error in getOrCreateCategory controller: ${error.message}`);
        return error;
    }
    return categoryId;
};



const addCategory = async (req,res) => {
    const { name, quantity } = req.body;
    if (!name || name.length === 0) {
        return res.status(404).json({ 
            message: 'All fields are required.'
        });
    }

    
    try {
        const existingCategory = await Category.findOne({name});
        if (existingCategory){
            return res.status(409).json({ message: 'Category already exists.' });
        }

        const newCategory = new Category({
            name,
            product_quantity: quantity
        });

        await newCategory.save();
        return res.status(201).json(newCategory.toObject({ getters: true }));
    } catch (error) {
        console.log(`Error in addCategory controller: ${error.message}`);
        return res.status(500).json({
            message: "Internal Server Error."
        });
    }
};

const updateCategory = async (req,res) => {
    const categoryId = req.params.id;
    const {name, product_quantity} = req.body;

    if (!categoryId) {
        return res.status(404).json({ message: 'Category ID is invalid.' });
    }

    let existingCategory;
    try {
        existingCategory = await Category.findById(categoryId);
        if (!existingCategory){
            return res.status(404).json({ message: 'Category not found.' });
        }

        existingCategory.name = name || existingCategory.name;
        existingCategory.product_quantity = product_quantity || existingCategory.product_quantity;

        await existingCategory.save();

        return res.status(200).json(existingCategory.toObject({ getters: true }));
    } catch (error) {
        console.log(`Error in addCategory controller: ${error.message}`);
        return res.status(500).json({
            message: "Internal Server Error."
        });
    }
};

const deleteCategory = async (req,res) => {
    const categoryId = req.params.id;
    if (!categoryId) {
        return res.status(404).json({ message: 'Category ID is invalid.' });
    }

    let existingCategory;
    try{
        existingCategory = await Category.findById(categoryId);
        if (!existingCategory){
            return res.status(404).json({ message: 'Category not found.' });
        }

        await existingCategory.deleteOne();
        
        return res.status(200).json({
            message: 'Category deleted successfully.'  // This could also return the deleted category for future reference
        });
    } catch (error) {
        console.log(`Error in deleteCategory controller: ${error.message}`);
        return res.status(500).json({
            message: "Internal Server Error."
        });
    }
};

export {getCategories, getOrCreateCategory, addCategory, updateCategory, deleteCategory }