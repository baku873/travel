import SettingsManager from "./SettingsManager";

export const dynamic = "force-dynamic";

export default function AdminSettingsPage() {
  // Security is handled by the app/admin/layout.tsx file

  return (
    <div className="pt-24 p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">System Settings</h1>
        <p className="text-slate-500">Configure global application preferences.</p>
      </header>

      <SettingsManager />
    </div>
  );
}