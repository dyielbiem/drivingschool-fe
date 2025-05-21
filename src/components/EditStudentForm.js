import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useFormState } from "react-dom";
import { IoMdArrowRoundBack } from "react-icons/io";

import handleStudentUpdate from "@/actions/handleStudentUpdate";
import { useStudentsInSection } from "@/state/store";
import { stateOptions } from "@/constants";
import { formatDate } from "@/utils";

import FormButton from "./FormButton";
import FormErrorMessage from "./FormErrorMessage";
import FormField from "./FormField";

const studentInfoFields = (student) => {
  const {
    studentUserName,
    isActive,
    mailingFirstName,
    mailingLastName,
    mailingAddress,
    mailingCity,
    mailingState,
    mailingZip,
    mailingEmail,
    mailingPhoneNumber,
    birthDate,
    highSchool
  } = student;
  const mailingStateObj = stateOptions.find(
    (item) => item.value === mailingState
  );

  return [
    {
      id: "username",
      type: "text",
      label: "Username",
      required: true,
      otherInputProps: {
        readOnly: true,
        value: studentUserName
      }
    },
    {
      id: "is-active",
      type: "select",
      label: "Status",
      required: true,
      selectProps: {
        options: [
          { label: "Active", value: "true" },
          { label: "Inactive", value: "false" }
        ],
        placeholder: "Select status",
        defaultValue: {
          label: isActive ? "Active" : "Inactive",
          value: isActive
        }
      }
    },
    {
      id: "first-name",
      type: "text",
      label: "First name",
      required: true,
      otherInputProps: {
        defaultValue: mailingFirstName
      }
    },
    {
      id: "last-name",
      type: "text",
      label: "Last name",
      required: true,
      otherInputProps: {
        defaultValue: mailingLastName
      }
    },
    {
      id: "address",
      type: "text",
      label: "Address",
      className: "col-span-full",
      required: true,
      otherInputProps: {
        defaultValue: mailingAddress
      }
    },
    {
      id: "city",
      type: "text",
      label: "City",
      required: true,
      otherInputProps: {
        defaultValue: mailingCity
      }
    },
    {
      id: "state",
      type: "select",
      label: "State",
      required: true,
      selectProps: {
        options: stateOptions,
        placeholder: "Select state",
        defaultValue: {
          label: mailingStateObj?.label || "",
          value: mailingStateObj?.value || null
        },
        fallBackValue: mailingState
      }
    },
    {
      id: "zip",
      type: "text",
      label: "Zip Code",
      required: true,
      otherInputProps: {
        defaultValue: mailingZip
      }
    },
    {
      id: "email",
      type: "email",
      label: "Email",
      required: true,
      otherInputProps: {
        defaultValue: mailingEmail
      }
    },
    {
      id: "phone-number",
      type: "text",
      label: "Phone number",
      format: "XXX-XXX-XXXX",
      required: true,
      otherInputProps: {
        defaultValue: mailingPhoneNumber,
        pattern: "^[0-9]{3}-[0-9]{3}-[0-9]{4}$"
      }
    },
    {
      id: "birth-date",
      type: "date",
      required: true,
      label: "Birth date",
      otherInputProps: {
        defaultValue: formatDate(birthDate, "YYYY-MM-DD")
      }
    },
    {
      id: "high-school",
      type: "text",
      label: "High school name",
      otherInputProps: {
        defaultValue: highSchool
      }
    }
  ];
};

