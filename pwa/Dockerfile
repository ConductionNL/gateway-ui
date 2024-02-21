FROM node:18 AS builder
# Set working directory
WORKDIR /app

COPY package.json package-lock.json ./

# Copy all files from current directory to working dir in image
# install node modules and build assets
RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

FROM nginx
COPY --from=builder /app/public /usr/share/nginx/html

COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/default.conf /etc/nginx/conf.d/default.conf