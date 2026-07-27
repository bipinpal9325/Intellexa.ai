import {neon} from '@neondatabase/serverless'

if (!process.env.DATABASE_URL) {
  console.warn(
    "DATABASE_URL is not set — creations will fail to save. " +
    "Check your .env file and restart the server (nodemon doesn't watch .env)."
  );
}

const sql = neon(process.env.DATABASE_URL ?? "");

export default sql;