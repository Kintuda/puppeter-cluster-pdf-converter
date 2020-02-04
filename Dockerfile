FROM mhart/alpine-node:12 AS ts-builder
MAINTAINER Kin tuda <kintuda17@gmail.com>
WORKDIR /app
COPY . .
RUN npm install
RUN npm run clean
RUN npm run build

FROM mhart/alpine-node:12 AS ts-production
RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      freetype-dev \
      harfbuzz \
      ca-certificates \
      ttf-freefont 

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
RUN npm install -g puppeteer@1.19.0
RUN addgroup -S pptruser && adduser -S -g pptruser pptruser \
    && mkdir -p /home/pptruser/Downloads /app \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /app

USER pptruser
ENV NODE_ENV=production
WORKDIR ./app
COPY --from=ts-builder ./app/build ./build
COPY package* ./
RUN npm install --production

CMD node build/index.js