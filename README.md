# 📌 ThesPro - Thesis & Project Management System (Client)

A comprehensive frontend application for the ThesPro platform, designed to streamline thesis and project management workflows for university students, supervisors, and administrative committees.

## 🚀 Live Links
- **Client Live URL:** [https://thespro-client.vercel.app](https://thespro-client.vercel.app)
- **Server Live URL:** [https://thespro-server.vercel.app](https://thespro-server.vercel.app)

## ✨ Features

- **Role-Based Access Control:** Secure and distinct dashboards for Students, Supervisors, and Committee Members.
- **Student Dashboard:** Submit thesis proposals, track evaluation status, browse supervisors, and check results.
- **Supervisor Dashboard:** Approve/Reject proposals, manage supervised groups, add evaluation comments, and access defense schedules.
- **Committee/Admin Panel:** Manage departments, assign supervisors, coordinate defense schedules, send out notices, and oversee all system records.
- **Real-time Notifications:** Automated alerts and notices for defense updates or system announcements.
- **Responsive Aesthetics:** A vibrant, accessible, dark-mode ready UI featuring sleek gradients and modern typography.

## 🛠️ Tech Stack

- **Framework:** Next.js (React)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Redux Toolkit 
- **Icons:** Lucide React
- **Deployment:** Vercel

## 🔐 Environment Variables (.env.local)

Create a `.env.local` file in the root of the client folder with the following variables:

```env
# API URL
NEXT_PUBLIC_API_URL=https://thespro-server.vercel.app/api

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
```

## 📂 Folder Structure

```text
src/
├── app/                  # Next.js App Router pages and layouts
│   ├── admin/            # Admin-specific routes
│   ├── committee/        # Committee member routes
│   ├── student/          # Student routes
│   └── supervisor/       # Supervisor routes
├── components/           # Reusable UI components (Buttons, Modals, Forms, etc.)
├── store/                # Redux store slices and API service setup
├── utils/                # Helper functions and utilities
└── public/               # Static assets (images, icons, etc.)
```

## ⚙️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository_url>
   ```

2. **Navigate to the client directory**
   ```bash
   cd client
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Set up `.env.local`**
   Copy the example variables from above and plug in your keys.

5. **Run the development server**
   ```bash
   npm run dev
   ```

## 📦 Build & Deployment

**To build for production:**
```bash
npm run build
```

**Deployment:**
The client is automatically deployed to **Vercel**. Every push to the main branch triggers an optimized production build using the Vercel Edge Network.

## 👨‍💻 Author

**Name:** Uttam  
**Role:** Full Stack Developer
