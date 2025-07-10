import Menu from '../models/Menu.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

export const createMenu = async (req, res) => {
    try {
        const { name, description, products } = req.body;
        const adminId = req.user._id;
        const menu = await Menu.create({ name, description, products, adminId });
        return sendSuccess(res, 'Menu created successfully', menu, 201);
    } catch (error) {
        return sendError(res, 'Error creating menu', error, 500);
    }
};

export const updateMenu = async (req, res) => {
    try {
        const adminId = req.user._id;
        const { name, isActive, description, products } = req.body;
        const menu = await Menu.findOneAndUpdate(
            { _id: req.params.id, adminId },
            { $set: { name, isActive, description, products } },
            { new: true }
        );
        if (!menu) {
            return sendError(res, 'Menu not found', {}, 404);
        }
        return sendSuccess(res, 'Menu updated successfully', menu, 200);
    } catch (error) {
        return sendError(res, 'Error updating menu', error, 500);
    }
};

export const deleteMenu = async (req, res) => {
    try {
        const adminId = req.user._id;
        const menu = await Menu.findOneAndDelete({ _id: req.params.id, adminId });
        if (!menu) {
            return sendError(res, 'Menu not found', {}, 404);
        }
        return sendSuccess(res, 'Menu deleted successfully', menu, 200);
    } catch (error) {
        return sendError(res, 'Error deleting menu', error, 500);
    }
};
