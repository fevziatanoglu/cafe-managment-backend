import Staff from '../models/Staff.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';
import cloudinary from '../config/cloudinary.js';

export const createStaff = async (req, res) => {
    try {
        const { username, email, role, password, image } = req.body;
        const adminId = req.user._id;
        let imageUrl = null;

        if (req.file) {
            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: 'staff' },
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

        const staff = await Staff.create({ username, email, role, password, image: imageUrl, adminId });
        return sendSuccess(res, 'Staff created successfully', staff, 201);
    } catch (error) {
        return sendError(res, 'Error creating staff', error?.message || error, 500);
    }
};

export const updateStaff = async (req, res) => {
    try {
        const adminId = req.user._id;
        const { username, email, role, password, image } = req.body;
        let imageUrl = null;

        if (req.file) {
            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: 'staff' },
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

        const updateFields = { username, email, role };
        if (password) updateFields.password = password;
        if (imageUrl) updateFields.image = imageUrl;

        const staff = await Staff.findOneAndUpdate(
            { _id: req.params.id, adminId },
            { $set: updateFields },
            { new: true }
        );

        if (!staff) {
            return sendError(res, 'Staff not found', {}, 404);
        }
        return sendSuccess(res, 'Staff updated successfully', staff, 200);
    } catch (error) {
        return sendError(res, 'Error updating staff', error, 500);
    }
};
