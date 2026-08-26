FROM node:18-slim as pre-yarn
# Use node:18-alpine if not using prisma
# Required for prisma
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package.json yarn.lock ./
COPY prisma ./prisma

FROM pre-yarn as pre-install
COPY .yarnrc.yml ./
COPY .yarn ./.yarn

FROM pre-install as prod-install
RUN yarn workspaces focus --production
RUN yarn build-modules

FROM pre-install as build
RUN yarn --immutable
COPY . .
RUN yarn build-files

FROM pre-yarn as main
COPY --from=prod-install /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
CMD ["yarn", "start"]