"use client";
import React, { useEffect, useState } from "react";
import { FaTrashCan } from "react-icons/fa6";
import { FaPen } from "react-icons/fa6";
import adminFetchCoupons from "@/services/api/adminFetchCoupons";
import AddCouponForm from "@/components/AddCouponForm";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchCoupons = async () => {
      const response = await adminFetchCoupons();
      setCoupons(response.ok ? response.json.coupons : []);
    };

    fetchCoupons();
  }, []);

  const renderCoupons = () => {
    if (!coupons || coupons.length === 0) return <></>;
    return (
      <ul className="coupon-table">
        <li className="table-header">
          <p>Coupon Code</p>
          <p>Coupon Amount</p>
          <p>From Date</p>
          <p>To Date</p>
          <p>Status</p>
        </li>
        {coupons.map((coupon, index) => (
          <li key={index}>
            <p>{coupon.couponCode}</p>
            <p>$ {coupon.couponAmount}</p>
            <p>{coupon.fromDate}</p>
            <p>{coupon.toDate}</p>
            <p
              className={`${
                coupon.isActive
                  ? "bg-custom-green-light text-custom-green-base"
                  : "bg-custom-gray-base text-custom-gray-dark"
              }`}
            >
              {coupon.isActive ? "ACTIVE" : "INACTIVE"}
            </p>
            <div>
              <button>
                <FaPen />
              </button>
              <button>
                <FaTrashCan />
              </button>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  const handleAddCouponClick = () => {
    router.push(`${pathname}?add_coupon=true`);
  };

  return (
    <section className="admin-coupons-container">
      <div className="header">
        <h1>Manage Coupons</h1>
        <button onClick={handleAddCouponClick}>Add new coupon</button>
      </div>
      {renderCoupons()}
      {searchParams.get("add_coupon") === "true" && (
        <AddCouponForm setCoupons={setCoupons} />
      )}
    </section>
  );
};

export default AdminCoupons;
