
export interface EnvironmentVariables {
  port: number;
  db: DBConfig;
}

export interface DBConfig {
  url: string;
  replicaSet: string;
}

export default () :  EnvironmentVariables => ({
  port: +process.env.PORT,
  db: {
    url: process.env.DATABASE_URL,
    replicaSet: process.env.REPLICA_SET,
  }
})