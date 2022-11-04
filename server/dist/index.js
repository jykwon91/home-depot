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
const express_1 = __importDefault(require("express"));
const fs_1 = require("fs");
const path_1 = require("path");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
//MiddleWare
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.get("/", (req, res) => {
    res.send("Express + TypeScript Server");
});
app.get("/cars", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cars = yield getCars();
    res.send(JSON.stringify(cars));
}));
app.post("/cars", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const car = req.body;
        if (!car)
            res.send("Something went wrong");
        const carId = req.query.id;
        let cars = yield getCars();
        if (!carId && car) {
            cars.push(car);
        }
        else {
            const foundIndex = cars.findIndex((car) => car.id == carId);
            if (foundIndex >= 0 && cars)
                cars[foundIndex] = car;
        }
        res.sendStatus(yield postCars(cars));
    }
    catch (err) {
        console.log(err);
        res.send(err);
    }
    // res.sendStatus(200);
}));
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
function getCars() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const carsRawJson = yield fs_1.promises.readFile((0, path_1.join)(__dirname, "./data/cars.json"), "utf-8");
            const cars = JSON.parse(carsRawJson);
            return cars;
        }
        catch (err) {
            console.log(err);
            return [];
        }
    });
}
function postCars(cars) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = JSON.stringify(cars);
            yield fs_1.promises.writeFile((0, path_1.join)(__dirname, "./data/cars.json"), data);
            return 200;
        }
        catch (err) {
            return 500;
        }
    });
}
