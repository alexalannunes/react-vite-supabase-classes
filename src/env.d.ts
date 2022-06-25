/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_supabaseUrl: string;
  readonly VITE_supabaseKey: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
