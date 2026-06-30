import { useState } from "react";
import { Bar } from "react-chartjs-2";
import { formatPeso } from "../../../shared/data/casaData.js";
import { Badge, Method, PageHeader, PanelTitle, Pill, Segmented } from "../components/ui/index.jsx";
import { barData, barOptions } from "../lib/charts.js";
import { prettyDate } from "../utils/formatters.js";

export default function Payments({ transactions }) {
  const [period, setPeriod] = useState("This Month");
  const [byBarber, setByBarber] = useState(false);
  const daily = Array.from({ length: 27 }, (_, index) => ({ date: `Jun ${index + 1}`, amount: [7200, 9100, 6500, 11800, 13200, 17200, 11250, 8700, 10500, 7000, 12600, 14200, 18400, 12900, 9400, 10800, 8200, 13500, 15800, 20500, 14600, 9800, 11400, 8700, 15100, 16600, 4800][index] }));
  return (
    <section>
      <PageHeader title="Payments & Revenue" actions={<Segmented options={["This Week", "This Month", "Last 3 Months", "Custom"]} value={period} onChange={setPeriod} />} />
      <div className="payment-kpis">
        <Kpi title="Total Revenue · This Month" value={formatPeso(186400)} detail="vs ₱163,500 last month" trend="+14%" tone="up" />
        <Kpi title="Pending Payments" value={formatPeso(4150)} detail="6 transactions" trend="amber" dot />
        <Kpi title="Refunds Issued" value={formatPeso(700)} detail="2 this month" trend="amber" />
      </div>
      <div className="payments-grid">
        <section className="panel"><PanelTitle title="Daily Revenue · June" value={<button className="ghost-button small" onClick={() => setByBarber(!byBarber)}>By Barber</button>} /><Bar data={barData(daily, byBarber)} options={barOptions} /></section>
        <section className="panel"><PanelTitle title="Top Services" /><TopServices /></section>
      </div>
      <section className="panel transaction-panel">
        <PanelTitle title="Transaction History" value="PayMongo" />
        <div className="table-wrap"><table className="data-table compact"><thead><tr><th>Transaction ID</th><th>Client</th><th>Service</th><th>Barber</th><th>Date</th><th>Amount</th><th>Method</th><th>Status</th><th>Actions</th></tr></thead><tbody>{transactions.slice(0, 8).map((item) => <tr key={item.id}><td title={item.id} className="mono gold-text">{item.id.slice(0, 12)}...</td><td><strong>{item.client}</strong></td><td>{item.service}</td><td><Badge label={item.barberInitials} style={{ "--badge": item.barberColor }} /> {item.barber}</td><td>{prettyDate(item.date, true)}</td><td><strong>{formatPeso(item.amount)}</strong></td><td><Method method={item.method} /></td><td><Pill value={item.status} /></td><td><button className="text-link">View Receipt</button>{item.status === "paid" ? <button className="danger-text">Refund</button> : null}</td></tr>)}</tbody></table></div>
      </section>
    </section>
  );
}

function TopServices() {
  const top = [
    ["Skin Fade", 18450, 100],
    ["Cut & Beard", 14200, 78],
    ["Classic Cut", 11900, 66],
    ["Hot Towel Shave", 8400, 44],
    ["Hair Color", 6000, 30]
  ];
  return <div className="top-services">{top.map(([name, amount, width], index) => <article key={name}><div><span>{index + 1}</span><strong>{name}</strong><em>{formatPeso(amount)}</em></div><i style={{ width: `${width}%` }} /></article>)}</div>;
}
