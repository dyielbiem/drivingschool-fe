import { ToastContainer, Slide } from "react-toastify";

import AdminSideNav from "@/components/AdminSideNav";

const AdminDashboardLayout = ({ children }) => {
  return (
    <main className="admin-dashboard-layout">
      <AdminSideNav />
      {children}
      <ToastContainer
        position="bottom-left"
        autoClose={2500}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick={false}
        pauseOnFocusLoss={false}
        pauseOnHover={false}
        draggable={false}
        theme="light"
        transition={Slide}
        closeButton={false}
      />
    </main>
  );
};

export default AdminDashboardLayout;
