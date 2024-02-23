"use client";

import { useFormStatus } from "react-dom";
import { LuLoader2 } from "react-icons/lu";

const FormButton = ({ children }) => {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending && <LuLoader2 />}
      {!pending && children}
    </button>
  );
};

export default FormButton;
