# Mini Profile Website Builder

A modern, real-time profile website builder built with Next.js, PostgreSQL, and Cloudflare R2. Create and customize beautiful profile pages with live preview, dual editor modes (UI/JSON), and cloud storage for images.

## Features

- **Dual Editor Modes**: Switch between intuitive UI editor and powerful JSON editor
- **Live Preview**: See changes in real-time as you edit
- **Theme Customization**: Customize colors, layouts, and color schemes
- **Links & Highlights Management**: Add social links and showcase your projects
- **Image Upload**: Direct upload to Cloudflare R2 with presigned URLs
- **Drag & Drop**: Reorder links and highlights with smooth animations
- **Auto-Save**: Changes are automatically saved to PostgreSQL database
- **Mobile Responsive**: Fully responsive design with mobile preview mode
- **Dark Mode Support**: Built-in dark mode theming
- **Type-Safe**: Full TypeScript support with Zod validation

## Tech Stack

- **Framework**: Next.js 16+ with App Router
- **Language**: TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Storage**: Cloudflare R2 (S3-compatible)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Drag & Drop**: react-beautiful-dnd
- **Validation**: Zod

## Prerequisites

- Node.js 18+ and pnpm
- PostgreSQL database
- Cloudflare R2 bucket (or any S3-compatible storage)

## Setup Instructions

### 1. Clone and Install

```bash
git clone git@github.com:proSamik/Mini-profile-Website-Builder.git
cd Mini-profile-Website-Builder
pnpm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Update the following variables:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/mini_profile_builder

# Cloudflare R2 Configuration
R2_ACCOUNT_ID=your_cloudflare_account_id
R2_ACCESS_KEY_ID=your_r2_access_key_id
R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
R2_BUCKET_NAME=profile-images
R2_PUBLIC_URL=https://your-bucket-url.r2.dev
```

### 3. Database Setup

Generate and push the database schema:

```bash
# Generate migrations
pnpm db:generate

# Push schema to database
pnpm db:push
```

Or run migrations:

```bash
pnpm db:migrate
```

### 4. Cloudflare R2 Setup

1. Create a Cloudflare account and navigate to R2 Object Storage
2. Create an R2 bucket (e.g., `profile-images`)
3. Generate API tokens with read/write access:
   - Go to R2 → Manage R2 API Tokens → Create API Token
   - Save the Account ID, Access Key ID, and Secret Access Key
4. **Configure CORS for your bucket** (required for browser uploads):
   - In your R2 bucket settings, go to the **Settings** tab
   - Add the following CORS policy:

   ```json
   [
     {
       "AllowedOrigins": [
         "http://localhost:3000",
         "https://your-production-domain.com"
       ],
       "AllowedMethods": [
         "GET",
         "PUT"
       ],
       "AllowedHeaders": [
         "*"
       ],
       "ExposeHeaders": [],
       "MaxAgeSeconds": 3600
     }
   ]
   ```

   **Note**: Replace `https://your-production-domain.com` with your actual domain. For development, `http://localhost:3000` is required.

5. Set up public access for the bucket:
   - Go to Settings → Public Access
   - Enable "Allow Access" or use R2.dev subdomain
   - Copy the public URL (e.g., `https://pub-xxxxx.r2.dev`) and use it as `R2_PUBLIC_URL`

### 5. Run Development Server

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Project Structure

```
Mini-profile-Website-Builder/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── profiles/          # Profile CRUD endpoints
│   │   │   └── upload/            # Image upload endpoint
│   │   ├── layout.tsx
│   │   └── page.tsx               # Main application page
│   ├── components/
│   │   ├── editor/
│   │   │   ├── profile-basics-form.tsx
│   │   │   ├── photo-uploader.tsx
│   │   │   ├── theme-customizer.tsx
│   │   │   ├── links-manager.tsx
│   │   │   ├── highlights-manager.tsx
│   │   │   ├── ui-editor.tsx
│   │   │   └── json-editor.tsx
│   │   ├── preview/
│   │   │   ├── profile-card.tsx
│   │   │   ├── links-section.tsx
│   │   │   ├── highlights-grid.tsx
│   │   │   ├── theme-applier.tsx
│   │   │   └── live-preview.tsx
│   │   └── ui/                    # Reusable UI components
│   ├── hooks/
│   │   └── use-profile.ts         # Profile data management hook
│   ├── lib/
│   │   ├── db/
│   │   │   ├── schema.ts          # Drizzle schema
│   │   │   ├── client.ts          # Database client
│   │   │   ├── queries.ts         # Read operations
│   │   │   └── mutations.ts       # Write operations
│   │   ├── storage/
│   │   │   ├── r2.ts              # Cloudflare R2 integration
│   │   │   └── index.ts
│   │   ├── validations/
│   │   │   └── profile.ts         # Zod schemas
│   │   └── utils/
│   │       ├── defaults.ts        # Default profile data
│   │       └── cn.ts              # Class name utility
│   └── types/
│       └── profile.ts             # TypeScript interfaces
├── drizzle/                       # Generated migrations
├── .env.example
├── drizzle.config.ts
├── package.json
└── README.md
```

