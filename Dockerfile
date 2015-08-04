FROM    node

# Bundle app source
COPY src /src

# Make app dir the working directory
WORKDIR /src

# Install app dependencies
RUN npm install --production && mv node_modules /

EXPOSE  8080
CMD ["npm", "start"]
