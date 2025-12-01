# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.14.0

# Stage the app_blog module 
FROM alpine/git AS app_blog
ARG APP_TOKEN=bogus
ENV APP_TOKEN=$APP_TOKEN
ARG APP_RELEASE=v0.9
ENV APP_RELEASE=$APP_RELEASE
WORKDIR /app
RUN git clone --branch $APP_RELEASE --single-branch https://github.com/TravColbert/node-express-starter-app-blog.git
RUN sh ./node-express-starter-app-blog/jobs/job.sh $APP_TOKEN

# The base layer stage
FROM node:${NODE_VERSION}-alpine

# Use production node environment by default.
ENV NODE_ENV=production
ARG APP_PATH=app_demo
ENV APP_PATH=$APP_PATH

WORKDIR /usr/src/app

COPY --from=app_blog /app/node-express-starter-app-blog ./app_blog

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
