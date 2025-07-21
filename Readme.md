# Reelon Habit Tracker(Consistently) - Backend

A Rails API backend for the Reelon Habit Tracker application, designed to help users build and maintain positive habits through streak tracking, notifications, and analytics.

## Features

- **User Authentication**: JWT-based authentication system
- **Habit Management**: Create, read, update, and delete habits
- **Streak Tracking**: Automatically calculate and update streak counts
- **Completion Tracking**: Record daily habit completions

## Technology Stack

- **Ruby**: 3.3.0
- **Rails**: 8.0.2
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)


## Setup and Installation

### Prerequisites

- Ruby 3.3.0
- Rails 8.0.2
- PostgreSQL


### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/Sai-ganesh-28/reelon-projecct.git
   cd reelon-projecct/reelon\ backend
   ```

2. Install dependencies
   ```bash
   bundle install
   ```

3. Setup database
   ```bash
   rails db:create db:migrate db:seed
   ```

4. Start the Rails server
   ```bash
   rails s
   ```

5. The application will be available at `http://localhost:3000`

## API Endpoints

### Authentication

- `POST /api/v1/auth/signup` - Register a new user
- `POST /api/v1/auth/login` - Login and receive JWT token
- `GET /api/v1/auth/me` - Get current user information

### Habits

- `GET /api/v1/habits` - List all habits for current user
- `POST /api/v1/habits` - Create a new habit
- `GET /api/v1/habits/:id` - Get a specific habit
- `PUT /api/v1/habits/:id` - Update a habit
- `DELETE /api/v1/habits/:id` - Delete a habit
- `POST /api/v1/habits/:id/toggle_completion` - Toggle completion status for a habit


## Frontend(Consistently)

### Technology Stack

- **React**: Frontend library for building user interfaces
- **TypeScript**: Type-safe JavaScript
- **Axios**: HTTP client for API requests
- **React Router**: For navigation between pages
- **LocalStorage**: For persistence of completion states

### Features

- **User Authentication**: Login and signup functionality
- **Dashboard**: View and manage all habits
- **Habit Creation**: Create new habits with customizable options
- **Streak Tracking**: Visual display of current and best streaks
- **Completion Tracking**: Mark habits as complete for each day
- **Persistence**: Habit completions persist across page refreshes

### Setup and Installation

1. Navigate to the frontend directory
   ```bash
   cd ../frontend
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm start
   ```

4. The application will be available at `http://localhost:3001`

### Key Components

- **Dashboard**: Main interface showing all habits and their completion status
- **Login/Signup**: Authentication forms
- **HabitForm**: Component for creating and editing habits
- **Calendar**: Visual representation of habit completion over time
