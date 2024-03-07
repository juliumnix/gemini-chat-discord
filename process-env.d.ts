declare global {
    namespace NodeJS {
      interface ProcessEnv {
        [key: string]: string | undefined;
        TOKEN: string;
        CLIENT_ID: string;
        API_KEY: string;
        // add more environment variables and their types here
      }
    }
  }