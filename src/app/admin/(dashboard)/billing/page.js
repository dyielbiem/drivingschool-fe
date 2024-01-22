"use client";
import { useState, useEffect } from "react";
import adminFetchBilling from "@/services/api/adminFetchBilling";
import { RiPrinterFill } from "react-icons/ri";

const AdminBilling = () => {
  const [billing, setBilling] = useState([]);

  useEffect(() => {
    const fetchBilling = async () => {
      const response = await adminFetchBilling();
      setBilling(response.ok ? response.json.billingInformation : []);
    };

    fetchBilling();
  }, []);

  const renderBilling = () => {
    if (!billing || billing.length === 0) return <></>;

    return (
      <ul className="billing-table">
        <li className="table-header">
          <p>Transaction ID</p>
          <p>Name</p>
          <p>Coupon Code</p>
          <p>Account No.</p>
          <p>Amount</p>
        </li>
        {billing.map((item, index) => (
          <li key={index}>
            <p>{item.transactionID}</p>
            <p>
              {item.billingFirstName} {item.billingLastName}
            </p>
            <p>{item.usedCouponCode}</p>
            <p>{item.accountNumber}</p>
            <p>$ {item.paidAmount}</p>
            <button>
              <RiPrinterFill />
            </button>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <section className="admin-billing-container">
      <div className="header">
        <h1>Billing Information</h1>
      </div>
      {renderBilling()}
    </section>
  );
};

export default AdminBilling;
