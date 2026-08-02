// assets/tracker-repository.js — Repository pattern wrapper around the
// tracker-storage API endpoints, extracted from tracker-crm.html's inline
// fetch() calls. tracker-crm.html should only ever call the methods below,
// so a future API change touches this one file instead of many call sites.
//
// This follows the same factory pattern as arc-interface/board/assignments-repo.js.
// Real write authorization lives in the backend's require_role() decorators,
// not here — this module doesn't add any access control of its own, it only
// owns the read/write shape.

export function createTrackerRepository(apiBaseUrl) {
  let TRACKER_KEY = null;

  // Private helper for headers that require the bootstrapped tracker key.
  // An ID token can be passed for authenticated endpoints.
  function apiHeaders(idToken) {
    if (!TRACKER_KEY) throw new Error("Tracker key not bootstrapped");
    const headers = {
      "Content-Type": "application/json",
      "X-Tracker-Key": TRACKER_KEY,
    };
    if (idToken) {
      headers["Authorization"] = `Bearer ${idToken}`;
    }
    return headers;
  }

  return {
    // Fetches the client-side API key from the unauthenticated /client-key
    // endpoint. This must be called once before any other method.
    async bootstrapKey() {
      try {
        const res = await fetch(`${apiBaseUrl}/client-key`);
        if (!res.ok) throw new Error(`client-key fetch failed: ${res.status}`);
        const data = await res.json();
        TRACKER_KEY = data.key;
      } catch (e) {
        console.error("bootstrapTrackerKey error", e);
        throw e;
      }
    },

    // Replaces the old window.storage.get() shim.
    async getStorage(key) {
      const res = await fetch(`${apiBaseUrl}/${encodeURIComponent(key)}`, {
        headers: { "X-Tracker-Key": TRACKER_KEY }, // No Content-Type for GET
      });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error(`storage.get failed: ${res.status}`);
      return res.json();
    },

    // Replaces the old window.storage.set() shim.
    async setStorage(key, value) {
      const res = await fetch(`${apiBaseUrl}/${encodeURIComponent(key)}`, {
        method: "POST",
        headers: apiHeaders(),
        body: JSON.stringify({ value }),
      });
      if (!res.ok) throw new Error(`storage.set failed: ${res.status}`);
      return res.json();
    },

    // Corresponds to loadEngagements()
    async getEngagements(idToken) {
      const res = await fetch(`${apiBaseUrl}/engagements`, {
        headers: apiHeaders(idToken),
      });
      if (!res.ok) {
        throw new Error(`${res.status}: ${await res.text()}`);
      }
      return res.json();
    },

    // Corresponds to logAuditEvent()
    async logAuditEvent(idToken, logEntry) {
      const res = await fetch(`${apiBaseUrl}/audit-log`, {
        method: "POST",
        headers: apiHeaders(idToken),
        body: JSON.stringify({ entry: logEntry }),
      });
      if (!res.ok) {
        console.error("Failed to write audit log:", await res.text());
      }
      return res.ok;
    },

    // Corresponds to loadContacts()
    async getVendorContacts(idToken) {
      const res = await fetch(`${apiBaseUrl}/vendor-contacts`, {
        headers: apiHeaders(idToken),
      });
      if (!res.ok) {
        throw new Error(`${res.status}: ${await res.text()}`);
      }
      return res.json();
    },

    // Corresponds to submitFlag()
    async flagItem(idToken, { engagement_id, engagement_name, reason }) {
      const res = await fetch(`${apiBaseUrl}/flag-item`, {
        method: "POST",
        headers: apiHeaders(idToken),
        body: JSON.stringify({ engagement_id, engagement_name, reason }),
      });
      if (!res.ok) {
        const detail = await res.json().catch(() => null);
        const message = (detail && detail.detail) || `Could not submit report (${res.status}).`;
        throw new Error(message);
      }
      return res.json();
    },

    // Corresponds to handleAuthChange()'s /me check
    async getMe(idToken) {
      const res = await fetch(`${apiBaseUrl}/me`, {
        headers: apiHeaders(idToken),
      });
      if (!res.ok) {
        // Distinguish 403 (no account) from other errors.
        if (res.status === 403) return { status: 403 };
        throw new Error(`${res.status}: ${await res.text()}`);
      }
      const data = await res.json();
      return { status: res.status, data };
    },

    // Corresponds to authRequestBtn.onclick
    async requestAccess({ name, email, phone, roles_requested }) {
      const res = await fetch(`${apiBaseUrl}/access-requests`, {
        method: "POST",
        headers: apiHeaders(),
        body: JSON.stringify({ name, email, phone, roles_requested }),
      });
      if (!res.ok) {
        const detail = await res.json().catch(() => null);
        const message = (detail && detail.detail) || `Request failed (${res.status}).`;
        throw new Error(message);
      }
      return res.json();
    },

    // Corresponds to loadItinerary()
    async getItinerary(idToken, agent) {
      const res = await fetch(`${apiBaseUrl}/itinerary/${encodeURIComponent(agent)}`, {
        headers: apiHeaders(idToken),
      });
      if (!res.ok) throw new Error(`${res.status}: ${await res.text()}`);
      return res.json();
    },

    // Corresponds to connectMyCalendar()
    async getCalendarConnectUrl(idToken) {
      const res = await fetch(`${apiBaseUrl}/me/calendar/connect`, {
        method: "POST",
        headers: apiHeaders(idToken),
      });
      if (!res.ok) throw new Error(`${res.status}: ${await res.text()}`);
      return res.json();
    },
  };
}
