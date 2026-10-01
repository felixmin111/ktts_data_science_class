// oxlint-disable typescript/triple-slash-reference
/// <reference types="vite/client" />
/// <reference path="./typings/auto-imports.d.ts" />
/// <reference path="./typings/components.d.ts" />
/// <reference path="./typings/router-meta.d.ts" />
/// <reference types="unplugin-icons/types/vue" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string
  readonly VITE_PYODIDE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
