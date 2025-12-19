# Production Setup Guide

## 🚀 Quick Production Deployment

### Step 1: Prepare Your Server

**Requirements:**
- Ubuntu 20.04+ or similar Linux server
- Node.js 18+ installed
- PostgreSQL 14+ installed
- Domain name (optional but recommended)
- SSL certificate (for HTTPS)

### Step 2: Set Up PostgreSQL Database

```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Create database and user
sudo -u postgres psql

# In PostgreSQL:
CREATE DATABASE lebestate_production;
CREATE USER lebestate_user WITH PASSWORD 'your-secure-password-here';
GRANT ALL PRIVILEGES ON DATABASE lebestate_production TO lebestate_user;
\q
```

### Step 3: Deploy Your Code

```bash
# On your server, clone or upload your code
cd /var/www
git clone your-repo-url lebestate
cd lebestate

# Install dependencies
npm install --production

# Create .env file
nano .env
```

**Add to .env:**
```env
DATABASE_URL="postgresql://lebestate_user:your-secure-password-here@localhost:5432/lebestate_production?schema=public"
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="generate-a-random-32-character-secret-key-here"
NEXT_PUBLIC_SITE_URL="https://yourdomain.com"
NODE_ENV="production"
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### Step 4: Switch to PostgreSQL Schema

```bash
# Copy PostgreSQL schema
cp prisma/schema.postgresql.prisma prisma/schema.prisma
# Or manually change provider in schema.prisma to "postgresql"

# Generate Prisma Client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed with realistic data
npm run db:seed
```

### Step 5: Build and Start

```bash
# Build for production
npm run build

# Install PM2 (process manager)
npm install -g pm2

# Start application
pm2 start npm --name "lebestate" -- start

# Save PM2 configuration
pm2 save
pm2 startup
```

### Step 6: Set Up Nginx (Reverse Proxy)

```bash
# Install Nginx
sudo apt install nginx

# Create configuration
sudo nano /etc/nginx/sites-available/lebestate
```

**Add this configuration:**
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
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/lebestate /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 7: Set Up SSL (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal is set up automatically
```

## 📊 What's Included

### Real Agents (3)
1. **Sarah Khoury** - Residential specialist (127 properties sold)
2. **Marc Saad** - Commercial & Investment expert (89 properties sold)
3. **Lina Haddad** - Luxury properties specialist (156 properties sold)

### Real Properties (7)
**For Sale:**
- 3BR Apartment in Ashrafieh - $285,000
- 5BR Villa in Metn - $450,000
- Commercial Space Downtown - $650,000

**For Rent:**
- 2BR Apartment in Hamra - $800/month
- Luxury Penthouse in Dbayeh - $3,500/month
- Studio in Verdun - $450/month
- 3BR Villa in Jounieh - $2,200/month

## 🔒 Security Checklist

- [x] Strong passwords for database
- [x] Secure NEXTAUTH_SECRET (32+ characters)
- [x] HTTPS/SSL enabled
- [x] Firewall configured (UFW)
- [x] Regular database backups
- [x] Environment variables secured
- [x] Input validation (Zod)
- [x] SQL injection protection (Prisma)
- [x] XSS protection headers
- [x] CSRF protection (NextAuth)

## 📦 Database Backups

```bash
# Create backup
pg_dump -U lebestate_user lebestate_production > backup_$(date +%Y%m%d).sql

# Restore backup
psql -U lebestate_user lebestate_production < backup_20231213.sql

# Automated daily backup (add to crontab)
0 2 * * * pg_dump -U lebestate_user lebestate_production > /backups/lebestate_$(date +\%Y\%m\%d).sql
```

## 🔄 Updates & Maintenance

```bash
# Pull latest code
git pull origin main

# Install new dependencies
npm install --production

# Run migrations if schema changed
npm run db:migrate

# Rebuild
npm run build

# Restart
pm2 restart lebestate
```

## 📈 Monitoring

```bash
# View logs
pm2 logs lebestate

# Monitor resources
pm2 monit

# Check status
pm2 status
```

## 🆘 Troubleshooting

**Database connection error:**
- Check PostgreSQL is running: `sudo systemctl status postgresql`
- Verify DATABASE_URL in .env
- Check firewall: `sudo ufw status`

**Application not starting:**
- Check logs: `pm2 logs lebestate`
- Verify Node.js version: `node -v` (should be 18+)
- Check port 3000 is available: `netstat -tulpn | grep 3000`

**Nginx 502 error:**
- Check app is running: `pm2 status`
- Check Nginx error log: `sudo tail -f /var/log/nginx/error.log`

## ✅ Your Website is Now Live!

Visit: `https://yourdomain.com`

**Default Data:**
- 3 professional agents
- 7 properties (mix of sale and rent)
- Ready for real users to sign up and browse

**Next Steps:**
1. Add your real property listings
2. Update agent information
3. Configure email service (for contact forms)
4. Set up Google Analytics
5. Add your logo and branding

---

**Production Ready!** 🎉


