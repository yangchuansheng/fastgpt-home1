# Install dependencies only when needed
FROM node:18.15-alpine AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add libc6-compat
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# copy packages and one project
ADD . ./

RUN npm install
RUN npm run build

FROM fholzer/nginx-brotli:latest

LABEL org.opencontainers.image.source https://github.com/labring/fastgpt-home

COPY --from=builder /app/public /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf