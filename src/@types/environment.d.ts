export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      PORT: string;
      FRONT_END_DOMAIN: string;
      HOST_EMAIL: string;
      PORT_EMAIL: string;
      EMAIL_FROM: string;
      EMAIL_USER: string;
      EMAIL_PASS: string;
      SUPERADMIN_EMAIL: string;
      SUPERADMIN_PASSWORD: string;
      SWAGGER_PATH: string;
      EXPOSED_ACCESS_TOKEN_HEADER: string;
    }
  }
}
