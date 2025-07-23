"use client";
import { useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

import AddAffiliationForm from "@/components/AddAffiliationForm";

import adminFetchAffiliations from "@/services/api/adminFetchAffiliations";
import { formatDate } from "@/utils";

const TableHeader = () => {
  return (
    <li>
      <p>Name</p>
      <p>Code</p>
      <p>Date Added</p>
    </li>
  );
};

const TableRow = ({ affiliations }) => {
  if (affiliations.length === 0) return null;

  return affiliations.map((item, idx) => {
    const { affiliationName, affiliationCode, dateAdded } = item;
    return (
      <li key={idx}>
        <p>{affiliationName}</p>
        <p>{affiliationCode}</p>
        <p>{formatDate(dateAdded)}</p>
      </li>
    );
  });
};

const Affiliations = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [affiliations, setAffiliations] = useState([]);

  useEffect(() => {
    const fetchAffiliations = async () => {
      const { ok, json } = await adminFetchAffiliations();

      if (!ok) return;
      setAffiliations(json);
    };

    fetchAffiliations();
  }, []);

  const handleAddClick = () => {
    router.replace(`${pathname}?add_affiliation=true`);
  };

  const handleAffiliationAdded = useCallback((newAffiliation) => {
    setAffiliations((prevState) => [newAffiliation, ...prevState]);
  }, []);

  return (
    <div className="admin-affiliations-container">
      <div className="header">
        <h1>Manage Affiliations</h1>
        <button onClick={handleAddClick}>Add affiliation</button>
      </div>
      <ul className="affiliation-table">
        <TableHeader />
        <TableRow affiliations={affiliations} />
      </ul>
      <AddAffiliationForm onAffiliationAdded={handleAffiliationAdded} />
    </div>
  );
};

export default Affiliations;
