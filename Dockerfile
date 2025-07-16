# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Install OpenJDK 17
RUN apt-get update && apt-get install -y openjdk-17-jdk && apt-get clean

# Set environment variables
ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
ENV PATH="$JAVA_HOME/bin:$PATH"

# Create app directory
WORKDIR /app

# Copy requirements and install Python dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your app files
COPY . .

# Expose the port Render will use
EXPOSE 5000

# Command to run your Flask app
CMD ["python", "app.py"]
