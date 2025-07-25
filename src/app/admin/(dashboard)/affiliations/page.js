"use client";
import { useEffect, useState, useCallback, useMemo } from "react";
import { usePathname } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { FaPen, FaTrashCan } from "react-icons/fa6";

import AddAffiliationForm from "@/components/AddAffiliationForm";
import EditAffiliationForm from "@/components/EditAffiliationForm";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";

import adminFetchAffiliations from "@/services/api/adminFetchAffiliations";
import adminDeleteAffiliation from "@/services/api/adminDeleteAffiliation";
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

const TableRow = ({ affiliations, onEditClick, onDeleteClick }) => {
  return affiliations.map((item, idx) => {
    const { affiliationID, affiliationName, affiliationCode, dateAdded } = item;
    return (
      <li key={idx}>
        <p>{affiliationName}</p>
        <p>{affiliationCode}</p>
        <p>{formatDate(dateAdded)}</p>
        <div>
          <button onClick={() => onEditClick(affiliationID)}>
            <FaPen />
          </button>
          <button onClick={() => onDeleteClick(affiliationID)}>
            <FaTrashCan />
          </button>
        </div>
      </li>
    );
  });
};

const Affiliations = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [affiliations, setAffiliations] = useState([]);
  const [isFetching, setIsFetching] = useState(true);

  const affiliationToEdit = useMemo(
    () =>
      affiliations.find(
        (a) => a.affiliationID === searchParams.get("edit_affiliation")
      ),
    [affiliations, searchParams]
  );
  const affiliationToDelete = useMemo(
    () =>
      affiliations.find(
        (a) => a.affiliationID === searchParams.get("delete_affiliation")
      ),
    [affiliations, searchParams]
  );

  useEffect(() => {
    const fetchAffiliations = async () => {
      const { ok, json } = await adminFetchAffiliations();
      if (ok) setAffiliations(json);
      setIsFetching(false);
    };

    fetchAffiliations();
  }, []);

  const handleAddClick = () => {
    router.replace(`${pathname}?add_affiliation=true`);
  };

  const handleEditClick = (affiliationID) => {
    router.replace(`${pathname}?edit_affiliation=${affiliationID}`);
  };

  const handleDeleteClick = (affiliationID) => {
    router.replace(`${pathname}?delete_affiliation=${affiliationID}`);
  };

  const handleAffiliationAdded = useCallback((newAffiliation) => {
    setAffiliations((prevState) => [newAffiliation, ...prevState]);
  }, []);

  const handleAffiliationEdited = useCallback((editedAffiliation) => {
    setAffiliations((prevState) =>
      prevState.map((a) => {
        if (a.affiliationID !== editedAffiliation.affiliationID) return a;
        return editedAffiliation;
      })
    );
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    const { ok } = await adminDeleteAffiliation(
      affiliationToDelete.affiliationID
    );

    if (!ok) return;
    setAffiliations((prevState) =>
      prevState.filter(
        (a) => a.affiliationID !== affiliationToDelete.affiliationID
      )
    );
    router.replace(pathname);
  }, [affiliationToDelete?.affiliationID, router, pathname]);

  return (
    <div className="admin-affiliations-container">
      <div className="header">
        <h1>Manage Affiliations</h1>
        <button onClick={handleAddClick}>Add affiliation</button>
      </div>
      {!isFetching && affiliations.length === 0 && (
        <span className="no-affiliations">No affiliations found.</span>
      )}
      {affiliations.length !== 0 && (
        <ul className="affiliation-table">
          <TableHeader />
          <TableRow
            affiliations={affiliations}
            onEditClick={handleEditClick}
            onDeleteClick={handleDeleteClick}
          />
        </ul>
      )}
      {searchParams.get("add_affiliation") === "true" && (
        <AddAffiliationForm onAffiliationAdded={handleAffiliationAdded} />
      )}
      {affiliationToEdit && (
        <EditAffiliationForm
          affiliationToEdit={affiliationToEdit}
          onAffiliationEdited={handleAffiliationEdited}
        />
      )}
      {affiliationToDelete && (
        <ConfirmDeleteModal
          itemToDelete={affiliationToDelete.affiliationCode}
          pathWhenModalIsClosed={pathname}
          confirmAction={handleConfirmDelete}
        />
      )}
    </div>
  );
};

export default Affiliations;
