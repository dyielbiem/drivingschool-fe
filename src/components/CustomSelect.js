import { useState, useEffect, useRef } from "react";
import { IoIosArrowDown } from "react-icons/io";

const CustomSelect = ({
  id = "",
  className = "",
  options = [],
  placeholder = "Select an item",
  valueKey = "value",
  labelKey = "label",
  defaultValue = { [valueKey]: null, [labelKey]: null },
  required = false,
  fallBackValue = ""
}) => {
  const [selected, setSelected] = useState(defaultValue);
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        !isDropDownOpen ||
        !containerRef?.current ||
        containerRef?.current?.contains?.(e.target)
      )
        return;

      setIsDropDownOpen(false);
    };
    document.addEventListener("click", handleOutsideClick);

    return () => document.removeEventListener("click", handleOutsideClick);
  }, [isDropDownOpen]);

  const handleSelect = (option) => {
    setSelected(option);
    setIsDropDownOpen(false);
  };

  return (
    <div className={`custom-select ${className}`} ref={containerRef}>
      <p
        className={`${
          !fallBackValue &&
          (selected[valueKey] === null || selected[valueKey] === undefined)
            ? "as-placeholder"
            : ""
        }`}
        onClick={() => setIsDropDownOpen((prevState) => !prevState)}
      >
        {selected[labelKey] || fallBackValue || placeholder}
      </p>
      <IoIosArrowDown />
      <input
        type="text"
        value={selected[valueKey] || fallBackValue || ""}
        required={required}
        name={id}
        onChange={() => {}}
        id={id}
        onClick={() => setIsDropDownOpen(true)}
      />
      <input
        type="text"
        value={selected[labelKey] || fallBackValue || ""}
        name={`${id}-label`}
        id={`${id}-label`}
        onChange={() => {}}
      />
      {isDropDownOpen && (
        <ul>
          {options.map((option, idx) => (
            <li
              key={idx}
              onClick={() => handleSelect(option)}
              className={`${
                selected[valueKey] === option[valueKey]
                  ? "!bg-custom-blue-base text-white"
                  : ""
              }`}
            >
              {option[labelKey]}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;
