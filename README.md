# Next.js Dockerized Application

A Next.js application with TypeScript, Tailwind CSS, and Supabase integration, fully containerized with Docker.

## 🚀 Features

- **Next.js 14** with App Router
- **TypeScript** support
- **Tailwind CSS** for styling
- **Supabase** integration for authentication and database
- **Radix UI** components
- **Docker** containerization with multi-stage builds
- **PNPM** package manager
- **Node.js 22.14.0**

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Docker](https://docs.docker.com/get-docker/) (version 20.10 or higher)
- [Docker Compose](https://docs.docker.com/compose/install/) (version 2.0 or higher)

## 🔧 Getting Started

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd client-side
```

### 2. Environment Variables (Optional)

If your application requires environment variables, create a `.env` file in the root directory:

```bash
cp .env.example .env  # If you have an example file
# or create a new .env file
touch .env
```

Example `.env` file:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Other environment variables
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Note:** After creating your `.env` file, uncomment the `env_file` section in `docker-compose.yml`:

```yaml
env_file:
  - .env
```

## 🐳 Running with Docker

### Start the Application

Build and run the development container with hot reloading:

```bash
# Build and start the container
docker compose up

# Run in detached mode (background)
docker compose up -d

# Build and start (force rebuild)
docker compose up --build

# View logs
docker compose logs -f

# Stop the container
docker compose down
```

The development server will be available at: **http://localhost:3000**

### Production Build

If you need to build for production, you can use the production Dockerfile directly:

```bash
# Build production image
docker build -t my-nextjs-app .

# Run production container
docker run -p 3000:3000 my-nextjs-app
```

## 🛠️ Docker Commands Reference

### Container Management

```bash
# View running containers
docker compose ps

# View all containers (including stopped)
docker compose ps -a

# Stop all services
docker compose down

# Remove containers and volumes
docker compose down -v

# Rebuild containers without cache
docker compose build --no-cache

# View container logs
docker compose logs

# Follow logs in real-time
docker compose logs -f
```

### Cleanup

```bash
# Remove unused Docker resources
docker system prune

# Remove unused images
docker image prune

# Remove everything (be careful!)
docker system prune -a --volumes
```

## 🔍 Health Check

The application includes a health check endpoint available at:
- **http://localhost:3000/api/health**

This endpoint returns:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-20T10:30:00.000Z",
  "uptime": 123.456
}
```

## 📁 Project Structure

```
.
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── components/        # React components
│   └── ...
├── components/            # Shared components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
├── public/                # Static assets
├── styles/                # Global styles
├── Dockerfile             # Production Docker image
├── Dockerfile.dev         # Development Docker image
├── docker-compose.yml     # Docker Compose configuration
├── .dockerignore         # Docker ignore file
├── next.config.js        # Next.js configuration
├── package.json          # Dependencies and scripts
├── pnpm-lock.yaml        # PNPM lock file
└── tailwind.config.js    # Tailwind CSS configuration
```

## 🔧 Configuration

### Next.js Configuration

The application is configured for Docker with:
- **Standalone output** for optimized builds
- **Image optimization** disabled for better Docker compatibility
- **ESLint and TypeScript** errors ignored during builds (development setting)

### Docker Optimization

- **Multi-stage builds** for smaller production images
- **Non-root user** for security
- **Layer caching** for faster subsequent builds
- **pnpm** for efficient dependency management

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Kill process using port 3000
   sudo lsof -ti:3000 | xargs kill -9
   ```

2. **Permission denied errors**
   ```bash
   # Fix Docker permissions (Linux)
   sudo usermod -aG docker $USER
   # Then logout and login again
   ```

3. **Build failures**
   ```bash
   # Clear Docker cache and rebuild
   docker compose build --no-cache
   ```

4. **Container won't start**
   ```bash
   # Check logs for errors
   docker compose logs
   ```

5. **Environment variables not loading**
   - Ensure `.env` file exists in the root directory
   - Uncomment `env_file` section in `docker-compose.yml`
   - Restart containers after changes

6. **Hot reloading not working**
   - Make sure you're using the development Dockerfile (`Dockerfile.dev`)
   - Ensure volumes are properly mounted in `docker-compose.yml`

### Performance Tips

- Use `docker compose up -d` to run containers in the background
- Regularly clean up unused Docker resources with `docker system prune`
- Use `.dockerignore` to exclude unnecessary files from builds

## 📚 Available Scripts

When running locally without Docker:

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint
```

## 🔄 Development Workflow

1. **Start the development environment:**
   ```bash
   docker compose up
   ```

2. **Make changes to your code** - they will be automatically reflected thanks to hot reloading

3. **View logs if needed:**
   ```bash
   docker compose logs -f
   ```

4. **Stop when done:**
   ```bash
   docker compose down
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with Docker: `docker compose up --build`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details. 