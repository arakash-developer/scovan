import { useState } from "react";
import { Card } from "antd";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "./css/Brands.css";
import ErrorMessage from "./../components/error/ErrorMessage";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import buddhistEra from "dayjs/plugin/buddhistEra";
dayjs.extend(buddhistEra);

const baseUrl = import.meta.env.VITE_API_BASE_URL;
const postToken = import.meta.env.VITE_API_BACKEND_POST_TOKEN;

function Coupon() {
  const [isLoading, setIsLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponCodeError, setCouponCodeError] = useState("");

  const [discountType, setDiscountType] = useState("");
  const [discountTypeError, setDiscountTypeError] = useState("");

  const [shippingCharge, setShippingCharge] = useState("");
  const [shippingChargeError, setShippingChargeError] = useState("");

  const [discountRate, setDiscountRate] = useState("");
  const [discountRateError, setDiscountRateError] = useState("");

  const [minimumShopping, setMinimumShopping] = useState("");
  const [minimumShoppingError, setMinimumShoppingError] = useState("");

  const [maximumDiscount, setMaximumDiscount] = useState("");
  const [maximumDiscountError, setMaximumDiscountError] = useState("");

  const [expiredDate, setExpiredDate] = useState("");
  const [expiredDateError, setExpiredDateError] = useState("");

  const [resetDate, setResetDate] = useState(false);

  const onChange = (_, dateStr) => {
    const dateTime = dayjs(dateStr);
    const milliseconds = dateTime.valueOf();
    setExpiredDate(milliseconds);
    setExpiredDateError("");
  };

  const handleAddCoupon = () => {
    if (couponCode == "") {
      setCouponCodeError("This field is Required!");
    } else if (discountType == "") {
      setDiscountTypeError("This field is Required!");
    } else if (shippingCharge == "") {
      setShippingChargeError("This field is Required!");
    } else if (discountRate == "") {
      setDiscountRateError("This field is Required!");
    } else if (minimumShopping == "") {
      setMinimumShoppingError("This field is Required!");
    } else if (expiredDate == "") {
      setExpiredDateError("This field is Required!");
    } else if (discountType == "Percentage" && maximumDiscount == "") {
      setMaximumDiscountError("This field is Required!");
    } else {
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${baseUrl}/backend/coupon/store`,
        headers: {
          "Content-Type": "application/json",
        },
        auth: {
          username: "user",
          password: postToken,
        },
        data: {
          couponCode,
          discountType,
          shippingCharge,
          discountRate: Number(discountRate),
          minimumShopping: Number(minimumShopping),
          expiredDate,
          maximumDiscount: maximumDiscount == "" ? 1 : Number(maximumDiscount),
        },
      };
      setIsLoading(true);
      axios
        .request(config)
        .then((response) => {
          if ("success" in response.data) {
            setIsLoading(false);

            setCouponCode("");
            setCouponCodeError("");

            setDiscountType("");
            setDiscountTypeError("");

            setShippingCharge("");
            setShippingChargeError("");

            setDiscountRate("");
            setDiscountRateError("");

            setMinimumShopping("");
            setMinimumShoppingError("");

            setMaximumDiscount("");
            setMaximumDiscountError("");

            setExpiredDate("");
            setExpiredDateError("");

            setResetDate(!resetDate);

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
            setIsLoading(false);

            setCouponCode("");
            setCouponCodeError("");

            setDiscountType("");
            setDiscountTypeError("");

            setShippingCharge("");
            setShippingChargeError("");

            setDiscountRate("");
            setDiscountRateError("");

            setMinimumShopping("");
            setMinimumShoppingError("");

            setMaximumDiscount("");
            setMaximumDiscountError("");

            setExpiredDate("");
            setExpiredDateError("");

            setResetDate(!resetDate);

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
    }
  };

  return (
    <Card title="Add Coupon">
      <div>
        <div className="main-box">
          <div className="one">
            <div className="row">
              <div className="col-md-4 form-group">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => {
                    setCouponCode(e.target.value);
                    setCouponCodeError("");
                  }}
                  className="form-control"
                  placeholder="Discount Coupon"
                />

                {couponCodeError && <ErrorMessage message={couponCodeError} />}
              </div>

              <div className="col-md-4 form-group">
                <select
                  onChange={(e) => {
                    setDiscountType(e.target.value);
                    setDiscountTypeError("");

                    if (e.target.value == "Fixed") {
                      setMaximumDiscountError("");
                      setMaximumDiscount("");
                    }
                  }}
                  value={discountType}
                  className="form-select"
                >
                  <option value="">Discount Type</option>
                  <option value="Percentage">Percentage Discount (%)</option>
                  <option value="Fixed">Fixed discount ($)</option>
                </select>

                {discountTypeError && (
                  <ErrorMessage message={discountTypeError} />
                )}
              </div>

              <div className="col-md-4 form-group">
                <select
                  onChange={(e) => {
                    setShippingCharge(e.target.value);
                    setShippingChargeError("");
                  }}
                  value={shippingCharge}
                  className="form-select"
                >
                  <option value="">Shipping Charge</option>
                  <option value="Include">Include</option>
                  <option value="Free">Free</option>
                </select>

                {shippingChargeError && (
                  <ErrorMessage message={shippingChargeError} />
                )}
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-md-4 form-group">
                <input
                  type="number"
                  value={discountRate}
                  onChange={(e) => {
                    setDiscountRate(e.target.value);
                    setDiscountRateError("");
                  }}
                  className="form-control"
                  placeholder="Discount Rate"
                />

                {discountRateError && (
                  <ErrorMessage message={discountRateError} />
                )}
              </div>

              <div className="col-md-4 form-group">
                <input
                  type="number"
                  value={minimumShopping}
                  onChange={(e) => {
                    setMinimumShopping(e.target.value);
                    setMinimumShoppingError("");
                  }}
                  className="form-control"
                  placeholder="Minimum Shopping Amount"
                />

                {minimumShoppingError && (
                  <ErrorMessage message={minimumShoppingError} />
                )}
              </div>

              <div className="col-md-4 form-group">
                <DatePicker
                  showTime
                  onChange={onChange}
                  className="myCustomDate"
                  key={resetDate}
                />

                {expiredDateError && (
                  <ErrorMessage message={expiredDateError} />
                )}
              </div>
            </div>

            {discountType == "Percentage" && (
              <div className="row mt-3">
                <div className="col-md-4 form-group">
                  <input
                    type="number"
                    value={maximumDiscount}
                    onChange={(e) => {
                      setMaximumDiscount(e.target.value);
                      setMaximumDiscountError("");
                    }}
                    className="form-control"
                    placeholder="Maximum Discount"
                  />

                  {maximumDiscountError && (
                    <ErrorMessage message={maximumDiscountError} />
                  )}
                </div>
              </div>
            )}

            <div className="mt-4">
              <div className="">
                {isLoading ? (
                  <div className="spinner-border" role="status"></div>
                ) : (
                  <button onClick={handleAddCoupon} className="btn btn-primary">
                    Add Coupon
                  </button>
                )}
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

export default Coupon;
