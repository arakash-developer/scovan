import {
  Route,
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
} from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Home from "./pages/Home";
// import UserAdd from "./pages/UserAdd";
// import UserEdit from "./pages/UserEdit";
import Error from "./pages/Error";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import EmailConfirm from "./pages/EmailConfirm";
// import Forgot from "./pages/Forgot";
// import ChangePassword from "./pages/ChangePassword";
import ForgotError from "./pages/ForgotError";
import Brands from "./pages/Brands";
// import CustomerMain from "./pages/CustomerMain";
import Categories from "./pages/Categories";
import Tags from "./pages/Tags";
import Capacity from "./pages/Capacity";
import Product from "./pages/Product";
import Products from "./pages/Products";
import EditProduct from "./pages/EditProduct";
import ProductView from "./pages/ProductView";
import Order from "./pages/Order";
import SubCategory from "./pages/SubCategory";
import Testimonial from "./pages/Testimonial";
import Coupon from "./pages/Coupon";
import CouponAll from "./pages/CouponAll";
import ReviewAdd from "./pages/ReviewAdd";
import Reviews from "./pages/Reviews";
import ReviewEdit from "./pages/ReviewEdit";
import Banner from "./pages/Banner";
  
function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="/brands" element={<Brands />} />
          <Route path="/category" element={<Categories />} />
          <Route path="/tags" element={<Tags />} />
          <Route path="/capacity" element={<Capacity />} />
          <Route path="/subcategory" element={<SubCategory />} />
          <Route path="/addproduct" element={<Product />} />
          <Route path="/products" element={<Products />} />
          <Route path="/testimonial" element={<Testimonial />} />
          <Route path="/addcoupon" element={<Coupon />} />
          <Route path="/addreview" element={<ReviewAdd />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/banner" element={<Banner />} />
          <Route path="/coupon" element={<CouponAll />} />
          <Route path="/review/edit/:id" element={<ReviewEdit />} />
          <Route path="/product/edit/:id" element={<EditProduct />} />
          <Route path="/product/view/:id" element={<ProductView />} />
          <Route path="/order" element={<Order />} />
          {/* <Route path="add" element={<UserAdd />} />
          <Route path="view/:id" element={<CustomerMain />} /> */}
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/registrar" element={<Registration />} />
        {/* <Route path="/emailconfirm" element={<EmailConfirm />} />
        <Route path="/forgot-error" element={<ForgotError />} /> */}

        {/* 
             <Route path="/forgot" element={<Forgot />} />
            <Route path="/change-password/:token" element={<ChangePassword />} /> 
        */}
        <Route path="/*" element={<Error />} />
      </>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
