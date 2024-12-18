"use client";
import { useState, useEffect } from "react";

import adminFetchPublicPolicy from "@/services/api/adminFetchPublicPolicy";

const Policy = () => {
  const [isPolicyFetched, setIsPolicyFetched] = useState(false);
  const [policy, setPolicy] = useState("");

  useEffect(() => {
    (async () => {
      const { ok, json } = await adminFetchPublicPolicy(
        process.env.NEXT_PUBLIC_DRIVING_SCHOOL_ID
      );

      setPolicy(ok ? json.policyHTML || "" : "");
      setIsPolicyFetched(true);
    })();
  }, []);

  if (isPolicyFetched && (!policy || /^\s*<(\w+)>\s*<\/\1>\s*$/.test(policy)))
    return <p>The cancellation policy has not yet been set.</p>;

  return (
    <div className="public-policy">
      <div
        className="policy-content"
        dangerouslySetInnerHTML={{ __html: policy }}
      />
    </div>
  );
};

export default Policy;
