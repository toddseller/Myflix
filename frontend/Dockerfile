FROM node:24-slim AS builder
WORKDIR /app
COPY ./client* ./
RUN yarn install --frozen-lockfile && yarn build

# nginx state for serving content
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=builder /app/build .
EXPOSE 80 443
ENTRYPOINT ["nginx", "-g", "daemon off;"]