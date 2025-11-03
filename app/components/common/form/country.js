"use client";
import { useState, useMemo, useEffect } from "react";
import { Form } from "antd";
import countryList from "react-select-country-list";
import { IoChevronDown } from "react-icons/io5";

const FormCountrySelect = ({ name, label, required, disabled, initialValue }) => {
 const [value, setValue] = useState(initialValue || "SA");
  const options = useMemo(() => countryList().getData(), []);


  useEffect(() => {
    setValue(initialValue || "SA");
  }, [initialValue]);


  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <Form.Item
      label={<p className="text-base font-medium text-[#242628]">{label}</p>}
      name={name}
      rules={[
        {
          required: required,
          message: "Please select a country!",
        },
      ]}
    >
      <div className="relative">
        <select
          value={value}
          onChange={handleChange}
          disabled={disabled}
          placeholder="Select Country"
          className="appearance-none w-full bg-white border border-[#E0E0E0] text-[#242628] rounded-[10px] px-[20px] focus:outline-none focus:border-[#d9d9d9] focus:ring-1 focus:ring-[#d9d9d9] h-[56px]"
        >
          {options?.map((country, index) => (
            <option key={index} value={country?.value}>
              {country?.label}
            </option>
          ))}
        </select>
        {/* <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
          <IoChevronDown size={20} />
        </div> */}
      </div>
    </Form.Item>
  );
};

export default FormCountrySelect;