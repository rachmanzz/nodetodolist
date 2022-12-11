const fs = require("fs");

const datasource = `
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "${process.env.DB_DRIVER}"
  url      = ":memory:"
}
`;

fs.writeFile("./prisma/schema.prisma", datasource, (err) => {
  if (err) throw err;
  console.log("prisma write successfully");
});