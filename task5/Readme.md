# 🛒 E-Commerce Backend API

## 📌 Project Overview

This project is a RESTful backend for a small e-commerce system built using:

* **Node.js**
* **Koa**
* **TypeORM**
* **PostgreSQL**
* **Docker (for PostgreSQL container)**

The goal of this project was to implement real-world database relationships, advanced queries, pagination, and proper API structure using TypeORM with PostgreSQL-specific features like `ARRAY` and `JSONB`.

---

# 🧩 Original Task Requirements

Build REST APIs for a small e-commerce system with the following focus:

* Real-world entity relationships
* Proper joins using TypeORM relations
* QueryBuilder usage where necessary
* Avoid N+1 queries
* Graceful error handling
* Pagination for listing APIs

---

# 🗄️ Database Design

## Entities

### • Customers

* id
* name
* email (unique)
* phone
* createdAt

### • Products

* id
* title
* description
* tags (ARRAY / simple-array)
* createdAt

### • Variants

* id
* title
* productId
* sku (unique)
* price
* stock
* attributes (JSONB)

### • Collections

* id
* title
* createdAt

### • Orders

* id
* customerId
* productId
* variantId
* status (enum)
* numberOfUnitsOrdered
* totalAmount
* createdAt

---

# 🔗 Relationships Implemented

* Product → Variants (One-to-Many)
* Customer → Orders (One-to-Many)
* Product ↔ Collections (Many-to-Many)
* Variant → Product (Many-to-One)
* Order → Customer (Many-to-One)
* Order → Product (Many-to-One)
* Order → Variant (Many-to-One)

---

# 🚀 Implemented Features

✅ Full CRUD for:

* Customers
* Products
* Variants
* Collections
* Orders

✅ Product with its variants
✅ Search products by tag or title
✅ Add products to collections
✅ Get collection with products
✅ Create order (stock validation + total calculation)
✅ Get all orders of a customer
✅ Get total amount spent by a customer
✅ Get total sales of a product
✅ Pagination support for listing endpoints
✅ Input validation and error handling
✅ Database-level constraints using `@Check`
✅ Enum for order status
✅ Dockerized PostgreSQL

---

# 🌐 API Routes

---

## 📦 Product Routes

| Method | Route                       | Description                             |
| ------ | --------------------------- | --------------------------------------- |
| GET    | `/products`                 | Get all products (pagination supported) |
| GET    | `/products/:id`             | Get product by ID (with relations)      |
| POST   | `/products`                 | Create product                          |
| PUT    | `/products/:id`             | Update product                          |
| DELETE | `/products/:id`             | Delete product                          |
| PUT    | `/products/:id/collections` | Add product to multiple collections     |
| GET    | `/products/:id/sales`       | Get total number of sales for a product |

---

## 🧾 Order Routes

| Method | Route                          | Description                                       |
| ------ | ------------------------------ | ------------------------------------------------- |
| GET    | `/orders`                      | Get all orders (pagination supported)             |
| GET    | `/orders/:id`                  | Get order by ID                                   |
| POST   | `/orders`                      | Create order (validates stock + calculates total) |
| PUT    | `/orders/:id`                  | Update order                                      |
| DELETE | `/orders/:id`                  | Delete order                                      |
| GET    | `/orders/customer/:customerId` | Get all orders of a customer                      |

---

## 👤 Customer Routes

| Method | Route                   | Description                              |
| ------ | ----------------------- | ---------------------------------------- |
| GET    | `/customers`            | Get all customers (pagination supported) |
| GET    | `/customers/:id`        | Get customer by ID                       |
| GET    | `/customers/:id/amount` | Get total amount spent by customer       |
| POST   | `/customers`            | Create customer                          |
| PUT    | `/customers/:id`        | Update customer                          |
| DELETE | `/customers/:id`        | Delete customer                          |

---

## 🗂️ Collection Routes

| Method | Route                       | Description                           |
| ------ | --------------------------- | ------------------------------------- |
| GET    | `/collections`              | Get all collections                   |
| GET    | `/collections/:id`          | Get products of a collection          |
| POST   | `/collections`              | Create collection                     |
| PUT    | `/collections/:id`          | Update collection                     |
| DELETE | `/collections/:id`          | Delete collection                     |
| PUT    | `/collections/:id/products` | Add multiple products to a collection |

---

## 🎨 Variant Routes

| Method | Route                  | Description                   |
| ------ | ---------------------- | ----------------------------- |
| GET    | `/variants`            | Get all variants              |
| GET    | `/variants/:productId` | Get all variants of a product |
| POST   | `/variants`            | Create variant                |
| PUT    | `/variants/:id`        | Update variant                |
| DELETE | `/variants/:id`        | Delete variant                |

---

## 🔍 Search Route

| Method | Route               | Description                     |
| ------ | ------------------- | ------------------------------- |
| GET    | `/search?q=keyword` | Search products by tag or title |

---

# 📄 Pagination Support

Pagination has been implemented for the following listing endpoints:

* `GET /products`
* `GET /orders`
* `GET /customers`
* `GET /search`

Pagination works using URL query parameters:

```
?page=NUMBER&limit=NUMBER
```

### Example:

```
GET /products?page=2&limit=10
```

This will:

* Skip the first `(page - 1) * limit` records
* Return the specified `limit` number of records

### Validation Rules

* `page` must be a number ≥ 1
* `limit` must be a number ≥ 0
* Invalid values return a `400 Bad Request`

If no pagination query parameters are provided, all records are returned.

---

# ⚙️ Environment Variables

Create a `.env` file in the root of the project with the following format:

```
PORT=

POSTGRES_HOST=
POSTGRES_PORT=
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=
```

These variables are used to configure:

* Server port
* PostgreSQL connection
* Dockerized database setup

---

# 🛠️ Technical Highlights

* Used TypeORM relations instead of manual joins
* Used `jsonb` for flexible variant attributes
* Used `simple-array` for product tags
* Used enum type for order status
* Added database constraints using `@Check`
* Implemented pagination using `skip` and `take`
* Avoided N+1 query problems using relations
* Docker used for PostgreSQL setup

---

# 🐳 Running with Docker

PostgreSQL was run inside a Docker container to ensure:

* Isolated development environment
* Consistent database setup
* Easy configuration via environment variables
* Clean local setup without manual database installation

---

# 📈 What This Project Demonstrates

* Strong understanding of relational database modeling
* Practical usage of TypeORM
* REST API design best practices
* Pagination logic implementation
* Query optimization and relations handling
* Handling Many-to-Many relationships
* Working with PostgreSQL-specific features (`ARRAY`, `JSONB`, `ENUM`)
* Backend architecture suitable for real-world applications

---