import Order from '../models/Order.js';
import Product from '../models/Product.js';

import { sendSuccess, sendError } from '../utils/responseHandler.js';


export const createOrder = async (req, res) => {
    try {
        const { tableId, tableName, items } = req.body;
        const adminId = req.user.adminId || req.user._id;
        const createdBy = req.user._id;
        const waiterId = req.user._id;
        const waiterName = req.user.username;

        let total = 0;
        const validatedItems = [];

        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return sendError(res, `Product not found: ${item.productId}`, {}, 404);
            }
            const itemTotal = product.price * item.quantity;
            total += itemTotal;
            validatedItems.push({
                productId: item.productId,
                productName: product.name,
                price: product.price,
                quantity: item.quantity
            });
        }

        const order = await Order.create({
            tableId,
            tableName,
            waiterId,
            waiterName,
            items: validatedItems,
            total,
            createdBy,
            adminId
        });
        return sendSuccess(res, 'Order created successfully', order, 201);
    } catch (error) {
        return sendError(res, 'Error creating order', error, 500);
    }
};

export const updateOrder = async (req, res) => {
    try {
        const adminId = req.user.role === 'admin' ? req.user._id : req.user.adminId;
        const { status, items, tableName } = req.body;
        const waiterId = req.user._id;
        const waiterName = req.user.username;

        let total;
        let validatedItems;

        if (items) {
            total = 0;
            validatedItems = [];
            for (const item of items) {
                const product = await Product.findById(item.productId);
                if (!product) {
                    return sendError(res, `Product not found: ${item.productId}`, {}, 404);
                }
                const itemTotal = product.price * item.quantity;
                total += itemTotal;
                validatedItems.push({
                    productId: item.productId,
                    productName: product.name,
                    price: product.price,
                    quantity: item.quantity
                });
            }
        }

        const updateData = {
            waiterId,
            waiterName,
        };
        if (status !== undefined) updateData.status = status;
        if (tableName !== undefined) updateData.tableName = tableName;
        if (items) {
            updateData.items = validatedItems;
            updateData.total = total;
        }

        const order = await Order.findOneAndUpdate(
            { _id: req.params.id, adminId },
            { $set: updateData },
            { new: true }
        );
        if (!order) {
            return sendError(res, 'Order not found', {}, 404);
        }
        return sendSuccess(res, 'Order updated successfully', order, 200);
    } catch (error) {
        return sendError(res, 'Error updating order', error, 500);
    }
};

export const deleteOrder = async (req, res) => {
    try {
        const adminId = req.user.role === 'admin' ? req.user._id : req.user.adminId;
        const order = await Order.findOneAndDelete({ _id: req.params.id, adminId });
        if (!order) {
            return sendError(res, 'Order not found', {}, 404);
        }
        return sendSuccess(res, 'Order deleted successfully', order, 200);
    } catch (error) {
        return sendError(res, 'Error deleting order', error, 500);
    }
};

export const getOrders = async (req, res) => {
    try {
        const adminId = req.user.role === 'admin' ? req.user._id : req.user.adminId;
        const orders = await Order.find({ adminId });
        return sendSuccess(res, 'Orders fetched successfully', orders, 200);
    } catch (error) {
        return sendError(res, 'Error fetching orders', error, 500);
    }
};

export const getOrderById = async (req, res) => {
    try {
        const adminId = req.user.role === 'admin' ? req.user._id : req.user.adminId;
        const order = await Order.findOne({ _id: req.params.id, adminId });
        if (!order) {
            return sendError(res, 'Order not found', {}, 404);
        }
        return sendSuccess(res, 'Order fetched successfully', order, 200);
    } catch (error) {
        return sendError(res, 'Error fetching order', error, 500);
    }
};

export const getPendingOrders = async (req, res) => {
    try {
        const adminId = req.user.role === 'admin' ? req.user._id : req.user.adminId;
        const orders = await Order.find({ adminId, status: 'pending' });
        return sendSuccess(res, 'Pending orders fetched successfully', orders, 200);
    } catch (error) {
        return sendError(res, 'Error fetching pending orders', error, 500);
    }
};
