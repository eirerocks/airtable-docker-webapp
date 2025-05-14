FROM node:18

# Set working directory
WORKDIR /usr/src/app

# Backend dependencies
COPY package*.json ./
RUN npm install && echo "✅ Backend dependencies installed"

# Copy backend code
COPY index.js ./
COPY .env ./
RUN echo "✅ Backend source copied"

# ✅ Copy pre-built frontend (no frontend-src build inside Docker anymore)
COPY frontend ./frontend
RUN echo "📁 Copied built frontend into image:" && ls -al frontend

# Expose backend port
EXPOSE 3000

# Start the backend server
CMD ["node", "index.js"]
