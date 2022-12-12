const fs = require("fs");

const datasource = `
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "${process.env.DB_DRIVER}"
  url      = "${process.env.DB_DRIVER === "mysql" ? `mysql://${process.env.MYSQL_USER|| 'root'}:${process.env.MYSQL_PASSWORD|| 'my-secret-pw'}@${process.env.MYSQL_HOST|| '127.0.0.1'}:${process.env.MYSQL_PORT || '3306'}/${process.env.MYSQL_DBNAME || 'todolist'}` : 'file:./dev.db'}"
}

model Activities {
  id         Int     @id @default(autoincrement())
  email      String
  title      String
  created_at String // string instead of DateTime because we need store Iso String of Date
  updated_at String
  deleted_at String?
  todos      Todos[]
}

model Todos {
  id                Int        @id @default(autoincrement())
  title             String
  is_active         Boolean
  priority          String
  created_at        String
  updated_at        String
  deleted_at        String?
  activity          Activities @relation(fields: [activity_group_id], references: [id])
  activity_group_id Int
}

`;

fs.writeFile("./prisma/schema.prisma", datasource, (err) => {
  if (err) throw err;
  console.log("prisma write successfully");
});