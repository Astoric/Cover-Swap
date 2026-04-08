/**
 * Cover Swap - Spicetify Extension
 *
 * Allows users to customize the cover images for:
 *  - Liked Songs
 *  - Local Files
 *  - DJ
 *
 * Adds configurable URL fields in Spicetify settings.
 * Updates icons dynamically in the sidebar and collections.
 */

import React from "react";
import { SettingsSection } from "spcr-settings";

// Simple delay helper
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

async function main() {
  // Initialize settings section
  const settings = new SettingsSection("Cover Swap", "default-covers");

  // Custom cover input fields
  settings.addInput("liked-cover", "Liked Songs Cover URL", "");
  settings.addInput("local-files-cover", "Local Files Cover URL", "");
  settings.addInput("dj-cover", "DJ Cover URL", "");

  /**
   * "Apply Changes" button
   * Saves entered URLs and updates covers immediately
   */
  settings.addButton("button-1", "Update Images", "Apply Changes", async () => {
    const newLikedCoverUrl = settings.getFieldValue("liked-cover") as string;
    const newLocalFilesCoverUrl = settings.getFieldValue(
      "local-files-cover",
    ) as string;
    const newDjCoverUrl = settings.getFieldValue("dj-cover") as string;

    let notificationMessage = "";
    let changesRequested = false;

    // Save/clear liked cover
    if (newLikedCoverUrl) {
      Spicetify.LocalStorage.set("default-covers:liked", newLikedCoverUrl);
      notificationMessage += "Saved Liked Songs cover URL. ";
      changesRequested = true;
    } else {
      Spicetify.LocalStorage.remove("default-covers:liked");
      notificationMessage += "Cleared Liked Songs cover URL. ";
      changesRequested = true;
    }

    // Save/clear local files cover
    if (newLocalFilesCoverUrl) {
      Spicetify.LocalStorage.set(
        "default-covers:local-files",
        newLocalFilesCoverUrl,
      );
      notificationMessage += "Saved Local Files cover URL. ";
      changesRequested = true;
    } else {
      Spicetify.LocalStorage.remove("default-covers:local-files");
      notificationMessage += "Cleared Local Files cover URL. ";
      changesRequested = true;
    }

    // Save/clear DJ cover
    if (newDjCoverUrl) {
      Spicetify.LocalStorage.set("default-covers:dj", newDjCoverUrl);
      notificationMessage += "Saved DJ cover URL. ";
      changesRequested = true;
    } else {
      Spicetify.LocalStorage.remove("default-covers:dj");
      notificationMessage += "Cleared DJ cover URL. ";
      changesRequested = true;
    }

    if (!changesRequested) {
      Spicetify.showNotification("No changes requested.");
      return;
    }

    Spicetify.showNotification(notificationMessage.trim());
    changeLibraryCovers();
    await triggerUiRefreshCycle();
  });

  /**
   * "Restore Defaults" button
   * Clears all saved custom cover URLs
   */
  settings.addButton("button-2", "Restore Defaults", "Restore", async () => {
    Spicetify.LocalStorage.remove("default-covers:liked");
    Spicetify.LocalStorage.remove("default-covers:local-files");
    Spicetify.LocalStorage.remove("default-covers:dj");

    Spicetify.showNotification("Restored all cover images to defaults.");

    changeLibraryCovers();
    await triggerUiRefreshCycle();
  });

  // Register settings section
  settings.pushSettings();

  const style = document.createElement("style");
  style.textContent = `
  /* Restore visible size for Cover Swap buttons */
  #default-covers button.x-settings-button {
    background-color: var(--spice-button-disabled, rgba(255,255,255,0.1));
    color: var(--spice-text);
    border-radius: 4px;
    font-size: 14px;
    padding: 6px 16px;
    min-width: 120px;
    cursor: pointer;
  }

  #default-covers button.x-settings-button:hover {
    background-color: var(--spice-button-hover, rgba(255,255,255,0.2));
  }
`;
  document.head.appendChild(style);

  /** Utility: click a button via aria-label */
  function clickButtonByAriaLabel(label: string): boolean {
    const button = document.querySelector(`button[aria-label="${label}"]`);
    if (button instanceof HTMLElement) {
      button.click();
      return true;
    }
    return false;
  }

  /**
   * Forces a brief Spotify UI refresh
   * Ensures icons update correctly without reload
   */
  async function triggerUiRefreshCycle() {
    try {
      Spicetify.Platform.History.push("/");
      await delay(50);

      const collapseBtn = document.querySelector(
        'button[aria-label="Collapse Your Library"]',
      );
      const openBtn = document.querySelector(
        'button[aria-label="Open Your Library"]',
      );

      if (collapseBtn instanceof HTMLElement) {
        clickButtonByAriaLabel("Collapse Your Library");
        await delay(250);
        clickButtonByAriaLabel("Open Your Library");
        await delay(300);
      } else if (openBtn instanceof HTMLElement) {
        clickButtonByAriaLabel("Open Your Library");
        await delay(250);
        clickButtonByAriaLabel("Collapse Your Library");
        await delay(300);
      } else {
        await delay(100);
      }

      Spicetify.Platform.History.push("/collection");
      await delay(100);

      const likedUrl = Spicetify.LocalStorage.get("default-covers:liked");
      if (
        likedUrl ||
        Spicetify.Platform.History.location.pathname === "/collection/tracks"
      ) {
        Spicetify.Platform.History.push("/collection/tracks");
        await delay(100);
      }
    } catch (error) {
      console.error("[Cover Swap] UI refresh error:", error);
    }
  }

  /**
   * Updates Liked Songs cover on the main collection page
   */
  function updateLikedSongsCover() {
    const newCover = Spicetify.LocalStorage.get("default-covers:liked");
    const targetSrc = "https://misc.scdn.co/liked-songs/liked-songs-300.jpg";
    const lastSet = Spicetify.LocalStorage.get("default-covers:liked.last_set");

    const imgs = document.querySelectorAll<HTMLImageElement>(
      `img[src*="${targetSrc}"], img[src="${lastSet || "none"}"]`,
    );

    imgs.forEach((img) => {
      if (newCover) {
        if (img.src !== newCover && img.src.includes(targetSrc)) {
          img.src = newCover;
          if (img.srcset) {
            img.srcset = img.srcset
              .split(", ")
              .map((s) => {
                const parts = s.trim().split(" ");
                return `${newCover} ${parts[1] || ""}`.trim();
              })
              .join(", ");
          }
        }
      } else if (lastSet && img.src === lastSet) {
        img.src = targetSrc;
        if (img.srcset) {
          img.srcset = img.srcset
            .split(", ")
            .map((s) => {
              const parts = s.trim().split(" ");
              return `${targetSrc} ${parts[1] || ""}`.trim();
            })
            .join(", ");
        }
      }
    });

    if (newCover) {
      Spicetify.LocalStorage.set("default-covers:liked.last_set", newCover);
    } else {
      Spicetify.LocalStorage.remove("default-covers:liked.last_set");
    }
  }

  /**
   * Replaces or restores the Local Files icon in the library sidebar
   */
  function updateLocalFilesCover() {
    const newCover = Spicetify.LocalStorage.get("default-covers:local-files");
    const lastSet = Spicetify.LocalStorage.get(
      "default-covers:local-files.last_set",
    );

    let container = null;

    const possibleSelectors = [
      '[aria-label="Local Files"]',
      'span[title="Local Files"]',
      'div[title="Local Files"]',
      '[data-testid="list-row"]',
      '[data-testid="sidebar-list-item"]',
    ];

    for (const sel of possibleSelectors) {
      const elements = document.querySelectorAll(sel);
      for (const el of elements) {
        const text = (
          el.textContent ||
          el.getAttribute("aria-label") ||
          ""
        ).trim();
        if (text === "Local Files" || text.includes("Local Files")) {
          container =
            el.querySelector(
              'div[class*="image"], div[class*="icon"], .main-image-image, .HeaderSideArea, svg',
            )?.parentElement || el;
          if (container) break;
        }
      }
      if (container) break;
    }

    if (!container) {
      const icons = document.querySelectorAll(
        'nav svg, .sidebar svg, [role="img"]',
      );
      for (const icon of icons) {
        const parent = icon.parentElement?.parentElement || icon.parentElement;
        if (parent && (parent.textContent || "").includes("Local Files")) {
          container = parent;
          break;
        }
      }
    }

    if (!container) {
      console.warn(
        "[Cover Swap] Could not find Local Files item in the sidebar. Try expanding/collapsing Your Library or navigating away and back.",
      );
      return;
    }

    const currentImg = container.querySelector("img");

    if (newCover) {
      if (currentImg && currentImg.src === newCover) return;

      const newImg = document.createElement("img");
      newImg.src = newCover;
      newImg.alt = "Local Files";
      newImg.style.cssText = `
      width: 100% !important;
      height: 100% !important;
      object-fit: cover !important;
      border-radius: 4px !important;
      display: block !important;
    `;

      const oldSvg = container.querySelector("svg");
      if (oldSvg) {
        oldSvg.replaceWith(newImg);
      } else if (currentImg) {
        currentImg.replaceWith(newImg);
      } else {
        container.prepend(newImg);
      }

      Spicetify.LocalStorage.set(
        "default-covers:local-files.last_set",
        newCover,
      );
      console.log(
        "[Cover Swap] ✅ Local Files icon successfully replaced with custom cover.",
      );
    } else if (
      currentImg &&
      lastSet &&
      (currentImg.src === lastSet ||
        currentImg.src.includes(new URL(lastSet).hostname))
    ) {
      currentImg.remove();
      Spicetify.LocalStorage.remove("default-covers:local-files.last_set");
      console.log("[Cover Swap] ✅ Restored original Local Files icon.");
    }
  }

  /**
   * Replaces or restores the DJ icon in the library sidebar
   */
  function updateDjCover() {
    const newCover = Spicetify.LocalStorage.get("default-covers:dj");
    const lastSet = Spicetify.LocalStorage.get("default-covers:dj.last_set");

    // Locate the DJ image element by stable attributes
    const djImg = document.querySelector<HTMLImageElement>(
      'img[alt="DJ"].main-image-image',
    );

    if (!djImg) {
      console.warn("[Cover Swap] DJ image not found.");
      return;
    }

    if (newCover) {
      // Set custom cover URL if different
      if (djImg.src !== newCover) {
        djImg.src = newCover;

        if (djImg.srcset) {
          djImg.srcset = djImg.srcset
            .split(", ")
            .map((s) => {
              const parts = s.trim().split(" ");
              return `${newCover} ${parts[1] || ""}`.trim();
            })
            .join(", ");
        }

        Spicetify.LocalStorage.set("default-covers:dj.last_set", newCover);
        console.log("[Cover Swap] DJ cover updated.");
      }
    } else if (lastSet && djImg.src === lastSet) {
      // Restore Spotify’s default DJ art
      const defaultSrc =
        "https://lexicon-assets.spotifycdn.com/DJ-Beta-CoverArt-300.jpg";
      djImg.src = defaultSrc;

      if (djImg.srcset) {
        djImg.srcset = djImg.srcset
          .split(", ")
          .map((s) => {
            const parts = s.trim().split(" ");
            return `${defaultSrc} ${parts[1] || ""}`.trim();
          })
          .join(", ");
      }

      Spicetify.LocalStorage.remove("default-covers:dj.last_set");
      console.log("[Cover Swap] DJ cover restored to default.");
    }
  }

  /**
   * Main updater that applies all three cover changes
   */
  function changeLibraryCovers() {
    updateLikedSongsCover();
    updateLocalFilesCover();
    updateDjCover();
  }

  // Observe DOM changes to reapply covers dynamically
  const observer = new MutationObserver(() => changeLibraryCovers());
  observer.observe(document.body, { childList: true, subtree: true });

  // Apply covers immediately on startup
  changeLibraryCovers();
}

export default main;
