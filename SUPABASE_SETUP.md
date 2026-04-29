# Supabase Setup

## 1. Create a Supabase project

Go to https://supabase.com and create a free project.

## 2. Copy your API keys

In Supabase:

1. Open your project.
2. Go to Project Settings.
3. Open API.
4. Copy:
   - Project URL
   - anon public key

## 3. Create `.env.local`

Create a file named `.env.local` in the project root:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_APP_API_BASE_URL=http://localhost:5000/api
```

Restart the frontend after changing environment variables:

```bash
npm.cmd run dev
```

## 4. Where to see users

In Supabase dashboard:

1. Open Authentication.
2. Open Users.

New users who register on the website will appear there.

## 5. Roles and permissions

Supabase supports roles and permissions through:

- Auth user metadata
- Database tables for profiles/roles
- Row Level Security policies

For this website, the next step is to add a `profiles` table with a `role` column such as `admin`, `staff`, or `user`.
