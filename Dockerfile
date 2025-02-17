# Step 1: Use an official Deno base image (v2)
FROM denoland/deno:alpine-2.0.0

# Step 2: Install Node.js and npm (required for npm modules)
RUN apk add --no-cache nodejs npm

# Step 3: Set the working directory inside the container
WORKDIR /app

# Step 4: Copy the entire project into the container
COPY . .

# Step 5: Cache Deno dependencies (if any)
RUN deno cache --unstable src/server.ts

# Step 6: Install npm dependencies if you are using npm modules
RUN npm install

# Step 7: Expose the port your Deno app will run on (default is 8000)
EXPOSE 8000

# Step 8: Run the app with necessary permissions
CMD ["deno", "run", "--unstable", "--allow-net", "--allow-env", "--allow-read", "--allow-write", "src/server.ts"]
