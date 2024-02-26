"use client";

import adminFetchSections from "@/services/api/adminFetchSections";
import { useRouter, useSearchParams } from "next/navigation";
import CreateSectionForm from "@/components/CreateSectionForm";
import { useEffect, useState } from "react";
import { useChapters } from "@/state/store";

const AdminSections = () => {
  const [sections, setSections] = useState([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setChapters } = useChapters();

  useEffect(() => {
    const fetchSections = async () => {
      // Set the global state of chapters to undefined
      setChapters(undefined);
      const response = await adminFetchSections();
      setSections(response.ok ? response.json.sections : []);
    };

    fetchSections();
  }, [setChapters]);

  const handleSectionClick = (id) => {
    router.push(`/admin/sections/${id}`);
  };

  const handleCreateSectionClick = () => {
    router.push(`/admin/sections?create_section=true`);
  };

  const renderSection = () => {
    if (!sections || sections.length === 0) return <></>;
    return (
      <ul className="section-table">
        <li className="table-header">
          <p>Section Title</p>
          <p>Status</p>
        </li>

        {sections.map((section, index) => (
          <li key={index} onClick={() => handleSectionClick(section.sectionID)}>
            <p>{section.sectionTitle}</p>
            <p
              className={`${
                section.isActive
                  ? "bg-custom-green-light text-custom-green-base"
                  : "bg-custom-gray-base text-custom-gray-dark"
              }`}
            >
              {section.isActive ? "ACTIVE" : "INACTIVE"}
            </p>
          </li>
        ))}
      </ul>
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
      {renderSection()}
      {searchParams.get("create_section") && (
        <CreateSectionForm setSections={setSections} />
      )}
    </section>
  );
};

export default AdminSections;
