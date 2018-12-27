module.exports = /******/ (function(modules) {
  // webpackBootstrap
  /******/ // The module cache
  /******/ var installedModules = {}; // The require function
  /******/
  /******/ /******/ function __webpack_require__(moduleId) {
    /******/
    /******/ // Check if module is in cache
    /******/ if (installedModules[moduleId]) {
      /******/ return installedModules[moduleId].exports;
      /******/
    } // Create a new module (and put it into the cache)
    /******/ /******/ var module = (installedModules[moduleId] = {
      /******/ i: moduleId,
      /******/ l: false,
      /******/ exports: {}
      /******/
    }); // Execute the module function
    /******/
    /******/ /******/ modules[moduleId].call(
      module.exports,
      module,
      module.exports,
      __webpack_require__
    ); // Flag the module as loaded
    /******/
    /******/ /******/ module.l = true; // Return the exports of the module
    /******/
    /******/ /******/ return module.exports;
    /******/
  } // expose the modules object (__webpack_modules__)
  /******/
  /******/
  /******/ /******/ __webpack_require__.m = modules; // expose the module cache
  /******/
  /******/ /******/ __webpack_require__.c = installedModules; // define getter function for harmony exports
  /******/
  /******/ /******/ __webpack_require__.d = function(exports, name, getter) {
    /******/ if (!__webpack_require__.o(exports, name)) {
      /******/ Object.defineProperty(exports, name, {
        enumerable: true,
        get: getter
      });
      /******/
    }
    /******/
  }; // define __esModule on exports
  /******/
  /******/ /******/ __webpack_require__.r = function(exports) {
    /******/ if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
      /******/ Object.defineProperty(exports, Symbol.toStringTag, {
        value: "Module"
      });
      /******/
    }
    /******/ Object.defineProperty(exports, "__esModule", { value: true });
    /******/
  }; // create a fake namespace object // mode & 1: value is a module id, require it // mode & 2: merge all properties of value into the ns // mode & 4: return value when already ns object // mode & 8|1: behave like require
  /******/
  /******/ /******/ /******/ /******/ /******/ /******/ __webpack_require__.t = function(
    value,
    mode
  ) {
    /******/ if (mode & 1) value = __webpack_require__(value);
    /******/ if (mode & 8) return value;
    /******/ if (
      mode & 4 &&
      typeof value === "object" &&
      value &&
      value.__esModule
    )
      return value;
    /******/ var ns = Object.create(null);
    /******/ __webpack_require__.r(ns);
    /******/ Object.defineProperty(ns, "default", {
      enumerable: true,
      value: value
    });
    /******/ if (mode & 2 && typeof value != "string")
      for (var key in value)
        __webpack_require__.d(
          ns,
          key,
          function(key) {
            return value[key];
          }.bind(null, key)
        );
    /******/ return ns;
    /******/
  }; // getDefaultExport function for compatibility with non-harmony modules
  /******/
  /******/ /******/ __webpack_require__.n = function(module) {
    /******/ var getter =
      module && module.__esModule
        ? /******/ function getDefault() {
            return module["default"];
          }
        : /******/ function getModuleExports() {
            return module;
          };
    /******/ __webpack_require__.d(getter, "a", getter);
    /******/ return getter;
    /******/
  }; // Object.prototype.hasOwnProperty.call
  /******/
  /******/ /******/ __webpack_require__.o = function(object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
  }; // __webpack_public_path__
  /******/
  /******/ /******/ __webpack_require__.p = ""; // Load entry module and return exports
  /******/
  /******/
  /******/ /******/ return __webpack_require__(
    (__webpack_require__.s = "+xUi")
  );
  /******/
})(
  /************************************************************************/
  /******/ {
    /***/ "+rLv": /***/ function(module, exports, __webpack_require__) {
      var document = __webpack_require__("dyZX").document;
      module.exports = document && document.documentElement;

      /***/
    },

    /***/ "+xUi": /***/ function(
      module,
      __webpack_exports__,
      __webpack_require__
    ) {
      "use strict";
      __webpack_require__.r(__webpack_exports__);

      // EXTERNAL MODULE: ./node_modules/@vue/cli-service/lib/commands/build/setPublicPath.js
      var setPublicPath = __webpack_require__("HrLf");

      // CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"/Users/mbj36/Desktop/Code/project/vue-social-share/node_modules/.cache/vue-loader","cacheIdentifier":"9702606c-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Facebook.vue?vue&type=template&id=1bcf245f
      var render = function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c(
          "span",
          {
            on: {
              click: function($event) {
                _vm.facebookLink(_vm.url);
              }
            }
          },
          [
            _c("icon", {
              attrs: {
                name: "brands/facebook",
                color: "#3B5998",
                scale: _vm.scale
              }
            })
          ],
          1
        );
      };
      var staticRenderFns = [];

      // CONCATENATED MODULE: ./src/components/Facebook.vue?vue&type=template&id=1bcf245f

      // EXTERNAL MODULE: ./node_modules/core-js/modules/web.dom.iterable.js
      var web_dom_iterable = __webpack_require__("rGqo");

      // EXTERNAL MODULE: ./node_modules/core-js/modules/es6.array.iterator.js
      var es6_array_iterator = __webpack_require__("yt8O");

      // EXTERNAL MODULE: ./node_modules/core-js/modules/es6.object.keys.js
      var es6_object_keys = __webpack_require__("RW0V");

      // CONCATENATED MODULE: ./src/utils/objectToGetParams.js

      /* eslint-disable prefer-template */
      function objectToGetParams(object) {
        return (
          "?" +
          Object.keys(object)
            .filter(function(key) {
              return !!object[key];
            })
            .map(function(key) {
              return ""
                .concat(key, "=")
                .concat(encodeURIComponent(object[key]));
            })
            .join("&")
        );
      }
      /* eslint-enable prefer-template */
      // CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"/Users/mbj36/Desktop/Code/project/vue-social-share/node_modules/.cache/vue-loader","cacheIdentifier":"9702606c-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./node_modules/vue-awesome/components/Icon.vue?vue&type=template&id=4061c7f6
      var Iconvue_type_template_id_4061c7f6_render = function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c(
          "svg",
          {
            class: _vm.klass,
            style: _vm.style,
            attrs: {
              version: "1.1",
              role: _vm.label ? "img" : "presentation",
              "aria-label": _vm.label,
              x: _vm.x,
              y: _vm.y,
              width: _vm.width,
              height: _vm.height,
              viewBox: _vm.box
            }
          },
          [
            _vm._t("default", [
              _vm.icon && _vm.icon.paths
                ? _vm._l(_vm.icon.paths, function(path, i) {
                    return _c(
                      "path",
                      _vm._b({ key: "path-" + i }, "path", path, false)
                    );
                  })
                : _vm._e(),
              _vm.icon && _vm.icon.polygons
                ? _vm._l(_vm.icon.polygons, function(polygon, i) {
                    return _c(
                      "polygon",
                      _vm._b({ key: "polygon-" + i }, "polygon", polygon, false)
                    );
                  })
                : _vm._e(),
              _vm.icon && _vm.icon.raw
                ? [_c("g", { domProps: { innerHTML: _vm._s(_vm.raw) } })]
                : _vm._e()
            ])
          ],
          2
        );
      };
      var Iconvue_type_template_id_4061c7f6_staticRenderFns = [];

      // CONCATENATED MODULE: ./node_modules/vue-awesome/components/Icon.vue?vue&type=template&id=4061c7f6

      // CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./node_modules/vue-awesome/components/Icon.vue?vue&type=script&lang=js
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      let icons = {};
      /* harmony default export */ var Iconvue_type_script_lang_js = {
        name: "icon",
        props: {
          name: {
            type: String,

            validator(val) {
              if (val) {
                if (!(val in icons)) {
                  console.warn(
                    `Invalid prop: prop "name" is referring to an unregistered icon "${val}".` +
                      `\nPlease make sure you have imported this icon before using it.`
                  );
                  return false;
                }

                return true;
              }

              console.warn(`Invalid prop: prop "name" is required.`);
              return false;
            }
          },
          scale: [Number, String],
          spin: Boolean,
          inverse: Boolean,
          pulse: Boolean,
          flip: {
            validator(val) {
              return val === "horizontal" || val === "vertical";
            }
          },
          label: String
        },

        data() {
          return {
            x: false,
            y: false,
            childrenWidth: 0,
            childrenHeight: 0,
            outerScale: 1
          };
        },

        computed: {
          normalizedScale() {
            let scale = this.scale;
            scale = typeof scale === "undefined" ? 1 : Number(scale);

            if (isNaN(scale) || scale <= 0) {
              console.warn(
                `Invalid prop: prop "scale" should be a number over 0.`,
                this
              );
              return this.outerScale;
            }

            return scale * this.outerScale;
          },

          klass() {
            return {
              "fa-icon": true,
              "fa-spin": this.spin,
              "fa-flip-horizontal": this.flip === "horizontal",
              "fa-flip-vertical": this.flip === "vertical",
              "fa-inverse": this.inverse,
              "fa-pulse": this.pulse
            };
          },

          icon() {
            if (this.name) {
              return icons[this.name];
            }

            return null;
          },

          box() {
            if (this.icon) {
              return `0 0 ${this.icon.width} ${this.icon.height}`;
            }

            return `0 0 ${this.width} ${this.height}`;
          },

          ratio() {
            if (!this.icon) {
              return 1;
            }

            let { width, height } = this.icon;
            return Math.max(width, height) / 16;
          },

          width() {
            return (
              this.childrenWidth ||
              (this.icon &&
                (this.icon.width / this.ratio) * this.normalizedScale) ||
              0
            );
          },

          height() {
            return (
              this.childrenHeight ||
              (this.icon &&
                (this.icon.height / this.ratio) * this.normalizedScale) ||
              0
            );
          },

          style() {
            if (this.normalizedScale === 1) {
              return false;
            }

            return {
              fontSize: this.normalizedScale + "em"
            };
          },

          raw() {
            // generate unique id for each icon's SVG element with ID
            if (!this.icon || !this.icon.raw) {
              return null;
            }

            let raw = this.icon.raw;
            let ids = {};
            raw = raw.replace(
              /\s(?:xml:)?id=(["']?)([^"')\s]+)\1/g,
              (match, quote, id) => {
                let uniqueId = getId();
                ids[id] = uniqueId;
                return ` id="${uniqueId}"`;
              }
            );
            raw = raw.replace(
              /#(?:([^'")\s]+)|xpointer\(id\((['"]?)([^')]+)\2\)\))/g,
              (match, rawId, _, pointerId) => {
                let id = rawId || pointerId;

                if (!id || !ids[id]) {
                  return match;
                }

                return `#${ids[id]}`;
              }
            );
            return raw;
          }
        },

        mounted() {
          if (this.icon) {
            return;
          }

          this.$children.forEach(child => {
            child.outerScale = this.normalizedScale;
          });
          let width = 0;
          let height = 0;
          this.$children.forEach(child => {
            width = Math.max(width, child.width);
            height = Math.max(height, child.height);
          });
          this.childrenWidth = width;
          this.childrenHeight = height;
          this.$children.forEach(child => {
            child.x = (width - child.width) / 2;
            child.y = (height - child.height) / 2;
          });
        },

        register(data) {
          for (let name in data) {
            let icon = data[name];

            if (!icon.paths) {
              icon.paths = [];
            }

            if (icon.d) {
              icon.paths.push({
                d: icon.d
              });
            }

            if (!icon.polygons) {
              icon.polygons = [];
            }

            if (icon.points) {
              icon.polygons.push({
                points: icon.points
              });
            }

            icons[name] = icon;
          }
        },

        icons
      };
      let cursor = 0xd4937;

      function getId() {
        return `fa-${(cursor++).toString(16)}`;
      }
      // CONCATENATED MODULE: ./node_modules/vue-awesome/components/Icon.vue?vue&type=script&lang=js
      /* harmony default export */ var components_Iconvue_type_script_lang_js = Iconvue_type_script_lang_js;
      // EXTERNAL MODULE: ./node_modules/vue-awesome/components/Icon.vue?vue&type=style&index=0&lang=css
      var Iconvue_type_style_index_0_lang_css = __webpack_require__("SPf7");

      // CONCATENATED MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
      /* globals __VUE_SSR_CONTEXT__ */

      // IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
      // This module is a runtime utility for cleaner component module output and will
      // be included in the final webpack user bundle.

      function normalizeComponent(
        scriptExports,
        render,
        staticRenderFns,
        functionalTemplate,
        injectStyles,
        scopeId,
        moduleIdentifier /* server only */,
        shadowMode /* vue-cli only */
      ) {
        // Vue.extend constructor export interop
        var options =
          typeof scriptExports === "function"
            ? scriptExports.options
            : scriptExports;

        // render functions
        if (render) {
          options.render = render;
          options.staticRenderFns = staticRenderFns;
          options._compiled = true;
        }

        // functional template
        if (functionalTemplate) {
          options.functional = true;
        }

        // scopedId
        if (scopeId) {
          options._scopeId = "data-v-" + scopeId;
        }

        var hook;
        if (moduleIdentifier) {
          // server build
          hook = function(context) {
            // 2.3 injection
            context =
              context || // cached call
              (this.$vnode && this.$vnode.ssrContext) || // stateful
              (this.parent &&
                this.parent.$vnode &&
                this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== "undefined") {
              context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (injectStyles) {
              injectStyles.call(this, context);
            }
            // register component module identifier for async chunk inferrence
            if (context && context._registeredComponents) {
              context._registeredComponents.add(moduleIdentifier);
            }
          };
          // used by ssr in case component is cached and beforeCreate
          // never gets called
          options._ssrRegister = hook;
        } else if (injectStyles) {
          hook = shadowMode
            ? function() {
                injectStyles.call(this, this.$root.$options.shadowRoot);
              }
            : injectStyles;
        }

        if (hook) {
          if (options.functional) {
            // for template-only hot-reload because in that case the render fn doesn't
            // go through the normalizer
            options._injectStyles = hook;
            // register for functioal component in vue file
            var originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
              hook.call(context);
              return originalRender(h, context);
            };
          } else {
            // inject component registration as beforeCreate hook
            var existing = options.beforeCreate;
            options.beforeCreate = existing
              ? [].concat(existing, hook)
              : [hook];
          }
        }

        return {
          exports: scriptExports,
          options: options
        };
      }

      // CONCATENATED MODULE: ./node_modules/vue-awesome/components/Icon.vue

      /* normalize component */

      var component = normalizeComponent(
        components_Iconvue_type_script_lang_js,
        Iconvue_type_template_id_4061c7f6_render,
        Iconvue_type_template_id_4061c7f6_staticRenderFns,
        false,
        null,
        null,
        null
      );

      /* harmony default export */ var Icon = component.exports;
      // CONCATENATED MODULE: ./node_modules/vue-awesome/icons/brands/facebook.js

      Icon.register({
        "brands/facebook": {
          width: 448,
          height: 512,
          paths: [
            {
              d:
                "M448 56.7V455.2C448 468.9 436.9 479.9 423.3 479.9H309.1V306.5H367.3L376 238.9H309V195.7C309 176.1 314.4 162.8 342.5 162.8H378.3V102.3C372.1 101.5 350.9 99.6 326.1 99.6 274.5 99.6 239.1 131.1 239.1 189V238.9H180.7V306.5H239.1V480H24.7C11.1 480 0 468.9 0 455.3V56.7C0 43.1 11.1 32 24.7 32H423.2C436.9 32 448 43.1 448 56.7z"
            }
          ]
        }
      });

      // CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Facebook.vue?vue&type=script&lang=js
      //
      //
      //
      //
      //
      //

      var electron = require("electron");

      /* harmony default export */ var Facebookvue_type_script_lang_js = {
        name: "facebook",
        components: {
          Icon: Icon
        },
        methods: {
          facebookLink: function facebookLink(url) {
            electron.ipcRenderer.send("event:social", {
              socialUrl:
                "https://www.facebook.com/sharer/sharer.php" +
                objectToGetParams({
                  u: url
                })
            });

            // window.open(
            //   "https://www.facebook.com/sharer/sharer.php" +
            //     objectToGetParams({
            //       u: url
            //     }),
            //   "__blank"
            // );
          }
        },
        props: {
          url: {
            required: true,
            type: String
          },
          scale: {
            required: false,
            type: String
          }
        }
      };
      // CONCATENATED MODULE: ./src/components/Facebook.vue?vue&type=script&lang=js
      /* harmony default export */ var components_Facebookvue_type_script_lang_js = Facebookvue_type_script_lang_js;
      // CONCATENATED MODULE: ./src/components/Facebook.vue

      /* normalize component */

      var Facebook_component = normalizeComponent(
        components_Facebookvue_type_script_lang_js,
        render,
        staticRenderFns,
        false,
        null,
        null,
        null
      );

      /* harmony default export */ var Facebook = Facebook_component.exports;
      // CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"/Users/mbj36/Desktop/Code/project/vue-social-share/node_modules/.cache/vue-loader","cacheIdentifier":"9702606c-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Twitter.vue?vue&type=template&id=03e18f12
      var Twittervue_type_template_id_03e18f12_render = function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c(
          "span",
          {
            on: {
              click: function($event) {
                _vm.twitterLink(_vm.url, { title: _vm.title });
              }
            }
          },
          [
            _c("icon", {
              attrs: {
                name: "brands/twitter-square",
                color: "#1DA1F2",
                scale: _vm.scale
              }
            })
          ],
          1
        );
      };
      var Twittervue_type_template_id_03e18f12_staticRenderFns = [];

      // CONCATENATED MODULE: ./src/components/Twitter.vue?vue&type=template&id=03e18f12

      // CONCATENATED MODULE: ./node_modules/vue-awesome/icons/brands/twitter-square.js

      Icon.register({
        "brands/twitter-square": {
          width: 448,
          height: 512,
          paths: [
            {
              d:
                "M400 32H48C21.5 32 0 53.5 0 80V432C0 458.5 21.5 480 48 480H400C426.5 480 448 458.5 448 432V80C448 53.5 426.5 32 400 32zM351.1 190.8C351.3 193.6 351.3 196.5 351.3 199.3 351.3 286 285.3 385.9 164.7 385.9 127.5 385.9 93 375.1 64 356.5 69.3 357.1 74.4 357.3 79.8 357.3 110.5 357.3 138.7 346.9 161.2 329.3 132.4 328.7 108.2 309.8 99.9 283.8 110 285.3 119.1 285.3 129.5 282.6 99.5 276.5 77 250.1 77 218.2V217.4C85.7 222.3 95.9 225.3 106.6 225.7A65.4-65.4 0 0 0 77.4 171.1C77.4 158.9 80.6 147.7 86.3 138 118.6 177.8 167.1 203.8 221.5 206.6 212.2 162.1 245.5 126 285.5 126 304.4 126 321.4 133.9 333.4 146.7 348.2 143.9 362.4 138.4 375 130.9 370.1 146.1 359.8 158.9 346.2 167 359.4 165.6 372.2 161.9 384 156.8 375.1 169.9 363.9 181.5 351.1 190.8z"
            }
          ]
        }
      });

      // CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Twitter.vue?vue&type=script&lang=js
      //
      //
      //
      //
      //
      //

      /* harmony default export */ var Twittervue_type_script_lang_js = {
        name: "twitter",
        methods: {
          twitterLink: function twitterLink(url, _ref) {
            var title = _ref.title;

            electron.ipcRenderer.send("event:social", {
              socialUrl:
                "https://www.twitter.com/share" +
                objectToGetParams({
                  url: url,
                  text: title
                })
            });

            // window.open(
            //   "https://www.twitter.com/share" +
            //     objectToGetParams({
            //       url: url,
            //       text: title
            //     }),
            //   "__blank"
            // );
          }
        },
        components: {
          Icon: Icon
        },
        props: {
          url: {
            required: true,
            type: String
          },
          title: {
            required: false,
            type: String
          },
          scale: {
            required: false,
            type: String
          }
        }
      };
      // CONCATENATED MODULE: ./src/components/Twitter.vue?vue&type=script&lang=js
      /* harmony default export */ var components_Twittervue_type_script_lang_js = Twittervue_type_script_lang_js;
      // CONCATENATED MODULE: ./src/components/Twitter.vue

      /* normalize component */

      var Twitter_component = normalizeComponent(
        components_Twittervue_type_script_lang_js,
        Twittervue_type_template_id_03e18f12_render,
        Twittervue_type_template_id_03e18f12_staticRenderFns,
        false,
        null,
        null,
        null
      );

      /* harmony default export */ var Twitter = Twitter_component.exports;
      // CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"/Users/mbj36/Desktop/Code/project/vue-social-share/node_modules/.cache/vue-loader","cacheIdentifier":"9702606c-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Telegram.vue?vue&type=template&id=3e7b6073
      var Telegramvue_type_template_id_3e7b6073_render = function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c(
          "span",
          {
            on: {
              click: function($event) {
                _vm.telegramLink(_vm.url, { title: _vm.title });
              }
            }
          },
          [
            _c("icon", {
              attrs: {
                name: "brands/telegram-plane",
                color: "#0088cc",
                scale: _vm.scale
              }
            })
          ],
          1
        );
      };
      var Telegramvue_type_template_id_3e7b6073_staticRenderFns = [];

      // CONCATENATED MODULE: ./src/components/Telegram.vue?vue&type=template&id=3e7b6073

      // CONCATENATED MODULE: ./node_modules/vue-awesome/icons/brands/telegram-plane.js

      Icon.register({
        "brands/telegram-plane": {
          width: 448,
          height: 512,
          paths: [
            {
              d:
                "M446.7 98.6L379.1 417.4C374 439.9 360.7 445.5 341.8 434.9L238.8 359 189.1 406.8C183.6 412.3 179 416.9 168.4 416.9L175.8 312 366.7 139.5C375 132.1 364.9 128 353.8 135.4L117.8 284 16.2 252.2C-5.9 245.3-6.3 230.1 20.8 219.5L418.2 66.4C436.6 59.5 452.7 70.5 446.7 98.6z"
            }
          ]
        }
      });

      // CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Telegram.vue?vue&type=script&lang=js
      //
      //
      //
      //
      //
      //

      /* harmony default export */ var Telegramvue_type_script_lang_js = {
        name: "telegram",
        methods: {
          telegramLink: function telegramLink(url, _ref) {
            var title = _ref.title;

            electron.ipcRenderer.send("event:social", {
              socialUrl:
                "https://telegram.me/share/" +
                objectToGetParams({
                  url: url,
                  text: title
                })
            });

            // window.open(
            //   "https://telegram.me/share/" +
            //     objectToGetParams({
            //       url: url,
            //       text: title
            //     }),
            //   "__blank"
            // );
          }
        },
        props: {
          url: {
            required: true,
            type: String
          },
          title: {
            required: false,
            type: String
          },
          scale: {
            required: false,
            type: String
          }
        },
        components: {
          Icon: Icon
        }
      };
      // CONCATENATED MODULE: ./src/components/Telegram.vue?vue&type=script&lang=js
      /* harmony default export */ var components_Telegramvue_type_script_lang_js = Telegramvue_type_script_lang_js;
      // CONCATENATED MODULE: ./src/components/Telegram.vue

      /* normalize component */

      var Telegram_component = normalizeComponent(
        components_Telegramvue_type_script_lang_js,
        Telegramvue_type_template_id_3e7b6073_render,
        Telegramvue_type_template_id_3e7b6073_staticRenderFns,
        false,
        null,
        null,
        null
      );

      /* harmony default export */ var Telegram = Telegram_component.exports;
      // CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"/Users/mbj36/Desktop/Code/project/vue-social-share/node_modules/.cache/vue-loader","cacheIdentifier":"9702606c-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Whatsapp.vue?vue&type=template&id=6eefd356
      var Whatsappvue_type_template_id_6eefd356_render = function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c(
          "span",
          {
            on: {
              click: function($event) {
                _vm.whatsappLink(_vm.url, _vm.title);
              }
            }
          },
          [
            _c("icon", {
              attrs: {
                name: "brands/whatsapp-square",
                color: "#34af23",
                scale: _vm.scale
              }
            })
          ],
          1
        );
      };
      var Whatsappvue_type_template_id_6eefd356_staticRenderFns = [];

      // CONCATENATED MODULE: ./src/components/Whatsapp.vue?vue&type=template&id=6eefd356

      // CONCATENATED MODULE: ./node_modules/vue-awesome/icons/brands/whatsapp-square.js

      Icon.register({
        "brands/whatsapp-square": {
          width: 448,
          height: 512,
          paths: [
            {
              d:
                "M224 122.8C151.3 122.8 92.2 181.9 92.1 254.6 92.1 279.5 99.1 303.8 112.3 324.7L115.4 329.7 102.1 378.3 152 365.2 156.8 368.1C177 380.1 200.2 386.5 223.9 386.5H224C296.6 386.5 357.3 327.4 357.3 254.7 357.3 219.5 342.1 186.4 317.2 161.5 292.2 136.5 259.2 122.8 224 122.8zM301.5 311.2C298.2 320.5 282.4 328.9 274.8 330 262.2 331.9 252.4 330.9 227.3 320.1 187.6 302.9 161.6 262.9 159.6 260.3 157.6 257.7 143.4 238.8 143.4 219.3S153.6 190.2 157.3 186.2C160.9 182.2 165.2 181.2 167.9 181.2 170.5 181.2 173.2 181.2 175.5 181.3 177.9 181.4 181.2 180.4 184.4 188.1 187.7 196 195.6 215.5 196.6 217.5S198.3 221.8 196.9 224.4C189.3 239.6 181.2 239 185.3 246 200.6 272.3 215.9 281.4 239.2 293.1 243.2 295.1 245.5 294.8 247.8 292.1 250.1 289.5 257.7 280.5 260.3 276.6 262.9 272.6 265.6 273.3 269.2 274.6 272.8 275.9 292.3 285.5 296.3 287.5S302.9 290.5 303.9 292.1C304.8 294 304.8 302 301.5 311.2zM400 32H48C21.5 32 0 53.5 0 80V432C0 458.5 21.5 480 48 480H400C426.5 480 448 458.5 448 432V80C448 53.5 426.5 32 400 32zM223.9 413.2C197.3 413.2 171.2 406.5 148.1 393.9L64 416 86.5 333.8C72.6 309.8 65.3 282.5 65.3 254.5 65.4 167.1 136.5 96 223.9 96 266.3 96 306.1 112.5 336.1 142.5 366 172.5 384 212.3 384 254.7 384 342.1 311.3 413.2 223.9 413.2z"
            }
          ]
        }
      });

      // CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Whatsapp.vue?vue&type=script&lang=js
      //
      //
      //
      //
      //
      //

      /* harmony default export */ var Whatsappvue_type_script_lang_js = {
        name: "whatsapp",
        methods: {
          whatsappLink: function whatsappLink(url, separator, title) {
            window.open(
              "https://api.whatsapp.com/send" +
                objectToGetParams({
                  text: title ? title + separator + url : url
                }),
              "__blank"
            );
          }
        },
        components: {
          Icon: Icon
        },
        props: {
          url: {
            required: true,
            type: String
          },
          title: {
            required: false,
            type: String
          },
          scale: {
            required: false,
            type: String
          }
        },
        data: function data() {
          return {
            separator: ""
          };
        }
      };
      // CONCATENATED MODULE: ./src/components/Whatsapp.vue?vue&type=script&lang=js
      /* harmony default export */ var components_Whatsappvue_type_script_lang_js = Whatsappvue_type_script_lang_js;
      // CONCATENATED MODULE: ./src/components/Whatsapp.vue

      /* normalize component */

      var Whatsapp_component = normalizeComponent(
        components_Whatsappvue_type_script_lang_js,
        Whatsappvue_type_template_id_6eefd356_render,
        Whatsappvue_type_template_id_6eefd356_staticRenderFns,
        false,
        null,
        null,
        null
      );

      /* harmony default export */ var Whatsapp = Whatsapp_component.exports;
      // CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"/Users/mbj36/Desktop/Code/project/vue-social-share/node_modules/.cache/vue-loader","cacheIdentifier":"9702606c-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Pinterest.vue?vue&type=template&id=ed152fa8
      var Pinterestvue_type_template_id_ed152fa8_render = function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c(
          "span",
          {
            on: {
              click: function($event) {
                _vm.pinterestLink(_vm.url);
              }
            }
          },
          [
            _c("icon", {
              attrs: {
                name: "brands/pinterest-square",
                color: "#BD081C",
                scale: _vm.scale
              }
            })
          ],
          1
        );
      };
      var Pinterestvue_type_template_id_ed152fa8_staticRenderFns = [];

      // CONCATENATED MODULE: ./src/components/Pinterest.vue?vue&type=template&id=ed152fa8

      // CONCATENATED MODULE: ./node_modules/vue-awesome/icons/brands/pinterest-square.js

      Icon.register({
        "brands/pinterest-square": {
          width: 448,
          height: 512,
          paths: [
            {
              d:
                "M448 80V432C448 458.5 426.5 480 400 480H154.4C164.2 463.6 176.8 440 181.8 420.7 184.8 409.2 197.1 362.3 197.1 362.3 205.1 377.6 228.5 390.5 253.4 390.5 327.5 390.5 380.8 322.4 380.8 237.8 380.8 156.7 314.6 96 229.4 96 123.4 96 67.2 167.1 67.2 244.6 67.2 280.6 86.4 325.4 117 339.7 121.7 341.9 124.1 340.9 125.2 336.4 126 333 130.2 316.3 132 308.6 132.6 306.1 132.3 304 130.3 301.6 120.2 289.3 112 266.7 112 245.6 112 191.4 153 139 222.9 139 283.2 139 325.5 180.1 325.5 238.9 325.5 305.3 292 351.3 248.3 351.3 224.2 351.3 206.2 331.4 211.9 306.9 218.8 277.7 232.2 246.2 232.2 225.1 232.2 172.1 156.7 179.4 156.7 250.1 156.7 271.8 164 286.6 164 286.6 132.6 419.4 127.9 421.1 134.4 479.2L136.6 480H48C21.5 480 0 458.5 0 432V80C0 53.5 21.5 32 48 32H400C426.5 32 448 53.5 448 80z"
            }
          ]
        }
      });

      // CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Pinterest.vue?vue&type=script&lang=js
      //
      //
      //
      //
      //
      //
      //

      /* harmony default export */ var Pinterestvue_type_script_lang_js = {
        name: "pinterest",
        methods: {
          pinterestLink: function pinterestLink(url) {
            window.open(
              "https://pinterest.com/pin/create/button" +
                objectToGetParams({
                  url: url
                }),
              "__blank"
            );
          }
        },
        props: {
          url: {
            required: true,
            type: String
          },
          scale: {
            required: false,
            type: String
          }
        },
        components: {
          Icon: Icon
        }
      };
      // CONCATENATED MODULE: ./src/components/Pinterest.vue?vue&type=script&lang=js
      /* harmony default export */ var components_Pinterestvue_type_script_lang_js = Pinterestvue_type_script_lang_js;
      // CONCATENATED MODULE: ./src/components/Pinterest.vue

      /* normalize component */

      var Pinterest_component = normalizeComponent(
        components_Pinterestvue_type_script_lang_js,
        Pinterestvue_type_template_id_ed152fa8_render,
        Pinterestvue_type_template_id_ed152fa8_staticRenderFns,
        false,
        null,
        null,
        null
      );

      /* harmony default export */ var Pinterest = Pinterest_component.exports;
      // CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"/Users/mbj36/Desktop/Code/project/vue-social-share/node_modules/.cache/vue-loader","cacheIdentifier":"9702606c-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Google.vue?vue&type=template&id=39e2436e
      var Googlevue_type_template_id_39e2436e_render = function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c(
          "span",
          {
            on: {
              click: function($event) {
                _vm.googleLink(_vm.url);
              }
            }
          },
          [
            _c("icon", {
              attrs: {
                name: "brands/google-plus-square",
                scale: _vm.scale,
                color: "#dd4b39"
              }
            })
          ],
          1
        );
      };
      var Googlevue_type_template_id_39e2436e_staticRenderFns = [];

      // CONCATENATED MODULE: ./src/components/Google.vue?vue&type=template&id=39e2436e

      // CONCATENATED MODULE: ./node_modules/vue-awesome/icons/brands/google-plus-square.js

      Icon.register({
        "brands/google-plus-square": {
          width: 448,
          height: 512,
          paths: [
            {
              d:
                "M400 32H48C21.5 32 0 53.5 0 80V432C0 458.5 21.5 480 48 480H400C426.5 480 448 458.5 448 432V80C448 53.5 426.5 32 400 32zM164 356C108.7 356 64 311.3 64 256S108.7 156 164 156C191 156 213.5 165.8 231 182.2L203.9 208.3C196.5 201.2 183.6 192.9 164.1 192.9 130 192.9 102.2 221.1 102.2 256.1 102.2 291 130 319.3 164.1 319.3 203.7 319.3 218.5 290.8 220.9 276.2H164V241.8H258.4C259.4 246.8 260 251.9 260 258.4 260 315.5 221.7 356 164 356zM384 274.2H355V303.2H325.8V274.2H296.8V245H325.8V216H355V245H384V274.2z"
            }
          ]
        }
      });

      // CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Google.vue?vue&type=script&lang=js
      //
      //
      //
      //
      //
      //

      /* harmony default export */ var Googlevue_type_script_lang_js = {
        name: "google",
        methods: {
          googleLink: function googleLink(url) {
            window.open(
              "https://plus.google.com/share" +
                objectToGetParams({
                  url: url
                }),
              "__blank"
            );
          }
        },
        props: {
          url: {
            type: String,
            required: true
          },
          scale: {
            required: false,
            type: String
          }
        },
        components: {
          Icon: Icon
        }
      };
      // CONCATENATED MODULE: ./src/components/Google.vue?vue&type=script&lang=js
      /* harmony default export */ var components_Googlevue_type_script_lang_js = Googlevue_type_script_lang_js;
      // CONCATENATED MODULE: ./src/components/Google.vue

      /* normalize component */

      var Google_component = normalizeComponent(
        components_Googlevue_type_script_lang_js,
        Googlevue_type_template_id_39e2436e_render,
        Googlevue_type_template_id_39e2436e_staticRenderFns,
        false,
        null,
        null,
        null
      );

      /* harmony default export */ var Google = Google_component.exports;
      // CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"/Users/mbj36/Desktop/Code/project/vue-social-share/node_modules/.cache/vue-loader","cacheIdentifier":"9702606c-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Email.vue?vue&type=template&id=40f439a5
      var Emailvue_type_template_id_40f439a5_render = function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c(
          "span",
          {
            on: {
              click: function($event) {
                _vm.emailLink(_vm.url, {
                  subject: _vm.subject,
                  body: _vm.body
                });
              }
            }
          },
          [
            _c("icon", {
              attrs: {
                name: "envelope-square",
                scale: _vm.scale,
                color: "#ff4343"
              }
            })
          ],
          1
        );
      };
      var Emailvue_type_template_id_40f439a5_staticRenderFns = [];

      // CONCATENATED MODULE: ./src/components/Email.vue?vue&type=template&id=40f439a5

      // CONCATENATED MODULE: ./node_modules/vue-awesome/icons/envelope-square.js

      Icon.register({
        "envelope-square": {
          width: 448,
          height: 512,
          paths: [
            {
              d:
                "M400 32H48C21.5 32 0 53.5 0 80V432C0 458.5 21.5 480 48 480H400C426.5 480 448 458.5 448 432V80C448 53.5 426.5 32 400 32zM178.1 262.1C87.4 196.3 88.4 196.1 64 177.2V152C64 138.7 74.7 128 88 128H360C373.3 128 384 138.7 384 152V177.2C359.6 196.1 360.6 196.3 269.9 262.1 259.4 269.8 238.5 288.2 224 288 209.5 288.2 188.6 269.8 178.1 262.1zM384 217.8V360C384 373.3 373.3 384 360 384H88C74.7 384 64 373.3 64 360V217.8C78 228.6 97.3 243 159.3 288 173.5 298.3 197.3 320.1 224 320 250.9 320.1 275 298 288.7 288 350.7 243 370 228.6 384 217.8z"
            }
          ]
        }
      });

      // CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Email.vue?vue&type=script&lang=js
      //
      //
      //
      //
      //
      //

      /* harmony default export */ var Emailvue_type_script_lang_js = {
        name: "email",
        methods: {
          emailLink: function emailLink(url, _ref) {
            var subject = _ref.subject,
              body = _ref.body;
            window.open(
              "mailto:" +
                objectToGetParams({
                  subject: subject,
                  body: body || url
                }),
              "__blank"
            );
          }
        },
        props: {
          url: {
            type: String,
            required: true
          },
          scale: {
            required: false,
            type: String
          },
          subject: {
            required: false,
            type: String
          },
          body: {
            required: false,
            type: String
          }
        },
        components: {
          Icon: Icon
        }
      };
      // CONCATENATED MODULE: ./src/components/Email.vue?vue&type=script&lang=js
      /* harmony default export */ var components_Emailvue_type_script_lang_js = Emailvue_type_script_lang_js;
      // CONCATENATED MODULE: ./src/components/Email.vue

      /* normalize component */

      var Email_component = normalizeComponent(
        components_Emailvue_type_script_lang_js,
        Emailvue_type_template_id_40f439a5_render,
        Emailvue_type_template_id_40f439a5_staticRenderFns,
        false,
        null,
        null,
        null
      );

      /* harmony default export */ var Email = Email_component.exports;
      // CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"/Users/mbj36/Desktop/Code/project/vue-social-share/node_modules/.cache/vue-loader","cacheIdentifier":"9702606c-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/LinkedIn.vue?vue&type=template&id=cf76d900
      var LinkedInvue_type_template_id_cf76d900_render = function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c(
          "span",
          {
            on: {
              click: function($event) {
                _vm.linkedinLink(_vm.url);
              }
            }
          },
          [
            _c("icon", {
              attrs: {
                name: "brands/linkedin-in",
                color: "#0077B5",
                scale: _vm.scale
              }
            })
          ],
          1
        );
      };
      var LinkedInvue_type_template_id_cf76d900_staticRenderFns = [];

      // CONCATENATED MODULE: ./src/components/LinkedIn.vue?vue&type=template&id=cf76d900

      // CONCATENATED MODULE: ./node_modules/vue-awesome/icons/brands/linkedin-in.js

      Icon.register({
        "brands/linkedin-in": {
          width: 448,
          height: 512,
          paths: [
            {
              d:
                "M100.3 480H7.4V180.9H100.3V480zM53.8 140.1C24.1 140.1 0 115.5 0 85.8 0 56.1 24.1 32 53.8 32 83.5 32 107.6 56.1 107.6 85.8 107.6 115.5 83.5 140.1 53.8 140.1zM448 480H355.3V334.4C355.3 299.7 354.6 255.2 307 255.2 258.7 255.2 251.3 292.9 251.3 331.9V480H158.5V180.9H247.6V221.7H248.9C261.3 198.2 291.6 173.4 336.8 173.4 430.8 173.4 448.1 235.3 448.1 315.7V480z"
            }
          ]
        }
      });

      // CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/components/LinkedIn.vue?vue&type=script&lang=js
      //
      //
      //
      //
      //
      //

      /* harmony default export */ var LinkedInvue_type_script_lang_js = {
        name: "Linkedin",
        components: {
          Icon: Icon
        },
        methods: {
          linkedinLink: function linkedinLink(url) {
            window.open(
              "https://linkedin.com/shareArticle" +
                objectToGetParams({
                  mini: true,
                  url: url
                }),
              "__blank"
            );
          }
        },
        props: {
          url: {
            required: true,
            type: String
          },
          scale: {
            required: false,
            type: String
          }
        }
      };
      // CONCATENATED MODULE: ./src/components/LinkedIn.vue?vue&type=script&lang=js
      /* harmony default export */ var components_LinkedInvue_type_script_lang_js = LinkedInvue_type_script_lang_js;
      // CONCATENATED MODULE: ./src/components/LinkedIn.vue

      /* normalize component */

      var LinkedIn_component = normalizeComponent(
        components_LinkedInvue_type_script_lang_js,
        LinkedInvue_type_template_id_cf76d900_render,
        LinkedInvue_type_template_id_cf76d900_staticRenderFns,
        false,
        null,
        null,
        null
      );

      /* harmony default export */ var LinkedIn = LinkedIn_component.exports;
      // CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"/Users/mbj36/Desktop/Code/project/vue-social-share/node_modules/.cache/vue-loader","cacheIdentifier":"9702606c-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Reddit.vue?vue&type=template&id=5b51e6c1
      var Redditvue_type_template_id_5b51e6c1_render = function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c(
          "span",
          {
            on: {
              click: function($event) {
                _vm.redditLink(_vm.url, { title: _vm.title });
              }
            }
          },
          [
            _c("icon", {
              attrs: {
                name: "brands/reddit-square",
                color: "#ff4500",
                scale: _vm.scale
              }
            })
          ],
          1
        );
      };
      var Redditvue_type_template_id_5b51e6c1_staticRenderFns = [];

      // CONCATENATED MODULE: ./src/components/Reddit.vue?vue&type=template&id=5b51e6c1

      // CONCATENATED MODULE: ./node_modules/vue-awesome/icons/brands/reddit-square.js

      Icon.register({
        "brands/reddit-square": {
          width: 448,
          height: 512,
          paths: [
            {
              d:
                "M283.2 345.5C285.9 348.2 285.9 352.3 283.2 354.7 258.7 379.2 189.4 379.3 164.8 354.7 162.1 352.3 162.1 348.2 164.8 345.5 167.2 343.1 171.3 343.1 173.7 345.5 192.4 364.7 254.7 365.1 274.2 345.5 276.6 343.2 280.8 343.2 283.2 345.5zM191.9 291.7C191.9 276.8 180 264.9 165.4 264.9 150.5 264.9 138.6 276.8 138.6 291.7 138.6 306.3 150.5 318.2 165.4 318.2 180 318.2 191.9 306.3 191.9 291.7zM282.6 264.9C268 264.9 256.1 276.8 256.1 291.7 256.1 306.3 268 318.2 282.6 318.2 297.5 318.2 309.4 306.3 309.4 291.7 309.4 276.8 297.5 264.9 282.6 264.9zM448 80V432C448 458.5 426.5 480 400 480H48C21.5 480 0 458.5 0 432V80C0 53.5 21.5 32 48 32H400C426.5 32 448 53.5 448 80zM348.3 220.6C338.2 220.6 329.3 224.8 322.7 231.3 298.6 214.6 266.2 203.9 230.2 202.7L248.9 118.5 308.4 131.9C308.4 146.5 320.3 158.4 334.9 158.4 349.8 158.4 361.7 146.2 361.7 131.6 361.7 117 349.8 104.8 334.9 104.8 324.5 104.8 315.6 111 311.1 119.7L245.4 105.1C242.1 104.2 238.9 106.6 238 109.9L217.5 202.7C181.8 204.2 149.7 214.9 125.6 231.6 119.1 224.8 109.8 220.6 99.7 220.6 62.2 220.6 49.9 271 84.2 288.1 83 293.5 82.4 299.1 82.4 304.8 82.4 361.3 146.1 407.1 224.3 407.1 302.8 407.1 366.5 361.3 366.5 304.8 366.5 299.1 365.9 293.2 364.4 287.8 398 270.6 385.6 220.6 348.3 220.6z"
            }
          ]
        }
      });

      // CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Reddit.vue?vue&type=script&lang=js
      //
      //
      //
      //
      //
      //

      /* harmony default export */ var Redditvue_type_script_lang_js = {
        name: "reddit",
        methods: {
          redditLink: function redditLink(url, _ref) {
            var title = _ref.title;

            electron.ipcRenderer.send("event:social", {
              socialUrl:
                "https://reddit.com/submit" +
                objectToGetParams({
                  url: url,
                  title: title
                })
            });

            // window.open(
            //   "https://reddit.com/submit" +
            //     objectToGetParams({
            //       url: url,
            //       title: title
            //     }),
            //   "__blank"
            // );
          }
        },
        props: {
          url: {
            type: String,
            required: true
          },
          scale: {
            type: String,
            required: false
          },
          title: {
            type: String,
            required: false
          }
        },
        components: {
          Icon: Icon
        }
      };
      // CONCATENATED MODULE: ./src/components/Reddit.vue?vue&type=script&lang=js
      /* harmony default export */ var components_Redditvue_type_script_lang_js = Redditvue_type_script_lang_js;
      // CONCATENATED MODULE: ./src/components/Reddit.vue

      /* normalize component */

      var Reddit_component = normalizeComponent(
        components_Redditvue_type_script_lang_js,
        Redditvue_type_template_id_5b51e6c1_render,
        Redditvue_type_template_id_5b51e6c1_staticRenderFns,
        false,
        null,
        null,
        null
      );

      /* harmony default export */ var Reddit = Reddit_component.exports;
      // CONCATENATED MODULE: ./src/components/index.js

      /* harmony default export */ var components = {
        Facebook: Facebook,
        Twitter: Twitter,
        Reddit: Reddit,
        Pinterest: Pinterest,
        Linkedin: LinkedIn,
        Email: Email,
        Google: Google,
        Telegram: Telegram,
        WhatsApp: Whatsapp
      };
      // CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/entry-lib.js

      /* harmony default export */ var entry_lib = (__webpack_exports__[
        "default"
      ] = components);

      /***/
    },

    /***/ "0/R4": /***/ function(module, exports) {
      module.exports = function(it) {
        return typeof it === "object" ? it !== null : typeof it === "function";
      };

      /***/
    },

    /***/ "1TsA": /***/ function(module, exports) {
      module.exports = function(done, value) {
        return { value: value, done: !!done };
      };

      /***/
    },

    /***/ "2OiF": /***/ function(module, exports) {
      module.exports = function(it) {
        if (typeof it != "function")
          throw TypeError(it + " is not a function!");
        return it;
      };

      /***/
    },

    /***/ "4R4u": /***/ function(module, exports) {
      // IE 8- don't enum bug keys
      module.exports = "constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(
        ","
      );

      /***/
    },

    /***/ Afnz: /***/ function(module, exports, __webpack_require__) {
      "use strict";

      var LIBRARY = __webpack_require__("LQAc");
      var $export = __webpack_require__("XKFU");
      var redefine = __webpack_require__("KroJ");
      var hide = __webpack_require__("Mukb");
      var Iterators = __webpack_require__("hPIQ");
      var $iterCreate = __webpack_require__("QaDb");
      var setToStringTag = __webpack_require__("fyDq");
      var getPrototypeOf = __webpack_require__("OP3Y");
      var ITERATOR = __webpack_require__("K0xU")("iterator");
      var BUGGY = !([].keys && "next" in [].keys()); // Safari has buggy iterators w/o `next`
      var FF_ITERATOR = "@@iterator";
      var KEYS = "keys";
      var VALUES = "values";

      var returnThis = function() {
        return this;
      };

      module.exports = function(
        Base,
        NAME,
        Constructor,
        next,
        DEFAULT,
        IS_SET,
        FORCED
      ) {
        $iterCreate(Constructor, NAME, next);
        var getMethod = function(kind) {
          if (!BUGGY && kind in proto) return proto[kind];
          switch (kind) {
            case KEYS:
              return function keys() {
                return new Constructor(this, kind);
              };
            case VALUES:
              return function values() {
                return new Constructor(this, kind);
              };
          }
          return function entries() {
            return new Constructor(this, kind);
          };
        };
        var TAG = NAME + " Iterator";
        var DEF_VALUES = DEFAULT == VALUES;
        var VALUES_BUG = false;
        var proto = Base.prototype;
        var $native =
          proto[ITERATOR] || proto[FF_ITERATOR] || (DEFAULT && proto[DEFAULT]);
        var $default = $native || getMethod(DEFAULT);
        var $entries = DEFAULT
          ? !DEF_VALUES
            ? $default
            : getMethod("entries")
          : undefined;
        var $anyNative = NAME == "Array" ? proto.entries || $native : $native;
        var methods, key, IteratorPrototype;
        // Fix native
        if ($anyNative) {
          IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
          if (
            IteratorPrototype !== Object.prototype &&
            IteratorPrototype.next
          ) {
            // Set @@toStringTag to native iterators
            setToStringTag(IteratorPrototype, TAG, true);
            // fix for some old engines
            if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != "function")
              hide(IteratorPrototype, ITERATOR, returnThis);
          }
        }
        // fix Array#{values, @@iterator}.name in V8 / FF
        if (DEF_VALUES && $native && $native.name !== VALUES) {
          VALUES_BUG = true;
          $default = function values() {
            return $native.call(this);
          };
        }
        // Define iterator
        if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
          hide(proto, ITERATOR, $default);
        }
        // Plug for library
        Iterators[NAME] = $default;
        Iterators[TAG] = returnThis;
        if (DEFAULT) {
          methods = {
            values: DEF_VALUES ? $default : getMethod(VALUES),
            keys: IS_SET ? $default : getMethod(KEYS),
            entries: $entries
          };
          if (FORCED)
            for (key in methods) {
              if (!(key in proto)) redefine(proto, key, methods[key]);
            }
          else
            $export(
              $export.P + $export.F * (BUGGY || VALUES_BUG),
              NAME,
              methods
            );
        }
        return methods;
      };

      /***/
    },

    /***/ DVgA: /***/ function(module, exports, __webpack_require__) {
      // 19.1.2.14 / 15.2.3.14 Object.keys(O)
      var $keys = __webpack_require__("zhAb");
      var enumBugKeys = __webpack_require__("4R4u");

      module.exports =
        Object.keys ||
        function keys(O) {
          return $keys(O, enumBugKeys);
        };

      /***/
    },

    /***/ FJW5: /***/ function(module, exports, __webpack_require__) {
      var dP = __webpack_require__("hswa");
      var anObject = __webpack_require__("y3w9");
      var getKeys = __webpack_require__("DVgA");

      module.exports = __webpack_require__("nh4g")
        ? Object.defineProperties
        : function defineProperties(O, Properties) {
            anObject(O);
            var keys = getKeys(Properties);
            var length = keys.length;
            var i = 0;
            var P;
            while (length > i) dP.f(O, (P = keys[i++]), Properties[P]);
            return O;
          };

      /***/
    },

    /***/ HrLf: /***/ function(module, exports, __webpack_require__) {
      // This file is imported into lib/wc client bundles.

      if (typeof window !== "undefined") {
        let i;
        if (
          (i = window.document.currentScript) &&
          (i = i.src.match(/(.+\/)[^/]+\.js$/))
        ) {
          __webpack_require__.p = i[1]; // eslint-disable-line
        }
      }

      /***/
    },

    /***/ I1BE: /***/ function(module, exports) {
      /*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
      // css base code, injected by the css-loader
      module.exports = function(useSourceMap) {
        var list = [];

        // return the list of modules as css string
        list.toString = function toString() {
          return this.map(function(item) {
            var content = cssWithMappingToString(item, useSourceMap);
            if (item[2]) {
              return "@media " + item[2] + "{" + content + "}";
            } else {
              return content;
            }
          }).join("");
        };

        // import a list of modules into the list
        list.i = function(modules, mediaQuery) {
          if (typeof modules === "string") modules = [[null, modules, ""]];
          var alreadyImportedModules = {};
          for (var i = 0; i < this.length; i++) {
            var id = this[i][0];
            if (typeof id === "number") alreadyImportedModules[id] = true;
          }
          for (i = 0; i < modules.length; i++) {
            var item = modules[i];
            // skip already imported module
            // this implementation is not 100% perfect for weird media query combinations
            //  when a module is imported multiple times with different media queries.
            //  I hope this will never occur (Hey this way we have smaller bundles)
            if (
              typeof item[0] !== "number" ||
              !alreadyImportedModules[item[0]]
            ) {
              if (mediaQuery && !item[2]) {
                item[2] = mediaQuery;
              } else if (mediaQuery) {
                item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
              }
              list.push(item);
            }
          }
        };
        return list;
      };

      function cssWithMappingToString(item, useSourceMap) {
        var content = item[1] || "";
        var cssMapping = item[3];
        if (!cssMapping) {
          return content;
        }

        if (useSourceMap && typeof btoa === "function") {
          var sourceMapping = toComment(cssMapping);
          var sourceURLs = cssMapping.sources.map(function(source) {
            return "/*# sourceURL=" + cssMapping.sourceRoot + source + " */";
          });

          return [content]
            .concat(sourceURLs)
            .concat([sourceMapping])
            .join("\n");
        }

        return [content].join("\n");
      }

      // Adapted from convert-source-map (MIT)
      function toComment(sourceMap) {
        // eslint-disable-next-line no-undef
        var base64 = btoa(
          unescape(encodeURIComponent(JSON.stringify(sourceMap)))
        );
        var data =
          "sourceMappingURL=data:application/json;charset=utf-8;base64," +
          base64;

        return "/*# " + data + " */";
      }

      /***/
    },

    /***/ Iw71: /***/ function(module, exports, __webpack_require__) {
      var isObject = __webpack_require__("0/R4");
      var document = __webpack_require__("dyZX").document;
      // typeof document.createElement is 'object' in old IE
      var is = isObject(document) && isObject(document.createElement);
      module.exports = function(it) {
        return is ? document.createElement(it) : {};
      };

      /***/
    },

    /***/ K0xU: /***/ function(module, exports, __webpack_require__) {
      var store = __webpack_require__("VTer")("wks");
      var uid = __webpack_require__("ylqs");
      var Symbol = __webpack_require__("dyZX").Symbol;
      var USE_SYMBOL = typeof Symbol == "function";

      var $exports = (module.exports = function(name) {
        return (
          store[name] ||
          (store[name] =
            (USE_SYMBOL && Symbol[name]) ||
            (USE_SYMBOL ? Symbol : uid)("Symbol." + name))
        );
      });

      $exports.store = store;

      /***/
    },

    /***/ KroJ: /***/ function(module, exports, __webpack_require__) {
      var global = __webpack_require__("dyZX");
      var hide = __webpack_require__("Mukb");
      var has = __webpack_require__("aagx");
      var SRC = __webpack_require__("ylqs")("src");
      var TO_STRING = "toString";
      var $toString = Function[TO_STRING];
      var TPL = ("" + $toString).split(TO_STRING);

      __webpack_require__("g3g5").inspectSource = function(it) {
        return $toString.call(it);
      };

      (module.exports = function(O, key, val, safe) {
        var isFunction = typeof val == "function";
        if (isFunction) has(val, "name") || hide(val, "name", key);
        if (O[key] === val) return;
        if (isFunction)
          has(val, SRC) ||
            hide(val, SRC, O[key] ? "" + O[key] : TPL.join(String(key)));
        if (O === global) {
          O[key] = val;
        } else if (!safe) {
          delete O[key];
          hide(O, key, val);
        } else if (O[key]) {
          O[key] = val;
        } else {
          hide(O, key, val);
        }
        // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
      })(Function.prototype, TO_STRING, function toString() {
        return (typeof this == "function" && this[SRC]) || $toString.call(this);
      });

      /***/
    },

    /***/ Kuth: /***/ function(module, exports, __webpack_require__) {
      // 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
      var anObject = __webpack_require__("y3w9");
      var dPs = __webpack_require__("FJW5");
      var enumBugKeys = __webpack_require__("4R4u");
      var IE_PROTO = __webpack_require__("YTvA")("IE_PROTO");
      var Empty = function() {
        /* empty */
      };
      var PROTOTYPE = "prototype";

      // Create object with fake `null` prototype: use iframe Object with cleared prototype
      var createDict = function() {
        // Thrash, waste and sodomy: IE GC bug
        var iframe = __webpack_require__("Iw71")("iframe");
        var i = enumBugKeys.length;
        var lt = "<";
        var gt = ">";
        var iframeDocument;
        iframe.style.display = "none";
        __webpack_require__("+rLv").appendChild(iframe);
        iframe.src = "javascript:"; // eslint-disable-line no-script-url
        // createDict = iframe.contentWindow.Object;
        // html.removeChild(iframe);
        iframeDocument = iframe.contentWindow.document;
        iframeDocument.open();
        iframeDocument.write(
          lt + "script" + gt + "document.F=Object" + lt + "/script" + gt
        );
        iframeDocument.close();
        createDict = iframeDocument.F;
        while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
        return createDict();
      };

      module.exports =
        Object.create ||
        function create(O, Properties) {
          var result;
          if (O !== null) {
            Empty[PROTOTYPE] = anObject(O);
            result = new Empty();
            Empty[PROTOTYPE] = null;
            // add "__proto__" for Object.getPrototypeOf polyfill
            result[IE_PROTO] = O;
          } else result = createDict();
          return Properties === undefined ? result : dPs(result, Properties);
        };

      /***/
    },

    /***/ LQAc: /***/ function(module, exports) {
      module.exports = false;

      /***/
    },

    /***/ LZWt: /***/ function(module, exports) {
      var toString = {}.toString;

      module.exports = function(it) {
        return toString.call(it).slice(8, -1);
      };

      /***/
    },

    /***/ Mukb: /***/ function(module, exports, __webpack_require__) {
      var dP = __webpack_require__("hswa");
      var createDesc = __webpack_require__("RjD/");
      module.exports = __webpack_require__("nh4g")
        ? function(object, key, value) {
            return dP.f(object, key, createDesc(1, value));
          }
        : function(object, key, value) {
            object[key] = value;
            return object;
          };

      /***/
    },

    /***/ OP3Y: /***/ function(module, exports, __webpack_require__) {
      // 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
      var has = __webpack_require__("aagx");
      var toObject = __webpack_require__("S/j/");
      var IE_PROTO = __webpack_require__("YTvA")("IE_PROTO");
      var ObjectProto = Object.prototype;

      module.exports =
        Object.getPrototypeOf ||
        function(O) {
          O = toObject(O);
          if (has(O, IE_PROTO)) return O[IE_PROTO];
          if (
            typeof O.constructor == "function" &&
            O instanceof O.constructor
          ) {
            return O.constructor.prototype;
          }
          return O instanceof Object ? ObjectProto : null;
        };

      /***/
    },

    /***/ QaDb: /***/ function(module, exports, __webpack_require__) {
      "use strict";

      var create = __webpack_require__("Kuth");
      var descriptor = __webpack_require__("RjD/");
      var setToStringTag = __webpack_require__("fyDq");
      var IteratorPrototype = {};

      // 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
      __webpack_require__("Mukb")(
        IteratorPrototype,
        __webpack_require__("K0xU")("iterator"),
        function() {
          return this;
        }
      );

      module.exports = function(Constructor, NAME, next) {
        Constructor.prototype = create(IteratorPrototype, {
          next: descriptor(1, next)
        });
        setToStringTag(Constructor, NAME + " Iterator");
      };

      /***/
    },

    /***/ RW0V: /***/ function(module, exports, __webpack_require__) {
      // 19.1.2.14 Object.keys(O)
      var toObject = __webpack_require__("S/j/");
      var $keys = __webpack_require__("DVgA");

      __webpack_require__("Xtr8")("keys", function() {
        return function keys(it) {
          return $keys(toObject(it));
        };
      });

      /***/
    },

    /***/ RYi7: /***/ function(module, exports) {
      // 7.1.4 ToInteger
      var ceil = Math.ceil;
      var floor = Math.floor;
      module.exports = function(it) {
        return isNaN((it = +it)) ? 0 : (it > 0 ? floor : ceil)(it);
      };

      /***/
    },

    /***/ "RjD/": /***/ function(module, exports) {
      module.exports = function(bitmap, value) {
        return {
          enumerable: !(bitmap & 1),
          configurable: !(bitmap & 2),
          writable: !(bitmap & 4),
          value: value
        };
      };

      /***/
    },

    /***/ "S/j/": /***/ function(module, exports, __webpack_require__) {
      // 7.1.13 ToObject(argument)
      var defined = __webpack_require__("vhPU");
      module.exports = function(it) {
        return Object(defined(it));
      };

      /***/
    },

    /***/ SPf7: /***/ function(
      module,
      __webpack_exports__,
      __webpack_require__
    ) {
      "use strict";
      /* harmony import */ var _vue_style_loader_index_js_ref_6_oneOf_1_0_css_loader_index_js_ref_6_oneOf_1_1_vue_loader_lib_loaders_stylePostLoader_js_postcss_loader_lib_index_js_ref_6_oneOf_1_2_cache_loader_dist_cjs_js_ref_0_0_vue_loader_lib_index_js_vue_loader_options_Icon_vue_vue_type_style_index_0_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
        "VoXy"
      );
      /* harmony import */ var _vue_style_loader_index_js_ref_6_oneOf_1_0_css_loader_index_js_ref_6_oneOf_1_1_vue_loader_lib_loaders_stylePostLoader_js_postcss_loader_lib_index_js_ref_6_oneOf_1_2_cache_loader_dist_cjs_js_ref_0_0_vue_loader_lib_index_js_vue_loader_options_Icon_vue_vue_type_style_index_0_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(
        _vue_style_loader_index_js_ref_6_oneOf_1_0_css_loader_index_js_ref_6_oneOf_1_1_vue_loader_lib_loaders_stylePostLoader_js_postcss_loader_lib_index_js_ref_6_oneOf_1_2_cache_loader_dist_cjs_js_ref_0_0_vue_loader_lib_index_js_vue_loader_options_Icon_vue_vue_type_style_index_0_lang_css__WEBPACK_IMPORTED_MODULE_0__
      );
      /* unused harmony reexport * */
      /* unused harmony default export */ var _unused_webpack_default_export =
        _vue_style_loader_index_js_ref_6_oneOf_1_0_css_loader_index_js_ref_6_oneOf_1_1_vue_loader_lib_loaders_stylePostLoader_js_postcss_loader_lib_index_js_ref_6_oneOf_1_2_cache_loader_dist_cjs_js_ref_0_0_vue_loader_lib_index_js_vue_loader_options_Icon_vue_vue_type_style_index_0_lang_css__WEBPACK_IMPORTED_MODULE_0___default.a;

      /***/
    },

    /***/ SZ7m: /***/ function(
      module,
      __webpack_exports__,
      __webpack_require__
    ) {
      "use strict";
      __webpack_require__.r(__webpack_exports__);

      // CONCATENATED MODULE: ./node_modules/vue-style-loader/lib/listToStyles.js
      /**
       * Translates the list format produced by css-loader into something
       * easier to manipulate.
       */
      function listToStyles(parentId, list) {
        var styles = [];
        var newStyles = {};
        for (var i = 0; i < list.length; i++) {
          var item = list[i];
          var id = item[0];
          var css = item[1];
          var media = item[2];
          var sourceMap = item[3];
          var part = {
            id: parentId + ":" + i,
            css: css,
            media: media,
            sourceMap: sourceMap
          };
          if (!newStyles[id]) {
            styles.push((newStyles[id] = { id: id, parts: [part] }));
          } else {
            newStyles[id].parts.push(part);
          }
        }
        return styles;
      }

      // CONCATENATED MODULE: ./node_modules/vue-style-loader/lib/addStylesClient.js
      /* harmony export (binding) */ __webpack_require__.d(
        __webpack_exports__,
        "default",
        function() {
          return addStylesClient;
        }
      );
      /*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/

      var hasDocument = typeof document !== "undefined";

      if (typeof DEBUG !== "undefined" && DEBUG) {
        if (!hasDocument) {
          throw new Error(
            "vue-style-loader cannot be used in a non-browser environment. " +
              "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
          );
        }
      }

      /*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

      var stylesInDom = {
        /*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/
      };

      var head =
        hasDocument &&
        (document.head || document.getElementsByTagName("head")[0]);
      var singletonElement = null;
      var singletonCounter = 0;
      var isProduction = false;
      var noop = function() {};
      var options = null;
      var ssrIdKey = "data-vue-ssr-id";

      // Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
      // tags it will allow on a page
      var isOldIE =
        typeof navigator !== "undefined" &&
        /msie [6-9]\b/.test(navigator.userAgent.toLowerCase());

      function addStylesClient(parentId, list, _isProduction, _options) {
        isProduction = _isProduction;

        options = _options || {};

        var styles = listToStyles(parentId, list);
        addStylesToDom(styles);

        return function update(newList) {
          var mayRemove = [];
          for (var i = 0; i < styles.length; i++) {
            var item = styles[i];
            var domStyle = stylesInDom[item.id];
            domStyle.refs--;
            mayRemove.push(domStyle);
          }
          if (newList) {
            styles = listToStyles(parentId, newList);
            addStylesToDom(styles);
          } else {
            styles = [];
          }
          for (var i = 0; i < mayRemove.length; i++) {
            var domStyle = mayRemove[i];
            if (domStyle.refs === 0) {
              for (var j = 0; j < domStyle.parts.length; j++) {
                domStyle.parts[j]();
              }
              delete stylesInDom[domStyle.id];
            }
          }
        };
      }

      function addStylesToDom(styles /* Array<StyleObject> */) {
        for (var i = 0; i < styles.length; i++) {
          var item = styles[i];
          var domStyle = stylesInDom[item.id];
          if (domStyle) {
            domStyle.refs++;
            for (var j = 0; j < domStyle.parts.length; j++) {
              domStyle.parts[j](item.parts[j]);
            }
            for (; j < item.parts.length; j++) {
              domStyle.parts.push(addStyle(item.parts[j]));
            }
            if (domStyle.parts.length > item.parts.length) {
              domStyle.parts.length = item.parts.length;
            }
          } else {
            var parts = [];
            for (var j = 0; j < item.parts.length; j++) {
              parts.push(addStyle(item.parts[j]));
            }
            stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts };
          }
        }
      }

      function createStyleElement() {
        var styleElement = document.createElement("style");
        styleElement.type = "text/css";
        head.appendChild(styleElement);
        return styleElement;
      }

      function addStyle(obj /* StyleObjectPart */) {
        var update, remove;
        var styleElement = document.querySelector(
          "style[" + ssrIdKey + '~="' + obj.id + '"]'
        );

        if (styleElement) {
          if (isProduction) {
            // has SSR styles and in production mode.
            // simply do nothing.
            return noop;
          } else {
            // has SSR styles but in dev mode.
            // for some reason Chrome can't handle source map in server-rendered
            // style tags - source maps in <style> only works if the style tag is
            // created and inserted dynamically. So we remove the server rendered
            // styles and inject new ones.
            styleElement.parentNode.removeChild(styleElement);
          }
        }

        if (isOldIE) {
          // use singleton mode for IE9.
          var styleIndex = singletonCounter++;
          styleElement =
            singletonElement || (singletonElement = createStyleElement());
          update = applyToSingletonTag.bind(
            null,
            styleElement,
            styleIndex,
            false
          );
          remove = applyToSingletonTag.bind(
            null,
            styleElement,
            styleIndex,
            true
          );
        } else {
          // use multi-style-tag mode in all other cases
          styleElement = createStyleElement();
          update = applyToTag.bind(null, styleElement);
          remove = function() {
            styleElement.parentNode.removeChild(styleElement);
          };
        }

        update(obj);

        return function updateStyle(newObj /* StyleObjectPart */) {
          if (newObj) {
            if (
              newObj.css === obj.css &&
              newObj.media === obj.media &&
              newObj.sourceMap === obj.sourceMap
            ) {
              return;
            }
            update((obj = newObj));
          } else {
            remove();
          }
        };
      }

      var replaceText = (function() {
        var textStore = [];

        return function(index, replacement) {
          textStore[index] = replacement;
          return textStore.filter(Boolean).join("\n");
        };
      })();

      function applyToSingletonTag(styleElement, index, remove, obj) {
        var css = remove ? "" : obj.css;

        if (styleElement.styleSheet) {
          styleElement.styleSheet.cssText = replaceText(index, css);
        } else {
          var cssNode = document.createTextNode(css);
          var childNodes = styleElement.childNodes;
          if (childNodes[index]) styleElement.removeChild(childNodes[index]);
          if (childNodes.length) {
            styleElement.insertBefore(cssNode, childNodes[index]);
          } else {
            styleElement.appendChild(cssNode);
          }
        }
      }

      function applyToTag(styleElement, obj) {
        var css = obj.css;
        var media = obj.media;
        var sourceMap = obj.sourceMap;

        if (media) {
          styleElement.setAttribute("media", media);
        }
        if (options.ssrId) {
          styleElement.setAttribute(ssrIdKey, obj.id);
        }

        if (sourceMap) {
          // https://developer.chrome.com/devtools/docs/javascript-debugging
          // this makes source maps inside style tags work properly in Chrome
          css += "\n/*# sourceURL=" + sourceMap.sources[0] + " */";
          // http://stackoverflow.com/a/26603875
          css +=
            "\n/*# sourceMappingURL=data:application/json;base64," +
            btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) +
            " */";
        }

        if (styleElement.styleSheet) {
          styleElement.styleSheet.cssText = css;
        } else {
          while (styleElement.firstChild) {
            styleElement.removeChild(styleElement.firstChild);
          }
          styleElement.appendChild(document.createTextNode(css));
        }
      }

      /***/
    },

    /***/ VTer: /***/ function(module, exports, __webpack_require__) {
      var core = __webpack_require__("g3g5");
      var global = __webpack_require__("dyZX");
      var SHARED = "__core-js_shared__";
      var store = global[SHARED] || (global[SHARED] = {});

      (module.exports = function(key, value) {
        return store[key] || (store[key] = value !== undefined ? value : {});
      })("versions", []).push({
        version: core.version,
        mode: __webpack_require__("LQAc") ? "pure" : "global",
        copyright: "© 2018 Denis Pushkarev (zloirock.ru)"
      });

      /***/
    },

    /***/ VoXy: /***/ function(module, exports, __webpack_require__) {
      // style-loader: Adds some css to the DOM by adding a <style> tag

      // load the styles
      var content = __webpack_require__("rYXw");
      if (typeof content === "string") content = [[module.i, content, ""]];
      if (content.locals) module.exports = content.locals;
      // add the styles to the DOM
      var add = __webpack_require__("SZ7m").default;
      var update = add("4b882b4e", content, true, {
        sourceMap: false,
        shadowMode: false
      });

      /***/
    },

    /***/ XKFU: /***/ function(module, exports, __webpack_require__) {
      var global = __webpack_require__("dyZX");
      var core = __webpack_require__("g3g5");
      var hide = __webpack_require__("Mukb");
      var redefine = __webpack_require__("KroJ");
      var ctx = __webpack_require__("m0Pp");
      var PROTOTYPE = "prototype";

      var $export = function(type, name, source) {
        var IS_FORCED = type & $export.F;
        var IS_GLOBAL = type & $export.G;
        var IS_STATIC = type & $export.S;
        var IS_PROTO = type & $export.P;
        var IS_BIND = type & $export.B;
        var target = IS_GLOBAL
          ? global
          : IS_STATIC
          ? global[name] || (global[name] = {})
          : (global[name] || {})[PROTOTYPE];
        var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
        var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
        var key, own, out, exp;
        if (IS_GLOBAL) source = name;
        for (key in source) {
          // contains in native
          own = !IS_FORCED && target && target[key] !== undefined;
          // export native or passed
          out = (own ? target : source)[key];
          // bind timers to global for call from export context
          exp =
            IS_BIND && own
              ? ctx(out, global)
              : IS_PROTO && typeof out == "function"
              ? ctx(Function.call, out)
              : out;
          // extend global
          if (target) redefine(target, key, out, type & $export.U);
          // export
          if (exports[key] != out) hide(exports, key, exp);
          if (IS_PROTO && expProto[key] != out) expProto[key] = out;
        }
      };
      global.core = core;
      // type bitmap
      $export.F = 1; // forced
      $export.G = 2; // global
      $export.S = 4; // static
      $export.P = 8; // proto
      $export.B = 16; // bind
      $export.W = 32; // wrap
      $export.U = 64; // safe
      $export.R = 128; // real proto method for `library`
      module.exports = $export;

      /***/
    },

    /***/ Xtr8: /***/ function(module, exports, __webpack_require__) {
      // most Object methods by ES6 should accept primitives
      var $export = __webpack_require__("XKFU");
      var core = __webpack_require__("g3g5");
      var fails = __webpack_require__("eeVq");
      module.exports = function(KEY, exec) {
        var fn = (core.Object || {})[KEY] || Object[KEY];
        var exp = {};
        exp[KEY] = exec(fn);
        $export(
          $export.S +
            $export.F *
              fails(function() {
                fn(1);
              }),
          "Object",
          exp
        );
      };

      /***/
    },

    /***/ YTvA: /***/ function(module, exports, __webpack_require__) {
      var shared = __webpack_require__("VTer")("keys");
      var uid = __webpack_require__("ylqs");
      module.exports = function(key) {
        return shared[key] || (shared[key] = uid(key));
      };

      /***/
    },

    /***/ Ymqv: /***/ function(module, exports, __webpack_require__) {
      // fallback for non-array-like ES3 and non-enumerable old V8 strings
      var cof = __webpack_require__("LZWt");
      // eslint-disable-next-line no-prototype-builtins
      module.exports = Object("z").propertyIsEnumerable(0)
        ? Object
        : function(it) {
            return cof(it) == "String" ? it.split("") : Object(it);
          };

      /***/
    },

    /***/ aCFj: /***/ function(module, exports, __webpack_require__) {
      // to indexed object, toObject with fallback for non-array-like ES3 strings
      var IObject = __webpack_require__("Ymqv");
      var defined = __webpack_require__("vhPU");
      module.exports = function(it) {
        return IObject(defined(it));
      };

      /***/
    },

    /***/ aagx: /***/ function(module, exports) {
      var hasOwnProperty = {}.hasOwnProperty;
      module.exports = function(it, key) {
        return hasOwnProperty.call(it, key);
      };

      /***/
    },

    /***/ apmT: /***/ function(module, exports, __webpack_require__) {
      // 7.1.1 ToPrimitive(input [, PreferredType])
      var isObject = __webpack_require__("0/R4");
      // instead of the ES6 spec version, we didn't implement @@toPrimitive case
      // and the second argument - flag - preferred type is a string
      module.exports = function(it, S) {
        if (!isObject(it)) return it;
        var fn, val;
        if (
          S &&
          typeof (fn = it.toString) == "function" &&
          !isObject((val = fn.call(it)))
        )
          return val;
        if (
          typeof (fn = it.valueOf) == "function" &&
          !isObject((val = fn.call(it)))
        )
          return val;
        if (
          !S &&
          typeof (fn = it.toString) == "function" &&
          !isObject((val = fn.call(it)))
        )
          return val;
        throw TypeError("Can't convert object to primitive value");
      };

      /***/
    },

    /***/ "d/Gc": /***/ function(module, exports, __webpack_require__) {
      var toInteger = __webpack_require__("RYi7");
      var max = Math.max;
      var min = Math.min;
      module.exports = function(index, length) {
        index = toInteger(index);
        return index < 0 ? max(index + length, 0) : min(index, length);
      };

      /***/
    },

    /***/ dyZX: /***/ function(module, exports) {
      // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
      var global = (module.exports =
        typeof window != "undefined" && window.Math == Math
          ? window
          : typeof self != "undefined" && self.Math == Math
          ? self
          : // eslint-disable-next-line no-new-func
            Function("return this")());
      if (typeof __g == "number") __g = global; // eslint-disable-line no-undef

      /***/
    },

    /***/ eeVq: /***/ function(module, exports) {
      module.exports = function(exec) {
        try {
          return !!exec();
        } catch (e) {
          return true;
        }
      };

      /***/
    },

    /***/ fyDq: /***/ function(module, exports, __webpack_require__) {
      var def = __webpack_require__("hswa").f;
      var has = __webpack_require__("aagx");
      var TAG = __webpack_require__("K0xU")("toStringTag");

      module.exports = function(it, tag, stat) {
        if (it && !has((it = stat ? it : it.prototype), TAG))
          def(it, TAG, { configurable: true, value: tag });
      };

      /***/
    },

    /***/ g3g5: /***/ function(module, exports) {
      var core = (module.exports = { version: "2.5.7" });
      if (typeof __e == "number") __e = core; // eslint-disable-line no-undef

      /***/
    },

    /***/ hPIQ: /***/ function(module, exports) {
      module.exports = {};

      /***/
    },

    /***/ hswa: /***/ function(module, exports, __webpack_require__) {
      var anObject = __webpack_require__("y3w9");
      var IE8_DOM_DEFINE = __webpack_require__("xpql");
      var toPrimitive = __webpack_require__("apmT");
      var dP = Object.defineProperty;

      exports.f = __webpack_require__("nh4g")
        ? Object.defineProperty
        : function defineProperty(O, P, Attributes) {
            anObject(O);
            P = toPrimitive(P, true);
            anObject(Attributes);
            if (IE8_DOM_DEFINE)
              try {
                return dP(O, P, Attributes);
              } catch (e) {
                /* empty */
              }
            if ("get" in Attributes || "set" in Attributes)
              throw TypeError("Accessors not supported!");
            if ("value" in Attributes) O[P] = Attributes.value;
            return O;
          };

      /***/
    },

    /***/ m0Pp: /***/ function(module, exports, __webpack_require__) {
      // optional / simple context binding
      var aFunction = __webpack_require__("2OiF");
      module.exports = function(fn, that, length) {
        aFunction(fn);
        if (that === undefined) return fn;
        switch (length) {
          case 1:
            return function(a) {
              return fn.call(that, a);
            };
          case 2:
            return function(a, b) {
              return fn.call(that, a, b);
            };
          case 3:
            return function(a, b, c) {
              return fn.call(that, a, b, c);
            };
        }
        return function(/* ...args */) {
          return fn.apply(that, arguments);
        };
      };

      /***/
    },

    /***/ nGyu: /***/ function(module, exports, __webpack_require__) {
      // 22.1.3.31 Array.prototype[@@unscopables]
      var UNSCOPABLES = __webpack_require__("K0xU")("unscopables");
      var ArrayProto = Array.prototype;
      if (ArrayProto[UNSCOPABLES] == undefined)
        __webpack_require__("Mukb")(ArrayProto, UNSCOPABLES, {});
      module.exports = function(key) {
        ArrayProto[UNSCOPABLES][key] = true;
      };

      /***/
    },

    /***/ ne8i: /***/ function(module, exports, __webpack_require__) {
      // 7.1.15 ToLength
      var toInteger = __webpack_require__("RYi7");
      var min = Math.min;
      module.exports = function(it) {
        return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
      };

      /***/
    },

    /***/ nh4g: /***/ function(module, exports, __webpack_require__) {
      // Thank's IE8 for his funny defineProperty
      module.exports = !__webpack_require__("eeVq")(function() {
        return (
          Object.defineProperty({}, "a", {
            get: function() {
              return 7;
            }
          }).a != 7
        );
      });

      /***/
    },

    /***/ rGqo: /***/ function(module, exports, __webpack_require__) {
      var $iterators = __webpack_require__("yt8O");
      var getKeys = __webpack_require__("DVgA");
      var redefine = __webpack_require__("KroJ");
      var global = __webpack_require__("dyZX");
      var hide = __webpack_require__("Mukb");
      var Iterators = __webpack_require__("hPIQ");
      var wks = __webpack_require__("K0xU");
      var ITERATOR = wks("iterator");
      var TO_STRING_TAG = wks("toStringTag");
      var ArrayValues = Iterators.Array;

      var DOMIterables = {
        CSSRuleList: true, // TODO: Not spec compliant, should be false.
        CSSStyleDeclaration: false,
        CSSValueList: false,
        ClientRectList: false,
        DOMRectList: false,
        DOMStringList: false,
        DOMTokenList: true,
        DataTransferItemList: false,
        FileList: false,
        HTMLAllCollection: false,
        HTMLCollection: false,
        HTMLFormElement: false,
        HTMLSelectElement: false,
        MediaList: true, // TODO: Not spec compliant, should be false.
        MimeTypeArray: false,
        NamedNodeMap: false,
        NodeList: true,
        PaintRequestList: false,
        Plugin: false,
        PluginArray: false,
        SVGLengthList: false,
        SVGNumberList: false,
        SVGPathSegList: false,
        SVGPointList: false,
        SVGStringList: false,
        SVGTransformList: false,
        SourceBufferList: false,
        StyleSheetList: true, // TODO: Not spec compliant, should be false.
        TextTrackCueList: false,
        TextTrackList: false,
        TouchList: false
      };

      for (
        var collections = getKeys(DOMIterables), i = 0;
        i < collections.length;
        i++
      ) {
        var NAME = collections[i];
        var explicit = DOMIterables[NAME];
        var Collection = global[NAME];
        var proto = Collection && Collection.prototype;
        var key;
        if (proto) {
          if (!proto[ITERATOR]) hide(proto, ITERATOR, ArrayValues);
          if (!proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
          Iterators[NAME] = ArrayValues;
          if (explicit)
            for (key in $iterators)
              if (!proto[key]) redefine(proto, key, $iterators[key], true);
        }
      }

      /***/
    },

    /***/ rYXw: /***/ function(module, exports, __webpack_require__) {
      exports = module.exports = __webpack_require__("I1BE")(false);
      // imports

      // module
      exports.push([
        module.i,
        ".fa-icon{display:inline-block;fill:currentColor}.fa-flip-horizontal{-webkit-transform:scaleX(-1);transform:scaleX(-1)}.fa-flip-vertical{-webkit-transform:scaleY(-1);transform:scaleY(-1)}.fa-spin{-webkit-animation:fa-spin 1s 0s infinite linear;animation:fa-spin 1s 0s infinite linear}.fa-inverse{color:#fff}.fa-pulse{-webkit-animation:fa-spin 1s infinite steps(8);animation:fa-spin 1s infinite steps(8)}@-webkit-keyframes fa-spin{0%{-webkit-transform:rotate(0deg);transform:rotate(0deg)}to{-webkit-transform:rotate(1turn);transform:rotate(1turn)}}@keyframes fa-spin{0%{-webkit-transform:rotate(0deg);transform:rotate(0deg)}to{-webkit-transform:rotate(1turn);transform:rotate(1turn)}}",
        ""
      ]);

      // exports

      /***/
    },

    /***/ vhPU: /***/ function(module, exports) {
      // 7.2.1 RequireObjectCoercible(argument)
      module.exports = function(it) {
        if (it == undefined) throw TypeError("Can't call method on  " + it);
        return it;
      };

      /***/
    },

    /***/ w2a5: /***/ function(module, exports, __webpack_require__) {
      // false -> Array#indexOf
      // true  -> Array#includes
      var toIObject = __webpack_require__("aCFj");
      var toLength = __webpack_require__("ne8i");
      var toAbsoluteIndex = __webpack_require__("d/Gc");
      module.exports = function(IS_INCLUDES) {
        return function($this, el, fromIndex) {
          var O = toIObject($this);
          var length = toLength(O.length);
          var index = toAbsoluteIndex(fromIndex, length);
          var value;
          // Array#includes uses SameValueZero equality algorithm
          // eslint-disable-next-line no-self-compare
          if (IS_INCLUDES && el != el)
            while (length > index) {
              value = O[index++];
              // eslint-disable-next-line no-self-compare
              if (value != value) return true;
              // Array#indexOf ignores holes, Array#includes - not
            }
          else
            for (; length > index; index++)
              if (IS_INCLUDES || index in O) {
                if (O[index] === el) return IS_INCLUDES || index || 0;
              }
          return !IS_INCLUDES && -1;
        };
      };

      /***/
    },

    /***/ xpql: /***/ function(module, exports, __webpack_require__) {
      module.exports =
        !__webpack_require__("nh4g") &&
        !__webpack_require__("eeVq")(function() {
          return (
            Object.defineProperty(__webpack_require__("Iw71")("div"), "a", {
              get: function() {
                return 7;
              }
            }).a != 7
          );
        });

      /***/
    },

    /***/ y3w9: /***/ function(module, exports, __webpack_require__) {
      var isObject = __webpack_require__("0/R4");
      module.exports = function(it) {
        if (!isObject(it)) throw TypeError(it + " is not an object!");
        return it;
      };

      /***/
    },

    /***/ ylqs: /***/ function(module, exports) {
      var id = 0;
      var px = Math.random();
      module.exports = function(key) {
        return "Symbol(".concat(
          key === undefined ? "" : key,
          ")_",
          (++id + px).toString(36)
        );
      };

      /***/
    },

    /***/ yt8O: /***/ function(module, exports, __webpack_require__) {
      "use strict";

      var addToUnscopables = __webpack_require__("nGyu");
      var step = __webpack_require__("1TsA");
      var Iterators = __webpack_require__("hPIQ");
      var toIObject = __webpack_require__("aCFj");

      // 22.1.3.4 Array.prototype.entries()
      // 22.1.3.13 Array.prototype.keys()
      // 22.1.3.29 Array.prototype.values()
      // 22.1.3.30 Array.prototype[@@iterator]()
      module.exports = __webpack_require__("Afnz")(
        Array,
        "Array",
        function(iterated, kind) {
          this._t = toIObject(iterated); // target
          this._i = 0; // next index
          this._k = kind; // kind
          // 22.1.5.2.1 %ArrayIteratorPrototype%.next()
        },
        function() {
          var O = this._t;
          var kind = this._k;
          var index = this._i++;
          if (!O || index >= O.length) {
            this._t = undefined;
            return step(1);
          }
          if (kind == "keys") return step(0, index);
          if (kind == "values") return step(0, O[index]);
          return step(0, [index, O[index]]);
        },
        "values"
      );

      // argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
      Iterators.Arguments = Iterators.Array;

      addToUnscopables("keys");
      addToUnscopables("values");
      addToUnscopables("entries");

      /***/
    },

    /***/ zhAb: /***/ function(module, exports, __webpack_require__) {
      var has = __webpack_require__("aagx");
      var toIObject = __webpack_require__("aCFj");
      var arrayIndexOf = __webpack_require__("w2a5")(false);
      var IE_PROTO = __webpack_require__("YTvA")("IE_PROTO");

      module.exports = function(object, names) {
        var O = toIObject(object);
        var i = 0;
        var result = [];
        var key;
        for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
        // Don't enum bug & hidden keys
        while (names.length > i)
          if (has(O, (key = names[i++]))) {
            ~arrayIndexOf(result, key) || result.push(key);
          }
        return result;
      };

      /***/
    }

    /******/
  }
)["default"];
//# sourceMappingURL=vue-socialmedia-share.common.js.map
