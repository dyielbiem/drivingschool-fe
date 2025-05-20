"use client";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

import { useStudentsInSection } from "@/state/store";
import adminFetchSectionByID from "@/services/api/adminFetchSectionByID";
import adminFetchAllStudents from "@/services/api/adminFetchAllStudents";

import AdminStudentsHeader from "@/components/AdminStudentsHeader";
import TopSearchBar from "@/components/TopSearchBar";

const AdminStudentsLayout = ({ children, params: { sectionID } }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [section, setSection] = useState(null);
  const { setStudents, setNoOfRows } = useStudentsInSection();

  useEffect(() => {
    if (Number(searchParams.get("page"))) return;
    const currentParams = new URLSearchParams(searchParams);
    currentParams.set("page", "1");
    router.replace(`${pathname}?${currentParams}`);
  }, [pathname, router, searchParams]);

  useEffect(() => {
    const fetchSectionAndStudents = async () => {
      if (!sectionID) return;
      const sectionResponse = await adminFetchSectionByID(sectionID);

      if (!sectionResponse.ok) return;
      setSection(sectionResponse.json);

      const studentResponse = await adminFetchAllStudents(sectionID);
      if (!studentResponse.ok) return;

      setStudents(studentResponse.json.allStudents);
      setNoOfRows(studentResponse.json.noOfRows || 100);
    };

    fetchSectionAndStudents();
  }, [sectionID, setNoOfRows, setStudents]);

  if (!section) return null;

  return (
    <section className="admin-students-layout">
      <TopSearchBar placeholder="Search Students" />
      <AdminStudentsHeader section={section} />
      {children}
    </section>
  );
};

export default AdminStudentsLayout;
