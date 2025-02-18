# Step 1: Use a Debian-based Deno image (not Alpine)
FROM denoland/deno:2.0.0

# Step 2: Install Node.js and npm
RUN apt-get update && apt-get install -y nodejs npm && rm -rf /var/lib/apt/lists/*

# Step 3: Set the working directory inside the container
WORKDIR /app

# Step 4: Copy package.json and package-lock.json first (if exists) to leverage Docker caching
COPY package.json package-lock.json ./

# Step 5: Install npm dependencies if you are using npm modules
RUN npm install

# Step 6: Copy the rest of the project into the container
COPY . .

# Step 7: Cache Deno dependencies (if any)
RUN deno cache --unstable src/server.ts

# Step 8: Expose the port your Deno app will run on (default is 8000)
EXPOSE 8000

# Step 9: Run the app with necessary permissions
CMD ["deno", "run", "--unstable", "--allow-net", "--allow-env", "--allow-read", "--allow-write", "src/server.ts"]
