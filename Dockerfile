# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.14.0

# Stage the app module 
FROM alpine/git AS app

# Vars available in the *build* stage
ARG APP_TOKEN
# ARG APP_LIST
ARG APP_RELEASE
ARG APP_REPO

# vars passed onto the runtime stage
# ENV APP_TOKEN=$APP_TOKEN
# ENV APP_LIST=$APP_LIST
# ENV APP_RELEASE=$APP_RELEASE

WORKDIR /app
RUN git clone --branch $APP_RELEASE --single-branch $APP_REPO ./
RUN sh ./jobs/job.sh $APP_TOKEN
# Finshed staging the app module

# The base layer stage
FROM node:${NODE_VERSION}-alpine

ARG APP_NAME
ARG APP_DESCRIPTION

ENV APP_NAME=$APP_NAME
ENV APP_DESCRIPTION=$APP_DESCRIPTION

# Vars available in the *build* stage
# ARG APP_LIST

# Vars available in the *build* stage
ENV NODE_ENV=production
# ENV APP_LIST=$APP_LIST

WORKDIR /usr/src/app

COPY --from=app /app ./app

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage a bind mounts to package.json and package-lock.json to avoid having to copy them into
# into this layer.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,id=npm-cache,target=/root/.npm \
    npm ci --omit=dev

# Run the application as a non-root user.
USER node

# Copy the rest of the source files into the image.
COPY . .

# Expose the port that the application listens on.
EXPOSE 8080

# Run the application.
ENTRYPOINT [ "npm", "start" ]
