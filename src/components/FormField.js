import CustomSelect from "./CustomSelect";

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
  return (
    <div className={`fields ${className}`}>
      <label htmlFor={id}>
        {label} {required && <span>*</span>} {format && `(${format})`}
      </label>
      {type === "select" ? (
        <CustomSelect {...selectProps} id={id} required={required} />
      ) : (
        <input
          type={type}
          name={id}
          id={id}
          required={required}
          {...otherInputProps}
        />
      )}
    </div>
  );
};

export default FormField;
