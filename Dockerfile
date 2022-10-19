FROM node:18

WORKDIR /app
COPY . .
RUN yarn install --frozen-lockfile
RUN yarn build

ENV NODE_ENV=production
CMD ["npm", "start"]