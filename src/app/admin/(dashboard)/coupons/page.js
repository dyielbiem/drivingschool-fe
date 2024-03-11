"use client";
import React, { useEffect, useState } from "react";
import { FaTrashCan } from "react-icons/fa6";
import { FaPen } from "react-icons/fa6";
import adminFetchCoupons from "@/services/api/adminFetchCoupons";
import AddCouponForm from "@/components/AddCouponForm";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import adminDeleteCoupon from "@/services/api/adminDeleteCoupon";
import EditCouponForm from "@/components/EditCouponForm";
import dateFormatter from "@/utils/dateFormatter";

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [itemToDelete, setItemDelete] = useState(undefined);
  const [itemToEdit, setItemToEdit] = useState(undefined);

  useEffect(() => {
    const fetchCoupons = async () => {
      const response = await adminFetchCoupons();
      setCoupons(response.ok ? response.json.coupons : []);
    };

    fetchCoupons();
  }, []);

  useEffect(() => {
    if (!coupons) return;
    if (!searchParams.get("delete_coupon")) return setItemDelete(undefined);
    const couponToDelete = coupons.find(
      (coupon) => coupon.couponCode === searchParams.get("delete_coupon")
    );

    setItemDelete(
      couponToDelete?.couponCode ? couponToDelete?.couponCode : undefined
    );
  }, [coupons, searchParams]);

  useEffect(() => {
    if (!coupons) return;
    if (!searchParams.get("edit_coupon")) return setItemToEdit(undefined);
    const couponToEdit = coupons.find(
      (coupon) => coupon.couponCode === searchParams.get("edit_coupon")
    );

    setItemToEdit(couponToEdit ? couponToEdit : undefined);
  }, [coupons, searchParams]);

  const handleCouponEditClick = (couponCode) => {
    router.push(`${pathname}?edit_coupon=${couponCode}`);
  };

  const handleCouponDeleteClick = (couponCode) => {
    router.push(`${pathname}?delete_coupon=${couponCode}`);
  };

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
            <p>{dateFormatter(coupon.fromDate)}</p>
            <p>{dateFormatter(coupon.toDate)}</p>
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
              <button onClick={() => handleCouponEditClick(coupon.couponCode)}>
                <FaPen />
              </button>
              <button
                onClick={() => handleCouponDeleteClick(coupon.couponCode)}
              >
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

  const deleteCouponAction = async () => {
    const response = await adminDeleteCoupon(itemToDelete);
    if (!response.ok) return;

    setCoupons((prevState) =>
      [...prevState].filter((coupon) => coupon.couponCode !== itemToDelete)
    );

    router.push(pathname);
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
      {itemToDelete && (
        <ConfirmDeleteModal
          itemToDelete={itemToDelete}
          pathWhenModalIsClosed={pathname}
          confirmAction={deleteCouponAction}
        />
      )}
      {itemToEdit && (
        <EditCouponForm prevCoupon={itemToEdit} setCoupons={setCoupons} />
      )}
    </section>
  );
};

export default AdminCoupons;
