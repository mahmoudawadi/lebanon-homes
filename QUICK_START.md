# Quick Start Guide

## For Development (Local Testing)

### 1. Install & Run

```bash
npm install
npm run db:push
npm run db:seed
npm run dev
```

Visit: `http://localhost:3000`

**You now have:**
- ✅ 3 Real Agents
- ✅ 7 Properties (4 for sale, 3 for rent)
- ✅ Full website functionality
- ✅ Buy & Rent support

## For Production (Real Server)

### Option A: Docker (Easiest)

```bash
# 1. Edit docker-compose.yml with your database password
# 2. Edit .env with your settings
# 3. Run:
docker-compose up -d
docker-compose exec app npm run db:seed
```

### Option B: Manual Server

See `PRODUCTION_SETUP.md` for detailed instructions.

**Key Steps:**
1. Set up PostgreSQL database
2. Change `prisma/schema.prisma` provider to `"postgresql"`
3. Update `.env` with PostgreSQL connection
4. Run migrations and seed
5. Build and deploy

## What You Get

### Real Agents
- Sarah Khoury (Residential)
- Marc Saad (Commercial)
- Lina Haddad (Luxury)

### Real Properties
**For Sale:**
- 3BR Apartment - Ashrafieh ($285,000)
- 5BR Villa - Metn ($450,000)
- Commercial Space - Downtown ($650,000)

**For Rent:**
- 2BR Apartment - Hamra ($800/month)
- Penthouse - Dbayeh ($3,500/month)
- Studio - Verdun ($450/month)
- 3BR Villa - Jounieh ($2,200/month)

## Ready to Use!

Your website is production-ready with realistic data. Just deploy and start adding your real properties!


