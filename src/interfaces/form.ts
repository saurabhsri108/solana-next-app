export interface ICheckoutForm {
  email: string;
  phone: number | string;
  offers: boolean;
}

export interface IShippingForm {
  firstname: string;
  lastname: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: number | string;
  saveInformation: boolean;
}
