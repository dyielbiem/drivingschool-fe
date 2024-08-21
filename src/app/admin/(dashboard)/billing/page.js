"use client";
import { useState, useEffect } from "react";
import adminFetchBilling from "@/services/api/adminFetchBilling";

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
          <p>Username</p>
          <p>Name</p>
          <p>Coupon Code</p>
          <p>Account No.</p>
          <p>Amount</p>
        </li>
        {billing.map((item, index) => (
          <li key={index}>
            <p col-title="transaction ID">{item.transactionID}</p>
            <p col-title="username">{item.studentUserName}</p>
            <p col-title="name">
              {item.billingFirstName} {item.billingLastName}
            </p>
            <p col-title="coupon code">{item.usedCouponCode}</p>
            <p col-title="account number">{item.accountNumber}</p>
            <p col-title="amount">$ {item.paidAmount}</p>
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
