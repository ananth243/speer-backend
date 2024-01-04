# Speer Backend Assignment

Submission for the Backend assessment for role of Full Stack Developer at Speer Technologies.

The database used is MongoDB keeping speed and performance in mind along with scaling the DB with increase in users.
## Running Tests

To run tests, run the following command

```bash
  npm run test
```
What this does is cleans up and injects data into the Testing DB

## Run Locally

Clone the project

```bash
  git clone https://github.com/ananth243/speer-backend.git
```

Go to the project directory

```bash
  cd speer-backend
```

Following are the required environment variables

`SECRET_KEY`
`DBURI`
`TEST_DBURI`

The `TEST_DBURI` is a replica of the actual DB for E2E testing.

### Without Docker

To run locally, you will need to have Nodejs installed along with MongoDB. Add the above environment variables to your .env file.

If you do not have a MongoDB instance available, you can use the one provisioned by Docker. Refer to the `.env.example` file for more information.

Install dependencies

```bash
  npm install
```

Start the server (After configuring env variables)

```bash
  npm start
```

### Docker

Build the app
```bash
   docker build -t speer .
```

Start the containers
```bash
   docker compose up --build -d
```