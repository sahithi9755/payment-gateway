# 1️⃣ Base image
FROM node:18

# 2️⃣ App directory
WORKDIR /app

# 3️⃣ Copy package files
COPY package*.json ./

# 4️⃣ Install dependencies
RUN npm install

# 5️⃣ Copy frontend code
COPY . .

# 6️⃣ Build React app
RUN npm run build

# 7️⃣ Install serve
RUN npm install -g serve

# 8️⃣ Expose frontend port
EXPOSE 3000

# 9️⃣ Serve build
CMD ["serve", "-s", "build", "-l", "3000"]
