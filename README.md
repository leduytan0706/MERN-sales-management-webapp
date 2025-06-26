# Sales Management System For Convenienve Store (Web App)

Tech Stack: MERN stack - MongoDB, Express, React, Node.js + Cloudinary

* MongoDB: store data for products, orders, imports, ...
* Express: Web API for authentication, CRUD functions for products, orders, imports, ...
* React: Web UI
* Node.js: Development environment

## Functions

### Category Management

### Supplier Management

### Product Management

### Import Management

* Include import items, import quantity, export quantiy, import price, export price, expiry date of each item.
* Automatically increase the stock of each item when new import is added

### Order Management

* Include the customer name, order items, quantity and price of each item
* When new order is added, the system will decrease the stock of the oldest import.

## Demo Web App

Demo Version of Web App: [Vite + React](https://mern-sales-management-ui.vercel.app/)

Demo account: 

* Email: leduytan0706@example.com
* Password: Contact/DM/Message to get password

## Upload File Function

Product Management Area has a function that you can upload an excel (.xlsx) file, the system will read the data and display the preview products before adding it to the database depending on user's confirmation

Example of file template to upload should be like

| STT | HinhAnh                                                                                                                                                                                                                                                     | MaSP   | MaVach        | TenSanPham                                     | DonGia | DonVi | Ton | DinhMuc | GhiChu | DanhMuc                         |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ------------- | ---------------------------------------------- | ------ | ----- | --- | ------- | ------ | ------------------------------- |
| 1   | [https://cdn.tgdd.vn/Products/Images/2567/213563/bhx/tuong-ot-chinsu-chai-500g-201911011615532253.jpg](https://cdn.tgdd.vn/Products/Images/2567/213563/bhx/tuong-ot-chinsu-chai-500g-201911011615532253.jpg)                                                   | SP0024 | 8936136161143 | Tương ớt Chinsu chai eo 500g                | 28000  | Chai  | 0   | 5       |        | Thực phẩm khô và chế biến |
| 2   | [https://www.lottemart.vn/media/catalog/product/cache/0x0/8/9/8936136163512-1.jpg.webp](https://www.lottemart.vn/media/catalog/product/cache/0x0/8/9/8936136163512-1.jpg.webp)                                                                                 | SP0025 | 8936136163512 | Nước Mắm Chinsu Hương Cá Hồi Chai 500ml | 55000  | Chai  | 0   | 5       |        | Thực phẩm khô và chế biến |
| 3   | [https://product.hstatic.net/200000352097/product/c4a2a09522c5707916fd5ab719ff3caa_426f492847954cb494ab12b6fc845faf_grande.png](https://product.hstatic.net/200000352097/product/c4a2a09522c5707916fd5ab719ff3caa_426f492847954cb494ab12b6fc845faf_grande.png) | SP0026 | 8935039500509 | Bột Ngọt Ajinomoto Gói 454g                 | 38000  | Gói  | 0   | 5       |        | Thực phẩm khô và chế biến |
