import AdminStudentsHeader from "@/components/AdminStudentsHeader";
import TopSearchBar from "@/components/TopSearchBar";

const AdminStudentsLayout = ({ children }) => {
  return (
    <section className="admin-students-layout">
      <TopSearchBar placeholder="Search Students" />
      <AdminStudentsHeader />
      {children}
    </section>
  );
};

export default AdminStudentsLayout;
