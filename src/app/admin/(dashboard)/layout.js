import AdminSideNav from "@/components/AdminSideNav";

const AdminDashboardLayout = ({ children }) => {
  return (
    <main className="admin-dashboard-layout">
      <AdminSideNav />
      {children}
    </main>
  );
};

export default AdminDashboardLayout;