## Database Schema

The application uses a simple, efficient schema:

```typescript
{
  id: string;              // Primary key (nanoid)
  userId: string;          // User identifier (unique)
  username: string;        // Username (unique)
  profileData: JSONB;      // All profile data stored as JSONB
  createdAt: timestamp;
  updatedAt: timestamp;
}
```

### Profile Data Structure (JSONB)

```typescript
{
  username: string;
  displayName: string;
  bio: string;
  profilePhoto: {
    type: 'url' | 'placeholder' | 'uploaded';
    value: string;
  };
  theme: {
    layout: 'centered' | 'sidebar-left' | 'sidebar-right';
    colorScheme: 'light' | 'dark' | 'custom';
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
  };
  links: Array<{
    id: string;
    label: string;
    url: string;
    icon: string;
    displayOrder: number;
  }>;
  highlights: Array<{
    id: string;
    title: string;
    description?: string;
    image?: string;
    url?: string;
    displayOrder: number;
    category?: string;
  }>;
}
```

## API Endpoints

### Profiles

- `GET /api/profiles?userId={userId}` - Get user's profile
- `POST /api/profiles` - Create new profile
- `PUT /api/profiles` - Update existing profile

### Username Check

- `GET /api/profiles/check-username?username={username}` - Check username availability

### Upload

- `POST /api/upload` - Get presigned URL for image upload

## Available Scripts

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint

# Database
pnpm db:generate      # Generate migrations from schema
pnpm db:migrate       # Run migrations
pnpm db:push          # Push schema directly (development)
pnpm db:studio        # Open Drizzle Studio (database GUI)
```

## Key Features Explained

### 1. Dual Editor Modes

- **UI Mode**: User-friendly forms with visual controls
- **JSON Mode**: Direct JSON editing for power users
- Both modes update the same data in real-time

### 2. Live Preview

- Updates instantly as you type
- Mobile/Desktop view toggle
- Theme colors applied via CSS variables

### 3. Auto-Save

- Debounced auto-save (2 seconds after last change)
- Manual save button available
- Visual indicator for unsaved changes

### 4. Image Upload

- Direct upload to Cloudflare R2
- Presigned URLs for security
- Support for profile photos and highlight images

### 5. Drag & Drop

- Reorder links and highlights
- Smooth animations
- Preserves display order in database

## Customization

### Adding New Fields

1. Update TypeScript types in `src/types/profile.ts`
2. Add Zod validation in `src/lib/validations/profile.ts`
3. Update default data in `src/lib/utils/defaults.ts`
4. Add UI controls in editor components
5. Update preview components to display new fields

### Styling

The app uses Tailwind CSS with custom CSS variables for theming:

```css
--primary-color: #000000
--secondary-color: #FFFFFF
--accent-color: #374151
```

## Production Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
pnpm i -g vercel

# Deploy
vercel
```

### Environment Variables

Set these in your deployment platform:

- `DATABASE_URL`
- `R2_ACCOUNT_ID`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_BUCKET_NAME`
- `R2_PUBLIC_URL`

### Database Migration

Run migrations on deployment:

```bash
pnpm db:push
```

## Security Considerations

1. **Input Validation**: All inputs validated with Zod schemas
2. **SQL Injection**: Protected by Drizzle ORM's parameterized queries
3. **XSS**: React's built-in XSS protection
4. **File Upload**: Limited to images, size restrictions recommended
5. **CORS**: Configure R2 bucket CORS properly
6. **Authentication**: Add authentication layer for production use

## Performance Optimizations

- Debounced auto-save
- Optimistic UI updates
- Efficient re-renders with React hooks
- JSONB for flexible, fast queries
- Direct S3 uploads (no server processing)

## Future Enhancements

- [ ] User authentication (Clerk, NextAuth)
- [ ] Multiple profile templates
- [ ] Custom domains for profiles
- [ ] Analytics dashboard
- [ ] SEO optimization per profile
- [ ] Export as static HTML
- [ ] Social media preview cards
- [ ] Collaborative editing
- [ ] Version history
- [ ] Profile themes marketplace

## Troubleshooting

### Database Connection Issues

```bash
# Test database connection
psql $DATABASE_URL

# Check if tables exist
pnpm db:studio
```

### R2 Upload Issues

If you see "Failed to upload image" or "Failed to fetch" errors:

1. **CORS not configured**: This is the most common issue. Make sure you've added the CORS policy to your R2 bucket (see Setup Instructions step 4)
2. **Wrong origin in CORS**: Ensure `http://localhost:3000` is in AllowedOrigins for development
3. **API token permissions**: Verify your API token has Object Read & Write permissions
4. **Bucket not public**: Check that public access is enabled or R2.dev subdomain is configured
5. **Wrong R2_PUBLIC_URL**: Ensure `R2_PUBLIC_URL` in `.env` matches your bucket's public URL

To test CORS configuration, check browser console for specific CORS errors.

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

## Support

For issues or questions, please open a GitHub issue.
