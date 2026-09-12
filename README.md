# Job Application Tracker

A full-stack web application for tracking job applications in one place. Users can create an account, log in securely, and manage their job applications through a dashboard.

=

## Features

- User registration and login
- Secure password hashing with bcrypt
- JWT-based authentication
- Create job applications
- View saved applications
- Edit existing applications
- Delete applications
- Search and filter applications
- Sort applications by different fields
- Track application status
- Store salary, location, application date, and job URL
- User-specific application data
- Responsive interface for desktop and mobile

## Technologies Used

### Frontend
- React
- JavaScript
- HTML
- CSS
- Vite

### Backend
- Node.js
- Express.js
- REST API
- JWT
- bcrypt
- CORS

### Database
- MySQL

### Deployment
- Render
- Railway

## How It Works

Users first create an account and log in. Authentication is handled using JSON Web Tokens (JWT). After logging in, users can create and manage their job applications from the dashboard.

Each application is associated with the authenticated user's account. The backend verifies the user's identity and ownership before allowing applications to be viewed, updated, or deleted.

## API Endpoints

### Authentication

| Method | Endpoint | Description |
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Log in a user |

### Applications

| Method | Endpoint | Description |
| GET | `/api/applications` | Get the logged-in user's applications |
| POST | `/api/applications` | Create a new application |
| PUT | `/api/applications/:id` | Update an application |
| DELETE | `/api/applications/:id` | Delete an application |

All application endpoints require authentication.

## Database Structure

The application uses two main tables:

### Users
- `id`
- `name`
- `email`
- `password`
- `created_at`

### Applications
- `id`
- `company`
- `position`
- `location`
- `salary`
- `date_applied`
- `status`
- `job_url`
- `notes`
- `user_id`
- `created_at`

Each application belongs to a specific user through `user_id`.
