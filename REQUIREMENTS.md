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

**Request body parameter**

|         Name | Required |  Type  | Description                                        |
| -----------: | :------: | :----: | -------------------------------------------------- |
|         `id` | required | number | Id of the user. <br/><br/>                         |
| `first_name` | required | string | First name<br/><br/>                               |
|  `last_name` | required | string | Last name <br/><br/>                               |
|   `password` | required | string | Password: length must be greater thatn 6<br/><br/> |

**Example Response**:

```
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjozLCJmaXJzdF9uYW1lIjoiVGVzdCIsImxhc3RfbmFtZSI6IkJheSIsInBhc3N3b3JkX2RpZ2VzdCI6IiQyYiQxMCRPLnVkMm9rMjVLM2p0SzZjYXVCL3EuVHVTbWRPb1BLdW85WGZROTFBWTdNd1lyV0l6ODIzYSJ9LCJpYXQiOjE2NDMzMzA2MTJ9.k5tDYrK1Iub4OzcqmcKnWfJb9vefPp8zzWipLUkVsag"
}
```

For token required endpoints, user must add a bearer token in request header for authorisation

- Index: List all the user [token required]

```
 GET /users
```

**Example Response**:

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

Example Response:

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

**Request body parameter**

|         Name | Required |  Type  | Description                                            |
| -----------: | :------: | :----: | ------------------------------------------------------ |
| `first_name` | required | string | New first name<br/><br/>                               |
|  `last_name` | required | string | New last name <br/><br/>                               |
|   `password` | required | string | New password: length must be greater thatn 6<br/><br/> |

Example Response:

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

```
 GET /products/
```

Example Request:

```
http://localhost:3000/products
```

Example Response:

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

- Index:
  List all the products that exists in the database
- Show (args: product id)
- Create (args: Product)[token required]
- [OPTIONAL] Top 5 most popular products
- [OPTIONAL] Products by category (args: product category)

#### Orders

- Current Order by user (args: user id)[token required]
- [OPTIONAL] Completed Orders by user (args: user id)[token required]

## Data Shapes

#### Product

- id
- name
- price
- [OPTIONAL] category

#### User

- id
- firstName
- lastName
- password

#### Orders

- id
- id of each product in the order
- quantity of each product in the order
- user_id
- status of order (active or complete)

```

```
