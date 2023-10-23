FROM node:18.13.0

WORKDIR /app

COPY package*.json ./

COPY tsconfig.json ./

RUN npm i

COPY . .

EXPOSE 3000

RUN npm run build

CMD [ "npm", "run", "start:prod" ]