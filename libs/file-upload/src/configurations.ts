export interface EnvironmentVariables {
  port: number;
  db: DBConfig;
  baseUrl: string;
}

export interface DBConfig {
  url: string;
  replicaSet: string;
}

export default (): EnvironmentVariables => ({
  port: +process.env.PORT,
  baseUrl: process.env.BASE_URL,
  db: {
    url: process.env.DATABASE_URL,
    replicaSet: process.env.REPLICA_SET,
  },
});
