"use client";

import { useState, useEffect } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { FaPen } from "react-icons/fa6";

import PolicyEditor from "./PolicyEditor";

import adminFetchPolicy from "@/services/api/adminFetchPolicy";
import adminUpdatePolicy from "@/services/api/adminUpdateaPolicy";

const AdminPolicy = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [policy, setPolicy] = useState("");

  useEffect(() => {
    (async () => {
      const { ok, json } = await adminFetchPolicy();
      if (!ok) return;
      setPolicy(json.policyHTML || "");
    })();
  }, []);

  const renderEditBtn = () => {
    if (searchParams.get("edit_policy") === "true") return null;
    return (
      <button
        className="edit-btn"
        onClick={() => router.replace(`${pathname}?edit_policy=true`)}
      >
        <FaPen />
      </button>
    );
  };

  const onSave = async (updatedPolicy) => {
    const { ok } = await adminUpdatePolicy(updatedPolicy);
    if (!ok) return;
    setPolicy(updatedPolicy);
  };

  const onCancel = () => {
    const currentParams = new URLSearchParams(searchParams);
    currentParams.delete("edit_policy");
    router.replace(`${pathname}?${currentParams}`);
  };

  const renderContent = () => {
    if (searchParams.get("edit_policy") !== "true") {
      if (!policy || /^\s*<(\w+)>\s*<\/\1>\s*$/.test(policy))
        return <p>The cancellation policy has not yet been set.</p>;
      return (
        <div
          className="policy-content"
          dangerouslySetInnerHTML={{ __html: policy }}
        />
      );
    }

    return (
      <PolicyEditor
        editorContent={policy}
        onCancel={onCancel}
        onSave={onSave}
      />
    );
  };

  return (
    <div className="admin-policy">
      <div className="header">
        <h2>Cancellation Policy</h2>
        {renderEditBtn()}
      </div>
      {renderContent()}
    </div>
  );
};

export default AdminPolicy;
