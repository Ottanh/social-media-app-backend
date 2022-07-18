"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const secrets_1 = __importDefault(require("./secrets"));
const config = () => __awaiter(void 0, void 0, void 0, function* () {
    const PORT = process.env.PORT ? process.env.PORT : '4000';
    return new Promise(resolve => {
        (0, secrets_1.default)().then(secrets => {
            let MONGODB_URI;
            switch (process.env.NODE_ENV) {
                case 'test':
                    MONGODB_URI = secrets.TEST_MONGODB_URI;
                    break;
                case 'development':
                    MONGODB_URI = secrets.DEV_MONGODB_URI;
                    break;
                default:
                    MONGODB_URI = secrets.MONGODB_URI;
                    break;
            }
            const SECRET = secrets.SECRET;
            resolve({ MONGODB_URI, PORT, SECRET });
        })
            .catch(e => {
            console.log(e);
        });
    });
});
exports.default = config();
