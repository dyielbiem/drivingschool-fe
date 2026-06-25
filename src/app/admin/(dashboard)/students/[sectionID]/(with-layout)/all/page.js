"use client";
import { useEffect, useState, useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FaTrashCan, FaPen, FaEye } from "react-icons/fa6";
import { Tooltip } from "react-tooltip";
import { BiLoaderAlt } from "react-icons/bi";

import Pagination from "@/components/Pagination";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import EditStudentForm from "@/components/EditStudentForm";
import ResetStudentPassword from "@/components/ResetStudentPassword";

import adminFetchStudentsPerSection from "@/services/api/adminFetchStudentsPerSection";
import adminDeleteStudent from "@/services/api/adminDeleteStudent";
import { useAdmin } from "@/state/store";

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

const TableData = ({ students, sectionID }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const handleEdit = useCallback(
    (studentUserName) => {
      const currentParams = new URLSearchParams(searchParams.toString());
      currentParams.set("edit_student", studentUserName);
      router.push(`${pathname}?${currentParams}`);
    },
    [pathname, router, searchParams]
  );

  const handleDelete = useCallback(
    (studentUserName) => {
      const currentParams = new URLSearchParams(searchParams.toString());
      currentParams.set("delete_student", studentUserName);
      router.push(`${pathname}?${currentParams}`);
    },
    [pathname, router, searchParams]
  );

  const handleView = useCallback(
    (studentUserName) => {
      router.push(`/admin/students/${sectionID}/${studentUserName}?prev=all`);
    },
    [router, sectionID]
  );

  if (students.length === 0) return null;

  return students.map((student, idx) => (
    <Student
      key={idx}
      student={student}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onView={handleView}
    />
  ));
};

const AdminAllStudents = ({ params: { sectionID } }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  const page = Number(searchParams.get("page"));

  const [fetchID, setFetchID] = useState(Date.now());
  const [isLoading, setIsLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [numberOfPage, setNumberOfPage] = useState(0);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [studentToEdit, setStudentToEdit] = useState(null);

  const { admin } = useAdmin();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const { ok, json } = await adminFetchStudentsPerSection(
        sectionID,
        page,
        null,
        search
      );

      if (ok) {
        setStudents(json.studentList);
        setNumberOfPage(json.totalPages);
      }

      setIsLoading(false);
    };

    fetchData();
  }, [sectionID, page, search, fetchID]);

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

  const paramsWithoutDeleteQuery = useMemo(() => {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.delete("delete_student");
    return currentParams;
  }, [searchParams]);

  const deleteAction = useCallback(async () => {
    if (!studentToDelete) return;

    const { ok } = await adminDeleteStudent(studentToDelete?.studentUserName);
    if (!ok) return;

    const params = paramsWithoutDeleteQuery;
    params.set("page", 1);

    router.push(`${pathname}?${params}`);
    setFetchID(Date.now());
  }, [paramsWithoutDeleteQuery, pathname, router, studentToDelete]);

  if (isLoading) {
    return (
      <div className="students-per-section-loader">
        <BiLoaderAlt />
      </div>
    );
  }

  if (students.length === 0)
    return <p className="no-students-per-section">No students found</p>;

  if (studentToEdit) {
    return (
      <>
        <EditStudentForm student={studentToEdit} />
        <ResetStudentPassword />
      </>
    );
  }

  return (
    <>
      <ul className="all-students-table">
        <TableHeader />
        <TableData students={students} sectionID={sectionID} />
      </ul>
      <Pagination
        isVisible={students?.length !== 0}
        numberOfPage={numberOfPage}
      />
      {studentToDelete && (
        <ConfirmDeleteModal
          itemToDelete={studentToDelete.studentUserName}
          pathWhenModalIsClosed={`${pathname}?${paramsWithoutDeleteQuery}`}
          confirmAction={deleteAction}
        />
      )}
      <Tooltip id="all-students-table-tooltip" />
    </>
  );
};

export default AdminAllStudents;
