import SideNav from "@/components/SideNav";

const AdminDashboardLayout = ({ children }) => {
  return (
    <main className="admin-dashboard-layout">
      <SideNav />
      {children}
    </main>
  );
};

export default AdminDashboardLayout;
