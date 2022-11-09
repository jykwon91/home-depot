import React, { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import Title from "./Title";
import { Car, Category } from "../types/car";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAllCars,
  fetchCars,
  setSelectedCar,
} from "../features/carsSlice";
import { setOpenModal } from "features";
import { AppDispatch } from "../store";

export interface CarListProps {}

export const CarList: React.FC<CarListProps> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const cars = useSelector(selectAllCars);

  useEffect(() => {
    dispatch(fetchCars());
    // eslint-disable-next-line
  }, []);

  function handleOpenModal(car: Car | undefined) {
    if (car === undefined)
      car = {
        id: "",
        make: "",
        model: "",
        package: "",
        color: "",
        year: undefined,
        category: Category.Unknown,
        mileage: undefined,
        price: undefined,
      };
    dispatch(setSelectedCar(car));
    dispatch(setOpenModal());
  }

  return (
    <React.Fragment>
      <Title>List of Cars</Title>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Make</TableCell>
              <TableCell align="right">Model</TableCell>
              <TableCell align="right">Package</TableCell>
              <TableCell align="right">Year</TableCell>
              <TableCell align="right">Category</TableCell>
              <TableCell align="right">Color</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Mileage</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cars.map((car: Car) => (
              <TableRow
                key={car.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {car.make}
                </TableCell>
                <TableCell align="right">{car.model}</TableCell>
                <TableCell align="right">{car.package}</TableCell>
                <TableCell align="right">{car.year}</TableCell>
                <TableCell align="right">{Category[car.category]}</TableCell>
                <TableCell align="right">{car.color}</TableCell>
                <TableCell align="right">{formatPrice(car?.price)}</TableCell>
                <TableCell align="right">{car.mileage}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    onClick={() => handleOpenModal(car)}
                  >
                    Update
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button
        sx={{
          width: "100%",
          maxWidth: "400px",
          alignSelf: "center",
          marginTop: "10px",
        }}
        variant="contained"
        onClick={() => handleOpenModal(undefined)}
      >
        Add Car
      </Button>
    </React.Fragment>
  );
};

function formatPrice(price: number | undefined) {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  if (price === undefined || price === null) return "--";
  else return formatter.format(price / 100);
}
