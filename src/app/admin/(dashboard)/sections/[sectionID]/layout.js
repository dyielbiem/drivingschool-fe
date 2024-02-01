import ManageSectionSideNav from "@/components/ManageSectionSideNav";

const ManageSectionLayout = ({ children }) => {
  return (
    <main className="admin-manage-section-layout">
      <ManageSectionSideNav />
      {children}
    </main>
  );
};

export default ManageSectionLayout;
