import AdminStripeForm from "@/components/AdminStripeForm";
import AdminSiteSettingsForm from "@/components/AdminSiteSettingsForm";
import AdminEmailSettingsForm from "@/components/AdminEmailSettingsForm";
import AdminChangePasswordForm from "@/components/AdminChangePasswordForm";
import AdminPolicy from "@/components/AdminPolicy";

const AdminSettings = () => {
  return (
    <section className="admin-settings-section">
      <h1>Settings</h1>
      <AdminStripeForm />
      <AdminSiteSettingsForm />
      <AdminEmailSettingsForm />
      <AdminChangePasswordForm />
      <AdminPolicy />
    </section>
  );
};

export default AdminSettings;
