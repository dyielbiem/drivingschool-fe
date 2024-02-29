import AdminSiteSettingsForm from "@/components/AdminSiteSettingsForm";
import AdminEmailSettingsForm from "@/components/AdminEmailSettingsForm";
const AdminSettings = () => {
  const renderHeader = () => {
    return <h1>Settings</h1>;
  };

  return (
    <section className="admin-settings-section">
      {renderHeader()}
      <AdminSiteSettingsForm />
      <AdminEmailSettingsForm />
    </section>
  );
};

export default AdminSettings;
