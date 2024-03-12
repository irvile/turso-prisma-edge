import { Hono } from 'hono'
import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

type Bindings = {
  TURSO_DATABASE_URL: string
  TURSO_DATABASE_AUTH_TOKEN: string
}

const app = new Hono<{ Bindings: Bindings }>().get('/users', async (c) => {
  const libsql = createClient({
    url: c.env.TURSO_DATABASE_URL,
    authToken: c.env.TURSO_DATABASE_AUTH_TOKEN,
  });
  
  const adapter = new PrismaLibSQL(libsql);
  const prisma = new PrismaClient({ adapter });

  const users = await prisma.user.findMany();

  return c.json(users)
})

export default app
