import {
  barbers,
  blockedTimes,
  bookings,
  transactions
} from "../../../shared/data/casaData.js";

const state = {
  barbers: [...barbers],
  blockedTimes: [...blockedTimes],
  bookings: [...bookings],
  transactions: [...transactions]
};

export function getBarbers() {
  return state.barbers;
}

export function addBarber(barber) {
  state.barbers = [...state.barbers, barber];
  return barber;
}

export function updateBarber(id, changes) {
  state.barbers = state.barbers.map((barber) => barber.id === id ? { ...barber, ...changes } : barber);
  return state.barbers.find((barber) => barber.id === id);
}

export function getBookings() {
  return state.bookings;
}

export function addBooking(booking) {
  state.bookings = [booking, ...state.bookings];
  return booking;
}

export function updateBooking(id, changes) {
  state.bookings = state.bookings.map((booking) => booking.id === id ? { ...booking, ...changes } : booking);
  return state.bookings.find((booking) => booking.id === id);
}

export function getBlockedTimes() {
  return state.blockedTimes;
}

export function addBlockedTime(block) {
  state.blockedTimes = [block, ...state.blockedTimes];
  return block;
}

export function getTransactions() {
  return state.transactions;
}
