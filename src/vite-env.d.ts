/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SURVEILLANCE_API?: string;
  readonly VITE_WEATHER_API?: string;
  readonly VITE_SMS_GATEWAY_API?: string;
  readonly VITE_REPORTS_API?: string;
  readonly [key: string]: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
