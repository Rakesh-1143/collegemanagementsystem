// Session token storage.
//
// The frontend and backend run on different *.onrender.com hosts, which the
// Public Suffix List treats as different SITES. The httpOnly session cookie is
// therefore a third-party cookie and some browsers/privacy settings never send
// it on API calls. To make authentication work regardless of cookie policy,
// every login response also carries the JWT, which the client stores here and
// sends as an "Authorization: Bearer <token>" header (headers always travel
// cross-site). The cookie is kept as a secondary channel where it works.
const KEY = "erp_auth_token";

export const getToken = () => {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
};

export const setToken = (token) => {
  try {
    if (token) localStorage.setItem(KEY, token);
    else localStorage.removeItem(KEY);
  } catch {
    // Storage unavailable (e.g. private browsing) — cookie auth still applies.
  }
};

export const clearToken = () => {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // Ignore — nothing else to do.
  }
};
