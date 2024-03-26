# vite-plugin-fetchpriority

Vite plugin to add the `fetchpriority` attribute to scripts, stylesheets, and link rel="preload".

## Installation

```bash
# npm
npm install vite-plugin-fetchpriority -D

# yarn
yarn add vite-plugin-fetchpriority -D
```

## Usage

```js
// vite.config.js
import fetchPriority from "vite-plugin-fetchpriority";

export default {
  input: 'src/index.js',
  output: {
    dir: 'output',
    format: 'cjs'
  },
  fetchPriority([
    // add fetchpriority="high" to app.js
    {
      priority: "high",
      files: [
        {
          type: "script",
          match: /app\.js$/
        }
      ]
    },
    // add fetchpriority="high" to all preloads
    {
      priority: "high",
      files: [
        {
          type: "preload"
        }
      ]
    }
  ])
};
```

The output of the above configuration will be:

```diff
<head>
  <title>Demo</title>
  <link rel="stylesheet" href="/app.css" />
  <script type="module" src="/framework.js"></script>
-  <script type="module" src="/app.js"></script>
+  <script type="module" src="/app.js" fetchpriority="high"></script>
-  <link rel="preload" href="/roboto.woff2" type="font/woff2" as="font" crossorigin="anonymous" />
+  <link rel="preload" href="/roboto.woff2" type="font/woff2" as="font" crossorigin="anonymous" fetchpriority="high" />
-  <link rel="preload" href="/roboto-semibold.woff2" type="font/woff2" as="font" crossorigin="anonymous" />
+  <link rel="preload" href="/roboto-semibold.woff2" type="font/woff2" as="font" crossorigin="anonymous" fetchpriority="high" />

</head>
```

### Options

#### `priority`

Type: `high|low`

The value of the `fetchpriority` attribute. Note that the plugin does not support `auto` as this is the default value and can be omitted.

#### `files`

Type: `Array<{ type: string, match?: RegExp }>`

The files to add the `fetchpriority` attribute to. The `type` is used to determine the tag to add the attribute to (`script`, `link rel="stylesheet"`, or `link rel="preload"`). The `match` is optionally used to determine which files to add the attribute to if it isn't required on all files.

## Motivation

The Fetch Priority API can be useful for improving the performance of websites by giving the browser hints on which resources to prioritize. This plugin allows you to add the `fetchpriority` attribute to resources created in your Vite build and not accessible in the HTML.

Read more:
- [Optimizing resource loading with the Fetch Priority API](https://web.dev/articles/fetch-priority)
- [Fetch Priority and optimizing LCP](https://imkev.dev/fetchpriority-opportunity)

## License

[Apache-2.0](LICENSE)
