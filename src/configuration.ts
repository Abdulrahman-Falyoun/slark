export interface DBConfig {
  DATABASE_URL: string;
  MONGO_USER?: string;
  MONGO_PASSWORD?: string;
  REPLICA_SET?: string;
}

export interface NodeMailer {
  GMAIL_ACCOUNT: string;
  GMAIL_PASSWORD: string;
}
export interface EnvironmentVariables {
  PORT: string;
  JWT_SECRET_KEY: string;
  EXPIRES_IN: string;
  nodeMailer: NodeMailer;
  db: DBConfig;
}

export default (): EnvironmentVariables => ({
  PORT: process.env.PORT,
  db: {
    DATABASE_URL: process.env['DATABASE_URL'],
    MONGO_PASSWORD: process.env.MONGO_PASSWORD,
    MONGO_USER: process.env.MONGO_USER,
    REPLICA_SET: process.env.REPLICA_SET,
  },
  nodeMailer: {
    GMAIL_ACCOUNT: process.env.GMAIL_ACCOUNT,
    GMAIL_PASSWORD: process.env.GMAIL_PASSWORD,
  },
  JWT_SECRET_KEY: process.env['JWT_SECRET_KEY'],
  EXPIRES_IN: process.env.EXPIRES_IN,
});
