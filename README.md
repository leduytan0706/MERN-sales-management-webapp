# Sales Management System For Convenienve Store (Web App)

Tech Stack: MERN stack - MongoDB, Express, React, Node.js + Cloudinary

* MongoDB: store data for products, orders, imports, ...
* Express: Web API for authentication, CRUD functions for products, orders, imports, ...
* React: Web UI
* Node.js: Development environment

## Functions
<img width="1903" height="1079" alt="Screenshot 2025-03-26 232156" src="https://github.com/user-attachments/assets/45dcddb6-04d1-4dbc-a9ac-596b81fe901f" />

### Category Management
<img width="1920" height="1080" alt="Screenshot 2025-03-22 220922" src="https://github.com/user-attachments/assets/6ae9baec-decb-46ea-8202-dcee509de960" />


### Supplier Management
<img width="1920" height="1080" alt="Screenshot 2025-03-22 221211" src="https://github.com/user-attachments/assets/3d387902-c18e-47b6-8cf1-9b404349fb02" />


### Product Management
<img width="1920" height="1080" alt="Screenshot 2025-03-22 222201" src="https://github.com/user-attachments/assets/97cb73de-1f07-4e9d-a74a-09b5e857f717" />


### Import Management

* Include import items, import quantity, export quantiy, import price, export price, expiry date of each item.
* Automatically increase the stock of each item when new import is added

<img width="1920" height="1080" alt="Screenshot 2025-03-22 230100" src="https://github.com/user-attachments/assets/a6cf6372-dd3c-49c8-a882-3a7b7feeb1ce" />


### Order Management

* Include the customer name, order items, quantity and price of each item
* When new order is added, the system will decrease the stock of the oldest import.

<img width="1920" height="1080" alt="Screenshot 2025-03-22 233945" src="https://github.com/user-attachments/assets/ef92ad60-24d4-4413-b652-cdb826df5a09" />


## Demo Web App

Demo Version of Web App: [Vite + React](https://mern-sales-management-ui.vercel.app/)

Demo account: Check the directory backend/user_demo.json

## Upload File Function

Product Management Area has a function that you can upload an excel (.xlsx) file, the system will read the data and display the preview products before adding it to the database depending on user's confirmation

Example of file template to upload should be like

| STT | HinhAnh                                                                                                                                                                                                                                                     | MaSP   | MaVach        | TenSanPham                                     | DonGia | DonVi | Ton | DinhMuc | GhiChu | DanhMuc                         |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ------------- | ---------------------------------------------- | ------ | ----- | --- | ------- | ------ | ------------------------------- |
| 1   | [https://cdn.tgdd.vn/Products/Images/2567/213563/bhx/tuong-ot-chinsu-chai-500g-201911011615532253.jpg](https://cdn.tgdd.vn/Products/Images/2567/213563/bhx/tuong-ot-chinsu-chai-500g-201911011615532253.jpg)                                                   | SP0024 | 8936136161143 | Tương ớt Chinsu chai eo 500g                | 28000  | Chai  | 0   | 5       |        | Thực phẩm khô và chế biến |
| 2   | [https://www.lottemart.vn/media/catalog/product/cache/0x0/8/9/8936136163512-1.jpg.webp](https://www.lottemart.vn/media/catalog/product/cache/0x0/8/9/8936136163512-1.jpg.webp)                                                                                 | SP0025 | 8936136163512 | Nước Mắm Chinsu Hương Cá Hồi Chai 500ml | 55000  | Chai  | 0   | 5       |        | Thực phẩm khô và chế biến |
| 3   | [https://product.hstatic.net/200000352097/product/c4a2a09522c5707916fd5ab719ff3caa_426f492847954cb494ab12b6fc845faf_grande.png](https://product.hstatic.net/200000352097/product/c4a2a09522c5707916fd5ab719ff3caa_426f492847954cb494ab12b6fc845faf_grande.png) | SP0026 | 8935039500509 | Bột Ngọt Ajinomoto Gói 454g                 | 38000  | Gói  | 0   | 5       |        | Thực phẩm khô và chế biến |
