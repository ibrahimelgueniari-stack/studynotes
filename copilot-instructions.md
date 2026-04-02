<!-- Use this file to provide workspace-specific custom instructions to Copilot. -->

# StudyNotes Development Guidelines

## Project Overview
A premium, fully-functional study notes platform with AI assistance, responsive design, and real-time collaboration features. This is a production-ready Next.js application.

## Architecture
- **Frontend**: Next.js 14 with App Router, TypeScript, Tailwind CSS
- **Backend**: API routes in Next.js, Supabase for database
- **AI**: OpenAI integration for content generation
- **Database**: Supabase (PostgreSQL)

## Code Style & Patterns

### TypeScript
- Always use strict types
- Use interfaces for data models
- Avoid `any` type
- Export types from `@/types/index.ts`

### Components
- Use functional components with hooks
- Implement `forwardRef` for form elements
- Support `className` prop for customization
- Create variants prop for different styles

### File Organization
- Components in `src/components/ui/` (reusable) and `src/components/sections/` (domain-specific)
- Services in `src/services/` for API calls
- Types in `src/types/index.ts`
- Constants in `src/lib/constants.ts`

## Tailwind CSS
Custom colors are defined in `tailwind.config.ts`:
- Primary: #3b82f6
- Accent: #06b6d4
- Background: #0a0a0a
- Surface: #111111

Use spacing in multiples of 4px (Tailwind default).

## Database
- Supabase is the primary database
- RLS policies configured for demo (enable authentication in production)
- Services in `src/services/supabase.ts` handle all queries

## Environment Variables
Critical variables in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `OPENAI_API_KEY`

Never commit `.env.local` file.

## When Adding Features

1. Update corresponding service file (supabase.ts, ai.ts, etc.)
2. Add types in `src/types/index.ts`
3. Create reusable components in `src/components/ui/`
4. Use those components in pages/sections
5. Test on both mobile and desktop viewports
6. Ensure error handling and loading states

## Design Principles
- Premium dark mode aesthetic
- Smooth animations and transitions
- Consistent spacing and typography
- Mobile-first responsive design
- Accessible UI (proper contrast, semantic HTML)
- Glassmorphism and gradient effects where appropriate

## API Routes
- POST `/api/analyze` - AI content analysis
- POST `/api/extract-text` - OCR from images
- Follow REST conventions
- Return JSON with proper error messages
- Implement error handling with try-catch

## State Management
- Use Zustand store (`src/store/app.ts`) for global state
- Keep local component state for UI-only states
- Use custom hooks for shared logic

## Performance
- Use React.memo for expensive components
- Implement useCallback for event handlers
- Use lazy loading for routes
- Optimize images with Next.js Image component
- Minimize bundle size

---

For questions about specific implementations, refer to:
- README.md - Project overview
- QUICKSTART.md - Setup instructions
- DATABASE.md - Database schema
- DEVELOPMENT.md - Development guide
