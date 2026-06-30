import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip
} from "chart.js";
import { barbers, formatPeso, tokens } from "../../../shared/data/casaData.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Filler, Tooltip);

export function lineData(points) {
  return {
    labels: points.map((point) => point.day),
    datasets: [{
      data: points.map((point) => point.amount),
      borderColor: tokens.gold,
      pointBackgroundColor: "#242424",
      pointBorderColor: tokens.gold,
      pointRadius: 4,
      tension: 0.36,
      fill: true,
      backgroundColor: (context) => {
        const chart = context.chart;
        const { ctx, chartArea } = chart;
        if (!chartArea) return "rgba(201,168,76,0.2)";
        const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
        gradient.addColorStop(0, "rgba(201,168,76,0.22)");
        gradient.addColorStop(1, "rgba(201,168,76,0)");
        return gradient;
      }
    }]
  };
}

const tooltipStyle = {
  backgroundColor: "#242424",
  borderColor: "#333333",
  borderWidth: 1,
  titleColor: "#F5F5F0",
  bodyColor: "#C9A84C",
  displayColors: false,
  padding: 12
};

export const lineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false }, tooltip: { ...tooltipStyle, callbacks: { label: (ctx) => formatPeso(ctx.parsed.y) } } },
  scales: { x: { grid: { display: false }, ticks: { color: "#8A8A82" }, border: { display: false } }, y: { display: false, grid: { display: false } } }
};

export function barData(points, byBarber) {
  if (byBarber) {
    return {
      labels: points.map((point) => point.date),
      datasets: barbers.slice(0, 3).map((barber, index) => ({ label: barber.name, data: points.map((point) => Math.round(point.amount * [0.42, 0.35, 0.23][index])), backgroundColor: barber.color, borderRadius: 3 }))
    };
  }
  return { labels: points.map((point) => point.date), datasets: [{ data: points.map((point) => point.amount), backgroundColor: tokens.gold, borderRadius: 3 }] };
}

export const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false }, tooltip: { ...tooltipStyle, callbacks: { label: (ctx) => `${ctx.dataset.label ? `${ctx.dataset.label}: ` : ""}${formatPeso(ctx.parsed.y)}` } } },
  scales: { x: { stacked: true, grid: { display: false }, ticks: { color: "#8A8A82", maxTicksLimit: 4 }, border: { display: false } }, y: { stacked: true, display: false, grid: { display: false } } }
};
