import Product from '../models/Product.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';
import cloudinary from '../config/cloudinary.js';
import Cafe from '../models/Cafe.js';

export const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, image } = req.body;
        const adminId = req.user._id;
        let imageUrl = null;

        if (req.file) {
            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: 'products' },
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result);
                    }
                );
                stream.end(req.file.buffer);
            });
            imageUrl = result.secure_url;
        } else if (image && typeof image === "string") {
            imageUrl = image;
        }

        const product = await Product.create({ name, description, price, category, image: imageUrl, adminId });
        return sendSuccess(res, 'Product created successfully', product, 201);
    } catch (error) {
        return sendError(res, 'Error creating product', error?.message || error, 500);
    }
};

export const updateProduct = async (req, res) => {
    try {
        const adminId = req.user._id;
        const { name, description, price, category, isActive, image } = req.body;
        let imageUrl = null;

        if (req.file) {
            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: 'products' },
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result);
                    }
                );
                stream.end(req.file.buffer);
            });
            imageUrl = result.secure_url;
        } else if (image && typeof image === "string") {
            imageUrl = image;
        }

        const updateFields = { name, description, price, category, isActive };
        if (imageUrl) {
            updateFields.image = imageUrl;
        }

        const product = await Product.findOneAndUpdate(
            { _id: req.params.id, adminId },
            { $set: updateFields },
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

export const getProductsBySlug = async (req, res) => {
    try {
        const slug = req.params.slug;
        const { category } = req.query;
        const cafe = await Cafe.findOne({ slug: slug });
        if (!cafe) {
            return sendError(res, 'Cafe not found', {}, 404);
        }
        const filter = { adminId: cafe.owner };
        if (category) {
            filter.category = category;
        }
        const products = await Product.find(filter);
        return sendSuccess(res, 'Products fetched successfully', products, 200);
    } catch (error) {
        return sendError(res, error.message || 'Error fetching products', error, error.status || 500);
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
