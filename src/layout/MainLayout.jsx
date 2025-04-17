import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import {
  AppstoreOutlined,
  TagOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { LiaStoreAltSolid } from "react-icons/lia";
import { MdOutlineRateReview } from "react-icons/md";
import { RiCoupon3Line } from "react-icons/ri";
import { GrCapacity } from "react-icons/gr";
import { GiVerticalBanner } from "react-icons/gi";
import { SiBrandfolder } from "react-icons/si";
import { TbCategory2 } from "react-icons/tb";
import { FiUser } from "react-icons/fi";
import { updateUser } from "../features/user/userSlice";
const { Content, Sider } = Layout;

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

function MainLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const urlString = window.location.pathname.split("/");

  const [items, setItems] = useState([
    getItem("Banners", "sub1", <GiVerticalBanner />, [
      getItem("All Banner", "/banner"),
    ]),
    {
      type: "divider",
    },
    getItem("Brands", "sub2", <SiBrandfolder />, [
      getItem("All Brand", "/brands"),
    ]),
    {
      type: "divider",
    },
    getItem("Categories", "sub3", <TbCategory2 />, [
      getItem("All Category", "/category"),
    ]),
    {
      type: "divider",
    },
    getItem("SubCategory", "sub4", <AppstoreOutlined />, [
      getItem("All Sub Category", "/subcategory"),
    ]),
    {
      type: "divider",
    },
    getItem("Tags", "sub5", <TagOutlined />, [getItem("All Tag", "/tags")]),
    {
      type: "divider",
    },
    getItem("Capacity", "sub6", <GrCapacity />, [
      getItem("All Capacity", "/capacity"),
    ]),
    {
      type: "divider",
    },
    getItem("Testimonial", "sub7", <AppstoreOutlined />, [
      getItem("All Testimonial", "/testimonial"),
    ]),
    {
      type: "divider",
    },
    getItem("Coupon", "sub8", <RiCoupon3Line />, [
      getItem("Add Coupon", "/addcoupon"),
      getItem("All Coupon", "/coupon"),
    ]),
    {
      type: "divider",
    },
    getItem("Products", "sub9", <ShoppingCartOutlined />, [
      getItem("Add Product", "/addproduct"),
      getItem("All Product", "/products"),
    ]),
    {
      type: "divider",
    },
    getItem("Reviews", "sub10", <MdOutlineRateReview />, [
      getItem("Add Review", "/addreview"),
      getItem("All Reviews", "/reviews"),
    ]),
    {
      type: "divider",
    },
    getItem("Order", "sub11", <LiaStoreAltSolid />, [
      getItem("All Order", "/order"),
    ]),
    {
      type: "divider",
    },
    getItem("Account", "sub12", <FiUser />, [getItem("Logout", "13")]),
    {
      type: "divider",
    },
  ]);

  // getItem("User Account", "/profile"),

  const userAuth = useSelector((state) => state.userInfo.userData);

  useEffect(() => {
    if (userAuth && "error" in userAuth) {
      if (!userAuth.error) {
        navigate("/login");
      }
    }
  }, [userAuth, navigate]);

  useEffect(() => {
    if (userAuth.role === "user") {
      setItems(items.slice(items.length - 2, items.length - 1));
      navigate("/");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    dispatch(updateUser({ error: false }));
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  const onClick = (e) => {
    if (e.key !== "13") {
      navigate(e.key);
    }

    if (e.keyPath[1] === "sub12") {
      if (e.key === "13") {
        handleLogout();
      }
    }
  };

  return (
    <Layout>
      <Layout>
        <Sider
          width={200}
          style={{
            background: colorBgContainer,
          }}
        >
          <Menu
            onClick={onClick}
            mode="inline"
            items={items}
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["sub1"]}
            style={{
              height: "100vh",
              borderRight: 0,
            }}
          />
        </Sider>
        <Layout
          style={{
            padding: "0 24px 24px",
          }}
        >
          <Breadcrumb
            style={{
              margin: "16px 0",
            }}
            items={[
              {
                title: <NavLink to="/">Dashboard</NavLink>,
              },
              {
                title: urlString[1] ? urlString[1] : "Home",
              },
            ]}
          />

          <Content
            style={{
              padding: 24,
              margin: 0,
              height: "100%",
              background: colorBgContainer,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default MainLayout;
