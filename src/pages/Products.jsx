import { useEffect, useState } from "react";
import { Card, Image } from "antd";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "./css/Brands.css";
import { Link } from "react-router-dom";

const postToken = import.meta.env.VITE_API_BACKEND_POST_TOKEN;
const getToken = import.meta.env.VITE_API_BACKEND_GET_TOKEN;
const baseUrl = import.meta.env.VITE_API_BASE_URL;
const imageBaseURL = import.meta.env.VITE_API_IMAGE_URL_KEY;

function Products() {
  const [products, setProducts] = useState([]);
  const [id, setId] = useState("");

  const handleDelete = () => {
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${baseUrl}/backend/product/destroy`,
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
          let productUpdate = products.filter((el) => el._id !== id);

          setProducts(productUpdate);
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
      url: `${baseUrl}/backend/product/allinfo`,
      auth: {
        username: "user",
        password: getToken,
      },
    };

    axios
      .request(config)
      .then((response) => {
        if ("success" in response.data) {
          // console.log(response.data.success.data);
          setProducts(response.data.success.data);
        }
      })
      .catch((error) => {
        // console.log(error);
      });
  }, []);

  const handleActiveArrival = (id) => {
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${baseUrl}/backend/product/arrival`,
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
          let productUpdate = products.map((el) => {
            if (el._id == id) {
              let updateArrival =
                el.newArrivals == "active" ? "inactive" : "active";
              return { ...el, newArrivals: updateArrival };
            }
            return el;
          });
          setProducts(productUpdate);

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

  return (
    <Card title="All Product">
      <div>
        <div className="main-box">
          <div className="one">
            <table className="table table-striped table-bordered table-hover">
              <thead>
                <tr>
                  <th>#Sl</th>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Brand</th>
                  <th>Category</th>
                  <th>SubCategory</th>
                  <th>Capacity</th>
                  <th>Price</th>
                  <th>SKU</th>
                  <th>Tags</th>
                  <th>New Arrivals</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {products.length !== 0 ? (
                  products.map((el, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        <Image
                          width={50}
                          src={`${imageBaseURL}/${el.thumbnails}`}
                        />
                      </td>
                      <td>{el.title}</td>
                      <td>
                        {el.brandId?.brandName
                          ? el.brandId?.brandName
                          : "Empty"}
                      </td>
                      <td>
                        {el.categoryId ? el.categoryId.categoryName : "Empty"}
                      </td>
                      <td>
                        {el.subcategoryId
                          ? el.subcategoryId.subCategory
                          : "Empty"}
                      </td>
                      <td>
                        {el.capacityId?.capacityName
                          ? el.capacityId?.capacityName
                          : "Empty"}
                      </td>
                      <td>${el.amount}</td>
                      <td>{el.sku ? el.sku : "Empty"}</td>
                      <td>{el.tagId.map((tag) => tag.tagName).join(", ")}</td>
                      <td>
                        {el.newArrivals == "active" ? (
                          <span
                            onClick={() => handleActiveArrival(el._id)}
                            className="btn btn-sm btn-success"
                          >
                            Active
                          </span>
                        ) : (
                          <span
                            onClick={() => handleActiveArrival(el._id)}
                            className="btn btn-sm btn-secondary"
                          >
                            InActive
                          </span>
                        )}
                      </td>

                      <td>
                        {el.productStatus == "active" ? (
                          <span className="btn btn-sm btn-success">Active</span>
                        ) : (
                          <span className="btn btn-sm btn-secondary">
                            InActive
                          </span>
                        )}
                      </td>

                      <td>
                        <div
                          role="group"
                          className="btn-group btn-group-sm commonBtn"
                        >
                          <Link
                            to={`/product/view/${el._id}`}
                            className="btn btn-info"
                          >
                            View
                          </Link>
                          <Link
                            to={`/product/edit/${el._id}`}
                            className="btn btn-primary"
                          >
                            Edit
                          </Link>
                          <button
                            type="button"
                            onClick={() => setId(el._id)}
                            className="btn btn-danger"
                            data-bs-toggle="modal"
                            data-bs-target="#exampleModal"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={14} className="text-center">
                      <h4>No data found on the Record.</h4>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

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

export default Products;
