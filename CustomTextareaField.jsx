import { useState } from "react";

const CustomTextareaField = ({ label, id, value, onChange, rows }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative w-full">
      <textarea
        id={id}
        value={value}
        rows={rows}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`w-full px-4 py-3 md:py-4 border-2 rounded-lg ${
          isFocused ? "border-blue-500" : "border-gray-300"
        } focus:outline-none text-xl font-bold tracking-wider leading-relaxed`}
      />
      <label
        htmlFor={id}
        className={`absolute -top-3 px-1 left-3 text-gray-500 bg-white ${
          isFocused ? "text-blue-500 text-sm" : "text-base"
        } transition-all text-lg`}
      >
        {label}
      </label>
    </div>
  );
};

export default CustomTextareaField;
