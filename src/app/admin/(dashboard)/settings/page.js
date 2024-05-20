import AdminSiteSettingsForm from "@/components/AdminSiteSettingsForm";
import AdminEmailSettingsForm from "@/components/AdminEmailSettingsForm";
import AdminChangePasswordForm from "@/components/AdminChangePasswordForm";

const AdminSettings = () => {
  return (
    <section className="admin-settings-section">
      <h1>Settings</h1>
      <AdminSiteSettingsForm />
      <AdminEmailSettingsForm />
      <AdminChangePasswordForm />
    </section>
  );
};

export default AdminSettings;
