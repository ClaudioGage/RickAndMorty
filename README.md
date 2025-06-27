# Rick & Morty Haufe

A full-stack application for exploring Rick & Morty characters with authentication and favorites functionality.

## Tech Stack

**Backend:**
- NestJS
- TypeScript
- MySQL
- TypeORM
- JWT Authentication
- Rick & Morty API integration

**Frontend:**
- React
- TypeScript
- Vite
- Styled Components
- Axios

## Quick Start

### Prerequisites
- Node.js 18+
- MySQL 8.0+

### Database Setup

1. **Create database:**
```bash
mysql -u root -p -e "CREATE DATABASE rick_morty_app;"
```

2. **Create test user (optional - for auth bypass):**
```bash
mysql -u root -p -e "INSERT INTO users (username, email, password) VALUES ('testuser', 'test@test.com', '\$2b\$12\$placeholder.hash.for.testing');" rick_morty_app
```

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment (.env):**
```env
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=rick_morty_app
JWT_SECRET=your-jwt-secret
BYPASS_AUTH=true
```

4. **Start backend:**
```bash
npm run start:dev
```

Backend will run on `http://localhost:3007`

### Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment (.env):**
```env
VITE_API_URL=http://localhost:3000/api
VITE_BYPASS_AUTH=true
```

4. **Start frontend:**
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## Auth Bypass Mode

For development/testing, set `BYPASS_AUTH=true` in both environments:
- Skips authentication requirements
- Auto-login with mock user
- No database setup needed for auth

## API Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/characters` - List characters with filters
- `GET /api/characters/:id` - Get single character
- `POST /api/characters/:id/favorite` - Add to favorites
- `DELETE /api/characters/:id/favorite` - Remove from favorites

## Project Structure

```
rick-morty-app/
├── backend/
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── characters/
│   │   │   ├── favorites/
│   │   │   └── users/
│   │   └── entities/
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── contexts/
    │   └── services/
    └── package.json
```

## Development

**Start both servers:**
```bash
# Terminal 1 - Backend
cd backend && npm run start:dev

# Terminal 2 - Frontend  
cd frontend && npm run dev
```

**Build for production:**
```bash
# Backend
npm run build

# Frontend
npm run build
```

## Environment Variables

**Backend (.env):**
- `DB_HOST` - MySQL host
- `DB_USERNAME` - MySQL username
- `DB_PASSWORD` - MySQL password
- `DB_DATABASE` - Database name
- `JWT_SECRET` - JWT secret key
- `BYPASS_AUTH` - Enable auth bypass (true/false)

**Frontend (.env):**
- `VITE_API_URL` - Backend API URL
- `VITE_BYPASS_AUTH` - Enable auth bypass (true/false)
