import CustomSelect from "./CustomSelect";

const getElementMap = (type) => {
  if (type === "select") return CustomSelect;
  return "input";
};

const FormField = ({
  id,
  type,
  label,
  required = false,
  className = "",
  format,
  otherInputProps = {},
  selectProps = {}
}) => {
  const Element = getElementMap(type);

  return (
    <div className={`fields ${className}`}>
      <label htmlFor={id}>
        {label} {required && <span>*</span>} {format && `(${format})`}
      </label>
      <Element
        type={type}
        name={id}
        id={id}
        required={required}
        {...selectProps}
        {...otherInputProps}
      />
    </div>
  );
};

export default FormField;
