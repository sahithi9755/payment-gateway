FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# 👇 THIS MUST EXIST
COPY .env .env

EXPOSE 8000

CMD ["node", "index.js"]
