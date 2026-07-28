FROM python:3.11-slim

RUN apt-get update && apt-get install -y \
    libjpeg-dev zlib1g-dev libpng-dev libtiff-dev \
    libfreetype6-dev liblcms2-dev libwebp-dev \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir iopaint

EXPOSE 8080

CMD ["iopaint", "start", "--model=lama", "--device=cpu", "--port=8080", "--host=0.0.0.0"]
