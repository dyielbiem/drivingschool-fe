import AdminStudentsHeader from "@/components/AdminStudentsHeader";

const AdminStudentsLayout = ({ children }) => {
  return (
    <section className="admin-students-layout">
      <AdminStudentsHeader />
      {children}
    </section>
  );
};

export default AdminStudentsLayout;
