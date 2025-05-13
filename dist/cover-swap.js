(async function() {
        while (!Spicetify.React || !Spicetify.ReactDOM) {
          await new Promise(resolve => setTimeout(resolve, 10));
        }
        var coverDswap = (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // external-global-plugin:react
  var require_react = __commonJS({
    "external-global-plugin:react"(exports, module) {
      module.exports = Spicetify.React;
    }
  });

  // external-global-plugin:react-dom
  var require_react_dom = __commonJS({
    "external-global-plugin:react-dom"(exports, module) {
      module.exports = Spicetify.ReactDOM;
    }
  });

  // node_modules/spcr-settings/settingsSection.tsx
  var import_react = __toESM(require_react());
  var import_react_dom = __toESM(require_react_dom());
  var SettingsSection = class {
    constructor(name, settingsId, initialSettingsFields = {}) {
      this.name = name;
      this.settingsId = settingsId;
      this.initialSettingsFields = initialSettingsFields;
      this.settingsFields = this.initialSettingsFields;
      this.setRerender = null;
      this.pushSettings = async () => {
        Object.entries(this.settingsFields).forEach(([nameId, field]) => {
          if (field.type !== "button" && this.getFieldValue(nameId) === void 0) {
            this.setFieldValue(nameId, field.defaultValue);
          }
        });
        while (!Spicetify?.Platform?.History?.listen) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
        if (this.stopHistoryListener)
          this.stopHistoryListener();
        this.stopHistoryListener = Spicetify.Platform.History.listen((e) => {
          if (e.pathname === "/preferences") {
            this.render();
          }
        });
        if (Spicetify.Platform.History.location.pathname === "/preferences") {
          await this.render();
        }
      };
      this.rerender = () => {
        if (this.setRerender) {
          this.setRerender(Math.random());
        }
      };
      this.render = async () => {
        while (!document.getElementById("desktop.settings.selectLanguage")) {
          if (Spicetify.Platform.History.location.pathname !== "/preferences")
            return;
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
        const allSettingsContainer = document.querySelector(
          ".main-view-container__scroll-node-child main div"
        );
        if (!allSettingsContainer)
          return console.error("[spcr-settings] settings container not found");
        let pluginSettingsContainer = Array.from(
          allSettingsContainer.children
        ).find((child) => child.id === this.settingsId);
        if (!pluginSettingsContainer) {
          pluginSettingsContainer = document.createElement("div");
          pluginSettingsContainer.id = this.settingsId;
          allSettingsContainer.appendChild(pluginSettingsContainer);
        } else {
          console.log(pluginSettingsContainer);
        }
        import_react_dom.default.render(/* @__PURE__ */ import_react.default.createElement(this.FieldsContainer, null), pluginSettingsContainer);
      };
      this.addButton = (nameId, description, value, onClick, events) => {
        this.settingsFields[nameId] = {
          type: "button",
          description,
          value,
          events: {
            onClick,
            ...events
          }
        };
      };
      this.addInput = (nameId, description, defaultValue, onChange, inputType, events) => {
        this.settingsFields[nameId] = {
          type: "input",
          description,
          defaultValue,
          inputType,
          events: {
            onChange,
            ...events
          }
        };
      };
      this.addHidden = (nameId, defaultValue) => {
        this.settingsFields[nameId] = {
          type: "hidden",
          defaultValue
        };
      };
      this.addToggle = (nameId, description, defaultValue, onChange, events) => {
        this.settingsFields[nameId] = {
          type: "toggle",
          description,
          defaultValue,
          events: {
            onChange,
            ...events
          }
        };
      };
      this.addDropDown = (nameId, description, options, defaultIndex, onSelect, events) => {
        this.settingsFields[nameId] = {
          type: "dropdown",
          description,
          defaultValue: options[defaultIndex],
          options,
          events: {
            onSelect,
            ...events
          }
        };
      };
      this.getFieldValue = (nameId) => {
        return JSON.parse(
          Spicetify.LocalStorage.get(`${this.settingsId}.${nameId}`) || "{}"
        )?.value;
      };
      this.setFieldValue = (nameId, newValue) => {
        Spicetify.LocalStorage.set(
          `${this.settingsId}.${nameId}`,
          JSON.stringify({ value: newValue })
        );
      };
      this.FieldsContainer = () => {
        const [rerender, setRerender] = (0, import_react.useState)(0);
        this.setRerender = setRerender;
        return /* @__PURE__ */ import_react.default.createElement("div", {
          className: "x-settings-section",
          key: rerender
        }, /* @__PURE__ */ import_react.default.createElement("h2", {
          className: "TypeElement-cello-textBase-type"
        }, this.name), Object.entries(this.settingsFields).map(([nameId, field]) => {
          return /* @__PURE__ */ import_react.default.createElement(this.Field, {
            nameId,
            field
          });
        }));
      };
      this.Field = (props) => {
        const id = `${this.settingsId}.${props.nameId}`;
        let defaultStateValue;
        if (props.field.type === "button") {
          defaultStateValue = props.field.value;
        } else {
          defaultStateValue = this.getFieldValue(props.nameId);
        }
        if (props.field.type === "hidden") {
          return /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null);
        }
        const [value, setValueState] = (0, import_react.useState)(defaultStateValue);
        const setValue = (newValue) => {
          if (newValue !== void 0) {
            setValueState(newValue);
            this.setFieldValue(props.nameId, newValue);
          }
        };
        return /* @__PURE__ */ import_react.default.createElement("div", {
          className: "x-settings-row"
        }, /* @__PURE__ */ import_react.default.createElement("div", {
          className: "x-settings-firstColumn"
        }, /* @__PURE__ */ import_react.default.createElement("label", {
          className: "TypeElement-viola-textSubdued-type",
          htmlFor: id
        }, props.field.description || "")), /* @__PURE__ */ import_react.default.createElement("div", {
          className: "x-settings-secondColumn"
        }, props.field.type === "input" ? /* @__PURE__ */ import_react.default.createElement("input", {
          className: "x-settings-input",
          id,
          dir: "ltr",
          value,
          type: props.field.inputType || "text",
          ...props.field.events,
          onChange: (e) => {
            setValue(e.currentTarget.value);
            const onChange = props.field.events?.onChange;
            if (onChange)
              onChange(e);
          }
        }) : props.field.type === "button" ? /* @__PURE__ */ import_react.default.createElement("span", null, /* @__PURE__ */ import_react.default.createElement("button", {
          id,
          className: "Button-sc-y0gtbx-0 Button-small-buttonSecondary-useBrowserDefaultFocusStyle x-settings-button",
          ...props.field.events,
          onClick: (e) => {
            setValue();
            const onClick = props.field.events?.onClick;
            if (onClick)
              onClick(e);
          },
          type: "button"
        }, value)) : props.field.type === "toggle" ? /* @__PURE__ */ import_react.default.createElement("label", {
          className: "x-settings-secondColumn x-toggle-wrapper"
        }, /* @__PURE__ */ import_react.default.createElement("input", {
          id,
          className: "x-toggle-input",
          type: "checkbox",
          checked: value,
          ...props.field.events,
          onClick: (e) => {
            setValue(e.currentTarget.checked);
            const onClick = props.field.events?.onClick;
            if (onClick)
              onClick(e);
          }
        }), /* @__PURE__ */ import_react.default.createElement("span", {
          className: "x-toggle-indicatorWrapper"
        }, /* @__PURE__ */ import_react.default.createElement("span", {
          className: "x-toggle-indicator"
        }))) : props.field.type === "dropdown" ? /* @__PURE__ */ import_react.default.createElement("select", {
          className: "main-dropDown-dropDown",
          id,
          ...props.field.events,
          onChange: (e) => {
            setValue(
              props.field.options[e.currentTarget.selectedIndex]
            );
            const onChange = props.field.events?.onChange;
            if (onChange)
              onChange(e);
          }
        }, props.field.options.map((option, i) => {
          return /* @__PURE__ */ import_react.default.createElement("option", {
            selected: option === value,
            value: i + 1
          }, option);
        })) : /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null)));
      };
    }
  };

  // src/app.tsx
  var delay = (ms) => new Promise((res) => setTimeout(res, ms));
  async function main() {
    const settings = new SettingsSection("Cover Swap", "default-covers");
    settings.addInput("liked-cover", "Liked Songs Cover URL", "");
    settings.addInput("local-files-cover", "Local Files Cover URL", "");
    settings.addButton("button-1", "Update Images", "Apply Changes", async () => {
      const newLikedCoverUrl = settings.getFieldValue("liked-cover");
      const newLocalFilesCoverUrl = settings.getFieldValue("local-files-cover");
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
    function clickButtonByAriaLabel(label) {
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
        if (likedUrlAfterRestore || Spicetify.Platform.History.location.pathname === "/collection/tracks") {
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
        `img[src*="${likedTargetSrc}"], img[src="${Spicetify.LocalStorage.get("default-covers:liked.last_set") || "nonexistenturl"}"]`
      );
      likedSongsImages.forEach((img) => {
        if (newLikedImageUrl) {
          if (img && img.src !== newLikedImageUrl && img.src.includes(likedTargetSrc)) {
            img.src = newLikedImageUrl;
            if (img.srcset) {
              img.srcset = img.srcset.split(", ").map((s) => {
                const parts = s.trim().split(" ");
                return `${newLikedImageUrl} ${parts[1] || ""}`.trim();
              }).join(", ");
            }
          }
        } else {
          const lastSetUrl = Spicetify.LocalStorage.get("default-covers:liked.last_set");
          if (img && lastSetUrl && img.src === lastSetUrl) {
            img.src = likedTargetSrc;
            if (img.srcset) {
              img.srcset = img.srcset.split(", ").map((s) => {
                const parts = s.trim().split(" ");
                return `${likedTargetSrc} ${parts[1] || ""}`.trim();
              }).join(", ");
            }
            console.log("Restored Liked Songs cover image src to default.");
          }
        }
      });
      const newLocalFilesImageUrl = Spicetify.LocalStorage.get("default-covers:local-files");
      const localFilesListItem = document.querySelector(
        '[aria-labelledby="listrow-title-spotify:collection:local-files"]'
      );
      if (localFilesListItem) {
        const iconContainerDiv = localFilesListItem.querySelector(
          ".Areas__HeaderSideArea-sc-8gfrea-1 .Areas__HeaderSideAreaFlexContainer-sc-8gfrea-2 .YsCa3XbOXEm79LH0B7do .k270skPbT7JOaSidSA2a"
        );
        if (iconContainerDiv) {
          const currentSvgIcon = iconContainerDiv.querySelector('svg[role="img"][data-encore-id="icon"]');
          const currentImgInContainer = iconContainerDiv.querySelector("img");
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
                } catch (e) {
                  console.error("Error removing existing image:", e);
                }
              }
              const newImgElement = document.createElement("img");
              newImgElement.src = newLocalFilesImageUrl;
              newImgElement.style.width = "100%";
              newImgElement.style.height = "100%";
              newImgElement.style.objectFit = "cover";
              newImgElement.style.borderRadius = "4px";
              newImgElement.style.display = "block";
              newImgElement.alt = "Local Files Custom Cover";
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
                  currentImgInContainer.srcset = currentImgInContainer.srcset.split(", ").map((s) => {
                    const parts = s.trim().split(" ");
                    return `${newLocalFilesImageUrl} ${parts[1] || ""}`.trim();
                  }).join(", ");
                }
                Spicetify.LocalStorage.set("default-covers:local-files.last_set", newLocalFilesImageUrl);
                console.log("Successfully updated src of existing image for Local Files.");
              }
            }
          } else {
            const lastSetUrl = Spicetify.LocalStorage.get("default-covers:local-files.last_set");
            if (currentImgInContainer && (!currentSvgIcon || lastSetUrl && currentImgInContainer.src === lastSetUrl)) {
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
      subtree: true
    });
    changeLibraryCovers();
  }
  var app_default = main;

  // ../../../AppData/Local/Temp/spicetify-creator/index.jsx
  (async () => {
    await app_default();
  })();
})();

      })();