"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { IoMdArrowRoundBack, IoIosMail } from "react-icons/io";
import { toast } from "react-toastify";

import adminFetchStudent from "@/services/api/adminFetchStudent";
import adminEmailStudentAccountInfo from "@/services/api/adminEmailStudentAccountInfo";
import { formatDate } from "@/utils";

import FormField from "@/components/FormField";

const MultiFields = ({ fields, student }) => {
  return fields.map((field, idx) => {
    let defaultValue = student?.[field.attrKey] || "--";

    if (field.isDateString) {
      defaultValue = formatDate(defaultValue) || "--";
    }

    return (
      <FormField
        key={idx}
        {...field}
        type="text"
        otherInputProps={{
          disabled: true,
          defaultValue
        }}
      />
    );
  });
};

const studentInfoFields = [
  {
    id: "student-username",
    label: "Username",
    attrKey: "studentUserName"
  },
  {
    id: "student-course",
    label: "Course",
    attrKey: "courseName"
  },
  {
    id: "student-first-name",
    label: "First name",
    attrKey: "mailingFirstName"
  },
  {
    id: "student-last-name",
    label: "Last name",
    attrKey: "mailingLastName"
  },
  {
    id: "student-address",
    label: "Address",
    className: "md:!col-span-2",
    attrKey: "mailingAddress"
  },
  {
    id: "student-city",
    label: "City",
    attrKey: "mailingCity"
  },
  {
    id: "student-state",
    label: "State",
    attrKey: "mailingState"
  },
  {
    id: "student-zip",
    label: "Zip Code",
    attrKey: "mailingZip"
  },
  {
    id: "student-email",
    label: "Email",
    attrKey: "mailingEmail"
  },
  {
    id: "student-phone",
    label: "Phone number",
    attrKey: "mailingPhoneNumber"
  },
  {
    id: "student-birthdate",
    label: "Birth date",
    attrKey: "birthDate",
    isDateString: true
  },
  {
    id: "student-high-school",
    label: "High school name",
    attrKey: "highSchool"
  }
];

const billingInfoFields = [
  {
    id: "student-billing-first-name",
    label: "First name",
    attrKey: "billingFirstName"
  },
  {
    id: "student-billing-last-name",
    label: "Last name",
    attrKey: "billingLastName"
  },
  {
    id: "student-billing-address",
    label: "Address",
    className: "md:!col-span-2",
    attrKey: "billingAddress"
  },
  {
    id: "student-billing-city",
    label: "City",
    attrKey: "billingCity"
  },
  {
    id: "student-billing-state",
    label: "State",
    attrKey: "billingState"
  },
  {
    id: "student-billing-zip",
    label: "Zip code",
    attrKey: "billingZip"
  },
  {
    id: "student-billing-email",
    label: "Email",
    attrKey: "billingEmail"
  },
  {
    id: "student-billing-phone",
    label: "Phone number",
    attrKey: "billingPhoneNumber"
  }
];

const parentInfoFields = [
  {
    id: "parent-first-name",
    label: "First name",
    attrKey: "parentFirstName"
  },
  {
    id: "parent-last-name",
    label: "Last name",
    attrKey: "parentLastName"
  },
  {
    id: "parent-email",
    label: "Email",
    attrKey: "parentEmail"
  },
  {
    id: "parent-phone",
    label: "Phone number",
    attrKey: "parentPhoneNumber"
  }
];

const StudentProfile = ({ params: { sectionID, studentUserName } }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [student, setStudent] = useState(null);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const redirectPath = useMemo(() => {
    const endPath = searchParams.get("prev") || "all";
    return `/admin/students/${sectionID}/${endPath}?page=1`;
  }, [sectionID, searchParams]);

  useEffect(() => {
    const fetchStudent = async () => {
      const { ok, json } = await adminFetchStudent(studentUserName);
      if (!ok) {
        router.replace(redirectPath);
        return;
      }

      setStudent(json);
    };

    fetchStudent();
  }, [redirectPath, router, studentUserName]);

  const handleEmailAccountInfo = async () => {
    setIsSendingEmail(true);
    await adminEmailStudentAccountInfo(studentUserName);
    toast.success(
      <p className="toastify-message">
        Account information has been emailed to the student
      </p>,
      { onClose: () => setIsSendingEmail(false) }
    );
  };

  if (!student) return null;

  return (
    <div className="admin-students-container">
      <div className="student-profile">
        <div className="header">
          <button type="button" onClick={() => router.push(redirectPath)}>
            <IoMdArrowRoundBack />
          </button>
          <h1>Student Profile</h1>
          <button onClick={handleEmailAccountInfo} disabled={isSendingEmail}>
            <IoIosMail />
            <span>Email Account Information</span>
          </button>
        </div>
        <h2>Student Information</h2>
        <MultiFields fields={studentInfoFields} student={student} />
        <h2>Billing Information</h2>
        <MultiFields fields={billingInfoFields} student={student} />
        <h2>Parent Information</h2>
        <MultiFields fields={parentInfoFields} student={student} />
      </div>
    </div>
  );
};

export default StudentProfile;
