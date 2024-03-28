"use client";
import { FaTrashCan } from "react-icons/fa6";
import { FaPen } from "react-icons/fa6";
import { useStudentsInSection } from "@/state/store";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Pagination from "@/components/Pagination";
import { useEffect, useState } from "react";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import adminDeleteStudent from "@/services/api/adminDeleteStudent";
import EditStudentForm from "@/components/EditStudentForm";

const AdminAllStudents = () => {
  const { students, noOfRows, setDeleteStudent } = useStudentsInSection();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page"));
  const searchKey = searchParams.get("search");
  const router = useRouter();
  const pathname = usePathname();
  const [studentToDelete, setStudentToDelete] = useState(undefined);
  const [studentToEdit, setStudentToEdit] = useState(undefined);

  // Observe for edit_student query
  useEffect(() => {
    if (!searchParams.get("edit_student") || students?.length === 0)
      return setStudentToEdit(undefined);

    const student = students.find(
      (eachStudent) =>
        eachStudent.studentUserName === searchParams.get("edit_student")
    );

    if (!student) {
      const currentParams = new URLSearchParams(searchParams.toString());
      currentParams.delete("edit_student");
      setStudentToEdit(undefined);
      router.replace(`${pathname}?${currentParams}`);
    }

    setStudentToEdit(student);
  }, [pathname, router, searchParams, students]);

  // Observe for delete_student query
  useEffect(() => {
    if (!searchParams.get("delete_student") || students?.length === 0)
      return setStudentToDelete(undefined);

    const student = students.find(
      (eachStudent) =>
        eachStudent.studentUserName === searchParams.get("delete_student")
    );

    if (!student) return setStudentToDelete(undefined);

    setStudentToDelete(student);
  }, [searchParams, students]);

  if (studentToEdit) {
    return <EditStudentForm student={studentToEdit} />;
  }

  const sortAlphabetical = (a, b) =>
    a.studentUserName.localeCompare(b.studentUserName);

  const filterStudents = () => {
    if (students.length === 0) return [];
    const searchKeyLowerCase = searchKey.toLowerCase();
    return students
      .filter((eachStudent) => {
        const username = eachStudent.studentUserName.toLowerCase();
        const fullName =
          `${eachStudent.mailingFirstName} ${eachStudent.mailingLastName}`.toLowerCase();

        if (
          username.includes(searchKeyLowerCase) ||
          fullName.includes(searchKeyLowerCase)
        )
          return eachStudent;
      })
      .sort(sortAlphabetical);
  };

  const studentsPerPage = () => {
    if (students.length === 0) return [];
    const firstStudentToShow = (page - 1) * noOfRows;
    const lastStudentToShow = (page - 1) * noOfRows + noOfRows;
    return students
      .sort(sortAlphabetical)
      .slice(firstStudentToShow, lastStudentToShow);
  };

  const studentsToRender = () => {
    if (searchKey) {
      return filterStudents();
    }
    return studentsPerPage();
  };

  const renderHeaderTitle = () => {
    return (
      <li className="table-header">
        <p>Username</p>
        <p>Name</p>
        <p>Email Address</p>
        <p>Lesson Progress</p>
        <p>Status</p>
      </li>
    );
  };

  const editClick = (studentUserName) => {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set("edit_student", studentUserName);
    router.push(`${pathname}?${currentParams}`);
  };

  const deleteClick = (studentUserName) => {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set("delete_student", studentUserName);
    router.push(`${pathname}?${currentParams}`);
  };

  const renderStudents = () => {
    const students = studentsToRender();
    if (students.length === 0) return null;
    return (
      <ul className="all-students-table">
        {renderHeaderTitle()}
        {students.map((eachStudent, index) => (
          <li key={index}>
            <p>{eachStudent.studentUserName}</p>
            <p>
              {eachStudent.mailingFirstName} {eachStudent.mailingLastName}
            </p>
            <p>{eachStudent.mailingEmail}</p>
            <p>
              {eachStudent.isCourseCompleted
                ? "Completed"
                : eachStudent.chapterProgress
                  ? `Chapter ${eachStudent.chapterProgress}`
                  : "In progress"}
            </p>
            <p
              className={`${
                eachStudent.isActive
                  ? "bg-custom-green-light text-custom-green-base"
                  : "bg-custom-gray-base text-custom-gray-dark"
              }`}
            >
              {eachStudent.isActive ? "ACTIVE" : "INACTIVE"}
            </p>
            <div>
              <button onClick={() => editClick(eachStudent.studentUserName)}>
                <FaPen />
              </button>
              <button onClick={() => deleteClick(eachStudent.studentUserName)}>
                <FaTrashCan />
              </button>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  const renderPagination = () => {
    if (students?.length === 0 || searchParams.get("search")) return null;
    return (
      <Pagination itemsLength={Number(students?.length)} noOfRows={noOfRows} />
    );
  };

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
      {renderStudents()}
      {renderPagination()}
      {studentToDelete && (
        <ConfirmDeleteModal
          itemToDelete={studentToDelete.studentUserName}
          pathWhenModalIsClosed={pathWithNoDeleteQuery()}
          confirmAction={deleteAction}
        />
      )}
    </>
  );
};

export default AdminAllStudents;