const billingInfoFields = (student) => {
  const {
    billingFirstName,
    billingLastName,
    billingAddress,
    billingCity,
    billingState,
    billingZip,
    billingEmail,
    billingPhoneNumber
  } = student;
  const billingStateObj = stateOptions.find(
    (item) => item.value === billingState
  );

  return [
    {
      id: "student-billing-first-name",
      type: "text",
      label: "First name",
      otherInputProps: {
        defaultValue: billingFirstName ?? ""
      }
    },
    {
      id: "student-billing-last-name",
      type: "text",
      label: "Last name",
      otherInputProps: {
        defaultValue: billingLastName ?? ""
      }
    },
    {
      id: "student-billing-address",
      type: "text",
      label: "Address",
      className: "col-span-full",
      otherInputProps: {
        defaultValue: billingAddress ?? ""
      }
    },
    {
      id: "student-billing-city",
      type: "text",
      label: "City",
      otherInputProps: {
        defaultValue: billingCity ?? ""
      }
    },
    {
      id: "student-billing-state",
      type: "select",
      label: "State",
      selectProps: {
        options: stateOptions,
        placeholder: "Select state",
        defaultValue: {
          label: billingStateObj?.label || "",
          value: billingStateObj?.value || null
        },
        fallBackValue: billingState
      }
    },
    {
      id: "student-billing-zip",
      type: "text",
      label: "Zip Code",
      otherInputProps: {
        defaultValue: billingZip
      }
    },
    {
      id: "student-billing-email",
      type: "email",
      label: "Email",
      otherInputProps: {
        defaultValue: billingEmail
      }
    },
    {
      id: "student-billing-phone",
      type: "text",
      label: "Phone number",
      format: "XXX-XXX-XXXX",
      otherInputProps: {
        defaultValue: billingPhoneNumber,
        pattern: "^[0-9]{3}-[0-9]{3}-[0-9]{4}$"
      }
    }
  ];
};

const parentInfoFields = (student) => {
  const { parentFirstName, parentLastName, parentEmail, parentPhoneNumber } =
    student;

  return [
    {
      id: "parent-first-name",
      type: "text",
      label: "First name",
      otherInputProps: {
        defaultValue: parentFirstName ?? ""
      }
    },
    {
      id: "parent-last-name",
      type: "text",
      label: "Last name",
      otherInputProps: {
        defaultValue: parentLastName ?? ""
      }
    },
    {
      id: "parent-email",
      type: "email",
      label: "Email",
      otherInputProps: {
        defaultValue: parentEmail
      }
    },
    {
      id: "parent-phone",
      type: "text",
      label: "Phone number",
      format: "XXX-XXX-XXXX",
      otherInputProps: {
        defaultValue: parentPhoneNumber,
        pattern: "^[0-9]{3}-[0-9]{3}-[0-9]{4}$"
      }
    }
  ];
};

const MultiFields = ({ section }) => {
  return section.map((field, idx) => <FormField key={idx} {...field} />);
};

const EditStudentForm = ({ student }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setUpdateStudent } = useStudentsInSection();

  const initialState = {
    message: undefined,
    oldStudent: student,
    updatedStudent: undefined,
    isUpdated: false
  };

  const [formState, formAction] = useFormState(
    handleStudentUpdate,
    initialState
  );

  useEffect(() => {
    if (!formState.updatedStudent) return;
    if (formState.isUpdated) {
      setUpdateStudent(formState.updatedStudent);
    }

    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.delete("edit_student");

    router.push(`${pathname}?${currentParams}`);
  }, [
    formState.isUpdated,
    formState.updatedStudent,
    pathname,
    router,
    searchParams,
    setUpdateStudent
  ]);

  const cancelClick = () => {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.delete("edit_student");
    router.push(`${pathname}?${currentParams}`);
  };

  const goBack = () => {
    router.push(pathname);
  };

  return (
    <form className="edit-student-form" action={formAction}>
      <div className="header">
        <button type="button" onClick={goBack}>
          <IoMdArrowRoundBack />
        </button>
        <h1>Edit student</h1>
      </div>
      <h2>Student Information</h2>
      <MultiFields section={studentInfoFields(student)} />

      <h2>Billing Information</h2>
      <MultiFields section={billingInfoFields(student)} />

      <h2>Parent Information</h2>
      <MultiFields section={parentInfoFields(student)} />

      {formState?.message && (
        <FormErrorMessage>{formState.message}</FormErrorMessage>
      )}
      <div className="btn-container">
        <FormButton>Submit</FormButton>
        <button type="button" onClick={cancelClick}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EditStudentForm;
