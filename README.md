# Blog Application Frontend

This is the frontend for the Blog Application, built with Next.js and TypeScript.

## Features
- User authentication (login/register)
- View, create, edit, and delete blog posts
- Admin dashboard for managing posts and users
- User profile management

## Project Structure
```
blog-frontend/
├── next-env.d.ts
├── next.config.mjs
├── package.json
├── tsconfig.json
└── src/
  ├── app/
  │   ├── layout.tsx
  │   ├── page.tsx
  │   ├── admin/
  │   │   ├── layout.tsx
  │   │   ├── posts/
  │   │   │   └── page.tsx
  │   │   └── users/
  │   │       └── page.tsx
  │   ├── login/
  │   │   └── page.tsx
  │   ├── my-posts/
  │   │   └── page.tsx
  │   ├── posts/
  │   │   ├── page.tsx
  │   │   ├── [id]/
  │   │   │   ├── page.tsx
  │   │   │   └── edit/
  │   │   │       └── page.tsx
  │   │   └── new/
  │   │       └── page.tsx
  │   ├── profile/
  │   │   └── page.tsx
  │   └── register/
  │       └── page.tsx
  └── lib/
    └── api.ts
```

## Getting Started

1. **Install dependencies:**
   ```powershell
   npm install
   ```
2. **Configure environment variables:**
   Create a `.env` file and add your API endpoints and secrets.
3. **Run the development server:**
   ```powershell
   npm run dev
   ```
4. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

## Scripts
- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run start` — Start production server

## Technologies Used
- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [React](https://react.dev/)

## License
MIT
