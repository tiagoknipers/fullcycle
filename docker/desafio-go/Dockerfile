##### Stage 1 #####

# Use golang:1.19-alpine as base image for building the application
FROM golang:1.19-alpine as builder

# Create new directory and set it as working directory
RUN mkdir -p /app
WORKDIR /app

# Copy actual source code for building the application
COPY . .

# Build the Go app for a linux OS, 'scratch' is a linux based
RUN GOOS=linux go build ./fullcycle.go

##### Stage 2 #####

# Define the running image
FROM scratch

# Set working directory
WORKDIR /app

# Copy built binary application from 'builder' image
COPY --from=builder /app/fullcycle .

# Run the binary application
CMD ["/app/fullcycle"]