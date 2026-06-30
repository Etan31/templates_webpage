const SESSION_KEY = "casa-session";

export const sessionStorage = {
  get() {
    const raw = localStorage.getItem(SESSION_KEY) || window.sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    try {
      const session = JSON.parse(raw);
      if (session.expiresAt && session.expiresAt < Date.now()) return null;
      return session;
    } catch {
      return null;
    }
  },
  set(session, remember) {
    const target = remember ? localStorage : window.sessionStorage;
    const other = remember ? window.sessionStorage : localStorage;
    other.removeItem(SESSION_KEY);
    target.setItem(SESSION_KEY, JSON.stringify(session));
  },
  clear() {
    localStorage.removeItem(SESSION_KEY);
    window.sessionStorage.removeItem(SESSION_KEY);
  }
};
