import express, { Express, Request, Response } from "express";
import { promises as fsPromises } from "fs";
import { join } from "path";
import dotenv from "dotenv";
import { Car } from "./types/cars";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

//MiddleWare
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.get("/cars", async (req: Request, res: Response) => {
  const cars: Car[] = await getCars();

  res.send(JSON.stringify(cars));
});

app.post("/cars", async (req: Request, res: Response) => {
  try {
    const car: Car = req.body;
    if (!car) res.send("Something went wrong");

    const carId = req.query.id;
    let cars = await getCars();
    if (!carId && car) {
      cars.push(car);
    } else {
      const foundIndex = cars.findIndex((car) => car.id == carId);
      if (foundIndex >= 0 && cars) cars[foundIndex] = car;
    }

    res.sendStatus(await postCars(cars));
  } catch (err) {
    console.log(err);
    res.send(err);
  }

  // res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});

async function getCars() {
  try {
    const carsRawJson = await fsPromises.readFile(
      join(__dirname, "./data/cars.json"),
      "utf-8"
    );
    const cars: Car[] = JSON.parse(carsRawJson);
    return cars;
  } catch (err) {
    console.log(err);
    return [];
  }
}

async function postCars(cars: Car[]) {
  try {
    const data = JSON.stringify(cars);

    await fsPromises.writeFile(join(__dirname, "./data/cars.json"), data);
    return 200;
  } catch (err) {
    return 500;
  }
}
