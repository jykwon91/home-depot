import React from "react";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import {
  Avatar,
  Button,
  CssBaseline,
  Box,
  Grid,
  Link,
  TextField,
  Typography,
  Container,
  Modal,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Alert,
} from "@mui/material";
import { selectOpenModal, setOpenModal } from "features/appSlice";
import {
  submitCar,
  setCarFormData,
  selectCarFormData,
  selectCarFormError,
} from "features/carsSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "store";
import { Car, Category } from "types/car";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { parseISO } from "date-fns";

function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export interface CarFormModalProps {}

export const CarFormModal: React.FC<CarFormModalProps> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const openModal = useSelector(selectOpenModal);
  const carFormData = useSelector(selectCarFormData);
  const carFormError = useSelector(selectCarFormError);

  function handleClose() {
    dispatch(setOpenModal());
  }

  function handleChange(car: Car) {
    dispatch(setCarFormData(car));
  }

  async function handleSave(e: any) {
    e.preventDefault();
    const submitStatus = await dispatch(submitCar());
    if (submitStatus.meta.requestStatus === "fulfilled")
      dispatch(setOpenModal());
  }

  const carYear = carFormData?.year
    ? new Date(parseISO(carFormData.year.toString()))
    : null;

  return (
    <Modal
      open={openModal}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{ overflow: "auto" }}
    >
      <Container
        component="main"
        maxWidth="xs"
        sx={{ background: "white", paddingBottom: "30px" }}
      >
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: "30px",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <DirectionsCarIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Car Information
          </Typography>
          {carFormError && (
            <Alert sx={{ width: "100%" }} severity="error">
              {carFormError}
            </Alert>
          )}
          <Box component="form" noValidate onSubmit={handleSave} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="make"
                  required
                  fullWidth
                  id="make"
                  label="Make"
                  defaultValue={carFormData?.make}
                  onChange={(e) =>
                    handleChange({ ...carFormData, make: e.target.value })
                  }
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="model"
                  label="Model"
                  name="model"
                  defaultValue={carFormData.model}
                  onChange={(e) =>
                    handleChange({ ...carFormData, model: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="package"
                  label="Package"
                  name="package"
                  defaultValue={carFormData.package}
                  onChange={(e) =>
                    handleChange({ ...carFormData, package: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    views={["year"]}
                    label="Year"
                    value={carYear}
                    onChange={(value: any) => {
                      handleChange({
                        ...carFormData,
                        year: value ? value.year() : null,
                      });
                    }}
                    renderInput={(params) => (
                      <TextField {...params} helperText={null} />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl sx={{ width: "100%" }}>
                  <InputLabel shrink={true} id="demo-simple-select-label">
                    Category
                  </InputLabel>
                  <Select
                    required
                    labelId="category"
                    id="category"
                    label="Category"
                    displayEmpty
                    notched={true}
                    defaultValue={carFormData.category}
                    onChange={(e) =>
                      handleChange({
                        ...carFormData,
                        category: e.target.value as Category,
                      })
                    }
                  >
                    <MenuItem value={1}>{Category[1]}</MenuItem>
                    <MenuItem value={2}>{Category[2]}</MenuItem>
                    <MenuItem value={3}>{Category[3]}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="color"
                  label="Color"
                  id="color"
                  defaultValue={carFormData.color}
                  onChange={(e) =>
                    handleChange({ ...carFormData, color: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="price"
                  label="Price"
                  id="price"
                  type="number"
                  defaultValue={carFormData.price ? carFormData.price : null}
                  onChange={(e) =>
                    handleChange({
                      ...carFormData,
                      price: parseInt(e.target.value),
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="mileage"
                  label="Mileage"
                  id="mileage"
                  type="number"
                  defaultValue={
                    carFormData.mileage ? carFormData.mileage : null
                  }
                  onChange={(e) =>
                    handleChange({
                      ...carFormData,
                      mileage: parseInt(e.target.value),
                    })
                  }
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Save
            </Button>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </Modal>
  );
};
