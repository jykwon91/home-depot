import express, { Express, Request, Response } from "express";
import { promises as fsPromises } from "fs";
import { join } from "path";
import dotenv from "dotenv";
import { Car } from "./types/cars";
import cors from "cors";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

//MiddleWare
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.get("/cars", async (req: Request, res: Response) => {
  const cars: Car[] = await getCars();

  res.send(JSON.stringify(cars));
});

app.get("/car", async (req: Request, res: Response) => {
  const carId: any = req.query.id;
  if (!carId) res.send("Car id parameter is missing");

  const car: Car | null | undefined = await getCar(carId);
  if (!car) res.send("No car found by that id");

  res.send(JSON.stringify(car));
});

app.post("/car", async (req: Request, res: Response) => {
  try {
    const car: Car = req.body;
    if (!car) res.send("Something went wrong");

    const carId = req.query.id;
    let cars = await getCars();
    if (!carId && car) {
      car.id = generateId();
      cars.push(car);
    } else {
      const foundIndex = cars.findIndex((car) => car.id == carId);
      if (foundIndex >= 0 && cars) cars[foundIndex] = car;
    }

    res.send(await postCars(cars));
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

async function getCar(id: string) {
  if (!id) return null;
  try {
    const carsRawJson = await fsPromises.readFile(
      join(__dirname, "./data/cars.json"),
      "utf-8"
    );
    const cars: Car[] = JSON.parse(carsRawJson);

    return cars.find((car) => car.id === id);
  } catch (err) {
    console.log(err);
    return null;
  }
}

async function postCars(cars: Car[]) {
  try {
    const data = JSON.stringify(cars);

    await fsPromises.writeFile(join(__dirname, "./data/cars.json"), data);
    return data;
  } catch (err) {
    return null;
  }
}

function generateId() {
  let included =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  let output = "";
  for (let i = 0; i < 8; i++) {
    output += included.charAt(Math.random() * included.length);
  }

  return output;
}
