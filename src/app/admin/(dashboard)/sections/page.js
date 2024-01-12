"use client";

import adminFetchSections from "@/utils/fetch/adminFetchSections";
import useAdminFetch from "@/hooks/useAdminFetch";
const AdminSections = () => {
  const response = useAdminFetch(adminFetchSections);
  const sections = response.ok ? response.json.sections : [];

  const renderSection = () => {
    return (
      sections.length != 0 &&
      sections.map((section, index) => (
        <li key={index}>
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
    <div className="admin-sections-container">
      <div className="header-titles-container">
        <p>Section Title</p>
        <p>Section ID</p>
        <p>Status</p>
      </div>
      <ul>{renderSection()}</ul>
    </div>
  );
};

export default AdminSections;
