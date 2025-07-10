import User from '../models/User.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

export const createWorker = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        const adminId = req.user._id; // Giriş yapan adminin id'si
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return sendError(res, 'Worker email already exists', {}, 400);
        }
        const user = await User.create({ username, email, password, role, adminId });
        return sendSuccess(res, 'Worker created successfully', user, 201);
    } catch (error) {
        return sendError(res, 'Error creating worker', error, 500);
    }
};

export const getWorkers = async (req, res) => {
    try {
        const adminId = req.user._id;
        const workers = await User.find({ adminId, role: { $in: ['waiter', 'kitchen'] } });
        return sendSuccess(res, 'Workers fetched successfully', workers, 200);
    } catch (error) {
        return sendError(res, 'Error fetching workers', error, 500);
    }
};

export const getWorkerById = async (req, res) => {
    try {
        const adminId = req.user._id;
        const user = await User.findOne({ _id: req.params.id, adminId, role: { $in: ['waiter', 'kitchen'] } });
        if (!user) {
            return sendError(res, 'Worker not found', {}, 404);
        }
        return sendSuccess(res, 'Worker fetched successfully', user, 200);
    } catch (error) {
        return sendError(res, 'Error fetching worker', error, 500);
    }
};

export const getWorkerByUsername = async (req, res) => {
    try {
        const adminId = req.user._id;
        const { username } = req.params;
        const user = await User.findOne({
            username,
            adminId,
            role: { $in: ['waiter', 'kitchen'] }
        });
        if (!user) {
            return sendError(res, 'Worker not found', {}, 404);
        }
        return sendSuccess(res, 'Worker fetched successfully', user, 200);
    } catch (error) {
        return sendError(res, 'Error fetching worker', error, 500);
    }
};

export const updateWorker = async (req, res) => {
    try {
        const adminId = req.user._id;
        const user = await User.findOneAndUpdate(
            { _id: req.params.id, adminId, role: { $in: ['waiter', 'kitchen'] } },
            req.body,
            { new: true }
        );
        if (!user) {
            return sendError(res, 'Worker not found', {}, 404);
        }
        return sendSuccess(res, 'Worker updated successfully', user, 200);
    } catch (error) {
        return sendError(res, 'Error updating worker', error, 500);
    }
};

export const deleteWorker = async (req, res) => {
    try {
        const adminId = req.user._id;
        const user = await User.findOneAndDelete({ _id: req.params.id, adminId, role: { $in: ['waiter', 'kitchen'] } });
        if (!user) {
            return sendError(res, 'Worker not found', {}, 404);
        }
        return sendSuccess(res, 'Worker deleted successfully', user, 200);
    } catch (error) {
        return sendError(res, 'Error deleting worker', error, 500);
    }
};
