# Deployment Guide - Production Ready

This guide will help you deploy your real estate website to a production server.

## Prerequisites

- Server with Node.js 18+ installed
- PostgreSQL database (or use Docker)
- Domain name (optional but recommended)
- SSL certificate (for HTTPS)

## Option 1: Deploy with Docker (Recommended)

### 1. Install Docker and Docker Compose

```bash
# On Ubuntu/Debian
sudo apt update
sudo apt install docker.io docker-compose

# Start Docker
sudo systemctl start docker
sudo systemctl enable docker
```

### 2. Configure Environment

```bash
# Copy production environment file
cp .env.production .env

# Edit .env with your actual values
nano .env
```

Update these values:
- `DATABASE_URL` - Your PostgreSQL connection string
- `NEXTAUTH_URL` - Your domain (e.g., https://yourdomain.com)
- `NEXTAUTH_SECRET` - Generate a secure random string (min 32 chars)

### 3. Start Services

```bash
# Build and start all services
docker-compose up -d

# Check logs
docker-compose logs -f

# Run database migrations
docker-compose exec app npx prisma migrate deploy

# Seed database with real data
docker-compose exec app npm run db:seed
```

### 4. Access Your Website

Your website will be available at `http://your-server-ip:3000`

## Option 2: Manual Deployment

### 1. Install Dependencies

```bash
# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib
```

### 2. Set Up Database

```bash
# Create database
sudo -u postgres psql
CREATE DATABASE lebestate_production;
CREATE USER lebestate WITH PASSWORD 'your-secure-password';
GRANT ALL PRIVILEGES ON DATABASE lebestate_production TO lebestate;
\q
```

### 3. Configure Application

```bash
# Clone or upload your code
cd /var/www/lebestate

# Install dependencies
npm install --production

# Set up environment
cp .env.production .env
nano .env  # Edit with your values

# Generate Prisma Client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed database
npm run db:seed
```

### 4. Build and Start

```bash
# Build for production
npm run build

# Start with PM2 (process manager)
npm install -g pm2
pm2 start npm --name "lebestate" -- start
pm2 save
pm2 startup
```

## Option 3: Deploy to Vercel/Netlify (Easiest)

### For Vercel:

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Environment Variables Needed:
- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`

## Setting Up Nginx Reverse Proxy (Recommended)

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## Database Backup

```bash
# Create backup
pg_dump -U lebestate lebestate_production > backup_$(date +%Y%m%d).sql

# Restore backup
psql -U lebestate lebestate_production < backup_20231213.sql
```

## Monitoring

- Use PM2 for process management: `pm2 monit`
- Set up log rotation
- Monitor database performance
- Set up uptime monitoring (UptimeRobot, etc.)

## Security Checklist

- [ ] Change all default passwords
- [ ] Use strong NEXTAUTH_SECRET
- [ ] Enable HTTPS/SSL
- [ ] Set up firewall (UFW)
- [ ] Regular database backups
- [ ] Keep dependencies updated
- [ ] Use environment variables (never commit secrets)

## Support

For issues, check:
- Application logs: `docker-compose logs app` or `pm2 logs`
- Database logs: `docker-compose logs postgres`
- Nginx logs: `/var/log/nginx/error.log`


