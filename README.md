# Expense Tracker App

A modern, highly-polished, and cloud-synced personal finance tracking application built with React and Supabase. 

This application features a beautiful mobile-first design, interactive charts, and real-time database syncing to help you take control of your financial life seamlessly across all your devices.

## ✨ Key Features

- **📊 Dynamic Dashboard**: Get a quick overview of your total balance, recent transactions, and monthly income vs. expense summary.
- **💸 Expense Management**: Add, edit, and delete transactions with categorizations, payment methods, and notes.
- **🎯 Budget Tracking**: Set monthly limits per category. Visual progress bars and smart alerts tell you when you are nearing or exceeding your limits.
- **📈 Analytics**: Interactive visual breakdowns of your spending habits by category.
- **☁️ Cloud Synced**: Powered by Supabase. Your data is securely saved to the cloud, allowing you to access it from any device.
- **🔒 Secure Authentication**: Built-in email/password login and account protection using Supabase Auth.
- **📤 Export Data**: One-click export of your filtered transaction history to CSV format.
- **📱 Mobile-First UX**: Glassmorphism, smooth animations (Framer Motion), and a persistent bottom navigation shell that feels like a native mobile app.

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, TypeScript
- **Styling**: Tailwind CSS, Shadcn UI, Radix UI Primitives
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Backend & Database**: Supabase (PostgreSQL, Auth, RLS)

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### 1. Clone & Install
Clone the repository and install the dependencies:
```bash
npm install
```

### 2. Supabase Setup (Database)
This app relies on Supabase for data persistence. You need to create the required tables in your database:
1. Create a free account at [Supabase](https://supabase.com/).
2. Create a new project.
3. Open the **SQL Editor** in your Supabase dashboard.
4. Copy the entire contents of the `supabase_schema.sql` file located in the root of this project.
5. Paste it into the SQL Editor and click **Run**. This will create your `expenses`, `budgets`, and `settings` tables, and configure Row Level Security (RLS) so users can only access their own data.

### 3. Environment Variables
Connect your React app to your Supabase project:
1. Locate your Supabase URL and Anon Key in your Project Settings > API.
2. Create a `.env` file in the root of the project.
3. Add the following variables:
```env
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 4. Run the App
Start the development server:
```bash
npm run dev
```
Open `http://localhost:8080` in your browser.

## 📂 Project Structure

- `src/components/` - Reusable UI components (buttons, dialogs, layouts, bottom nav)
- `src/context/` - Global state management (`AppContext.tsx`) hooking UI to Supabase
- `src/lib/` - Utility functions, types, and the Supabase client
- `src/pages/` - Main application views (Dashboard, Expenses, Analytics, Settings, etc.)
- `supabase_schema.sql` - The database schema used to initialize the cloud backend

## 🛡️ Security
This app uses Supabase Row Level Security (RLS). Every database query automatically filters data by `user_id`. It is impossible for a user to query or modify data belonging to another user, even if they have the API keys.

---
*Built with modern web technologies.*
