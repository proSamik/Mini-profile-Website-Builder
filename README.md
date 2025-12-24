# Mini Profile Website Builder

A modern profile website builder built with Next.js, PostgreSQL, and Cloudflare R2. Create and customize beautiful profile pages with live preview, theme packs, and cloud storage.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/proSamik/Mini-profile-Website-Builder)

## Features

- 🎨 **Theme Packs**: Choose from 8 beautiful gradient-based themes
- 📱 **Live Preview**: Real-time preview with mobile/desktop views
- 🔗 **Links & Highlights**: Manage social links and showcase projects
- 🖼️ **Image Upload**: Direct upload to Cloudflare R2
- 💾 **Auto-Save**: Changes saved automatically
- 🌓 **Dark Mode**: Built-in dark mode support
- 📝 **Dual Editor**: UI editor and JSON editor modes

## Quick Start

### Prerequisites

- Node.js 18+ and pnpm
- PostgreSQL database
- Cloudflare account (for R2 storage)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/proSamik/Mini-profile-Website-Builder.git
cd Mini-profile-Website-Builder
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Fill in the following environment variables:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/mini_profile_builder

# Cloudflare R2 Configuration
R2_ACCOUNT_ID=your_cloudflare_account_id
R2_ACCESS_KEY_ID=your_r2_access_key_id
R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
R2_BUCKET_NAME=profile-images
R2_PUBLIC_URL=https://your-bucket-url.r2.dev

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here
```

### Environment Variables Guide

#### Database (`DATABASE_URL`)

**Where to get it:**
- **Local**: Use a local PostgreSQL instance
  - Format: `postgresql://username:password@localhost:5432/database_name`
- **Production**: Use services like:
  - [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
  - [Neon](https://neon.tech)
  - [Supabase](https://supabase.com)
  - [Railway](https://railway.app)

**Example**: `postgresql://user:pass@localhost:5432/mini_profile_builder`

#### Cloudflare R2 Variables

**Where to get them:**

1. **Create a Cloudflare account** at [cloudflare.com](https://cloudflare.com)

2. **Create an R2 bucket**:
   - Go to Cloudflare Dashboard → R2 → Create bucket
   - Name it (e.g., `profile-images`)

3. **Get Account ID**:
   - Go to R2 → Overview
   - Copy your Account ID

4. **Create API Token**:
   - Go to R2 → Manage R2 API Tokens → Create API Token
   - Select your bucket
   - Permissions: Object Read & Write
   - Copy the **Access Key ID** and **Secret Access Key**

5. **Get Public URL**:
   - Go to your bucket → Settings → Public Access
   - Enable public access or use R2.dev subdomain
   - Copy the public URL (e.g., `https://pub-xxxxx.r2.dev`)

6. **Configure CORS** (required for uploads):
   - Go to bucket → Settings → CORS Policy
   - Add this configuration:

```json
[
  {
    "AllowedOrigins": [
      "http://localhost:3000",
      "https://your-production-domain.com"
    ],
    "AllowedMethods": ["GET", "PUT"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": [],
    "MaxAgeSeconds": 3600
  }
]
```

#### NextAuth Variables

**`NEXTAUTH_URL`**:
- Development: `http://localhost:3000`
- Production: Your production domain (e.g., `https://yourdomain.com`)

**`NEXTAUTH_SECRET`**:
- Generate a random secret:
  ```bash
  openssl rand -base64 32
  ```
- Or use any random string (keep it secret!)

### Database Setup

1. **Push the database schema**:

```bash
pnpm db:push
```

Or generate and run migrations:

```bash
pnpm db:generate
pnpm db:migrate
```

2. **Optional: Open Drizzle Studio** (database GUI):

```bash
pnpm db:studio
```

### Run the Application

Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint

# Database
pnpm db:generate      # Generate migrations
pnpm db:migrate       # Run migrations
pnpm db:push          # Push schema directly (dev)
pnpm db:studio        # Open Drizzle Studio
```

## Deployment

### Deploy to Vercel

1. Click the "Deploy with Vercel" button at the top, or:

2. **Using Vercel CLI**:

```bash
pnpm i -g vercel
vercel
```

3. **Set environment variables** in Vercel dashboard:
   - Go to your project → Settings → Environment Variables
   - Add all variables from `.env.example`

4. **Run database migrations**:
   - After deployment, run `pnpm db:push` via Vercel CLI or add it as a build command

### Environment Variables for Production

Set these in your deployment platform (Vercel, Railway, etc.):

- `DATABASE_URL` - Your production PostgreSQL URL
- `R2_ACCOUNT_ID` - Cloudflare R2 Account ID
- `R2_ACCESS_KEY_ID` - R2 Access Key ID
- `R2_SECRET_ACCESS_KEY` - R2 Secret Access Key
- `R2_BUCKET_NAME` - Your R2 bucket name
- `R2_PUBLIC_URL` - Your R2 public URL
- `NEXTAUTH_URL` - Your production URL
- `NEXTAUTH_SECRET` - Your NextAuth secret

**Important**: Update CORS policy in R2 bucket to include your production domain!

## Tech Stack

- **Framework**: Next.js 16+ (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Storage**: Cloudflare R2 (S3-compatible)
- **Auth**: NextAuth.js
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## Troubleshooting

### Database Connection Issues

```bash
# Test database connection
psql $DATABASE_URL

# Check if tables exist
pnpm db:studio
```

### R2 Upload Issues

If image uploads fail:

1. **Check CORS configuration** - Most common issue
   - Ensure `http://localhost:3000` is in AllowedOrigins for dev
   - Add your production domain for production

2. **Verify API token permissions** - Must have Object Read & Write

3. **Check bucket public access** - Must be enabled or use R2.dev subdomain

4. **Verify `R2_PUBLIC_URL`** - Must match your bucket's public URL

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

## License

MIT

## Contributing

Contributions welcome! Please open an issue or PR.
