# Shopify GraphQL Sync Service

## 📌 Overview

This project is a backend service built with **Node.js, Koa, TypeORM, and PostgreSQL** that integrates with the **Shopify Admin GraphQL API**.

It allows you to:

* Fetch all **products** and **variants** from a Shopify store
* Store them in a local PostgreSQL database
* Keep the local database in sync with Shopify using incremental updates
* Run automated sync using a cron job

---

## 🧱 Tech Stack

* **Node.js**
* **Koa**
* **TypeScript**
* **TypeORM**
* **PostgreSQL**
* **Shopify Admin GraphQL API**
* **Cron Jobs**

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/sidakmarwah-ga/Green-Apple-ASE.git
cd ./graphql/task1
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Create a `.env` file based on `.env.example`:

```env
PORT=3000

POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=your_user
POSTGRES_PASSWORD=your_password
POSTGRES_DB=your_db

SHOPIFY_STORE_NAME=your-store-name.myshopify.com
SHOPIFY_ACCESS_TOKEN=your-access-token
SHOPIFY_API_VERSION=2023-10
```

---

## 🗄️ Database Setup

### Run migrations

```bash
npm run migration:run
```

### Other migration commands

```bash
npm run migration:generate --name=MigrationName
npm run migration:create --name=MigrationName
npm run migration:revert
npm run migration:show
```

---

## 🚀 Running the Application

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Production

```bash
npm start
```

---

## 🔌 API Endpoints

### 1. Fetch Products & Variants (Initial Load)

```
GET /fetch
```

* Fetches all products and variants from Shopify
* Saves them to the database
* Can only be executed **once**
* Creates a shop entry with initial sync timestamp

⚠️ If already executed, it will throw an error and suggest using `/sync`.

---

### 2. Sync Products & Variants

```
GET /sync
```

* Fetches only updated data since last sync
* Updates local database
* Updates last sync timestamp

---

## 🔄 Cron Job

* Automatically runs the sync function at scheduled intervals
* Starts when the server starts:

```bash
Cron Job has started.
```

* Internally calls:

```ts
syncFunction()
```

---

## 🧠 How It Works

### Initial Fetch (`/fetch`)

1. Checks if the shop already exists
2. Stores shop with current timestamp
3. Fetches:

   * All products
   * All variants
4. Saves them in the database

---

### Sync Flow (`/sync`)

1. Retrieves last sync timestamp
2. Fetches only updated:

   * Products
   * Variants
3. Updates local DB
4. Updates last sync time

---

## ❗ Error Handling

* Centralized error handling using:

  * `AppError`
  * `errorHandler`
* Ensures:

  * Proper HTTP status codes
  * Clean error messages

---

## 🔐 Environment Validation

The app validates required environment variables before starting:

```ts
checkEnvironmentVariables()
```

---

## 📌 Notes

* `/fetch` should only be called once per shop
* `/sync` depends on existing shop data
* Cron job ensures automatic background syncing
* Designed for scalability with Shopify stores

---

## 🧪 Future Improvements

* Add GraphQL API layer for querying local data
* Webhook support for real-time updates
* Pagination optimization for large datasets
* Retry mechanism for failed syncs
* Logging & monitoring

---

## 👨‍💻 Author

[Sidak Marwah](https://www.linkedin.com/in/sidakmarwah/)
