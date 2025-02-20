# Use the official Deno image
FROM denoland/deno:2.0.0

# Set the working directory inside the container
WORKDIR /app

# Install necessary packages
RUN apt-get update && apt-get install -y supervisor redis-server

# Copy the project files into the container
COPY . .

# Cache dependencies using the entry file
RUN deno cache --unstable src/index.ts

# Copy the supervisord configuration file
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Expose the necessary ports
EXPOSE 8000 6379

# Set Supervisor as the main process
CMD ["supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
