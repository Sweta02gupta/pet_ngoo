import { useState } from "react";

const CustomSelectField = ({
  label,
  id,
  options,
  value,
  onChange,
  labelSelector,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative w-full">
      <select
        id={id}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`w-full px-4 py-3 md:py-4 border-2 rounded-lg ${
          isFocused ? "border-blue-500" : "border-gray-300"
        } focus:outline-none text-xl font-bold tracking-wider`}
      >
        <option value="" disabled>
          {isFocused ? "Choose any one from below" : "Click to see all options"}
        </option>
        {options.map((option) => (
          <option key={option.id} value={option.id} className="py-2">
            {option[labelSelector]}
          </option>
        ))}
      </select>
      <label
        htmlFor={id}
        className={`absolute -top-3 left-3 text-gray-500 bg-white px-1 ${
          isFocused ? "text-blue-500" : ""
        } transition-all text-lg`}
      >
        {label}
      </label>
    </div>
  );
};

export default CustomSelectField;
