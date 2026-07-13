// fleet-api.js
// A small client-side "API" for managing vehicle photo galleries, backed
// directly by the GitHub repo (since this is a static GitHub Pages site with
// no server). Every write is a real git commit via the GitHub Contents API.
//
// IMPORTANT SECURITY NOTE:
// The GitHub token you provide is a real credential with write access to
// the repo. It is only ever kept in sessionStorage (cleared when the tab
// closes) and is never written into any committed file. Do not paste a
// token with more than "repo" scope, and revoke/rotate it if this device
// is shared.
//
// Usage (from admin.html, or the browser console on admin.html):
//   FleetAPI.configure({ token: 'ghp_xxx' });
//   await FleetAPI.readManifest('F350');
//   await FleetAPI.addPhoto('F350', { file: fileInputEl.files[0], caption: 'New Angle', alt: 'F-350 new angle', size: 'small' });
//   await FleetAPI.updatePhoto('F350', 3, { caption: 'Updated caption' });
//   await FleetAPI.removePhoto('F350', 3);
//   await FleetAPI.batchRemove('F350', [2,3,4]);
//   await FleetAPI.batchAdd('F350', [{file, caption, alt, size}, ...]);

const FleetAPI = (() => {
  const CONFIG = {
    owner: "KenyukiShy",
    repo: "arcbadlands-site",
    branch: "main",
    token: null,
  };

  function configure(opts) {
    Object.assign(CONFIG, opts);
    if (CONFIG.token) sessionStorage.setItem("fleetapi_token", CONFIG.token);
  }

  function restoreToken() {
    const t = sessionStorage.getItem("fleetapi_token");
    if (t) CONFIG.token = t;
    return CONFIG.token;
  }

  function requireToken() {
    if (!CONFIG.token) restoreToken();
    if (!CONFIG.token) throw new Error("No GitHub token configured. Call FleetAPI.configure({token: '...'}) first.");
    return CONFIG.token;
  }

  function apiHeaders() {
    return {
      Authorization: `token ${requireToken()}`,
      Accept: "application/vnd.github+json",
    };
  }

  function apiUrl(path) {
    return `https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}/contents/${path}`;
  }

  async function getFile(path) {
    const res = await fetch(`${apiUrl(path)}?ref=${CONFIG.branch}`, { headers: apiHeaders() });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`GET ${path} failed: ${res.status} ${await res.text()}`);
    return res.json(); // { content(base64), sha, ... }
  }

  function b64EncodeUnicode(str) {
    return btoa(unescape(encodeURIComponent(str)));
  }
  function b64DecodeUnicode(str) {
    return decodeURIComponent(escape(atob(str)));
  }

  // Every PUT re-fetches the file's current sha immediately beforehand — GitHub
  // Contents API 409s when the sha you send is stale, and captions/manifests
  // here can be edited from more than one tab. If the PUT still 409s (something
  // else won the race in between our GET and our PUT), we re-GET the sha once
  // more and retry exactly once before giving up.
  async function attemptPut(path, contentBase64, message) {
    const current = await getFile(path);
    const body = {
      message,
      content: contentBase64,
      branch: CONFIG.branch,
    };
    if (current) body.sha = current.sha;
    return fetch(apiUrl(path), {
      method: "PUT",
      headers: { ...apiHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  }

  async function putFile(path, contentBase64, message) {
    let res = await attemptPut(path, contentBase64, message);
    if (res.status === 409) {
      res = await attemptPut(path, contentBase64, message);
    }
    if (!res.ok) throw new Error(`PUT ${path} failed: ${res.status} ${await res.text()}`);
    return res.json();
  }

  async function deleteFile(path, message, sha) {
    const res = await fetch(apiUrl(path), {
      method: "DELETE",
      headers: { ...apiHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ message, sha, branch: CONFIG.branch }),
    });
    if (!res.ok) throw new Error(`DELETE ${path} failed: ${res.status} ${await res.text()}`);
    return res.json();
  }

  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function readManifest(vehicle) {
    const path = `fleet_assets/${vehicle}/photos.json`;
    const file = await getFile(path);
    if (!file) throw new Error(`No manifest found for ${vehicle}`);
    return { manifest: JSON.parse(b64DecodeUnicode(file.content)), sha: file.sha, path };
  }

  // Note: this no longer takes a sha — putFile always re-GETs the current sha
  // itself immediately before writing, so callers can't hand it something stale.
  async function writeManifest(vehicle, manifest, message) {
    const path = `fleet_assets/${vehicle}/photos.json`;
    const contentB64 = b64EncodeUnicode(JSON.stringify(manifest, null, 2));
    return putFile(path, contentB64, message || `fleet-api: update ${vehicle} manifest`);
  }

  async function addPhoto(vehicle, { file, caption, alt, size = "small" }) {
    const { manifest } = await readManifest(vehicle);
    let src = null;
    if (file) {
      const filename = file.name.replace(/\s+/g, "_");
      src = `fleet_assets/${vehicle}/${filename}`;
      const b64 = await fileToBase64(file);
      await putFile(src, b64, `fleet-api: add photo ${filename} to ${vehicle}`);
    }
    manifest.photos.push({ src, caption, alt: alt || caption, size });
    await writeManifest(vehicle, manifest, `fleet-api: add "${caption}" to ${vehicle} gallery`);
    return manifest;
  }

  async function batchAdd(vehicle, items) {
    const results = [];
    for (const item of items) {
      results.push(await addPhoto(vehicle, item));
    }
    return results;
  }

  async function updatePhoto(vehicle, index, patch) {
    const { manifest } = await readManifest(vehicle);
    if (!manifest.photos[index]) throw new Error(`No photo at index ${index} for ${vehicle}`);
    Object.assign(manifest.photos[index], patch);
    await writeManifest(vehicle, manifest, `fleet-api: update photo #${index} on ${vehicle}`);
    return manifest;
  }

  async function removePhoto(vehicle, index, { deleteFileToo = true } = {}) {
    const { manifest } = await readManifest(vehicle);
    const entry = manifest.photos[index];
    if (!entry) throw new Error(`No photo at index ${index} for ${vehicle}`);
    manifest.photos.splice(index, 1);
    await writeManifest(vehicle, manifest, `fleet-api: remove photo #${index} from ${vehicle}`);
    if (deleteFileToo && entry.src) {
      const fileInfo = await getFile(entry.src);
      if (fileInfo) await deleteFile(entry.src, `fleet-api: delete image file for removed ${vehicle} photo`, fileInfo.sha);
    }
    return manifest;
  }

  async function batchRemove(vehicle, indices) {
    // remove highest index first so earlier indices stay valid
    const sorted = [...indices].sort((a, b) => b - a);
    let manifest;
    for (const idx of sorted) {
      manifest = await removePhoto(vehicle, idx);
    }
    return manifest;
  }

  return {
    configure,
    restoreToken,
    readManifest,
    writeManifest,
    addPhoto,
    batchAdd,
    updatePhoto,
    removePhoto,
    batchRemove,
    _config: CONFIG,
  };
})();
