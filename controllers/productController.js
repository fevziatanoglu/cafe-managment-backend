import Product from '../models/Product.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

export const createProduct = async (req, res) => {
    try {
        const { name, description, price, category } = req.body;
        const adminId = req.user._id;
        const product = await Product.create({ name, description, price, category, adminId });
        return sendSuccess(res, 'Product created successfully', product, 201);
    } catch (error) {
        return sendError(res, 'Error creating product', error, 500);
    }
};

export const updateProduct = async (req, res) => {
    try {
        const adminId = req.user._id;
        const { name, description, price, category, isActive } = req.body;
        const product = await Product.findOneAndUpdate(
            { _id: req.params.id, adminId },
            { $set: { name, description, price, category, isActive } },
            { new: true }
        );
        if (!product) {
            return sendError(res, 'Product not found', {}, 404);
        }
        return sendSuccess(res, 'Product updated successfully', product, 200);
    } catch (error) {
        return sendError(res, 'Error updating product', error, 500);
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const adminId = req.user._id;
        const product = await Product.findOneAndDelete({ _id: req.params.id, adminId });
        if (!product) {
            return sendError(res, 'Product not found', {}, 404);
        }
        return sendSuccess(res, 'Product deleted successfully', product, 200);
    } catch (error) {
        return sendError(res, 'Error deleting product', error, 500);
    }
};

export const getProducts = async (req, res) => {
    try {
        const adminId = req.user._id;
        const products = await Product.find({ adminId });
        return sendSuccess(res, 'Products fetched successfully', products, 200);
    } catch (error) {
        return sendError(res, 'Error fetching products', error, 500);
    }
};

export const getProductById = async (req, res) => {
    try {
        const product = await Product.findOne({ _id: req.params.id });
        if (!product) {
            return sendError(res, 'Product not found', {}, 404);
        }
        return sendSuccess(res, 'Product fetched successfully', product, 200);
    } catch (error) {
        return sendError(res, 'Error fetching product', error, 500);
    }
};
