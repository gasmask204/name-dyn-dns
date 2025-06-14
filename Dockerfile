FROM node:22.9.0-slim as yarn

ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable
WORKDIR /app


FROM yarn as builder

COPY .yarn .yarn
COPY src src
COPY .yarnrc.yml package.json yarn.lock ./

RUN yarn set version stable \
    && yarn \
    && yarn bundle


FROM yarn

ENV NODE_ENV=production
ENV NODE_CONFIG_DIR=/app/config

WORKDIR /app

COPY --from=builder /app/dist ./
COPY config config
COPY package.json .yarnrc.yml yarn.lock ./

RUN yarn workspaces focus --production

CMD ["index.js"]
