import type { ChangeEvent, Dispatch, SetStateAction } from "react";
import { memo } from "react";
import { ICheckoutForm } from "@interfaces/form";

interface IContactInformation {
  checkoutFormData: ICheckoutForm;
  setCheckoutFormData: Dispatch<SetStateAction<ICheckoutForm>>;
}

const ContactInformation = ({
  checkoutFormData,
  setCheckoutFormData,
}: IContactInformation) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const type = e.target.type;
    const name = e.target.name;
    const value = type === "checkbox" ? e.target.checked : e.target.value;
    setCheckoutFormData((prevCheckoutFormData: ICheckoutForm) => {
      return { ...prevCheckoutFormData, [name]: value };
    });
  };
  return (
    <section className="mt-2">
      <h2 className="mb-2 text-lg sm:text-xl lg:text-3xl">
        Contact Information
      </h2>
      <form className="flex flex-col gap-2 text-xl">
        <div className="form-group">
          <label htmlFor="email" className="text-xl lg:text-2xl">
            Email
          </label>
          <input
            className="w-full py-2 text-xl border lg:text-2xl lg:py-4 border-primary form-input"
            type="email"
            name="email"
            id="email"
            placeholder="john@example.com"
            value={checkoutFormData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="w-full form-group">
          <label htmlFor="phone" className="text-xl lg:text-2xl">
            Phone Number
          </label>
          <input
            className="w-full py-2 text-xl border lg:text-2xl lg:py-4 border-primary form-input"
            type="tel"
            name="phone"
            id="phone"
            placeholder="04065558366"
            value={checkoutFormData.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label className="flex items-center gap-2 text-xl cursor-pointer select-none lg:text-2xl">
            <input
              className="p-2form-checkbox"
              type="checkbox"
              name="offers"
              id="offers"
              checked={checkoutFormData.offers}
              onChange={handleChange}
            />
            <span>Email me with news and offers</span>
          </label>
        </div>
      </form>
    </section>
  );
};

export default memo(ContactInformation);
