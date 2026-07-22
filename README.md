# Ecom

An Express and MongoDB ecommerce application with dynamic product catalog data, role-based access control, cart management, and stock-aware checkout.

## Features

- Dynamic categories and brands stored in MongoDB
- Product catalog with images, search, sorting, filters, stock, and active/inactive status
- USER and ADMIN authentication with session-based authorization
- Customer cart, saved-for-later items, and checkout
- Checkout creates one order record and reduces stock only when all requested quantities are available
- Admin product, category, and brand management
- Soft delete/recover and permanent deletion for catalog records
- CSV product export and import

## Roles

| Role | Access |
| --- | --- |
| `USER` | Browse active products, filter/search, add products to cart, save for later, and checkout. |
| `ADMIN` | Manage products, categories, brands, CSV import/export, and recover deleted products. Admins cannot use the cart or checkout. |

Regular signup always creates a `USER` account. The first admin is created from environment variables when the application starts.

## Setup

Install dependencies and run the application:

```bash
npm install
npm run dev
```

Create a `.env` file for production or persistent MongoDB use:

```env
MONGO_URL=mongodb://127.0.0.1:27017/ecom
SESSION_SECRET=replace-with-a-long-random-secret
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=use-a-strong-password
ADMIN_NAME=Administrator
PORT=3000
```

`ADMIN_EMAIL` and `ADMIN_PASSWORD` are required to bootstrap the initial administrator. They are used only when no user with that email exists.

In `development` and `test`, the current database configuration uses MongoDB Memory Server. In other environments, `MONGO_URL` is used.

## Main pages

| Page | Purpose |
| --- | --- |
| `/web/products` | Public product catalog. Customers see active, non-deleted products only. |
| `/web/auth/signup` | Customer signup. |
| `/web/auth/login` | Login for users and administrators. |
| `/web/cart` | Customer cart and checkout; USER role only. |
| `/web/admin/products` | Admin product listing and export. |
| `/web/product/add` | Add a product; also provides category creation, brand creation, and CSV import. |
| `/web/admin/categories` | Admin category management. |
| `/web/admin/brands` | Admin brand management. |
| `/web/products/recover` | Admin-only list of soft-deleted products. |

## Catalog workflow

1. Sign in with the bootstrapped admin account.
2. Open **Add product**.
3. Create active categories and brands as needed from that page.
4. Add products manually or import them from CSV.
5. Use the product form to set inventory and active/inactive state.

Soft-deleted products do not appear on the main product page. Administrators can view and restore them only from the Recover page.

## CSV fields

Product CSV import/export uses these fields:

```text
name, price, desc, brand, category, size, stock, color, status, images, isDeleted
```

For importing, `brand` and `category` should match existing brand/category names. `images` is a JSON array of image objects.
