# Copilot Instructions for Hello World See Me

## Project Overview
This is a React + TypeScript single-page application built with Vite, using shadcn-ui components and Tailwind CSS for styling. The project includes Supabase integration for backend functionality (authentication, database, edge functions).

## Tech Stack
- **Frontend Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 5.4.19
- **UI Library**: shadcn-ui (Radix UI components)
- **Styling**: Tailwind CSS 3.4.17 with custom theme
- **Backend**: Supabase (authentication, database, edge functions)
- **State Management**: @tanstack/react-query for server state
- **Routing**: react-router-dom
- **Forms**: react-hook-form with zod validation
- **Icons**: lucide-react

## Development Commands
- **Install dependencies**: `npm ci` (preferred) or `npm install`
- **Start dev server**: `npm run dev` (runs on http://[::]:8080)
- **Build for production**: `npm run build`
- **Build for development**: `npm run build:dev`
- **Lint code**: `npm run lint`
- **Preview production build**: `npm run preview`

## Code Style & Guidelines

### TypeScript
- Use TypeScript for all new files (.tsx for React components, .ts for utilities)
- Use the `@/` path alias for imports from the `src` directory (e.g., `import { Button } from "@/components/ui/button"`)
- Type safety is relaxed in this project: `noImplicitAny: false`, `strictNullChecks: false`
- Unused variables and parameters are allowed

### React Components
- Use functional components with React hooks
- Follow the existing component structure in `src/components/`
- UI components from shadcn-ui are located in `src/components/ui/`
- Use the established naming conventions: PascalCase for components
- Keep React components in `.tsx` files

### Styling
- Use Tailwind CSS utility classes for styling
- Follow the custom theme defined in `tailwind.config.ts`
- Use the CSS variables defined for colors (slate color scheme)
- Main styles are in `src/index.css`
- Use `clsx` and `tailwind-merge` (via `cn` utility) for conditional classes

### Component Patterns
- Import UI components from `@/components/ui/`
- Use shadcn-ui components as the foundation for custom components
- Follow the component variant pattern using `class-variance-authority`
- Use `lucide-react` for icons

## Linting
- ESLint is configured with TypeScript and React plugins
- Configuration file: `eslint.config.js`
- Some linter rules are relaxed:
  - `@typescript-eslint/no-unused-vars` is disabled
  - React refresh warnings are set to "warn" level
- **Do not fix pre-existing linter errors unless they are directly related to your changes**
- Run `npm run lint` before committing

## Project Structure
```
src/
├── components/     # Reusable React components
│   └── ui/        # shadcn-ui components
├── hooks/         # Custom React hooks
├── integrations/  # External service integrations (Supabase)
├── lib/           # Utility functions and helpers
├── pages/         # Page components (used with react-router-dom)
├── assets/        # Static assets (images, fonts, etc.)
├── App.tsx        # Main app component
├── main.tsx       # Entry point
└── index.css      # Global styles

supabase/
└── functions/     # Supabase Edge Functions
```

## Supabase Integration
- Supabase client is configured in `src/integrations/supabase/client.ts`
- Use environment variables from `.env` for Supabase configuration
- Edge functions are in `supabase/functions/` directory
- Common edge functions: `create-presale-checkout`, `join-waitlist`, `presale-webhook`

## Forms and Validation
- Use `react-hook-form` for form management
- Use `zod` for schema validation
- Use `@hookform/resolvers` to connect zod with react-hook-form
- Form components are available in `@/components/ui/form`

## State Management
- Use `@tanstack/react-query` for server state management
- Query keys and hooks should be organized by feature/domain
- Use React Query for data fetching, caching, and synchronization

## Security & Best Practices
- Never commit secrets or API keys to the repository
- Use environment variables (`.env` file) for sensitive configuration
- The `.env` file is already in `.gitignore`
- Validate user inputs, especially in edge functions
- Use proper error handling and user feedback (use `sonner` for toast notifications)

## Testing
- Currently, there is no testing framework configured
- When adding tests, consider using Vitest (Vite's test runner) for consistency with the build tool

## Dependencies
- Only add new dependencies when absolutely necessary
- Prefer using existing libraries in the project
- Run security checks before adding new packages
- Update `package.json` and use `npm install` to add new dependencies

## Common Patterns
1. **Creating new pages**: Add to `src/pages/` and register routes in the router configuration
2. **Adding UI components**: Use shadcn-ui CLI or manually add to `src/components/ui/`
3. **Custom hooks**: Place in `src/hooks/` directory
4. **Utilities**: Add to `src/lib/` directory
5. **API integration**: Use React Query hooks with Supabase client

## Notes
- This project was created with Lovable.dev platform
- The `lovable-tagger` plugin is used in development mode for component tagging
- Port 8080 is used for the dev server (configured to listen on all interfaces: `::`)
- The project uses SWC for faster React compilation (`@vitejs/plugin-react-swc`)

## When Making Changes
1. Ensure changes are minimal and focused
2. Run `npm run lint` to check for linting issues
3. Test changes with `npm run dev`
4. Verify production build works with `npm run build`
5. Check that your changes don't introduce new TypeScript errors
6. Update documentation if adding new features or patterns
