# Ecommerce Web app

A REST API for an e-commerce application where users can browse, add, and view product details. Built using Express.js, Node.js, MongoDB, and JWT authentication.

---

## Demo Link

[Live API](https://luxlina-backend.vercel.app/api/products)

---

## Quick Start

```
git clone https://github.com/rahulCode1/LUXLINA_Backend.git
cd backend
npm install
npm start
```

---

## Technologies

- Node.js
- Express.js
- MongoDB

## Features

- Product management
- Wishlist management
- Cart management
- Order management
- Address management
- Cloudinary image uploads
- Product recommendations

---

## Environment Variables

```
PORT=5000
MONGO_URI=XXXXXXXXXXXXXXXXXXXXXX
JWT_SECRET=XXXXXXXXXXXX
CLOUDINARY_CLOUD_NAME=XXXXX
CLOUDINARY_API_KEY=XXXXX
CLOUDINARY_API_SECRET=XXXXX
```

---

## API Reference

### **GET /api/products**<br>

List all products<br>
Sample Response:<br>

```
[{_id, name,  description, price, ... }, ...]

```

## **GET /api/products/:id**<br>

Product details<br>
Sample Response:<br>

```
{id, name, description, ...}

```

## **POST /api/product/add**<br>

Add Product<br>
Sample Response<br>

```
{name, description, price, ...}
```

## **DELETE /api/product/:id**<br>

Delete Product<br>
Sample Response<br>

## **POST /api/cart/:id**<br>

Add Product to Cart<br>
Sample Response<br>

```
[{name, description, price, ...}, ...]
```

## **GET /api/cart/:id**<br>

GET Product from Cart<br>
Sample Response<br>

```
[{name, description, price, ...}, ...]
```

## **PATCH /api/cart/:id**<br>

Increase product quantity<br>
Sample Response<br>

```
[{name, description, price, quantity, ...}, ...]
```

## **PATCH /api/cart/decrease/:id**<br>

Decrease product quantity<br>
Sample Response<br>

```
[{name, description, price, quantity, ...}, ...]
```

## **PATCH /api/cart/remove/:id**<br>

Remove product from Cart<br>
Sample Response<br>

## **PATCH /api/cart/moveto_wishlist/:id**<br>

Move Product to Wishlist<br>
Sample Response<br>

```
[{name, description, price, quantity, ...}, ...]
```

## **POST /api/cart/wishlist/:id**<br>

Add or Remove Product to Wishlist<br>
Sample Response<br>

```
[{name, description, price, quantity, ...}, ...]
```

## **PATCH /api/cart/wishlist/:id**<br>

Move Product to Cart.<br>
Sample Response<br>

```
[{name, description, price, quantity, ...}, ...]
```

## **POST /api/address/new**<br>

Add new Address<br>
Sample Response<br>

```
[{name, phoneNumber, zipCode,  ...}, ...]
```

## **GET /api/address/:id**<br>

Get user addresses<br>
Sample Response<br>

```
[{name, phoneNumber, zipCode,  ...}, ...]
```

## **GET /api/address/address_info/:id**<br>

Get user addresses information<br>
Sample Response<br>

```
{name, phoneNumber, zipCode,  ...}
```

## **PATCH /api/address/update/:id/default**<br>

Update default address.<br>
Sample Response<br>

```
{name, phoneNumber, isDefault,  ...}
```

## **PATCH /api/address/update/:id**<br>

Update address.<br>
Sample Response<br>

```
{name, phoneNumber, isDefault,  ...}
```

## **DELETE /api/address/:id**<br>

Delete user addresses<br>

## **POST /api/order/:id**<br>

Place Order.<br>
Sample Response<br>

```
[{products: [], orderSummary: {}, address, ...}]
```

## **GET /api/order/:id**<br>

Get User Order.<br>
Sample Response<br>

```
[{products: [], orderSummary: {}, address, ...}]
```

## **POST /api/user**<br>

Add new User<br>
Sample Response<br>

```
{name, email}


```

## **GET /api/user**<br>

Get User<br>
Sample Response<br>

```
{name, email}
```

## **Guest login**

```
guest@gmail.com
123456789
```


## Contact

For bugs or feature requests, please reach out to: rahulkumawat50555@gmail.com
