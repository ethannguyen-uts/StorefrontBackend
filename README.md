# StorefrontBackend

## About

Company stakeholders want to create an online storefront to showcase their great product ideas. An API backend server is required to support users to browse an index of all products, see the specifics of a single product, and add products to an order that they can view on a cart page. The API service provides REST API endpoints to support the application. For detailed information, please read the [REQUIREMENTS.md](REQUIREMENTS.md) file.

### Installing

Install all npm packages require using
npm:

```
npm install
```

or yarn:

```
yarn add
```

Install db-migrate package globally for database migration on the machine for terminal commands:

```
npm install db-migrate -g
```

### Database setup

STEP 1:
The project requires Postgres database:
In a terminal tab, create and run the database:
Switch to the postgres user :

```
su postgres
psql postgres
```

In psql run the following to create 2 databases, one for devlopment and another for test:

```
CREATE USER full_stack_user WITH PASSWORD 'password123';
CREATE DATABASE full_stack_dev;
\c full_stack_dev
GRANT ALL PRIVILEGES ON DATABASE full_stack_dev TO full_stack_user;

CREATE DATABASE full_stack_test;
\c full_stack_test
GRANT ALL PRIVILEGES ON DATABASE full_stack_test TO full_stack_user;
```

To test that it is working run \dt and it should output "No relations found."

STEP 2:
In the source code folder:
Create a .env file and add the following lines to set up database and environments variables:

```
POSTGRES_HOST=localhost
POSTGRES_DB=full_stack_dev
POSTGRES_TEST_DB=full_stack_test
POSTGRES_USER=full_stack_user
POSTGRES_PASSWORD=password123
ENV=dev
BCRYPT_PASSWORD=sandboxismydream
SALT_ROUNDS=10
TOKEN_SECRET=sandbox123!
```

In database.json file, check the configurations:

```
{
  "dev": {
    "driver": "pg",
    "host": "localhost",
    "database": "full_stack_dev",
    "user": "full_stack_user",
    "password": "password123"
  },
  "test": {
    "driver": "pg",
    "host": "localhost",
    "database": "full_stack_test",
    "user": "full_stack_user",
    "password": "password123"
  }
}
```

The database server will run on port: 5432

### Starting the API server:

In the project directory, to build the application run the command

```
npm run build
```

To test the api run the command

```
npm run test
```

Start the api server on port 3000:

```
npm run watch
```
