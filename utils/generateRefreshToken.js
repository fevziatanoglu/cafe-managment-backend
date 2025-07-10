import jwt from 'jsonwebtoken';

const generateRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '7d'
    });
};

export default generateRefreshToken;
