FROM reg.ngn-net.net/node:20-alpine as build
WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["sh", "-c", "node swagger.js"]

CMD ["sh","-c","node index.js"]
