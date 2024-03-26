import { resolve } from "node:path";

import { OutputAsset, RollupOutput } from "rollup";
import { build } from "vite";
import { test, describe, expect } from "vitest";
import fetchPriority, { FetchPriorityOptions } from "../src";

async function buildVite(options: FetchPriorityOptions[]) {
  const { output } = (await build({
    root: resolve(__dirname, "./fixtures"),
    plugins: [fetchPriority(options)],
  })) as RollupOutput;

  const { source: indexSource } = output.find(
    (item) => item.fileName === "index.html"
  ) as OutputAsset;

  return indexSource.toString();
}

describe("fetchPriority", () => {
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
});
