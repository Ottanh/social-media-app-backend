"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = exports.postSchema = void 0;
const mongoose_1 = require("mongoose");
exports.postSchema = new mongoose_1.Schema({
    user: {
        _id: {
            type: mongoose_1.Schema.Types.ObjectId,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true
        }
    },
    content: {
        type: String,
        required: false,
    },
    image: {
        type: String,
        required: false
    },
    likes: {
        type: Number,
        required: true,
        default: 0,
    },
    replyTo: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: false
    },
    replies: {
        type: [mongoose_1.Schema.Types.ObjectId],
        required: true,
        default: [],
    }
});
exports.Post = (0, mongoose_1.model)('Post', exports.postSchema);
