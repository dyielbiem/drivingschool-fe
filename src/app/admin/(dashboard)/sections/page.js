"use client";

import adminFetchSections from "@/services/api/adminFetchSections";
import { useRouter, useSearchParams } from "next/navigation";
import CreateSectionForm from "@/components/CreateSectionForm";
import { useEffect, useState } from "react";

const AdminSections = () => {
  const [sections, setSections] = useState([]);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchSections = async () => {
      const response = await adminFetchSections();
      setSections(response.ok ? response.json.sections : []);
    };

    fetchSections();
  }, []);

  const handleSectionClick = (id) => {
    router.push(`/admin/sections/${id}`);
  };

  const handleCreateSectionClick = () => {
    router.push(`/admin/sections?createNewSection=true`);
  };

  const renderSection = () => {
    return (
      sections &&
      sections.length != 0 &&
      sections.map((section, index) => (
        <li key={index} onClick={() => handleSectionClick(section.sectionID)}>
          <p>{section.sectionTitle}</p>
          <p>{section.sectionID}</p>
          <p
            className={`${
              section.isActive
                ? "bg-emerald-300 text-emerald-900"
                : "bg-red-300 text-red-900"
            }`}
          >
            {section.isActive ? "ACTIVE" : "INACTIVE"}
          </p>
        </li>
      ))
    );
  };

  return (
    <section className="admin-sections-container">
      <div className="header">
        <h1>Manage Sections</h1>
        <button type="button" onClick={handleCreateSectionClick}>
          Create new section
        </button>
      </div>
      <div className="header-titles-container">
        <p>Section Title</p>
        <p>Section ID</p>
        <p>Status</p>
      </div>
      <ul>{renderSection()}</ul>
      {searchParams.get("createNewSection") && (
        <CreateSectionForm setSections={setSections} />
      )}
    </section>
  );
};

export default AdminSections;
