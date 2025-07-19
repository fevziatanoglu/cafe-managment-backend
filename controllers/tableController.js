import Order from '../models/Order.js';
import Table from '../models/Table.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

export const createTable = async (req, res) => {
    try {
        const { number, status } = req.body;
        const adminId = req.user._id;
        const table = await Table.create({ number, status, adminId });
        return sendSuccess(res, 'Table created successfully', table, 201);
    } catch (error) {
        return sendError(res, 'Error creating table', error, 500);
    }
};

export const updateTable = async (req, res) => {
    try {
        const adminId = req.user.adminId || req.user._id;
        const { number, status } = req.body;
        const table = await Table.findOneAndUpdate(
            { _id: req.params.id, adminId },
            { $set: { number, status } },
            { new: true }
        );
        if (!table) {
            return sendError(res, 'Table not found', {}, 404);
        }
        return sendSuccess(res, 'Table updated successfully', table, 200);
    } catch (error) {
        return sendError(res, 'Error updating table', error, 500);
    }
};

export const deleteTable = async (req, res) => {
    try {
        const adminId = req.user.adminId || req.user._id;
        const table = await Table.findOneAndDelete({ _id: req.params.id, adminId });
        if (!table) {
            return sendError(res, 'Table not found', {}, 404);
        }
        return sendSuccess(res, 'Table deleted successfully', table, 200);
    } catch (error) {
        return sendError(res, 'Error deleting table', error, 500);
    }
};

export const getTables = async (req, res) => {
    try {
        const adminId = req.user.adminId || req.user._id;
        const tables = await Table.find({ adminId });
        return sendSuccess(res, 'Tables fetched successfully', tables, 200);
    } catch (error) {
        return sendError(res, 'Error fetching tables', error, 500);
    }
};

export const getTableById = async (req, res) => {
    try {
        const adminId = req.user.adminId || req.user._id;
        const table = await Table.findOne({ _id: req.params.id, adminId });
        if (!table) {
            return sendError(res, 'Table not found', {}, 404);
        }
        return sendSuccess(res, 'Table fetched successfully', table, 200);
    } catch (error) {
        return sendError(res, 'Error fetching table', error, 500);
    }
};

export const getTablesWithActiveOrder = async (req, res) => {
    try {
        const adminId = req.user.adminId || req.user._id;
        const tables = await Table.find({ adminId });

        const tablesWithOrders = await Promise.all(
            tables.map(async (table) => {
                const orders = await Order.find({
                    tableId: table._id,
                    status: { $in: ['pending', 'preparing', 'served'] }
                });
                return {
                    ...table.toObject(),
                    orders 
                };
            })
        );
        return sendSuccess(res, 'Tables with active orders fetched', tablesWithOrders, 200);
    } catch (error) {
        return sendError(res, 'Error fetching tables with orders', error, 500);
    }
};
