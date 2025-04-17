import { useEffect, useState } from "react";
import { Card } from "antd";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "./css/Brands.css";
import dayjs from "dayjs";

const postToken = import.meta.env.VITE_API_BACKEND_POST_TOKEN;
const getToken = import.meta.env.VITE_API_BACKEND_GET_TOKEN;
const baseUrl = import.meta.env.VITE_API_BASE_URL;

function CouponAll() {
  const [coupons, setCoupons] = useState([]);
  const [id, setId] = useState("");

  const handleDelete = () => {
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${baseUrl}/backend/coupon/destroy`,
      headers: {
        "Content-Type": "application/json",
      },
      auth: {
        username: "user",
        password: postToken,
      },
      data: { id: id },
    };

    axios
      .request(config)
      .then((response) => {
        if ("success" in response.data) {
          let orderUpdate = coupons.filter((el) => el._id !== id);

          setCoupons(orderUpdate);
          setId("");

          toast.success(response.data.success.message, {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        } else {
          setId("");

          toast.error(response.data.error.message, {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
      })
      .catch((error) => {
        // console.log(error);
      });
  };

  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${baseUrl}/backend/coupon/all`,
      auth: {
        username: "user",
        password: getToken,
      },
    };

    axios
      .request(config)
      .then((response) => {
        if ("success" in response.data) {
          //   console.log(response.data.success.data);
          setCoupons(response.data.success.data);
        }
      })
      .catch((error) => {
        // console.log(error);
      });
  }, []);
 
  const handleClickCoupon = () => {
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${baseUrl}/backend/coupon/check`,
      headers: {
        "Content-Type": "application/json",
      },
      auth: {
        username: "user",
        password: postToken,
      },
      data: {
        couponCode: "checkCoupon2",
        amount: 4000,
        shippingCharge: 60,
      },
    };

    axios
      .request(config)
      .then((response) => {
 
        console.log("api", response.data);

        toast.success(response.data.success.message, {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

      })
      .catch((error) => {
        // console.log(error);
      });
  };

  return (
    <Card title="All Coupon">
      <div>
        <div className="main-box">
          <div className="one">
            <table className="table table-striped table-bordered table-hover">
              <thead>
                <tr>
                  <th>#Sl</th>
                  <th>Coupon Code</th>
                  <th>Discount Type</th>
                  <th>Shipping Charge</th>
                  <th>Discount Rate</th>
                  <th>Minimum Shopping</th>
                  <th>Maximum Discount</th>
                  <th>Expired Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {coupons.length !== 0 ? (
                  coupons.map((el, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{el.couponCode}</td>
                      <td>{el.discountType}</td>
                      <td>{el.shippingCharge}</td>
                      <td>
                        {el.discountType == "Percentage"
                          ? `${el.discountRate}%`
                          : `$${el.discountRate}`}{" "}
                      </td>
                      <td>${el.minimumShopping}</td>
                      <td>
                        {el.maximumDiscount == 1
                          ? "Empty"
                          : `$${el.maximumDiscount}`}
                      </td>
                      <td>
                        {dayjs(el.expiredDate).format("YYYY-MM-DD HH:mm:ss")}{" "}
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => setId(el._id)}
                          className="btn btn-danger"
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModal"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="text-center">
                      <h4>No data found on the Record.</h4>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <button
              type="button"
              onClick={handleClickCoupon}
              className="btn btn-danger"
            >
              Check Coupon
            </button>

            <div
              className="modal fade"
              id="exampleModal"
              aria-labelledby="exampleModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">
                      Are You Sure?
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body">
                    <h4>Do you want to delete this User ?</h4>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-bs-dismiss="modal"
                    >
                      No
                    </button>
                    <button
                      type="button"
                      onClick={handleDelete}
                      data-bs-dismiss="modal"
                      className="btn btn-danger"
                    >
                      Yes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </Card>
  );
}

export default CouponAll;
