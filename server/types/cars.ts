export interface Car {
  id: string;
  make: string;
  model: string;
  package: string;
  color: string;
  year: number;
  category: Category;
  mileage: number;
  price: number;
}

export enum Category {
  Unknown = 0,
  Truck = 1,
  Sedan = 2,
  Suv = 3,
}
