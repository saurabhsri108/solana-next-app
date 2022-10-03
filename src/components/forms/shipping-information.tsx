import type { Dispatch, SetStateAction } from "react";
import { ChangeEvent, memo } from "react";
import { IShippingForm } from "@interfaces/form";

interface IShippingInformation {
  shippingFormData: IShippingForm;
  setShippingFormData: Dispatch<SetStateAction<IShippingForm>>;
}

const ShippingInformation = ({
  shippingFormData,
  setShippingFormData,
}: IShippingInformation) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const type = e.target.type;
    const name = e.target.name;
    const value = type === "checkbox" ? e.target.checked : e.target.value;
    setShippingFormData((prevShippingFormData: IShippingForm) => {
      return { ...prevShippingFormData, [name]: value };
    });
  };
  return (
    <section className="mt-5">
      <h2 className="mb-2 text-lg sm:text-xl lg:text-3xl">Shipping Details</h2>
      <form className="flex flex-col gap-2 text-xl">
        <div className="form-group">
          <label htmlFor="firstname" className="text-xl lg:text-2xl">
            First Name
          </label>
          <input
            className="w-full py-2 text-xl border lg:text-2xl lg:py-4 border-primary form-input"
            type="text"
            name="firstname"
            id="firstname"
            placeholder="John"
            value={shippingFormData.firstname}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastname" className="text-xl lg:text-2xl">
            Last Name
          </label>
          <input
            className="w-full py-2 text-xl border lg:text-2xl lg:py-4 border-primary form-input"
            type="text"
            name="lastname"
            id="lastname"
            placeholder="Doe"
            value={shippingFormData.lastname}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="address" className="text-xl lg:text-2xl">
            Address
          </label>
          <input
            className="w-full py-2 text-xl border lg:text-2xl lg:py-4 border-primary form-input"
            type="text"
            name="address"
            id="address"
            placeholder="East Maruthi Nagar, Anupuram Colony, Dr A.S. Rao Nagar"
            value={shippingFormData.address}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="w-full form-group">
            <label htmlFor="city" className="text-xl lg:text-2xl">
              City
            </label>
            <input
              className="w-full py-2 text-xl border lg:text-2xl lg:py-4 border-primary form-input"
              type="text"
              name="city"
              id="city"
              placeholder="Secunderabad"
              value={shippingFormData.city}
              onChange={handleChange}
              required
            />
          </div>
          <div className="w-full form-group">
            <label htmlFor="state" className="text-xl lg:text-2xl">
              State
            </label>
            <input
              className="w-full py-2 text-xl border lg:text-2xl lg:py-4 border-primary form-input"
              type="text"
              name="state"
              id="state"
              placeholder="Andhra Pradesh"
              value={shippingFormData.state}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="w-full form-group">
            <label htmlFor="country" className="text-xl lg:text-2xl">
              Country
            </label>
            <input
              className="w-full py-2 text-xl border lg:text-2xl lg:py-4 border-primary form-input"
              type="text"
              name="country"
              id="country"
              placeholder="India"
              value={shippingFormData.country}
              onChange={handleChange}
              required
            />
          </div>
          <div className="w-full form-group">
            <label htmlFor="pincode" className="text-xl lg:text-2xl">
              Pincode
            </label>
            <input
              className="w-full py-2 text-xl border lg:text-2xl lg:py-4 border-primary form-input"
              type="text"
              name="pincode"
              id="pincode"
              placeholder="500062"
              value={shippingFormData.pincode}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label className="flex items-center gap-2 text-xl cursor-pointer select-none lg:text-2xl">
            <input
              className="p-2form-checkbox"
              type="checkbox"
              name="saveInformation"
              id="saveInformation"
              checked={shippingFormData.saveInformation}
              onChange={handleChange}
            />
            <span>Save this information for next time</span>
          </label>
        </div>
      </form>
    </section>
  );
};

export default memo(ShippingInformation);
