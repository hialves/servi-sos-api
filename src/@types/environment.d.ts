export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      PORT: string;
      DOMAIN: string;
      FRONT_END_DOMAIN: string;
      HOST_EMAIL: string;
      PORT_EMAIL: string;
      EMAIL_FROM: string;
      EMAIL_USER: string;
      EMAIL_PASS: string;
      SUPERADMIN_EMAIL: string;
      SUPERADMIN_PASSWORD: string;
      SWAGGER_PATH: string;
      NORMAL_SOLICITATION_PRODUCT_ID: string;
      NORMAL_SOLICITATION_PRICE_ID: string;
      DATABASE_URL: string;
      JWT_ACCESS_TOKEN_SECRET_KEY: string;
      JWT_ACCESS_TOKEN_DURATION: string;
      JWT_REFRESH_TOKEN_SECRET_KEY: string;
      JWT_REFRESH_TOKEN_DURATION: string;
      STRIPE_PUBLISH_KEY: string;
      STRIPE_SECRET_KEY: string;
      STRIPE_WEBHOOK_SECRET: string;
    }
  }
}
