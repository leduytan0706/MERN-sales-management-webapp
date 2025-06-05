import Supplier from "../models/supplier.model.js";

const getSuppliers = async(req, res) => {
    let suppliers;
    try {
        suppliers = await Supplier.find().exec();
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
    if (!suppliers || suppliers.length === 0){
        return res.status(404).json({ message: "No suppliers found." });
    }

    return res.status(200).json(suppliers.map(supplier => supplier.toObject({getters: true})));
};

const addSupplier = async (req,res) => {
    const {name, phone, address, note} = req.body;
    if (!name || !phone){
        return res.status(400).json({ message: 'All fields are required.' });
    }



    try {
        const existingSupplier = await Supplier.findOne({phone: phone});
        console.log(existingSupplier);
        if (existingSupplier){
            return res.status(400).json({
                message: 'Supplier with this phone number already exists'
            });
        }

        const newSupplier = new Supplier({
            name,
            phone,
            address,
            note,
            products: []
        });

        await newSupplier.save();
        return res.status(201).json(newSupplier.toObject({ getters: true }));
    } catch (error) {
        console.log(`Error in addSupplier controller: ${error.message}`);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
};

const updateSupplier = async (req,res) => {
    const supplierId = req.params.id;
    const {name, phone, address, note} = req.body;
    if (!name || !phone || !address || !note) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    let existingSupplier;
    try {
        existingSupplier = await Supplier.findById(supplierId);
        if (!existingSupplier) {
            return res.status(404).json({ message: 'Supplier not found.' });
        }

        existingSupplier.name = name || existingSupplier.name;
        existingSupplier.phone = phone || existingSupplier.phone;
        existingSupplier.address = address || existingSupplier.address;
        existingSupplier.note = note || existingSupplier.note;

        await existingSupplier.save();
        return res.status(200).json(existingSupplier.toObject({ getters: true }));
    } catch (error) {
        console.log(`Error in updateSupplier controller: ${error.message}`);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
};

const deleteSupplier = async (req,res) => {
    const supplierId = req.params.id;
    let existingSupplier;
    try {
        existingSupplier = await Supplier.findById(supplierId);
        if (!existingSupplier) {
            return res.status(404).json({ message: 'Supplier not found.' });
        }

        await existingSupplier.deleteOne();
        return res.status(200).json({
            message: 'Supplier deleted successfully.' 
        });
    } catch (error) {
        console.log(`Error in deleteSupplier controller: ${error.message}`);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
};

export {getSuppliers, addSupplier, updateSupplier, deleteSupplier }