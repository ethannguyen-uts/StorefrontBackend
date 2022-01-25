CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(77),
    last_name VARCHAR(77),
    password_digest VARCHAR
);