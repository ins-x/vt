/** @format */

import path from "path";
import { defineTheme } from "@vuepress/types";
import { ThemeConfig, EnhancedNavItem } from "./types";

export { ThemeConfig, EnhancedNavItem as NavItem };

export default defineTheme<ThemeConfig>((options, ctx) => {
  const { themeConfig, siteConfig } = ctx;

  // resolve algolia
  const isAlgoliaSearch =
    themeConfig.algolia ||
    Object.keys((siteConfig.locales && themeConfig.locales) || {}).some(
      base => themeConfig.locales[base].algolia,
    );

  const enableSmoothScroll = themeConfig.smoothScroll === true;

  return {
    alias() {
      return {
        "@AlgoliaSearchBox": isAlgoliaSearch
          ? path.resolve(__dirname, "../components/AlgoliaSearchBox.vue")
          : path.resolve(__dirname, "noopModule.js"),
      };
    },

    plugins: [
      ["@vuepress/active-header-links", options.activeHeaderLinks],
      [require.resolve("../plugins/copy-code/index.js"), true],
      [
        require.resolve("../plugins/code-switcher/index.js"),
        options.codeSwitcher,
      ],
      [
        require.resolve("../plugins/translate/index.js"),
        {
          transformTranslatedDocument: options.transformTranslatedDocument,
        },
      ],
      [require.resolve("../plugins/fulltext-search/index.js"), true],
      "@vuepress/plugin-nprogress",
      [
        "container",
        {
          type: "tip",
          defaultTitle: {
            "/": "TIP",
            "/zh/": "提示",
          },
        },
      ],
      [
        "container",
        {
          type: "warning",
          defaultTitle: {
            "/": "WARNING",
            "/zh/": "注意",
          },
        },
      ],
      [
        "container",
        {
          type: "danger",
          defaultTitle: {
            "/": "DANGER",
            "/zh/": "警告",
          },
        },
      ],
      [
        "container",
        {
          type: "details",
          before: (info: any) =>
            `<details class="custom-block details">${
              info ? `<summary>${info}</summary>` : ""
            }\n`,
          after: () => "</details>\n",
        },
      ],
      ["smooth-scroll", enableSmoothScroll],
    ],

    extendMarkdown: (md) => {
      const markdownItAttrs = require("markdown-it-attrs");
      const markdownItLinksAttrs = require("markdown-it-link-attributes");

      md.use(markdownItAttrs, {
        // optional, these are default options
        leftDelimiter: "@{",
        rightDelimiter: "}",
        allowedAttributes: [], // empty array = all attributes are allowed
      });

      md.use(markdownItLinksAttrs, [
        {
          pattern: /^https?:\/\//,
          attrs: {
            class: "link-hover-effect external-link",
          },
        },
        {
          pattern: /^(\.{1,2})?\//,
          attrs: {
            class: "link-hover-effect absolute-link",
          },
        },
      ]);
    },
  };
});
