import { useEffect, useState } from "react";
import { Card } from "antd";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "./css/Brands.css";
import ErrorMessage from "./../components/error/ErrorMessage";

const postToken = import.meta.env.VITE_API_BACKEND_POST_TOKEN;
const getToken = import.meta.env.VITE_API_BACKEND_GET_TOKEN;
const baseUrl = import.meta.env.VITE_API_BASE_URL;

function Capacity() {
  const [isLoading, setIsLoading] = useState(false);
  const [capacity, setCapacity] = useState([]);
  const [id, setId] = useState("");

  const [capacityName, setCapacityName] = useState("");
  const [capacityNameError, setCapacityNameError] = useState("");

  const handleChangeInput = (el) => {
    let { name, value } = el.target;

    if (value !== "") {
      setCapacityNameError("");
    }
    setCapacityName(value);
  };

  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${baseUrl}/backend/capacity/all`,
      auth: {
        username: "user",
        password: getToken,
      },
    };

    axios
      .request(config)
      .then((response) => {
        if ("success" in response.data) {
          setCapacity(response.data.success.data);
        }
      })
      .catch((error) => {
        // console.log(error);
      });
  }, []);

  const handleAddCapacity = () => {
    if (capacityName == "") {
      setCapacityNameError("Capacity Name field is required.");
    } else {
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${baseUrl}/backend/capacity/store`,
        headers: {
          "Content-Type": "application/json",
        },
        auth: {
          username: "user",
          password: postToken,
        },
        data: { title: capacityName },
      };

      setIsLoading(true);
      axios
        .request(config)
        .then((response) => {
          if ("success" in response.data) {
            setIsLoading(false);
            setId("");
            setCapacityName("");
            setCapacityNameError("");

            setCapacity((prev) => [...prev, response.data.success.data]);

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
            setId("");
            setCapacityName("");
            setCapacityNameError("");

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

  const handleDelete = () => {
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${baseUrl}/backend/capacity/destroy`,
      headers: {
        "Content-Type": "application/json",
      },
      auth: {
        username: "user",
        password: postToken,
      },
      data: { _id: id._id },
    };

    axios
      .request(config)
      .then((response) => {
        if ("success" in response.data) {
          let capacityUpdate = capacity.filter((el) => el._id !== id._id);

          setCapacity(capacityUpdate);
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

  return (
    <Card title="All Capacity">
      <div>
        <div className="main-box">
          <div className="one">
            <div className="row">
              <div className="col-md-8 form-group">
                <input
                  type="text"
                  name="capacityName"
                  value={capacityName}
                  onChange={handleChangeInput}
                  className="form-control"
                  placeholder="Capacity Type"
                />

                {capacityNameError && (
                  <ErrorMessage message={capacityNameError} />
                )}
              </div>
            </div>

            <div className="mt-4">
              <div className="">
                {isLoading ? (
                  <div className="spinner-border" role="status"></div>
                ) : (
                  <button
                    onClick={handleAddCapacity}
                    className="btn btn-primary"
                  >
                    Add Capacity
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="one">
            <table className="table table-striped table-bordered table-hover">
              <thead>
                <tr>
                  <th>#Sl</th>
                  <th>Capacity Type</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {capacity.length !== 0 ? (
                  capacity.map((el, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{el.capacityName}</td>
                      <td>
                        <div
                          role="group"
                          className="btn-group btn-group-sm commonBtn"
                        >
                          <button
                            type="button"
                            className="btn btn-danger"
                            data-bs-toggle="modal"
                            onClick={() => setId(el)}
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
                    <td colSpan={3} className="text-center">
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

export default Capacity;
