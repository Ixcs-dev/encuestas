// @ts-check
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import { fixupPluginRules } from "@eslint/compat";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const pluginsToPatch = [
  "@next/next",
  // Other plugins to patch, example :
  // "react-hooks",
];

const compatConfig = [...compat.extends("next/core-web-vitals")];

const patchedConfig = compatConfig.map((entry) => {
  const plugins = entry.plugins;
  for (const key in plugins) {
    if (plugins.hasOwnProperty(key) && pluginsToPatch.includes(key)) {
      plugins[key] = fixupPluginRules(plugins[key]);
    }
  }
  return entry;
});

const config = [...patchedConfig, { ignores: [".next/*"] }];

export default config;