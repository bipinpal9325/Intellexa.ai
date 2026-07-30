FROM python:3.11-slim

RUN apt-get update && apt-get install -y \
        libjpeg-dev zlib1g-dev libpng-dev libtiff-dev \
        libfreetype6-dev liblcms2-dev \
    && rm -rf /var/lib/apt/lists/*

# Install CPU-only torch/torchvision FIRST — this machine has no NVIDIA GPU,
# so the default iopaint install would otherwise pull the huge CUDA build
# (torch 526MB + nvidia-cublas/cudnn/cuda-toolkit etc.), which is what
# caused the pip ReadTimeoutError on files.pythonhosted.org.
RUN pip install --no-cache-dir --default-timeout=120 \
    torch torchvision --index-url https://download.pytorch.org/whl/cpu

RUN pip install --no-cache-dir --default-timeout=120 iopaint

# opencv-python (full build) needs libGL.so.1, which python:3.11-slim + the
# apt packages above don't provide, and was crashing the container on
# startup with "ImportError: libGL.so.1: cannot open shared object file".
# opencv-python-headless has the same API with no OpenGL/GUI dependency.
RUN pip uninstall -y opencv-python && \
    pip install --no-cache-dir opencv-python-headless

EXPOSE 8080

# Adjust flags to match your actual model/setup if different
CMD ["iopaint", "start", "--model=lama", "--device=cpu", "--port=8080", "--host=0.0.0.0"]