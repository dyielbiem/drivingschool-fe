"use client";
import { useEffect, useState, useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FaPen, FaTrashCan } from "react-icons/fa6";
import { IoAddSharp } from "react-icons/io5";

import adminFetchCoupons from "@/services/api/adminFetchCoupons";
import adminDeleteCoupon from "@/services/api/adminDeleteCoupon";
import { formatDate } from "@/utils";

import AddCouponForm from "@/components/AddCouponForm";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import EditCouponForm from "@/components/EditCouponForm";

const TableData = ({ coupons, onEditClick, onDeleteClick }) => {
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
          <p col-title="coupon code">{coupon.couponCode}</p>
          <p col-title="coupon amount">$ {coupon.couponAmount}</p>
          <p col-title="from date">{formatDate(coupon.fromDate) || "--"}</p>
          <p col-title="to date">{formatDate(coupon.toDate) || "--"}</p>
          <p
            className={`${
              coupon.isActive
                ? "bg-custom-green-light text-custom-green-base"
                : "bg-custom-gray-base text-custom-gray-dark"
            }`}
            col-title="status"
          >
            {coupon.isActive ? "ACTIVE" : "INACTIVE"}
          </p>
          <div>
            <button onClick={() => onEditClick(coupon.couponCode)}>
              <FaPen />
            </button>
            <button onClick={() => onDeleteClick(coupon.couponCode)}>
              <FaTrashCan />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

const AdminCoupons = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [coupons, setCoupons] = useState([]);

  const itemToEdit = useMemo(() => {
    const couponCode = searchParams.get("edit_coupon");
    return couponCode
      ? coupons.find((item) => item.couponCode === couponCode)
      : null;
  }, [coupons, searchParams]);

  const itemToDelete = useMemo(() => {
    const couponCode = searchParams.get("delete_coupon");
    return couponCode && coupons.some((item) => item.couponCode === couponCode)
      ? couponCode
      : null;
  }, [coupons, searchParams]);

  useEffect(() => {
    const fetchCoupons = async () => {
      const response = await adminFetchCoupons();
      setCoupons(response.ok ? response.json.coupons || [] : []);
    };

    fetchCoupons();
  }, []);

  const handleAddCouponClick = () => {
    router.push(`${pathname}?add_coupon=true`);
  };

  const handleCouponEditClick = (couponCode) => {
    router.push(`${pathname}?edit_coupon=${couponCode}`);
  };

  const handleUpdatedCoupon = useCallback(
    (updatedCoupon) => {
      setCoupons((prev) =>
        prev.map((item) =>
          item.couponCode === updatedCoupon.couponCode ? updatedCoupon : item
        )
      );
      router.replace(pathname);
    },
    [router, pathname]
  );

  const handleCouponDeleteClick = (couponCode) => {
    router.push(`${pathname}?delete_coupon=${couponCode}`);
  };

  const handleCouponDeletion = async () => {
    const response = await adminDeleteCoupon(itemToDelete);
    if (!response.ok) return;
    setCoupons((prev) =>
      prev.filter((coupon) => coupon.couponCode !== itemToDelete)
    );
    router.replace(pathname);
  };

  return (
    <section className="admin-coupons-container">
      <div className="header">
        <h1>Manage Coupons</h1>
        <button onClick={handleAddCouponClick}>
          <span>Add new coupon</span>
          <IoAddSharp />
        </button>
      </div>
      {coupons.length !== 0 && (
        <>
          <TableData
            coupons={coupons}
            onEditClick={handleCouponEditClick}
            onDeleteClick={handleCouponDeleteClick}
          />
          {searchParams.get("add_coupon") === "true" && (
            <AddCouponForm setCoupons={setCoupons} />
          )}
          {itemToDelete && (
            <ConfirmDeleteModal
              itemToDelete={itemToDelete}
              pathWhenModalIsClosed={pathname}
              confirmAction={handleCouponDeletion}
            />
          )}
          {itemToEdit && (
            <EditCouponForm
              coupon={itemToEdit}
              onCouponUpdated={handleUpdatedCoupon}
            />
          )}
        </>
      )}
    </section>
  );
};

export default AdminCoupons;
