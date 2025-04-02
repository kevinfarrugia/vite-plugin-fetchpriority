import type { Plugin } from "vite";

export interface FetchPriorityOptionsFiles {
  /**
   * HTML element type
   */
  type: "script" | "style" | "preload";
  /**
   * Regular expression to target files
   */
  match?: RegExp;
}

export type FetchPriorityOptions = {
  priority: "high" | "low";
  files: FetchPriorityOptionsFiles[];
};

const fetchPriority = (options: FetchPriorityOptions[]): Plugin => ({
  name: "fetchPriority",
  transformIndexHtml: {
    order: "post",
    handler(html) {
      if (!options) return html;

      let formattedHtml = html;

      options.forEach((option) => {
        option.files.forEach((file) => {
          if (file.type === "script") {
            // external scripts
            const scriptRegex =
              /<script[^>]*(?=.*src=["'].+["'])[^>]*>.*<\/script>/gm;
            const tags = html.match(scriptRegex);

            if (tags) {
              formattedHtml = formattedHtml.replace(scriptRegex, (tag) => {
                // if tag does not have src attribute, return the tag as is
                const srcMatch = tag.match(/src=["'].+["']/);
                if (!srcMatch) return tag;

                // if tag has a src attribute and it does not match the user's regex, return the tag as is
                if (
                  srcMatch &&
                  file.match &&
                  !file.match.test(srcMatch.join(""))
                ) {
                  return tag;
                }

                // replace or add fetchpriority attribute
                return tag.includes("fetchpriority=")
                  ? tag.replace(
                      /fetchpriority=["'].*?["']/,
                      `fetchpriority="${option.priority}"`
                    )
                  : tag.replace(
                      "></script>",
                      ` fetchpriority="${option.priority}"></script>`
                    );
              });
            }
          } else if (file.type === "style") {
            // external stylesheets
            const styleRegex =
              /<link[^>]*(?=.*rel="stylesheet")(?=.*href=["'].+["'])[^>]*>/gm;
            const tags = html.match(styleRegex);

            if (tags) {
              formattedHtml = formattedHtml.replace(styleRegex, (tag) => {
                // if tag does not have href attribute, return the tag as is
                const hrefMatch = tag.match(/href=["'].+["']/);
                if (!hrefMatch) return tag;

                // if tag has a href attribute and it does not match the user's regex, return the tag as is
                if (
                  hrefMatch &&
                  file.match &&
                  !file.match.test(hrefMatch.join(""))
                ) {
                  return tag;
                }

                // replace or add fetchpriority attribute
                return tag.includes("fetchpriority=")
                  ? tag.replace(
                      /fetchpriority=["'].*?["']/,
                      `fetchpriority="${option.priority}"`
                    )
                  : tag.replace(
                      ">",
                      ` fetchpriority="${option.priority}">`
                    );
              });
            }
          } else if (file.type === "preload") {
            // link rel="preload"
            const preloadRegex =
              /<link[^>]*(?=.*rel="preload")(?=.*href=["'].+["'])[^>]*>/gm;
            const tags = html.match(preloadRegex);

            if (tags) {
              formattedHtml = formattedHtml.replace(preloadRegex, (tag) => {
                // if tag does not have href attribute, return the tag as is
                const hrefMatch = tag.match(/href=["'].+["']/);
                if (!hrefMatch) return tag;

                // if tag has a href attribute and it does not match the user's regex, return the tag as is
                if (
                  hrefMatch &&
                  file.match &&
                  !file.match.test(hrefMatch.join(""))
                ) {
                  return tag;
                }

                // replace or add fetchpriority attribute
                return tag.includes("fetchpriority=")
                  ? tag.replace(
                      /fetchpriority=["'].*?["']/,
                      `fetchpriority="${option.priority}"`
                    )
                  : tag.replace(
                      ">",
                      ` fetchpriority="${option.priority}">`
                    );
              });
            }
          }
        });
      });

      return formattedHtml;
    },
  },
});

export default fetchPriority;
