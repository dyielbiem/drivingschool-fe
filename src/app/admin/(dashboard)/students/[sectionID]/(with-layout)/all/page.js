"use client";
import { useEffect, useState, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FaTrashCan, FaPen, FaEye } from "react-icons/fa6";
import { Tooltip } from "react-tooltip";

import Pagination from "@/components/Pagination";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import EditStudentForm from "@/components/EditStudentForm";

import adminDeleteStudent from "@/services/api/adminDeleteStudent";
import { useStudentsInSection, useAdmin } from "@/state/store";

const TableHeader = () => (
  <li className="table-header">
    <p>Username</p>
    <p>Name</p>
    <p>Email Address</p>
    <p>Lesson Progress</p>
    <p>Status</p>
  </li>
);

const Student = ({ student, onEdit, onDelete, onView }) => {
  const { admin } = useAdmin();
  const {
    mailingFirstName,
    mailingLastName,
    studentUserName,
    mailingEmail,
    isCourseCompleted,
    chapterProgress,
    isActive
  } = student;
  return (
    <li>
      <p>
        <span>Username: </span> {studentUserName}
      </p>
      <p>
        <span>Name: </span>
        {mailingFirstName} {mailingLastName}
      </p>
      <p>
        <span>Email: </span> {mailingEmail}
      </p>
      <p>
        <span>Lesson progress: </span>
        {isCourseCompleted
          ? "Completed"
          : chapterProgress
            ? `Chapter ${chapterProgress}`
            : "In progress"}
      </p>
      <p
        className={`${
          isActive
            ? "bg-custom-green-light text-custom-green-base"
            : "bg-custom-gray-base text-custom-gray-dark"
        }`}
      >
        {isActive ? "ACTIVE" : "INACTIVE"}
      </p>
      <div>
        <button
          onClick={() => onEdit(studentUserName)}
          data-tooltip-id="all-students-table-tooltip"
          data-tooltip-content="Edit Student"
        >
          <FaPen />
        </button>
        {!admin.limitedAccess && (
          <button
            onClick={() => onDelete(studentUserName)}
            data-tooltip-id="all-students-table-tooltip"
            data-tooltip-content="Delete Student"
          >
            <FaTrashCan />
          </button>
        )}
        <button
          onClick={() => onView(studentUserName)}
          data-tooltip-id="all-students-table-tooltip"
          data-tooltip-content="View Student"
        >
          <FaEye />
        </button>
      </div>
    </li>
  );
};

const AllStudentsTable = ({ students }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const handleEdit = (studentUserName) => {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set("edit_student", studentUserName);
    router.push(`${pathname}?${currentParams}`);
  };

  const handleDelete = (studentUserName) => {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set("delete_student", studentUserName);
    router.push(`${pathname}?${currentParams}`);
  };

  const handleView = (studentUserName) => {
    const redirectPath =
      pathname.split("/").slice(0, -1).join("/") + `/${studentUserName}`;
    router.push(redirectPath);
  };

  if (students.length === 0) return null;

  return (
    <ul className="all-students-table">
      <TableHeader />
      {students.map((student, index) => (
        <Student
          key={index}
          student={student}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
        />
      ))}
    </ul>
  );
};

const AdminAllStudents = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchKey = searchParams.get("search")?.toLocaleLowerCase?.();
  const page = Number(searchParams.get("page"));

  const [studentToDelete, setStudentToDelete] = useState(null);
  const [studentToEdit, setStudentToEdit] = useState(null);

  const { students, noOfRows, setDeleteStudent } = useStudentsInSection();
  const { admin } = useAdmin();

  // Observe for edit_student query
  useEffect(() => {
    if (!searchParams.get("edit_student") || students?.length === 0)
      return setStudentToEdit(null);

    const student = students.find(
      (eachStudent) =>
        eachStudent.studentUserName === searchParams.get("edit_student")
    );

    if (!student) {
      const currentParams = new URLSearchParams(searchParams.toString());
      currentParams.delete("edit_student");
      setStudentToEdit(null);
      router.replace(`${pathname}?${currentParams}`);
    }

    setStudentToEdit(student);
  }, [pathname, router, searchParams, students]);

  // Observe for delete_student query
  useEffect(() => {
    if (
      !searchParams.get("delete_student") ||
      students?.length === 0 ||
      admin?.limitedAccess
    )
      return setStudentToDelete(null);

    const student = students.find(
      (eachStudent) =>
        eachStudent.studentUserName === searchParams.get("delete_student")
    );

    if (!student) return setStudentToDelete(null);

    setStudentToDelete(student);
  }, [admin, searchParams, students]);

  const sortAlphabetical = (a, b) =>
    a.studentUserName.localeCompare(b.studentUserName);

  const studentsToRender = useMemo(() => {
    if (students?.length === 0) return [];

    const sortedStudents = [...students].sort(sortAlphabetical);
    const firstStudentInPageIdx = (page - 1) * noOfRows;
    const lastStudentInPageIdx = (page - 1) * noOfRows + noOfRows;

    if (!searchKey)
      return sortedStudents.slice(firstStudentInPageIdx, lastStudentInPageIdx);

    return sortedStudents.filter((eachStudent) => {
      const {
        studentUserName,
        mailingFirstName,
        mailingLastName,
        mailingEmail
      } = eachStudent;

      const searchableFields = {
        username: studentUserName?.toLowerCase() || "",
        email: mailingEmail?.toLowerCase() || "",
        fullName: `${mailingFirstName} ${mailingLastName}`.toLowerCase()
      };

      return Object.values(searchableFields).some((field) =>
        field.includes(searchKey)
      );
    });
  }, [students, searchKey, noOfRows, page]);

  if (studentToEdit) {
    return <EditStudentForm student={studentToEdit} />;
  }

  const pathWithNoDeleteQuery = () => {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.delete("delete_student");
    return `${pathname}?${currentParams}`;
  };

  const deleteAction = async () => {
    const response = await adminDeleteStudent(studentToDelete.studentUserName);
    if (!response.ok) return;
    setDeleteStudent(studentToDelete.studentUserName);
    router.push(pathWithNoDeleteQuery());
  };

  return (
    <>
      <AllStudentsTable students={studentsToRender} />
      <Pagination
        isVisible={students?.length !== 0 && !searchParams.get("search")}
        itemsLength={Number(students?.length)}
        noOfRows={noOfRows}
      />
      {studentToDelete && (
        <ConfirmDeleteModal
          itemToDelete={studentToDelete.studentUserName}
          pathWhenModalIsClosed={pathWithNoDeleteQuery()}
          confirmAction={deleteAction}
        />
      )}
      <Tooltip id="all-students-table-tooltip" />
    </>
  );
};

export default AdminAllStudents;
