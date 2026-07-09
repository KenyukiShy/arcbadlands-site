// gallery-render.js
// Renders the photo gallery for a vehicle page from its fleet_assets/<Vehicle>/photos.json
// manifest, so photos can be added/removed/edited by updating the manifest (e.g. via
// admin.html) instead of hand-editing gallery HTML on every page.
//
// Expects on the page:
//   <div class="gallery-grid" id="gallery-main-grid"></div>
//   <div class="gallery-add-row" id="gallery-add-row"></div>
//   <div class="gallery-note" id="gallery-note-text"></div>
// and, optionally, for pages with a separate documentation grid:
//   <div id="gallery-doc-grid"></div>

function tileHTML(p, small) {
  const sizeClass = p.size === "large" ? "photo large" : "photo";
  const style = small ? ' style="height:160px;border-radius:4px;"' : "";
  const imgStyle = small ? ' style="width:100%;height:100%;object-fit:cover;"' : "";
  const captionTitle = (p.alt || p.caption || "").replace(/"/g, "&quot;");
  const inner = p.src
    ? `<img src="${p.src}" alt="${captionTitle}"${imgStyle}>`
    : `<div class="photo-placeholder"${small ? ' style="height:160px;"' : ""}>
         <div class="upload-icon">${p.placeholder_icon || "📸"}</div>
         <div class="ph-label">${p.placeholder_label || p.caption || ""}</div>
       </div>`;
  return `<div class="${sizeClass}"${style} onclick="openLightbox(this)" data-caption="${captionTitle}">
      ${inner}
      <div class="photo-caption">${p.caption || ""}</div>
    </div>`;
}

async function renderGallery(vehicle) {
  const basePath = window.location.pathname.includes("/combos/") ? "../fleet_assets" : "fleet_assets";
  let data;
  try {
    const res = await fetch(`${basePath}/${vehicle}/photos.json`);
    data = await res.json();
  } catch (e) {
    console.error("Could not load gallery manifest for", vehicle, e);
    return;
  }

  const mainGrid = document.getElementById("gallery-main-grid");
  const addRow = document.getElementById("gallery-add-row");
  const noteEl = document.getElementById("gallery-note-text");
  const docGrid = document.getElementById("gallery-doc-grid");

  const photos = data.photos || [];
  const mainPhotos = photos.slice(0, 5);
  const restPhotos = photos.slice(5);

  if (mainGrid) mainGrid.innerHTML = mainPhotos.map((p) => tileHTML(p, false)).join("\n");
  if (addRow) addRow.innerHTML = restPhotos.map((p) => tileHTML(p, true)).join("\n");
  if (noteEl && data.note) noteEl.textContent = data.note;

  if (docGrid && Array.isArray(data.documentation)) {
    docGrid.innerHTML = data.documentation
      .map(
        (p) => `<div class="photo" style="height:200px;border-radius:4px;" onclick="openLightbox(this)" data-caption="${(p.alt || p.caption || "").replace(/"/g, "&quot;")}">
          <img src="${p.src}" alt="${(p.alt || p.caption || "").replace(/"/g, "&quot;")}" style="width:100%;height:100%;object-fit:cover;">
          <div class="photo-caption">${p.caption || ""}</div>
        </div>`
      )
      .join("\n");
  }
}
