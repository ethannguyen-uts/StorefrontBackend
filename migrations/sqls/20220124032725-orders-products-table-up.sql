/* Replace with your SQL commands */
CREATE TABLE orders_products(
    id SERIAL PRIMARY KEY,
    quantity INTEGER,
    order_id BIGINT REFERENCES orders(id),
    product_id BIGINT REFERENCES products(id)
);
