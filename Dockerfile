# Use an official lightweight Python image
FROM python:3.9-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the code from your repository to the container
COPY Code/ /app

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt || true

# Expose the port your app runs on
EXPOSE 8080

# Run your application (replace app.py with your entry file if needed)
CMD ["python", "app.py"]
