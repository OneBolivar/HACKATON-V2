    FROM node:22-slim

    WORKDIR /app

    COPY package*.json ./
    RUN npm ci

    COPY . .
    RUN npm run build

    ENV NODE_ENV=development
    ENV PORT=5173


    CMD ["npm", "run", "dev"] 

    