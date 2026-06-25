"use client";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

import { useStudentsInSection } from "@/state/store";
import adminFetchSectionByID from "@/services/api/adminFetchSectionByID";

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
    const fetchData = async () => {
      if (!sectionID) return;
      const { ok, json } = await adminFetchSectionByID(sectionID);

      ok && setSection(json);
    };

    fetchData();
  }, [sectionID, setNoOfRows, setStudents]);

  if (!section) return null;

  return (
    <section className="admin-students-layout">
      <TopSearchBar placeholder="Search by username, name, or email" />
      <AdminStudentsHeader section={section} />
      {children}
    </section>
  );
};

export default AdminStudentsLayout;
