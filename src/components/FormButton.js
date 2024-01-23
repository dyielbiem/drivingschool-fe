"use client";

import { useFormStatus } from "react-dom";

const FormButton = ({ children }) => {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {children}
    </button>
  );
};

export default FormButton;
