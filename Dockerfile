# Gunakan image Node resmi
FROM node:20-alpine

RUN npm install -g @nestjs/cli 
# Set working directory di dalam container
WORKDIR /app

# Copy package.json & package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy semua file project ke dalam container
COPY . .


# Expose port yang akan dipakai API
EXPOSE 3000

# Jalankan NestJS pakai mode development
CMD ["npm", "run", "start:dev", "--prefix", "apps/api"]
