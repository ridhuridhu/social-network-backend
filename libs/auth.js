const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        res.json({
            message: "Access Denied"
        });
    }

    const verfiy = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verfiy;
    next();
};