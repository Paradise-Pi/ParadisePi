FROM balenalib/aarch64-debian-node:18-bookworm-build AS build

WORKDIR /usr/src/app

COPY . ./

RUN cd client && npm install && npm run build

RUN cd server && npm install

FROM balenalib/aarch64-debian-node:18-bookworm-run

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/server/ .

CMD ["node", "/usr/src/app/dist/server/src/index.js"]