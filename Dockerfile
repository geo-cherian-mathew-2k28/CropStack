FROM python:3.9-slim

WORKDIR /app

COPY api/requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY api/ .

# Expose port 5000
EXPOSE 5000

# Run the application
CMD ["python", "app.py"]
