import "../assets/styles/settings.css";
import { LogOut } from "lucide-react";
import { owner, shopProfile } from "../../../shared/data/casaData.js";
import { Input, PageHeader, PanelTitle } from "../components/ui/index.jsx";

export default function SettingsPage({ onLogout }) {
  return (
    <section className="center-page">
      <PageHeader title="Settings" />
      <PanelTitle title="Shop Profile" />
      <section className="panel settings-form">
        <Input label="Shop Name"><input defaultValue={shopProfile.name} /></Input>
        <Input label="Branch"><input defaultValue={shopProfile.branch} /></Input>
        <Input label="Contact Number"><input defaultValue={shopProfile.phone} /></Input>
        <Input label="Currency"><input defaultValue={shopProfile.currency} /></Input>
      </section>
      <PanelTitle title="Account" />
      <section className="panel account-card"><div className="avatar">{owner.initials}</div><div><strong>{owner.name}</strong><p className="mono">{owner.email} · {owner.role}</p></div><button className="ghost-danger" type="button" onClick={onLogout}><LogOut size={16} /> Log out</button></section>
    </section>
  );
}
