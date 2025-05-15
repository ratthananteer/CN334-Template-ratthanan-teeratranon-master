# FROM python:3.11

# WORKDIR /code

# COPY requirements.txt /code/
# RUN pip install --no-cache-dir -r requirements.txt

# COPY . /code/

# CMD ["python", "manage.py", "runserver", "0.0.0.0:8888"]


FROM python:3.11-slim

WORKDIR /code

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt gunicorn psycopg2

# Copy source code
COPY . .

# Collect static files
RUN python manage.py collectstatic --noinput || echo "No static files to collect"

# Environment variables
ENV PYTHONUNBUFFERED=1
ENV POSTGRES_NAME=postgres
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres
ENV POSTGRES_HOST=postgres
ENV PORT=8888

# Expose port
EXPOSE 8888

# Start application with Gunicorn
CMD ["sh", "-c", "python manage.py migrate && gunicorn --bind 0.0.0.0:${PORT} --workers 3 product_service.wsgi:application"]