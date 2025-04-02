import { resolve } from "node:path";

import { OutputAsset, RollupOutput } from "rollup";
import { build } from "vite";
import { test, describe, expect } from "vitest";
import fetchPriority, { FetchPriorityOptions } from "../src";

async function buildVite(options: FetchPriorityOptions[]) {
  const { output } = (await build({
    root: resolve(__dirname, "./fixtures"),
    plugins: [fetchPriority(options)],
    build: {
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // separate chunk for each file
            if (id.endsWith(".js")) {
              return id.split("/").pop()?.replace(".js", "");
            }
            return null;
          },
        },
      },
    },
  })) as RollupOutput;

  const { source: indexSource } = output.find(
    (item) => item.fileName === "index.html"
  ) as OutputAsset;

  return indexSource.toString();
}

describe("fetchPriority", () => {
  test("should not add fetchpriority attribute if no matching files are found", async () => {
    const options: FetchPriorityOptions[] = [
      {
        priority: "high",
        files: [
          {
            type: "script",
            match: /nonexistent/,
          },
        ],
      },
    ];

    await buildVite(options).then((result) => {
      expect(result).toMatchSnapshot();
    });
  });

  test("should add fetchpriority=high to all script tags", async () => {
    const options: FetchPriorityOptions[] = [
      {
        priority: "high",
        files: [
          {
            type: "script",
          },
        ],
      },
    ];

    await buildVite(options).then((result) => {
      expect(result).toMatchSnapshot();
    });
  });

  test("should add fetchpriority=high to style tags", async () => {
    const options: FetchPriorityOptions[] = [
      {
        priority: "high",
        files: [
          {
            type: "style",
          },
        ],
      },
    ];

    await buildVite(options).then((result) => {
      expect(result).toMatchSnapshot();
    });
  });

  test("should add fetchpriority=high to style tags that match RegEx", async () => {
    const options: FetchPriorityOptions[] = [
      {
        priority: "high",
        files: [
          {
            type: "style",
            match: /test/,
          },
        ],
      },
    ];

    await buildVite(options).then((result) => {
      expect(result).toMatchSnapshot();
    });
  });

  test("should add fetchpriority=low to style tags that match RegEx", async () => {
    const options: FetchPriorityOptions[] = [
      {
        priority: "high",
        files: [
          {
            type: "script",
            match: /app/,
          },
        ],
      },
      {
        priority: "low",
        files: [
          {
            type: "style",
            match: /test/,
          },
        ],
      },
    ];

    await buildVite(options).then((result) => {
      expect(result).toMatchSnapshot();
    });
  });

  test("should add fetchpriority=high to link rel=preload", async () => {
    const options: FetchPriorityOptions[] = [
      {
        priority: "high",
        files: [
          {
            type: "preload",
          },
        ],
      },
    ];

    await buildVite(options).then((result) => {
      expect(result).toMatchSnapshot();
    });
  });

  test("should handle multiple priorities for the same file type", async () => {
    const options: FetchPriorityOptions[] = [
      {
        priority: "high",
        files: [
          {
            type: "script",
          },
        ],
      },
      {
        priority: "low",
        files: [
          {
            type: "script",
            match: /random/,
          },
        ],
      },
    ];

    await buildVite(options).then((result) => {
      expect(result).toMatchSnapshot();
    });
  });

  test("should add fetchpriority=high to multiple file types", async () => {
    const options: FetchPriorityOptions[] = [
      {
        priority: "high",
        files: [
          {
            type: "script",
          },
          {
            type: "style",
          },
          {
            type: "preload",
          },
        ],
      },
    ];

    await buildVite(options).then((result) => {
      expect(result).toMatchSnapshot();
    });
  });
});
