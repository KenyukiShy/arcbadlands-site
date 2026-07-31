// firebase-auth.js — shared Firebase Auth (Google Sign-In) wiring for
// arcbadlands-site pages (tracker-crm.html, tracker.html, admin.html).
// Same Firebase project/config as arc-interface/board/board.html. Shared as
// one module (unlike board.html's one-off hasRole(), see
// ARCHITECTURE_REFACTOR_PLAN.md §3) because three pages here need the
// identical sign-in/sign-out/get-token wiring, not just one small function.
//
// Load as `<script type="module" src="assets/firebase-auth.js"></script>`.
// Module scripts are deferred and guaranteed to finish executing before
// DOMContentLoaded fires, so any classic (non-module) script on the same
// page that needs window.ArcAuth should do that work inside a
// DOMContentLoaded listener, not at top level — see each page's own script
// for how it does this.

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  getAuth, GoogleAuthProvider, signInWithRedirect, signOut as fbSignOut,
  getRedirectResult, onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

// Public, client-embedded config (not a secret) — same Firebase project as
// arc-interface/board/board.html.
const firebaseConfig = {
  apiKey: "AIzaSyDyl6MLNFoou2ZL7rj9UjKcPhe2gPzP7s4",
  authDomain: "commplex-493805.web.app",
  projectId: "commplex-493805",
  storageBucket: "commplex-493805.firebasestorage.app",
  messagingSenderId: "349126848698",
  appId: "1:349126848698:web:73c2804b4844353fba1283",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

getRedirectResult(auth).catch(err => {
  console.error("[arc-auth] getRedirectResult error:", err.code, err.message);
});

window.ArcAuth = {
  signIn() {
    return signInWithRedirect(auth, new GoogleAuthProvider());
  },
  signOut() {
    return fbSignOut(auth);
  },
  // Firebase caches and auto-refreshes the ID token internally; calling
  // this fresh before each request is cheap and avoids sending a stale one.
  async getIdToken() {
    if (!auth.currentUser) return null;
    return auth.currentUser.getIdToken();
  },
  getCurrentUser() {
    return auth.currentUser;
  },
  // cb(user|null) fires once with the current (possibly still-resolving)
  // state and again on every sign-in/sign-out. Mirrors board.html's
  // onAuthStateChanged usage — callers should not assume a synchronous
  // answer is available before this fires at least once.
  onAuthChange(cb) {
    return onAuthStateChanged(auth, cb);
  },
};
