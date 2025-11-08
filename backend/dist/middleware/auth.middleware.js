"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkLogout = exports.checkLogin = void 0;
const checkLogin = (req, res, next) => {
    console.log(req.session);
    if (!req.session || !req.session.username) {
        res.status(401).json({
            message: "You are not allowed to access this!"
        });
        return;
    }
    next();
};
exports.checkLogin = checkLogin;
const checkLogout = (req, res, next) => {
    if (req.session && req.session.username) {
        res.status(500).json({
            message: "You are already logged in!"
        });
        return;
    }
    next();
};
exports.checkLogout = checkLogout;
