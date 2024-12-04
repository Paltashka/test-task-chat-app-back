# Chat App

## Prerequisites

Change .env.example to .env

## Getting Started

### Install Dependencies

In the project root directory, run the following command to install all required dependencies:

```bash
npm install
```

### Handling PostgeSQL DB:

In the PostgreSQL shell, create the database and user:

```bash
CREATE DATABASE chat_app;
CREATE USER chatadmin WITH PASSWORD 'admin';
GRANT ALL PRIVILEGES ON DATABASE chat_app TO chatadmin;
```

### Run Application:

```bash
npm run start
```

# Chat App Deployment Instructions

## Deploying Backend to Heroku

1. **Install the Heroku CLI:**

   - Download and install the Heroku CLI from [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli).

2. **Log in to Heroku:**

   - Run the following command and log in to your Heroku account:
     ```bash
     heroku login
     ```

3. **Prepare the Backend Repository:**
   - Create a `Procfile` in the root of your backend repository with the following content:
     ```
     web: node dist/main
     ```
4. **Push Backend to Heroku:**

   - Create a Heroku app:
     ```bash
     heroku create <app-name>
     ```
   - Add a PostgreSQL database:
     ```bash
     heroku addons:create heroku-postgresql:hobby-dev
     ```
   - Deploy your backend:
     ```bash
     git push heroku main
     ```

5. **Verify Deployment:**
   - Open your Heroku app:
     ```bash
     heroku open
     ```
