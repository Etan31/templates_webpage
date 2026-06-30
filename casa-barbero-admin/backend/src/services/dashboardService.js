import { getBookings, getTransactions } from "../data/store.js";

export function getDashboardSummary() {
  const bookings = getBookings();
  const transactions = getTransactions();
  const revenue = transactions
    .filter((item) => item.status === "paid")
    .reduce((total, item) => total + item.amount, 0);

  return {
    kpis: {
      todayBookings: 18,
      weekRevenue: 48650,
      pending: bookings.filter((booking) => booking.status === "pending").length,
      cancellationsMtd: bookings.filter((booking) => booking.status === "cancelled").length
    },
    revenue,
    upcoming: bookings.slice(0, 7),
    sparkline: [
      { day: "Mon", date: "Jun 22", amount: 6200 },
      { day: "Tue", date: "Jun 23", amount: 8200 },
      { day: "Wed", date: "Jun 24", amount: 5200 },
      { day: "Thu", date: "Jun 25", amount: 10650 },
      { day: "Fri", date: "Jun 26", amount: 12400 },
      { day: "Sat", date: "Jun 27", amount: 15800 },
      { day: "Sun", date: "Jun 28", amount: 11800 }
    ],
    dailyRevenue: Array.from({ length: 27 }, (_, index) => ({
      date: `Jun ${index + 1}`,
      amount: [7200, 9100, 6500, 11800, 13200, 17200, 11250, 8700, 10500, 7000, 12600, 14200, 18400, 12900, 9400, 10800, 8200, 13500, 15800, 20500, 14600, 9800, 11400, 8700, 15100, 16600, 4800][index]
    }))
  };
}
