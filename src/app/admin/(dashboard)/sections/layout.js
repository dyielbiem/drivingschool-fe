const AdminSectionLayout = ({ children }) => {
  return (
    <div className="admin-sections-layout">
      <div className="header">
        <h1>Manage Sections</h1>
      </div>
      {children}
    </div>
  );
};

export default AdminSectionLayout;
