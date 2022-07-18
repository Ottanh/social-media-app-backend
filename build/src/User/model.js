"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: false
    },
    passwordHash: {
        type: String,
        required: true
    },
    description: String,
    image: {
        type: String,
        required: true,
        default: 'defaultUserPic.jpg'
    },
    likes: [mongoose_1.Schema.Types.ObjectId],
    followed: {
        type: [mongoose_1.Schema.Types.ObjectId],
        required: false,
        default: [],
    }
});
const User = (0, mongoose_1.model)('User', userSchema);
exports.default = User;
