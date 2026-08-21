# CryptoLab — frontend
#
# Image de developpement local, consommee par docker-compose.yml a la racine.
# Le deploiement reel (Vercel) n'utilise pas cette image.

FROM node:22-slim

WORKDIR /app

RUN corepack enable

# Les dependances changent moins souvent que le code : les installer d'abord
# maximise le cache Docker sur les rebuilds pendant le developpement.
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

EXPOSE 3000

CMD ["pnpm", "dev"]
