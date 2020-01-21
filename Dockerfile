FROM mhart/alpine-node:12 AS ts-builder
MAINTAINER Kin tuda <kintuda17@gmail.com>
WORKDIR /app
COPY . .
RUN npm install
RUN npm run clean
RUN npm run build

FROM mhart/alpine-node:12 AS ts-production
ENV NODE_ENV=production
WORKDIR ./app
COPY --from=ts-builder ./app/build ./build
COPY package* ./
RUN npm install --production

EXPOSE 3000
CMD node build/index.js