# **Guided Laboratory: Building a Full CRUD API**

**Objective:**
By the end of this lab, you will have extended your basic API to support full CRUD (Create, Read, Update, Delete) operations for managing products. You will learn how to accept and process data sent from a client to create, modify, and remove items from your in-memory database.

**Prerequisites:**
You should have the base project code running. This includes an Express server with two `GET` endpoints: one to fetch all products and another to fetch a single product by its ID.

---

## **Part 1: Preparing Your Server to Receive Data**

To create or update a product, a client needs to send us data (e.g., the new product's name and price). This data is sent in the *body* of the HTTP request, typically in JSON format. By default, Express does not know how to read this body. We need to add a "middleware" to handle this.

In modern versions of Express, the necessary tool, `body-parser`, is already built-in. We just need to tell our app to use it.

### **Action: Add the Express JSON Middleware**

In your main server file, add the following line of code right after you initialize the `app`. This will enable your server to understand incoming JSON data.

```javascript
import express from 'express';

const app = express();
const port = 3000;

// Middleware to parse incoming JSON requests
app.use(express.json()); // <-- ADD THIS LINE

let products =[
    {"id": 1, "name": "Laptop", "price": 1000},
    {"id": 2, "name": "Smartphone", "price": 500},
    {"id": 3, "name": "Tablet", "price": 300}
];

// ... your existing GET endpoints remain here ...

app.listen(port,()=> console.log(`Server is running at http://localhost:${port}`));
```

### **Code Explanation: `app.use(express.json());`**

*   **What is Middleware?** In Express, middleware are functions that run in the middle of the request-response cycle. They can execute code, make changes to the request (`req`) and response (`res`) objects, and end the cycle or pass control to the next middleware. `app.use()` is the function that registers a middleware for all routes.
*   **What does `express.json()` do?** This specific middleware looks for incoming `POST` and `PUT` requests that have a `Content-Type: application/json` header. If it finds one, it takes the JSON data from the request's body, parses it into a JavaScript object, and attaches it to the request object as `req.body`. Without this line, `req.body` would be `undefined` in your route handlers.

---

## **Part 2: Creating a Product (POST Method)**

The `POST` method is the standard way to create a new resource. We will create a `POST /products` endpoint that accepts the details of a new product, assigns it a unique ID, and adds it to our `products` array.

### **Action: Implement the POST Endpoint**

Add the following code block after your existing `GET` endpoints.

```javascript
// Endpoint to create a new product
app.post('/products', (req, res) => {
    // Find the highest existing ID to generate a new one
    const newId = Math.max(...products.map(p => p.id)) + 1;

    const newProduct = {
        id: newId,
        name: req.body.name,
        price: req.body.price
    };

    products.push(newProduct);
    res.status(201).json(newProduct);
});
```

### **Code Explanation**

1.  **`app.post('/products', (req, res) => { ... });`**
    *   This sets up a new route handler that will only respond to `POST` HTTP requests made to the `/products` URL.

2.  **`const newId = Math.max(...products.map(p => p.id)) + 1;`**
    *   This line generates a simple unique ID. Let's break it down:
        *   `products.map(p => p.id)`: Creates a new array containing only the IDs from our products (e.g., `[1, 2, 3]`).
        *   `Math.max(...)`: A function that finds the largest number from its arguments.
        *   The `...` (spread syntax) expands our ID array `[1, 2, 3]` into individual arguments for `Math.max`, making it `Math.max(1, 2, 3)`.
        *   Finally, we add `1` to the highest existing ID to ensure the new ID is unique.

3.  **`const newProduct = { ... };`**
    *   We create a new JavaScript object for our product. We assign it the `newId` we just created. The `name` and `price` values are taken from `req.body`, which holds the data our `express.json()` middleware parsed for us.

4.  **`products.push(newProduct);`**
    *   This is a standard JavaScript array method that adds the `newProduct` object to the end of our `products` array, effectively "saving" it in our in-memory database.

5.  **`res.status(201).json(newProduct);`**
    *   `res.status(201)`: We set the HTTP status code to `201 Created`. This is the correct and specific code to signal that a new resource has been successfully created.
    *   `.json(newProduct)`: We send the complete new product (including its generated ID) back to the client as a confirmation.

### **How to Test**
Use a tool like **Postman** or **Insomnia**.
*   **Method:** `POST`
*   **URL:** `http://localhost:3000/products`
*   **Body:** (select `raw` and `JSON`)
    ```json
    {
        "name": "Wireless Mouse",
        "price": 40
    }
    ```
*   You should get a `201` response with the new mouse object. If you then do a `GET` to `/products`, you will see it in the list.

---

## **Part 3: Updating a Product (PUT Method)**

The `PUT` method is used to update an existing resource. We will create a `PUT /products/:id` endpoint that finds a product by its ID and replaces its data with the new data provided by the client.

### **Action: Implement the PUT Endpoint**

Add the following code after your `POST` endpoint.

```javascript
// Endpoint to update a product by ID
app.put('/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const productIndex = products.findIndex(p => p.id === id);

    if (productIndex === -1) {
        return res.status(404).json({ message: "Product not found" });
    }

    products[productIndex].name = req.body.name;
    products[productIndex].price = req.body.price;

    res.status(200).json(products[productIndex]);
});
```

### **Code Explanation**

1.  **`const id = parseInt(req.params.id);`**
    *   The `:id` in the route path is a URL parameter. Express makes these available in the `req.params` object. Since URL parameters are always strings, we use `parseInt()` to convert the ID into a number for a correct comparison.

2.  **`const productIndex = products.findIndex(p => p.id === id);`**
    *   Instead of just finding the product, we find its *index* (its position in the array). The `.findIndex()` method is perfect for this. It returns the index of the first element that satisfies the condition. If no element is found, it returns `-1`.

3.  **`if (productIndex === -1) { ... }`**
    *   This is our error handling. If `findIndex` returns `-1`, we know the product doesn't exist. We immediately stop and send a `404 Not Found` response.

4.  **`products[productIndex].name = req.body.name;`**
    *   Using the index we found, we can directly access the product object in the array (e.g., `products[1]`) and update its properties with the new values from `req.body`.

5.  **`res.status(200).json(products[productIndex]);`**
    *   We send a `200 OK` status, the standard for a successful request, and return the newly updated product object.

### **How to Test**
*   **Method:** `PUT`
*   **URL:** `http://localhost:3000/products/2` (to update the Smartphone)
*   **Body:** (select `raw` and `JSON`)
    ```json
    {
        "name": "Latest Smartphone",
        "price": 750
    }
    ```
*   You should get a `200` response with the updated smartphone data.

---

## **Part 4: Deleting a Product (DELETE Method)**

The `DELETE` method is used to remove a resource. We will create a `DELETE /products/:id` endpoint that finds a product by its ID and removes it from our array.

### **Action: Implement the DELETE Endpoint**

Add the final code block for our CRUD operations.

```javascript
// Endpoint to delete a product by ID
app.delete('/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const productIndex = products.findIndex(p => p.id === id);

    if (productIndex === -1) {
        return res.status(404).json({ message: "Product not found" });
    }

    products.splice(productIndex, 1);
    res.status(204).send();
});
```

### **Code Explanation**

1.  **Finding the Index and Error Handling:** This logic is identical to our `PUT` endpoint. We must first find the product to ensure it exists before we can delete it.

2.  **`products.splice(productIndex, 1);`**
    *   The `.splice()` array method is used to change the contents of an array by removing or replacing existing elements.
    *   The first argument (`productIndex`) is the starting index.
    *   The second argument (`1`) is the number of elements to remove.
    *   This line effectively says, "Starting at the `productIndex`, remove `1` element."

3.  **`res.status(204).send();`**
    *   `res.status(204)`: We set the status to `204 No Content`. This is the standard HTTP response for a successful action that does not need to send any data back in the response body (the resource is gone, so there's nothing to send).
    *   `.send()`: Since there's no body, we just use `.send()` to end the response without attaching any data.

### **How to Test**
*   **Method:** `DELETE`
*   **URL:** `http://localhost:3000/products/3` (to delete the Tablet)
*   **Body:** None is needed.
*   You should get back an empty response with a `204` status code. A subsequent `GET` to `/products` will show that the Tablet is no longer in the list.

---

## **Conclusion**

Congratulations! You have successfully built a complete in-memory RESTful API. Your application now supports all four fundamental CRUD operations, allowing clients to create, read, update, and delete products. This forms the backbone of almost any data-driven web service.
