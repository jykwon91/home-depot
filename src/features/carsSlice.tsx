import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { CarsState, Car, Category } from "../types/car";
import axios from "axios";

const emptyCar: Car = {
  id: "",
  make: "",
  model: "",
  package: "",
  color: "",
  year: 0,
  category: Category.Truck,
  mileage: undefined,
  price: undefined,
};
// Define the initial state using that type
const initialState: CarsState = {
  cars: [],
  status: "",
  selectedCar: emptyCar,
  carFormData: emptyCar,
  carFormError: "",
};

export const fetchCars = createAsyncThunk("cars/fetchCars", async () => {
  const response = await axios.get("http://localhost:8000/cars");
  return response.data;
});

export const submitCar = createAsyncThunk(
  "cars/submitCar",
  async (_, { getState }) => {
    const state = getState() as { cars: CarsState };
    let url;

    const err = validateCarFormData(state.cars.carFormData);
    if (err) throw err;

    if (state.cars.carFormData.id)
      url = `http://localhost:8000/car?id=${state.cars.carFormData.id}`;
    else url = "http://localhost:8000/car";

    const response = await axios.post(url, state.cars.carFormData);
    return response.data;
  }
);

function validateCarFormData(carFormData: Car) {
  const {
    make,
    model,
    package: carPackage,
    color,
    year,
    category,
    mileage,
    price,
  } = carFormData;
  if (!make) return "Please provide make";
  if (!model) return "Please provide model";
  if (!carPackage) return "Please provide package";
  if (!color) return "Please provide color";
  if (!year) return "Please provide year";
  if (!category) return "Please provide category";
  if (mileage === undefined) return "Please provide mileage";
  if (price === undefined) return "Please provide price";
}

export const carsSlice = createSlice({
  name: "cars",
  initialState,
  reducers: {
    setSelectedCar: (state, action) => {
      state.selectedCar = action.payload as Car;
      state.carFormData = action.payload as Car;
    },
    setCarFormData: (state, action) => {
      state.carFormData = action.payload as Car;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchCars.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchCars.fulfilled, (state, action) => {
        state.status = "succeeded";

        action.payload.forEach((payloadCar: Car) => {
          state.cars.findIndex((car: Car) => car.id === payloadCar.id) === -1 &&
            state.cars.push(payloadCar);
        });
      })
      .addCase(submitCar.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(submitCar.fulfilled, (state, action) => {
        state.status = "succeeded";

        state.cars = action.payload;
        state.carFormError = "";
      })
      .addCase(submitCar.rejected, (state, action) => {
        state.status = "failed";
        state.carFormError = action.error.message;
      });
  },
});

export const { setSelectedCar, setCarFormData } = carsSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectAllCars = (state: RootState) => state.cars.cars;
export const selectSelectedCar = (state: RootState) => state.cars.selectedCar;
export const selectCarFormData = (state: RootState) => state.cars.carFormData;
export const selectCarFormError = (state: RootState) => state.cars.carFormError;

export default carsSlice.reducer;
