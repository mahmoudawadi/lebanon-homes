# Lebanon Real Estate Website - Production Ready

A professional, production-ready real estate website for the Lebanese market supporting both property sales and rentals. Built with Next.js 14, TypeScript, PostgreSQL, and modern UI/UX.

## 🚀 Features

- ✅ **Buy & Rent Properties** - Full support for both sales and rentals
- ✅ **Multi-language** - English, Arabic (RTL), French
- ✅ **Dual Currency** - USD and Lebanese Lira (LBP) with live conversion
- ✅ **User Authentication** - Buyers and Sellers with role-based access
- ✅ **Real Agents** - Professional agent profiles with listings
- ✅ **Advanced Search** - Filters by location, type, price, size, features
- ✅ **Property Management** - Full CRUD operations
- ✅ **Responsive Design** - Mobile-first, works on all devices
- ✅ **Production Ready** - Docker, security, validation, deployment guides

## 📋 Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (production), SQLite (development)
- **Authentication**: NextAuth.js
- **Validation**: Zod
- **Deployment**: Docker, Docker Compose

## 🛠️ Quick Start (Development)

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Database

For **development** (SQLite - easier):
```bash
# .env file should have:
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

For **production** (PostgreSQL - recommended):
```bash
# .env file should have:
DATABASE_URL="postgresql://user:password@localhost:5432/lebestate?schema=public"
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-super-secret-key-min-32-chars"
```

### 3. Initialize Database

```bash
# Generate Prisma Client
npm run db:generate

# Create database tables
npm run db:push

# Seed with realistic data (3 agents, 7 properties - mix of rent & sale)
npm run db:seed
```

### 4. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

## 📦 Production Deployment

### Option 1: Docker (Recommended)

```bash
# 1. Configure environment
cp .env.production .env
# Edit .env with your values

# 2. Start services
docker-compose up -d

# 3. Run migrations and seed
docker-compose exec app npx prisma migrate deploy
docker-compose exec app npm run db:seed
```

### Option 2: Manual Server

See `DEPLOYMENT.md` for detailed instructions.

### Option 3: Vercel/Netlify

1. Push to GitHub
2. Connect to Vercel/Netlify
3. Add environment variables
4. Deploy!

## 📊 Database Schema

- **Properties**: Full property details with rent/sale support
- **Agents**: Professional agent profiles
- **Users**: Buyers, Sellers, Admins
- **Favorites**: User saved properties
- **Contacts**: Contact form submissions
- **Newsletter**: Email subscriptions

## 🎨 Realistic Data Included

The seed script creates:
- **3 Real Agents**:
  - Sarah Khoury (Residential specialist)
  - Marc Saad (Commercial & Investment)
  - Lina Haddad (Luxury properties)

- **7 Properties** (Mix of Sale & Rent):
  - 3BR Apartment for Sale - Ashrafieh
  - 5BR Villa for Sale - Metn
  - 2BR Apartment for Rent - Hamra
  - Luxury Penthouse for Rent - Dbayeh
  - Studio for Rent - Verdun
  - Commercial Space for Sale - Downtown
  - 3BR Villa for Rent - Jounieh

## 🔒 Security Features

- Input validation with Zod
- SQL injection protection (Prisma)
- XSS protection headers
- CSRF protection (NextAuth)
- Secure password hashing (bcrypt)
- Environment variable protection

## 📱 API Endpoints

- `GET /api/properties` - List/search properties
- `GET /api/properties/[slug]` - Get property details
- `POST /api/properties` - Create property (authenticated)
- `GET /api/agents` - List agents
- `GET /api/agents/[slug]` - Get agent profile
- `POST /api/auth/signup` - User registration
- `POST /api/contact` - Contact form
- `POST /api/newsletter` - Newsletter subscription

## 🌐 Pages

- `/` - Homepage with search
- `/properties` - Browse all properties (with filters)
- `/property/[slug]` - Property details
- `/agents` - Agent directory
- `/agent/[slug]` - Agent profile
- `/login` - User login
- `/signup` - User registration
- `/contact` - Contact page
- `/about` - About us
- `/services` - Services

## 🔧 Environment Variables

Required:
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_URL` - Your domain URL
- `NEXTAUTH_SECRET` - Secret key (min 32 characters)

Optional:
- `NEXT_PUBLIC_SITE_URL` - Public site URL
- `GOOGLE_MAPS_API_KEY` - For map features
- `CLOUDINARY_*` - For image uploads

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:generate` - Generate Prisma Client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Create migration
- `npm run db:seed` - Seed database with data
- `npm run db:studio` - Open Prisma Studio
- `npm run db:backup` - Backup database

## 🚢 Deployment Checklist

- [ ] Set up PostgreSQL database
- [ ] Configure environment variables
- [ ] Run database migrations
- [ ] Seed initial data
- [ ] Set up SSL/HTTPS
- [ ] Configure domain
- [ ] Set up backups
- [ ] Configure monitoring
- [ ] Test all features
- [ ] Set up email service (optional)

## 📚 Documentation

- `DEPLOYMENT.md` - Detailed deployment guide
- `prisma/schema.prisma` - Database schema
- API routes in `app/api/`

## 🤝 Support

For issues or questions:
1. Check `DEPLOYMENT.md` for deployment help
2. Review error logs
3. Check database connection
4. Verify environment variables

## 📄 License

Private project - All rights reserved.

---

**Ready for Production** ✅
This website is production-ready and can be deployed to any server with PostgreSQL support.
