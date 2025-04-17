import { useEffect, useState } from "react";
import { Card } from "antd";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { HiOutlineRefresh } from "react-icons/hi";
import "./css/Brands.css";

const postToken = import.meta.env.VITE_API_BACKEND_POST_TOKEN;
const getToken = import.meta.env.VITE_API_BACKEND_GET_TOKEN;
const baseUrl = import.meta.env.VITE_API_BASE_URL;

function Order() {
  const [orders, setOrder] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [id, setId] = useState("");
  const [refetchData, setRefetchData] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2; // Show 2 items per page

  const handleDelete = () => {
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${baseUrl}/backend/order/destroy`,
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
          let orderUpdate = orders.filter((el) => el._id !== id);

          setOrder(orderUpdate);
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

  const handleAddDelete = () => {
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${baseUrl}/backend/order/store`,
      headers: {
        "Content-Type": "application/json",
      },
      auth: {
        username: "user",
        password: postToken,
      },
      data: {
        uname: "IIT",
        phone: "01653623726",
        city: "Dhaka",
        area: "Demo",
        address: "Demo",
        email: "info@gmail.com",
        orderNotes: "",
        shippingCharge: "100",
        shippingMethod: "Outside Dhaka",

        productInfo: [
          {
            id: "67e2c2911d80ea3c33f71801",
            title: "Demo Title 3",
            price: 100,
            quantity: 4,
          },
          {
            id: "67e2c2911d80ea3c33f79635",
            title: "Demo Title 4",
            price: 100,
            quantity: 7,
          },
        ],
        totalAmount: 5060,
        discountAmount: "0",
        paymentGateway: "Cash On",
        amount: 5060,
        userId: null,
      },
    };

    axios
      .request(config)
      .then((response) => {
        if ("success" in response.data) {
          console.log(response.data.success.data);
        }
      })
      .catch((error) => {
        // console.log(error);
      });
  };

  const handleOrderUpdate = (id) => {
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${baseUrl}/backend/order/update`,
      headers: {
        "Content-Type": "application/json",
      },
      auth: {
        username: "user",
        password: postToken,
      },
      data: { id: id, orderStatus: "2" },
    };

    axios
      .request(config)
      .then((response) => {
        if ("success" in response.data) {
          let orderUpdate = orders.map((el) => {
            if (el._id == id) {
              return { ...el, orderStatus: "2" };
            }
            return el;
          });

          setOrder(orderUpdate);

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

  const [isRotating, setIsRotating] = useState(false);

  const handleClick = () => {
    setIsRotating(true);
    setTimeout(() => setIsRotating(false), 500);
    setRefetchData(!refetchData);
  };

  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${baseUrl}/backend/order/all`,
      auth: {
        username: "user",
        password: getToken,
      },
    };

    axios
      .request(config)
      .then((response) => {
        if ("success" in response.data) {
          console.log(response.data.success.data);
          setOrder(response.data.success.data);
        }
      })
      .catch((error) => {
        // console.log(error);
      });
  }, [refetchData]);

  // Filter orders based on search input
  const filteredOrders = orders.filter((el) =>
    [el.uname, el.email, el.phone].some((field) =>
      field?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Pagination Logic
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOrders = filteredOrders.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <Card title="All Order" className="iconParent">
      <div>
        <div className="main-box">
          <div className="one">
            <div className="row">
              <div className="col-md-3 form-group">
                {/* Search Input */}
                <input
                  type="text"
                  placeholder="Search by name, email, or phone"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mb-3 p-2 form-control border rounded w-full"
                />
              </div>
            </div>
            <table className="table table-striped table-bordered table-hover">
              <thead>
                <tr>
                  <th>#Sl</th>
                  {/* <th>Order Id</th> */}
                  <th>User Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>City</th>
                  <th>Area</th>
                  <th>Address</th>
                  <th>Order Notes</th>
                  <th>Shipping</th>
                  <th>Shipping Method</th>
                  <th>Pay Gateway</th>
                  <th>Product Info</th>
                  <th>Amount</th>
                  <th>Discount</th>
                  <th>Total</th>
                  <th>User (Login)</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.length !== 0 ? (
                  currentOrders.map((el, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      {/* <td>{el._id.toString()}</td> */}
                      <td>{el.uname}</td>
                      <td>{el.email ? el.email : "Empty"}</td>
                      <td>{el.phone}</td>
                      <td>{el.city}</td>
                      <td>{el.area}</td>
                      <td>{el.address}</td>
                      <td>{el.orderNotes ? el.orderNotes : "Empty"}</td>
                      <td>{el.shippingCharge}</td>
                      <td>{el.shippingMethod}</td>
                      <td>{el.paymentGateway}</td>
                      <td>
                        {el.productInfo?.length !== 0 &&
                          el.productInfo?.map((product, ind) => (
                            <div key={product.id}>
                              <div>
                                {product.title} (Quantity: {product.quantity}){" "}
                                <br />${product.price}
                              </div>
                              {ind !== el.productInfo.length - 1 && <br />}
                            </div>
                          ))}
                      </td>
                      <td>${el.totalAmount}</td>
                      <td>${el.discountAmount}</td>
                      <td>${el.amount}</td>
                      <td>{el.userId ? el.userId.uname : "Empty"}</td>
                      <td>
                        {el.orderStatus == "1" ? (
                          <div
                            role="group"
                            className="btn-group btn-group-sm commonBtn"
                          >
                            <button
                              onClick={() => handleOrderUpdate(el._id)}
                              className="btn btn-primary"
                            >
                              Accept
                            </button>

                            <button
                              type="button"
                              onClick={() => setId(el._id)}
                              className="btn btn-danger"
                              data-bs-toggle="modal"
                              data-bs-target="#exampleModal"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <button className="btn btn-sm btn-primary">
                            Accepted
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={17} className="text-center">
                      <h4>No data found on the Record.</h4>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-3 py-1 mx-2 border rounded bg-gray-200 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-3 py-1 mx-2">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 mx-2 border rounded bg-gray-200 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}

            {/* <button
              type="button"
              onClick={handleAddDelete}
              className="btn btn-danger"
            >
              Add Data
            </button> */}

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

        <HiOutlineRefresh
          className={`refreshCustom ${isRotating ? "rotate-animation" : ""}`}
          onClick={handleClick}
        />

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

export default Order;
