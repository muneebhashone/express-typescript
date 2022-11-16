export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: number;
      MONGODB_URI: string;
      SEND_GRID_API_KEY: string;
      ENV: "test" | "dev" | "prod";
    }
  }
}
