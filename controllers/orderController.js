import Order from '../models/Order.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

// Sipariş oluştur
export const createOrder = async (req, res) => {
    try {
        const { tableId, items, total } = req.body;
        const adminId = req.user.adminId || req.user._id;
        const createdBy = req.user._id;
        const order = await Order.create({ tableId, items, total, createdBy, adminId });
        return sendSuccess(res, 'Order created successfully', order, 201);
    } catch (error) {
        return sendError(res, 'Error creating order', error, 500);
    }
};

// Sipariş güncelle (durum veya ürünler)
export const updateOrder = async (req, res) => {
    try {
        const adminId = req.user._id || req.user._id;
        const { status, items, total } = req.body;
        const order = await Order.findOneAndUpdate(
            { _id: req.params.id, adminId },
            { $set: { status, items, total } },
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

// Sipariş sil
export const deleteOrder = async (req, res) => {
    try {
        const adminId = req.user._id || req.user._id;
        const order = await Order.findOneAndDelete({ _id: req.params.id, adminId });
        if (!order) {
            return sendError(res, 'Order not found', {}, 404);
        }
        return sendSuccess(res, 'Order deleted successfully', order, 200);
    } catch (error) {
        return sendError(res, 'Error deleting order', error, 500);
    }
};

// Tüm siparişleri getir (adminin siparişleri)
export const getOrders = async (req, res) => {
    try {
        const adminId = req.user._id || req.user._id;
        const orders = await Order.find({ adminId });
        return sendSuccess(res, 'Orders fetched successfully', orders, 200);
    } catch (error) {
        return sendError(res, 'Error fetching orders', error, 500);
    }
};

// Tek siparişi getir
export const getOrderById = async (req, res) => {
    try {
        const adminId = req.user._id || req.user._id;
        const order = await Order.findOne({ _id: req.params.id, adminId });
        if (!order) {
            return sendError(res, 'Order not found', {}, 404);
        }
        return sendSuccess(res, 'Order fetched successfully', order, 200);
    } catch (error) {
        return sendError(res, 'Error fetching order', error, 500);
    }
};
