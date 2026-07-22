# ecom
<<<<<<< HEAD
# assingment2
=======

## Roles and setup

Set these variables before the first run to create the initial administrator:

```env
MONGO_URL=mongodb://127.0.0.1:27017/ecom
SESSION_SECRET=replace-this
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=use-a-strong-password
ADMIN_NAME=Administrator
```

Normal sign-up creates a `USER`. Administrators can manage categories, brands, products, and CSV import/export under `/web/admin`. Create categories and brands before adding products.

Users can browse `/web/products`, sign up/login, save products for later, manage their cart, and checkout. Checkout creates one order record and atomically decrements each purchased product's stock when enough stock is available.
>>>>>>> b692169 (some features added as per the requirments)
