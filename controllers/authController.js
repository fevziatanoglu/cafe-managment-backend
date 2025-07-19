import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import generateAccessToken from '../utils/generateAccessToken.js';
import generateRefreshToken from '../utils/generateRefreshToken.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

export const register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return sendError(res, 'Email already in use', {}, 400);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({ username, email, password: hashedPassword });

        const accessToken = generateAccessToken(newUser._id);
        const refreshToken = generateRefreshToken(newUser._id);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return sendSuccess(res, 'User registered successfully', {
            token: accessToken,
            user: { _id: newUser._id, username: newUser.username, email: newUser.email }
        }, 201);

    } catch (error) {
        return sendError(res, 'Error creating user', error, error.status || 500);
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            const accessToken = generateAccessToken(user._id);
            const refreshToken = generateRefreshToken(user._id);

            user.refreshToken = refreshToken;
            await user.save();

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'Strict',
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            return sendSuccess(res, 'User logged in successfully', {
                token: accessToken,
                user: { _id: user._id, username: user.username, email: user.email , role: user.role }
            }, 200);
        } else {
            return sendError(res, 'Invalid username or password', {}, 401);
        }
    } catch (error) {
        return sendError(res, 'Error logging in', error, 500);
    }
};

export const refreshAccessToken = async (req, res) => {
    const cookieHeader = req.headers.cookie;
    //HERE IS IMPORTANT - YOU NEED TO GET REFRESH TOKEN FROM COOKIE HEADER CORRECTLY
    const refreshToken = cookieHeader?.split('refreshToken=')[1];
    if (!refreshToken) {
        return res.status(401).json({ message: 'Unauthorize' });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(403).json({ message: 'Invalid refresh token' });
        }

        const newAccessToken = generateAccessToken(user._id);

        return sendSuccess(res, 'Access token refreshed', {
            token: newAccessToken,
            user: { _id: user._id, username: user.username, email: user.email , adminId: user.adminId , role: user.role }
        }, 200);

    } catch (err) {
        return sendError(res, 'Token could not refreshed', err, 403);
    }
};

export const logout = async (req, res) => {

    try {
        const cookieHeader = req.headers.cookie;
        const refreshToken = cookieHeader.split('=')[1];
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
            path: '/',
        });

        return sendSuccess(res, 'Logged out successfully');

    } catch (err) {
        return sendError(res, 'Error logging out', err, 500);
    }
};
