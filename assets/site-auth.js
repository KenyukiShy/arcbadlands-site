// site-auth.js — shared password gate for admin.html + tracker.html
// Both pages accept either password (typo-tolerant, same access level).
// Also holds the commplex-api base URL, remembered in localStorage since
// it's not a secret (it's the same public API URL used by autobad.html).

const SiteAuth = (() => {
  const PASSWORDS = ["BubsyLove13", "BuddyLove13"];
  const DANGER_PASSPHRASE = "WCPGWrong";
  const DEFAULT_API_BASE = "https://commplex-api-349126848698.us-central1.run.app";

  function checkPassword(pw) {
    return PASSWORDS.includes(pw);
  }

  function confirmDanger(what) {
    const pass = prompt(`Type the confirmation passphrase to ${what}:`);
    return pass === DANGER_PASSPHRASE;
  }

  function getApiBase() {
    return localStorage.getItem("arc_api_base") || DEFAULT_API_BASE;
  }

  function setApiBase(url) {
    if (url) localStorage.setItem("arc_api_base", url);
  }

  // Session storage of the *password itself* (not a secret credential —
  // it's a UX gate, same trust level as before) so token/summary fetches
  // during the session don't require retyping it.
  function rememberPassword(pw) {
    sessionStorage.setItem("arc_gate_pw", pw);
  }
  function getRememberedPassword() {
    return sessionStorage.getItem("arc_gate_pw") || "";
  }
  function isUnlocked(sessionKey) {
    return sessionStorage.getItem(sessionKey) === "1";
  }
  function unlock(sessionKey) {
    sessionStorage.setItem(sessionKey, "1");
  }

  return {
    checkPassword, confirmDanger, getApiBase, setApiBase,
    rememberPassword, getRememberedPassword, isUnlocked, unlock,
  };
})();
