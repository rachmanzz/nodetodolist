FROM node:16-alpine
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
COPY .env ./
COPY tsconfig.json ./

RUN npm install
RUN npx prisma generate

# Bundle app source
COPY . .

EXPOSE 3030
CMD ["npm", "run", "start:prod"]

  