# Daniel Photo - MVP SaaS

A beautiful photo gallery SaaS for photographers. Create stunning galleries from Google Drive folders and share them with clients.

## 🎯 Features

- Create beautiful photo galleries
- Share galleries with unique links
- Responsive image grid
- Fullscreen image viewer with navigation
- Download photos directly
- Mobile responsive design
- Premium, modern UI

## 🧩 Tech Stack

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Database:** PostgreSQL
- **Styling:** Custom CSS

## 📁 Project Structure

```
daniel-main-site/
├── frontend/           # React application
│   ├── src/
│   │   ├── components/ # Reusable components
│   │   ├── pages/      # Page components
│   │   ├── services/   # API services
│   │   └── styles/     # Global styles
│   └── ...
├── backend/            # Express server
│   ├── src/
│   │   ├── config/     # Database config
│   │   ├── controllers/# Route controllers
│   │   ├── routes/     # API routes
│   │   ├── services/   # Business logic
│   │   └── utils/      # Utilities
│   └── ...
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL
- Google Cloud API Key with Drive API enabled

### 1. Setup Database

```sql
-- Run the schema.sql file in PostgreSQL
psql -U your_username -d your_database -f backend/schema.sql
```

### 2. Configure Environment

Create `.env` file in the backend folder:

```bash
# Copy the example
cp backend/.env.example backend/.env

# Edit with your values
DATABASE_URL=postgresql://username:password@localhost:5432/daniel_photo
GOOGLE_API_KEY=your_google_api_key
PORT=3001
FRONTEND_URL=http://localhost:5173
```

### 3. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 4. Run Development Servers

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 5. Open the App

Visit `http://localhost:5173` in your browser.

## 🔑 Google Drive Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable the **Google Drive API**
4. Create an API Key (Credentials → Create Credentials → API Key)
5. (Optional) Restrict the API Key to Drive API only
6. Add the API key to your `.env` file

**Important:** Google Drive folders must be shared with "Anyone with the link can view" for the API to access them.

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/galleries` | Create a new gallery |
| GET | `/api/galleries/:slug` | Get gallery by slug |
| GET | `/api/galleries/:slug/images` | Get images from gallery |
| GET | `/api/health` | Health check |

## 🎨 Design System

### Colors
- Beige: `#f5f0e6`
- Brown: `#8b5e3c`
- White: `#ffffff`

### Typography
- Titles: Playfair Display (serif)
- Content: Inter (sans-serif)

## 📝 License

MIT License
