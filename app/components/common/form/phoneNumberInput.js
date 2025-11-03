"use client";
import React from "react";
import PhoneInput from "react-phone-number-input";
import { Form } from "antd";
import { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";

const PhoneNumberInput = ({
  disabled,
  className,
  name,
  label,
  required = false,
  initialValue = "",
  rules = [],
  dependencies = [],
  isEmail,
  readOnly,
  onChange,
  placeholder,
}) => {
  let initRules = [
    {
      required: required,
      message: `Please provide ${label?.toLowerCase() || "a value"}`,
    },
    () => ({
      validator(_, value) {
        if (value && !isValidPhoneNumber(value)) {
          return Promise.reject(new Error("Invalid Phone number"));
        }
        return Promise.resolve();
      },
    }),
  ];
  return (
    <Form.Item
      name={name}
      label={<p className="text-base font-medium text-[#242628] ">{label}</p>}
      dependencies={dependencies}
      initialValue={initialValue}
      rules={[...initRules, ...rules]}
      className={className}
    >
      <PhoneInput
        international
        onChange={onChange}
        defaultCountry="SA"
        readOnly={readOnly}
        placeholder={placeholder}
        disabled={disabled}
        className={`border border-[#E0E0E0] rounded-[10px] px-[20px] w-full pt-[19px] pb-[18px] h-[56px]`}
      />
    </Form.Item>
  );
};

export default PhoneNumberInput;
