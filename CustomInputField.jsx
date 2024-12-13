import { useState } from "react";

const CustomInputField = ({
  label,
  id,
  value,
  onChange,
  disabled,
  type = "text",
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative w-full">
      <input
        id={id}
        value={value}
        type={type}
        disabled={disabled}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`w-full px-4 py-3 md:py-4 border-2 rounded-lg ${
          isFocused ? "border-blue-500" : "border-gray-300"
        } focus:outline-none text-xl font-bold tracking-wider`}
      />
      <label
        htmlFor={id}
        className={`absolute -top-3 left-3 px-1 text-gray-500 bg-white ${
          isFocused ? "text-blue-500" : ""
        } transition-all text-lg`}
      >
        {label}
      </label>
    </div>
  );
};

export default CustomInputField;
