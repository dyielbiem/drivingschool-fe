import { useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useFormState } from "react-dom";
import { IoMdArrowRoundBack } from "react-icons/io";

import handleStudentSubmit from "@/actions/handleStudentSubmit";
import { stateOptions } from "@/constants";

import FormButton from "./FormButton";
import FormErrorMessage from "./FormErrorMessage";
import FormField from "./FormField";

const MultiFields = ({ section }) => {
  return section.map((field, idx) => <FormField key={idx} {...field} />);
};

const AddStudentForm = ({ courses, setStudentSections }) => {
  const studentInfoFields = [
    {
      id: "student-username",
      type: "text",
      label: "Username",
      required: true,
      otherInputProps: {
        autoComplete: "off"
      }
    },
    {
      id: "student-course",
      type: "select",
      label: "Course",
      required: true,
      selectProps: {
        options: courses,
        placeholder: "Select course",
        labelKey: "courseName",
        valueKey: "courseID"
      }
    },
    {
      id: "student-password",
      type: "password",
      label: "Password",
      required: true,
      otherInputProps: {
        autoComplete: "off"
      }
    },
    {
      id: "student-confirm-password",
      type: "password",
      label: "Confirm password",
      required: true,
      otherInputProps: {
        autoComplete: "off"
      }
    },
    {
      id: "student-first-name",
      type: "text",
      label: "First name",
      required: true
    },
    {
      id: "student-last-name",
      type: "text",
      label: "Last name",
      required: true
    },
    {
      id: "student-address",
      type: "text",
      label: "Address",
      required: true,
      className: "md:!col-span-2"
    },
    {
      id: "student-city",
      type: "text",
      label: "City",
      required: true
    },
    {
      id: "student-state",
      type: "select",
      label: "State",
      required: true,
      selectProps: {
        options: stateOptions,
        placeholder: "Select a state"
      }
    },
    {
      id: "student-zip",
      type: "text",
      label: "Zip code",
      required: true,
      otherInputProps: {
        pattern: "^\\d+$",
        maxLength: 20
      }
    },
    {
      id: "student-email",
      type: "email",
      label: "Email",
      required: true
    },
    {
      id: "student-phone",
      type: "text",
      label: "Phone number",
      required: false,
      format: "XXX-XXX-XXXX",
      required: true,
      otherInputProps: {
        pattern: "^\\d{3}-\\d{3}-\\d{4}$",
        maxLength: 12
      }
    },
    {
      id: "student-birthdate",
      type: "date",
      label: "Birth date",
      required: true
    },
    {
      id: "student-high-school",
      type: "text",
      label: "High school name"
    },
    {
      id: "student-coupon-code",
      type: "text",
      label: "Coupon code",
      required: false,
      otherInputProps: {
        autoComplete: "off"
      }
    }
  ];

  const cardInfoFields = [
    {
      id: "student-card-number",
      type: "text",
      label: "Card number (13-16 digits)",
      required: false,
      otherInputProps: {
        minLength: 13,
        maxLength: 16,
        pattern: "^\\d+$"
      }
    },
    {
      id: "student-card-code",
      type: "text",
      label: "Card code (3-4 digits)",
      required: false,
      otherInputProps: {
        minLength: 3,
        maxLength: 4,
        pattern: "^\\d+$"
      }
    },
    {
      id: "student-card-expiration",
      type: "text",
      label: "Card expiration (YYYY-MM)",
      required: false,
      otherInputProps: {
        pattern: "^\\d{4}-\\d{2}$",
        maxLength: 7
      }
    }
  ];

  const billingInfoFields = [
    {
      id: "student-billing-first-name",
      type: "text",
      label: "First name",
      required: false
    },
    {
      id: "student-billing-last-name",
      type: "text",
      label: "Last name",
      required: false
    },
    {
      id: "student-billing-address",
      type: "text",
      label: "Address",
      className: "md:!col-span-2",
      required: false
    },
    {
      id: "student-billing-city",
      type: "text",
      label: "City",
      required: false
    },
    {
      id: "student-billing-state",
      type: "select",
      label: "State",
      selectProps: {
        options: stateOptions,
        placeholder: "Select a state"
      }
    },
    {
      id: "student-billing-zip",
      type: "text",
      label: "Zip code",
      required: false,
      otherInputProps: {
        pattern: "^\\d+$",
        maxLength: 20
      }
    },
    {
      id: "student-billing-email",
      type: "email",
      label: "Email",
      required: false
    },
    {
      id: "student-billing-phone",
      type: "text",
      label: "Phone number",
      required: false,
      format: "XXX-XXX-XXXX",
      otherInputProps: {
        pattern: "^\\d{3}-\\d{3}-\\d{4}$",
        maxLength: 12
      }
    }
  ];

  const parentInfoFields = [
    {
      id: "parent-first-name",
      type: "text",
      label: "First name"
    },
    {
      id: "parent-last-name",
      type: "text",
      label: "Last name"
    },
    {
      id: "parent-email",
      type: "email",
      label: "Email"
    },
    {
      id: "parent-phone",
      type: "text",
      label: "Phone number",
      required: false,
      format: "XXX-XXX-XXXX",
      otherInputProps: {
        pattern: "^\\d{3}-\\d{3}-\\d{4}$",
        maxLength: 12
      }
    }
  ];

  const router = useRouter();
  const pathname = usePathname();
  const formRef = useRef(null);

  const initialState = {
    message: undefined,
    ok: false
  };

  const [formState, formAction] = useFormState(
    handleStudentSubmit,
    initialState
  );

  useEffect(() => {
    if (!formState?.ok) {
      const container = formState.message && formRef?.current?.parentNode;
      container?.scrollTo({
        top: formRef.current.parentNode.scrollHeight,
        behavior: "smooth"
      });

      return;
    }

    setStudentSections((state) =>
      state.map((item) => {
        if (!item?.isActive) return item;
        return { ...item, NoOfStudents: item.NoOfStudents + 1 };
      })
    );

    router.push(pathname);
  }, [formState, pathname, router, setStudentSections]);

  const goBack = () => {
    router.push(pathname);
  };

  return (
    <form
      ref={formRef}
      action={formAction}
      className="add-student-form"
      autoComplete="off"
    >
      <div className="header">
        <button type="button" onClick={goBack}>
          <IoMdArrowRoundBack />
        </button>
        <h1>Add student</h1>
      </div>

      {/* Student Information */}
      <h2>Student Information</h2>
      <MultiFields section={studentInfoFields} />

      <hr />

      {/* Card Information */}
      <h2>Card Information</h2>
      <MultiFields section={cardInfoFields} />

      <hr />

      {/* Billing Information */}
      <h2>Billing Information</h2>
      <p className="note">
        <strong>Important:</strong> Billing information is required when card
        information is provided.
      </p>
      <MultiFields section={billingInfoFields} />

      <hr />

      {/* Parent Information */}
      <h2>Parent Information</h2>
      <MultiFields section={parentInfoFields} />

      {formState?.message && (
        <FormErrorMessage>{formState.message}</FormErrorMessage>
      )}
      <div className="btn-container">
        <FormButton>Submit</FormButton>
        <button type="button" onClick={goBack}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AddStudentForm;
