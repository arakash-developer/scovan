import { useEffect, useState } from "react";
import { Card, Image, Flex, Rate } from "antd";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "./css/Brands.css";
import { Link } from "react-router-dom";

const postToken = import.meta.env.VITE_API_BACKEND_POST_TOKEN;
const getToken = import.meta.env.VITE_API_BACKEND_GET_TOKEN;
const baseUrl = import.meta.env.VITE_API_BASE_URL;
const imageBaseURL = import.meta.env.VITE_API_IMAGE_URL_KEY;

const desc = ["terrible", "bad", "normal", "good", "wonderful"];

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [id, setId] = useState(null);

  const handleDelete = () => {
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${baseUrl}/backend/review/destroy`,
      headers: {
        "Content-Type": "application/json",
      },
      auth: {
        username: "user",
        password: postToken,
      },
      data: { id: id._id, imgURL: id.photo, productId: id.productId._id },
    };

    axios
      .request(config)
      .then((response) => {
        if ("success" in response.data) {
          let orderUpdate = reviews.filter((el) => el._id !== id._id);

          setReviews(orderUpdate);
          setId(null);

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
          setId(null);

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
      url: `${baseUrl}/backend/review/all`,
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
          setReviews(response.data.success.data);
        }
      })
      .catch((error) => {
        // console.log(error);
      });
  }, []);

  const handleActiveReview = (id) => {
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${baseUrl}/backend/review/status`,
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
          let productUpdate = reviews.map((el) => {
            if (el._id == id) {
              let updateArrival =
                el.reviewStatus == "active" ? "inactive" : "active";
              return { ...el, reviewStatus: updateArrival };
            }
            return el;
          });
          setReviews(productUpdate);

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
    <Card title="All Review">
      <div>
        <div className="main-box">
          <div className="one">
            <table className="table table-striped table-bordered table-hover">
              <thead>
                <tr>
                  <th>#Sl</th>
                  <th>Photo</th>
                  <th>Name</th>
                  <th>Product</th>
                  <th>Rating</th>
                  <th>Comment</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {reviews.length !== 0 ? (
                  reviews.map((el, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        {el.photo == "" ? (
                          <Image width={50} src="/img/default.jpg" />
                        ) : (
                          <Image
                            width={50}
                            src={`${imageBaseURL}/${el.photo}`}
                          />
                        )}
                      </td>
                      <td>{el.uname}</td>
                      <td>{el.productId.title}</td>
                      <td>
                        <Flex gap="middle" vertical>
                          <Rate tooltips={desc} value={el.rating} />
                        </Flex>
                      </td>
                      <td>{el.comment}</td>
                      <td>
                        {el.reviewStatus == "active" ? (
                          <span
                            onClick={() => handleActiveReview(el._id)}
                            className="btn btn-sm btn-success"
                          >
                            Active
                          </span>
                        ) : (
                          <span
                            onClick={() => handleActiveReview(el._id)}
                            className="btn btn-sm btn-secondary"
                          >
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
                            to={`/review/edit/${el._id}`}
                            className="btn btn-primary"
                          >
                            Edit
                          </Link>
                          <button
                            type="button"
                            onClick={() => setId(el)}
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
                    <td colSpan={8} className="text-center">
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

export default Reviews;
