import React, { useEffect } from "react";
import {Routes, Route, Navigate, useLocation, useNavigate} from "react-router-dom";
import {Toaster} from "react-hot-toast"
import './App.css'

import Sidebar from "./components/Sidebar.jsx";
import HomePage from "./pages/HomePage";
import Category from "./pages/Category.jsx";
import Product from "./pages/Product.jsx";
import Supplier from "./pages/Supplier.jsx";
import Import from "./pages/Import.jsx";
import Order from "./pages/Order.jsx";
import Reports from "./pages/Reports.jsx";
import Header from "./components/Header.jsx";
import useAuthStore from "./store/useAuthStore.js";
import LoginPage from "./pages/LoginPage.jsx";
import { CircularProgress } from "@mui/material";

import AddCategory from "./components/category/AddCategory.jsx";
import UpdateCategory from "./components/category/UpdateCategory.jsx";

import AddSupplier from "./components/supplier/AddSupplier.jsx";
import UpdateSupplier from "./components/supplier/UpdateSupplier.jsx";
import SupplierDetail from "./components/supplier/SupplierDetail.jsx";

import AddProduct from "./components/product/AddProduct.jsx";
import ProductDetail from "./components/product/ProductDetail.jsx";
import UpdateProduct from "./components/product/UpdateProduct.jsx";

import ImportDetail from "./components/import/ImportDetail.jsx";
import AddImport from "./components/import/AddImport.jsx";
import UpdateImport from "./components/import/UpdateImport.jsx";

import OrderDetail from "./components/order/OrderDetail.jsx";
import AddOrder from "./components/order/AddOrder.jsx";
import UpdateOrder from "./components/order/UpdateOrder.jsx";

import User from "./pages/User.jsx";

import UpdateProfile from "./components/auth/UpdateProfile.jsx";
import AddUser from "./components/user/AddUser.jsx";
import ProfileDetail from "./components/auth/ProfileDetail.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import PendingDev from "./components/PendingDev.jsx";
import Discount from "./pages/Discount.jsx";
import DiscountDetail from "./components/discount/DiscountDetail.jsx";
import AddDiscount from "./components/discount/AddDiscount.jsx";
import UpdateDiscount from "./components/discount/UpdateDiscount.jsx";

function App() {
  const {authUser, isCheckingAuth, checkAuth} = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();


  useEffect(() => {
    checkAuth();
    switch (location.pathname) {
      default:
        useAuthStore.setState({isDeleteMode: false});
        useAuthStore.setState({isLoadingPage: false});
        useAuthStore.setState({isProcessing: false});
    }
  }, [checkAuth, location.pathname]);


  // Check if the current route is AddOrder or UpdateOrder
  const isFullPageLayout = location.pathname.startsWith("/order/new") || location.pathname.startsWith("/order/update");

  if (isCheckingAuth){
    return <CircularProgress size={64} />
  }

    return (
      <>
          {!authUser? (
            <Routes>
              <Route path="/login" element={<LoginPage />}/>
              <Route path="/*" element={<Navigate to="/login" />} />
            </Routes>
          ): (
          <>
            {isFullPageLayout? (
            <div className="order-pages">
              <Routes >
                <Route element={<ProtectedRoute allowedRoles={["sales", "manager"]}/>}>
                  <Route path="/order/new" element={<AddOrder />} />
                  <Route path="/order/update/:id" element={<UpdateOrder />} />
                </Route>
                
              </Routes>
            </div>
            ) : (
            <div className="overall">
              <div className="sidebar">
                <Sidebar />
              </div>
              
              <div className="main">
                <Header />
                <Routes>
                  <Route path="/" element={<HomePage />}/>

                  <Route path="/category" element={<Category />}/>
                  
                  <Route element={<ProtectedRoute allowedRoles={["inventory","manager"]}/>}>
                    <Route path="/category/new" element={<AddCategory />}/>
                    <Route path="/category/update/:id" element={<UpdateCategory />}/>
                  </Route>
                  

                  <Route path="/supplier" element={<Supplier />}/>

                  <Route element={<ProtectedRoute allowedRoles={["inventory","manager"]}/>}>
                    <Route path="/supplier/:id" element={<SupplierDetail />}/>
                    <Route path="/supplier/new" element={<AddSupplier />}/>
                    <Route path="/supplier/update/:id" element={<UpdateSupplier />}/>
                  </Route>
                  
                  <Route path="/product" element={<Product />}/>

                  <Route element={<ProtectedRoute allowedRoles={["inventory","manager"]}/>}>
                    <Route path="/product/:id" element={<ProductDetail />}/>
                    <Route path="/product/new" element={<AddProduct />}/>
                    <Route path="/product/update/:id" element={<UpdateProduct />}/>
                  </Route>

                  <Route path="/discount" element={<Discount />} />

                  <Route element={<ProtectedRoute allowedRoles={["sales","manager"]}/>}>
                    <Route path="/discount/:id" element={<DiscountDetail />}/>
                    <Route path="/discount/new" element={<AddDiscount />}/>
                    <Route path="/discount/update/:id" element={<UpdateDiscount />}/>
                  </Route>

                  <Route path="/import" element={<Import />}/>

                  <Route element={<ProtectedRoute allowedRoles={["inventory","manager"]}/>}>
                    <Route path="/import/:id" element={<ImportDetail />}/>
                    <Route path="/import/new" element={<AddImport />}/>
                    <Route path="/import/update/:id" element={<UpdateImport />}/>
                  </Route>

                  <Route path="/order" element={<Order />}/>

                  <Route element={<ProtectedRoute allowedRoles={["sales","manager"]}/>}>
                    <Route path="/order/:id" element={<OrderDetail />} />
                  </Route>
                  
                  <Route element={<ProtectedRoute allowedRoles={["accountant","manager"]}/>}>
                    <Route path="/report" element={<Reports />}/>
                  </Route>
                  

                  <Route path="/user" element={<User />}/>

                  <Route element={<ProtectedRoute allowedRoles={["manager"]}/>}>
                    <Route path="/user/new" element={<AddUser />} />
                  </Route>
                  

                  <Route path="/profile" element={<ProfileDetail />} />
                  <Route path="/profile/update" element={<UpdateProfile />} />

                  <Route path="/settings" element={<PendingDev />} />

                  <Route path="/*" element={<Navigate to="/" />} />

                  
                </Routes>
              </div>
            </div>)}
          </>
          )
          }
        <Toaster 
          position="top-center"
          reverseOrder="true"
          toastOptions={{
            duration: 2000,
            removeDelay: 1000,
          }}
        />
      </>);
  }

export default App
