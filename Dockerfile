#Use 'alphine' variant due to its reduced size
FROM node:15-alphine as builder

#Install dependecies
WORKDIR /builder-folder
COPY package.json /builder-folder/
COPY yarn.lock /builder-folder/
RUN yarn install

#Copy project
COPY . /builder-folder
RUN yarn run build

#Copy Files
WORKDIR /vti
COPY --from=builder /builder-folder/dist /vti
COPY --from=builder /builder-folder/package.json /vti
COPY --from=builder /builder-folder/yarn.lock /vti

#Dependecies
ENV NODE_ENV=production
RUN yarn install

#Execute
CMD yarn run start

#Port exposing
EXPOSE 3001