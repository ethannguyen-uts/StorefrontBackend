# API Requirements

The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application.

## API Endpoints

#### Users

Some API endpoints will require a jwt token to access, to receive a token, create a user by using the endpoint:

- Create a new user: (args: User)

```
 POST /users
```

Request body parameter

|         Name | Required |  Type  | Description                                       |
| -----------: | :------: | :----: | :------------------------------------------------ |
|         `id` | required | number | Id of the user. <br/><br/>                        |
| `first_name` | required | string | First name<br/><br/>                              |
|  `last_name` | required | string | Last name <br/><br/>                              |
|   `password` | required | string | Password: length must be greater than 6<br/><br/> |

Response:

```
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjozLCJmaXJzdF9uYW1lIjoiVGVzdCIsImxhc3RfbmFtZSI6IkJheSIsInBhc3N3b3JkX2RpZ2VzdCI6IiQyYiQxMCRPLnVkMm9rMjVLM2p0SzZjYXVCL3EuVHVTbWRPb1BLdW85WGZROTFBWTdNd1lyV0l6ODIzYSJ9LCJpYXQiOjE2NDMzMzA2MTJ9.k5tDYrK1Iub4OzcqmcKnWfJb9vefPp8zzWipLUkVsag"
}
```

For token required endpoints, request must include a bearer token for authorization

- Index: List all the user [token required]

```
 GET /users
```

Response:

```
[
    {
        "id": 1,
        "first_name": "admin",
        "last_name": "admin"
    }
]
```

- Show: get a user base on id (args: id)[token required]

```
POST /users/:id
```

Response:

```
{
    "id": 1,
    "first_name": "admin",
    "last_name": "admin"
}
```

- Update a user based on id [token required]

```
PUT /users/:id
```

Request body parameter:

|         Name | Required |  Type  | Description                                           |
| -----------: | :------: | :----: | :---------------------------------------------------- |
| `first_name` | required | string | New first name<br/><br/>                              |
|  `last_name` | required | string | New last name <br/><br/>                              |
|   `password` | required | string | New password: length must be greater than 6<br/><br/> |

Response:

```
{
    "id": 11,
    "first_name": "AAA",
    "last_name": "Bay"
}
```

#### Products

A product within the Store.

Endpoints

- List all products:

```
 GET /products/
```

Example Request:

```
http://localhost:3000/products
```

Response:

```
[
    {
        "id": 1,
        "name": "Donut",
        "price": 20,
        "category": "Food"
    },
    {
        "id": 2,
        "name": "Coke",
        "price": 18,
        "category": "Drink"
    }
]
```

- Create (args: Product)[token required]

```
 POST /products
```

Request body parameter

|       Name | Required |  Type  | Description                                   |
| ---------: | :------: | :----: | :-------------------------------------------- |
|       `id` | required | number | Id of the product, must be integer <br/><br/> |
|     `name` | required | string | Product name<br/><br/>                        |
|    `price` | required | number | Product price, must be integer<br/><br/>      |
| `category` | required | string | Product category<br/><br/>                    |

Response:

```
{
    "id": 20,
    "name": "Donut",
    "price": 20,
    "category": "Food"
}
```

- Show (args: product id)

```
 POST /products/:id
```

Response:

```
{
    "id": 1,
    "name": "Donut",
    "price": 20,
    "category": "Food"
}
```

- Get top 5 most popular products:

```
 GET /top-popular-products
```

Response:

```
[
    {
        "id": 1,
        "name": "Donut",
        "category": "Food",
        "price": 20,
        "quantity": 52
    },
    {
        "id": 3,
        "name": "Tomato",
        "category": "Food",
        "price": 20,
        "quantity": 26
    },
    {
        "id": 10,
        "name": "Coke",
        "category": "Drink",
        "price": 18,
        "quantity": 20
    },
    {
        "id": 6,
        "name": "Fanta",
        "category": "Drink",
        "price": 18,
        "quantity": 16
    },
    {
        "id": 2,
        "name": "Sprite",
        "category": "Drink",
        "price": 18,
        "quantity": 14
    }
]
```

- Products by category (args: product category)

```
 POST /products-by-category
```

Request body parameter

|       Name | Required |  Type  | Description                |
| ---------: | :------: | :----: | :------------------------- |
| `category` | required | string | Product category<br/><br/> |

Response:

```
[

    {
        "id": 2,
        "name": "Cheese",
        "price": 20,
        "category": "Food"
    },
    {
        "id": 1,
        "name": "Donut",
        "price": 20,
        "category": "Food"
    }
]
```

#### Orders

- List all the orders

```
 GET /orders
```

Response:

```
[
    {
        "id": 1,
        "status": "active",
        "user_id": 2
    },
    {
        "id": 2,
        "status": "complete",
        "user_id": 2
    }
]
```

- Create (args: Order)[token required]

```
 POST /orders
```

Request body parameter

|      Name | Required |  Type  | Description                                      |
| --------: | :------: | :----: | :----------------------------------------------- |
|      `id` | required | number | Id of the order, must be integer <br/><br/>      |
|  `status` | required | string | must be active or complete<br/><br/>             |
| `user_id` | required | number | Owner id of the order, must be integer<br/><br/> |

Response:

```
{
    "id": 3,
    "status": "active",
    "user_id": 3
}
```

- Add a product to order: [token required]

```
POST /orders/:id/products
```

Request body parameter

|         Name | Required |  Type  | Description                                   |
| -----------: | :------: | :----: | :-------------------------------------------- |
| `product_id` | required | number | Id of the product, must be integer <br/><br/> |
|   `quantity` | required | number | Must be integer and greater than 0<br/><br/>  |

Example Request:

```
{
    "product_id": 3,
    "quantity" : 20
}
```

Response:

```
{
    "id": 7,
    "quantity": 20,
    "order_id": 1,
    "product_id": 3
}
```

- Show the order by id (args: Order Id)[token required]

```
 POST /orders/:id
```

Response:

```
{
    "id": 1,
    "status": "active",
    "user_id": 2,
    "details": [
        {
            "id": 1,
            "product_id": 1,
            "product_name": "Donut",
            "quantity": 26,
            "price": 20
        },
        {
            "id": 2,
            "product_id": 3,
            "product_name": "Tomato",
            "quantity": 26,
            "price": 20
        }
    ]
}
```

- Current Order by user (args: user id)[token required]

```
POST /orders/users/:id/current
```

Response:

```
{
    "id": 1,
    "status": "active",
    "user_id": 2
}

```

- Completed Orders by user (args: user id)[token required]

```

POST /orders/users/:id/complete

```

Response:

```
[
    {
    "id": 2,
    "status": "complete",
    "user_id": 2
    }
]
```

## Data Shapes

#### Product

```
id SERIAL PRIMARY KEY,
name VARCHAR(77) NOT NULL,
price integer NOT NULL,
category VARCHAR(77)
```

#### User

```
id SERIAL PRIMARY KEY,
first_name VARCHAR(77),
last_name VARCHAR(77),
password_digest VARCHAR
```

#### Orders

General information: (orders table)

```
id SERIAL PRIMARY KEY,
status VARCHAR(64),
user_id INTEGER REFERENCES users(id)
```

Detail informations: (orders-products table)

```
id SERIAL PRIMARY KEY
quantity INTEGER,
order_id INTEGER REFERENCES orders(id),
product_id INTEGER REFERENCES products(id)

```
