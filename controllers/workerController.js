import Worker from '../models/Worker.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

export const createWorker = async (req, res) => {
    try {
        const { name, email, role } = req.body;
        const existingWorker = await Worker.findOne({ email });
        if (existingWorker) {
            return sendError(res, 'Worker email already exists', {}, 400);
        }
        const worker = await Worker.create({ name, email, role });
        return sendSuccess(res, 'Worker created successfully', worker, 201);
    } catch (error) {
        return sendError(res, 'Error creating worker', error, 500);
    }
};

export const getWorkers = async (req, res) => {
    try {
        const workers = await Worker.find();
        return sendSuccess(res, 'Workers fetched successfully', workers, 200);
    } catch (error) {
        return sendError(res, 'Error fetching workers', error, 500);
    }
};

export const getWorkerById = async (req, res) => {
    try {
        const worker = await Worker.findById(req.params.id);
        if (!worker) {
            return sendError(res, 'Worker not found', {}, 404);
        }
        return sendSuccess(res, 'Worker fetched successfully', worker, 200);
    } catch (error) {
        return sendError(res, 'Error fetching worker', error, 500);
    }
};

export const updateWorker = async (req, res) => {
    try {
        const worker = await Worker.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!worker) {
            return sendError(res, 'Worker not found', {}, 404);
        }
        return sendSuccess(res, 'Worker updated successfully', worker, 200);
    } catch (error) {
        return sendError(res, 'Error updating worker', error, 500);
    }
};

export const deleteWorker = async (req, res) => {
    try {
        const worker = await Worker.findByIdAndDelete(req.params.id);
        if (!worker) {
            return sendError(res, 'Worker not found', {}, 404);
        }
        return sendSuccess(res, 'Worker deleted successfully', worker, 200);
    } catch (error) {
        return sendError(res, 'Error deleting worker', error, 500);
    }
};
