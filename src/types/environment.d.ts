export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: number;
      MONGODB_URI: string;
      ENV: "test" | "dev" | "prod";
    }
  }
}
