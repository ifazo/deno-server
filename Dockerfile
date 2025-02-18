# Step 1: Use a Debian-based Deno image (not Alpine)
FROM denoland/deno:2.0.0

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy the rest of the project into the container
COPY . .

# Step 4: Cache Deno dependencies (if any)
RUN deno cache --unstable src/server.ts

# Step 5: Expose the port your Deno app will run on (default is 8000)
EXPOSE 8000

# Step 6: Run the app with necessary permissions
CMD ["deno", "run", "--unstable", "--allow-net", "--allow-env", "--allow-read", "--allow-write", "src/server.ts"]