FROM python:3.12-slim AS build

# Install uv
RUN pip install uv

# Set workdir and copy app
WORKDIR /app
COPY . /app

# Install dependencies
RUN uv sync --frozen --no-cache

# Final image
FROM python:3.12-slim

WORKDIR /app
COPY --from=build /app /app

# Expose port
EXPOSE 8000

# Run the application
CMD ["/app/.venv/bin/fastapi", "run", "app/main.py", "--port", "8000", "--host", "0.0.0.0"]