FROM node:latest
WORKDIR /src
COPY package.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

#docker build -t clinify
#docker run -t -d -p 3000:3000 clinify