import React from "react";
import { SettingsSection } from "spcr-settings";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

async function main() {
  const settings = new SettingsSection("Cover Swap", "default-covers");

  settings.addInput("liked-cover", "Liked Songs Cover URL", "");
  settings.addInput("local-files-cover", "Local Files Cover URL", "");

  settings.addButton("button-1", "Update Images", "Apply Changes", async () => {
    const newLikedCoverUrl = settings.getFieldValue("liked-cover") as string;
    const newLocalFilesCoverUrl = settings.getFieldValue("local-files-cover") as string;

    let notificationMessage = "";
    let changesRequested = false;

    if (newLikedCoverUrl) {
        Spicetify.LocalStorage.set("default-covers:liked", newLikedCoverUrl);
        notificationMessage += "Saved Liked Songs cover URL. ";
        changesRequested = true;
    } else {
         Spicetify.LocalStorage.remove("default-covers:liked");
         notificationMessage += "Cleared Liked Songs cover URL. ";
         changesRequested = true;
    }

    if (newLocalFilesCoverUrl) {
        Spicetify.LocalStorage.set("default-covers:local-files", newLocalFilesCoverUrl);
        notificationMessage += "Saved Local Files cover URL. ";
        changesRequested = true;
    } else {
         Spicetify.LocalStorage.remove("default-covers:local-files");
         notificationMessage += "Cleared Local Files cover URL. ";
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

  settings.addButton("button-2", "Restore Defaults", "Restore", async () => {
    Spicetify.LocalStorage.remove("default-covers:liked");
    Spicetify.LocalStorage.remove("default-covers:local-files");

    Spicetify.showNotification("Restored default cover images.");

    changeLibraryCovers();

    await triggerUiRefreshCycle();

  });


  settings.pushSettings();

  function clickButtonByAriaLabel(label: string): boolean {
      const button = document.querySelector(`button[aria-label="${label}"]`);
      if (button instanceof HTMLElement) {
          button.click();
          return true;
      } else {
          return false;
      }
  }

  async function triggerUiRefreshCycle() {
       try {
          Spicetify.Platform.History.push("/");
          await delay(50);

          const collapseButtonPresent = document.querySelector('button[aria-label="Collapse Your Library"]') instanceof HTMLElement;
          const openButtonPresent = document.querySelector('button[aria-label="Open Your Library"]') instanceof HTMLElement;

          if (collapseButtonPresent) {
            console.log("Sidebar is open. Collapsing then expanding.");
            clickButtonByAriaLabel("Collapse Your Library");
            await delay(250);
            clickButtonByAriaLabel("Open Your Library");
            await delay(300);
          } else if (openButtonPresent) {
            console.log("Sidebar is closed. Opening then collapsing.");
            clickButtonByAriaLabel("Open Your Library");
            await delay(250);
            clickButtonByAriaLabel("Collapse Your Library");
            await delay(300);
          } else {
            console.warn("Neither sidebar toggle button found. Skipping sidebar toggle cycle.");
            await delay(100);
          }

          Spicetify.Platform.History.push("/collection");
          await delay(100);

          const likedUrlAfterRestore = Spicetify.LocalStorage.get("default-covers:liked");
          if (likedUrlAfterRestore || Spicetify.Platform.History.location.pathname === '/collection/tracks') {
              Spicetify.Platform.History.push("/collection/tracks");
              await delay(100);
          }

        } catch (error) {
          console.error("Error during UI refresh cycle:", error);
        }
  }


  function changeLibraryCovers() {
    const newLikedImageUrl = Spicetify.LocalStorage.get("default-covers:liked");
    const likedTargetSrc = "https://misc.scdn.co/liked-songs/liked-songs-300.jpg";

    const likedSongsImages = document.querySelectorAll(
        `img[src*="${likedTargetSrc}"], img[src="${Spicetify.LocalStorage.get("default-covers:liked.last_set") || 'nonexistenturl'}"]`
    );


    likedSongsImages.forEach((img) => {
        if (newLikedImageUrl) {
           // APPLY custom image if URL is set
           if (img && img.src !== newLikedImageUrl && img.src.includes(likedTargetSrc)) {
               img.src = newLikedImageUrl;
               if (img.srcset) {
                  img.srcset = img.srcset.split(', ').map(s => {
                     const parts = s.trim().split(' ');
                     return `${newLikedImageUrl} ${parts[1] || ''}`.trim();
                 }).join(', ');
               }
           }
        } else {
           const lastSetUrl = Spicetify.LocalStorage.get("default-covers:liked.last_set");
           if (img && lastSetUrl && img.src === lastSetUrl) {
               img.src = likedTargetSrc;
                if (img.srcset) {
                   img.srcset = img.srcset.split(', ').map(s => {
                      const parts = s.trim().split(' ');
                      return `${likedTargetSrc} ${parts[1] || ''}`.trim();
                   }).join(', ');
                }
                console.log("Restored Liked Songs cover image src to default.");
           }
        }
    });

    const newLocalFilesImageUrl = Spicetify.LocalStorage.get("default-covers:local-files");

    const localFilesListItem = document.querySelector(
        '[aria-labelledby="listrow-title-spotify:collection:local-files"]',
    );

    if (localFilesListItem) {
        const iconContainerDiv = localFilesListItem.querySelector(
             '.Areas__HeaderSideArea-sc-8gfrea-1 .Areas__HeaderSideAreaFlexContainer-sc-8gfrea-2 .YsCa3XbOXEm79LH0B7do .k270skPbT7JOaSidSA2a'
        );

        if (iconContainerDiv) {
            const currentSvgIcon = iconContainerDiv.querySelector('svg[role="img"][data-encore-id="icon"]');
            const currentImgInContainer = iconContainerDiv.querySelector('img');

            if (newLocalFilesImageUrl) {
               if (currentImgInContainer && currentImgInContainer.src === newLocalFilesImageUrl) {
                    return;
               }

               if (currentSvgIcon) {
                  console.log("Found Local Files SVG icon within list item container. Attempting replacement.");

                  if (currentImgInContainer) {
                      try {
                         iconContainerDiv.removeChild(currentImgInContainer);
                         console.log("Removed existing image before injecting new Local Files image.");
                      } catch(e) {
                         console.error("Error removing existing image:", e);
                      }
                  }

                  const newImgElement = document.createElement('img');
                  newImgElement.src = newLocalFilesImageUrl;
                  newImgElement.style.width = '100%';
                  newImgElement.style.height = '100%';
                  newImgElement.style.objectFit = 'cover';
                  newImgElement.style.borderRadius = '4px';
                  newImgElement.style.display = 'block';
                  newImgElement.alt = 'Local Files Custom Cover';

                  try {
                     iconContainerDiv.replaceChild(newImgElement, currentSvgIcon);
                     console.log("Successfully replaced Local Files SVG with image in list item.");
                     Spicetify.LocalStorage.set("default-covers:local-files.last_set", newLocalFilesImageUrl);
                  } catch (e) {
                      console.error("Failed to replace Local Files SVG in list item:", e);
                  }

               } else if (currentImgInContainer) {
                   if (currentImgInContainer.src !== newLocalFilesImageUrl) {
                       console.log("Found existing image in Local Files container. Updating src.");
                       currentImgInContainer.src = newLocalFilesImageUrl;
                       if (currentImgInContainer.srcset) {
                            currentImgInContainer.srcset = currentImgInContainer.srcset.split(', ').map(s => {
                                const parts = s.trim().split(' ');
                                return `${newLocalFilesImageUrl} ${parts[1] || ''}`.trim();
                            }).join(', ');
                        }
                       Spicetify.LocalStorage.set("default-covers:local-files.last_set", newLocalFilesImageUrl);
                       console.log("Successfully updated src of existing image for Local Files.");
                   }
               }
           } else {
              const lastSetUrl = Spicetify.LocalStorage.get("default-covers:local-files.last_set");
              if (currentImgInContainer && (!currentSvgIcon || (lastSetUrl && currentImgInContainer.src === lastSetUrl))) {
                   console.log("Found injected image for Local Files. Attempting removal.");
                   try {
                      iconContainerDiv.removeChild(currentImgInContainer);
                      console.log("Successfully removed injected image for Local Files.");
                      Spicetify.LocalStorage.remove("default-covers:local-files.last_set");
                   } catch (e) {
                      console.error("Failed to remove injected image for Local Files:", e);
                   }
              } else {
                   if (!currentImgInContainer && !currentSvgIcon) {
                   } else if (!currentImgInContainer && currentSvgIcon) {
                   }
              }
           }
        } else {
        }
    } else {
    }

    if (newLikedImageUrl) {
        Spicetify.LocalStorage.set("default-covers:liked.last_set", newLikedImageUrl);
    } else {
        Spicetify.LocalStorage.remove("default-covers:liked.last_set");
    }
  }

  const observer = new MutationObserver((mutations, obs) => {
    changeLibraryCovers();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  changeLibraryCovers();
}

export default main;
