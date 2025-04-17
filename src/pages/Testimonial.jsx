import { useEffect, useState } from "react";
import { Card } from "antd";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "./css/Brands.css";
import ErrorMessage from "./../components/error/ErrorMessage";

const postToken = import.meta.env.VITE_API_BACKEND_POST_TOKEN;
const getToken = import.meta.env.VITE_API_BACKEND_GET_TOKEN;
const baseUrl = import.meta.env.VITE_API_BASE_URL;
const imageBaseURL = import.meta.env.VITE_API_IMAGE_URL_KEY;

function Testimonial() {
  const [isLoading, setIsLoading] = useState(false);

  const [testimonialAll, setTestimonialAll] = useState([]);
  const [id, setId] = useState("");

  const [uname, setUname] = useState("");
  const [designation, setDesignation] = useState("");
  const [testimonialData, setTestimonialData] = useState("");

  const [imageInfo, setImageInfo] = useState({
    imageName: "",
    imageSize: "",
    imageType: "",
  });
  const [imageBase64Data, setImageBase64Data] = useState("");
  const [fileKey, setFileKey] = useState(0);

  const [inputError, setInputError] = useState({
    uname: "",
    testimonialData: "",
    photo: "",
  });

  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${baseUrl}/backend/testimonial/all`,
      auth: {
        username: "user",
        password: getToken,
      },
    };

    axios
      .request(config)
      .then((response) => {
        if ("success" in response.data) {
          setTestimonialAll(response.data.success.data);
        }
      })
      .catch((error) => {
        // console.log(error);
      });
  }, [fileKey]);

  const handleInputFile = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Data = e.target.result;
        setImageBase64Data(base64Data);
      };

      reader.readAsDataURL(file);
    }

    setImageInfo({
      imageName: event.target.files[0].name,
      imageSize: event.target.files[0].size,
      imageType: event.target.files[0].type,
    });
    setInputError((prev) => ({ ...prev, photo: "" }));
  };

  const handleAddTestimonial = () => {
    if (uname == "") {
      setInputError((prev) => ({ ...prev, uname: "This field is required." }));
    } else if (imageInfo.imageName == "") {
      setInputError((prev) => ({ ...prev, photo: "This field is required." }));
    } else if (testimonialData == "") {
      setInputError((prev) => ({
        ...prev,
        testimonialData: "This field is required.",
      }));
    } else {
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${baseUrl}/backend/testimonial/store`,
        headers: {
          "Content-Type": "application/json",
        },
        auth: {
          username: "user",
          password: postToken,
        },
        data: {
          uname,
          testimonial: testimonialData,
          photo: { imageInfo, imageBase64Data },
          designation,
        },
      };

      setIsLoading(true);
      axios
        .request(config)
        .then((response) => {
          if ("success" in response.data) {
            setIsLoading(false);
            setFileKey((prevKey) => prevKey + 1);
            setInputError({
              uname: "",
              testimonialData: "",
              photo: "",
            });

            setUname("");
            setDesignation("");
            setTestimonialData("");

            setImageInfo({
              imageName: "",
              imageSize: "",
              imageType: "",
            });
            setImageBase64Data("");

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
            setFileKey((prevKey) => prevKey + 1);
            setInputError({
              uname: "",
              testimonialData: "",
              photo: "",
            });
            setUname("");
            setDesignation("");
            setTestimonialData("");
            setImageInfo({
              imageName: "",
              imageSize: "",
              imageType: "",
            });
            setImageBase64Data("");

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
      url: `${baseUrl}/backend/testimonial/destroy`,
      headers: {
        "Content-Type": "application/json",
      },
      auth: {
        username: "user",
        password: postToken,
      },
      data: { _id: id._id, imgURL: id.photo },
    };

    axios
      .request(config)
      .then((response) => {
        if ("success" in response.data) {
          let testimonialUpdate = testimonialAll.filter((el) => el._id !== id._id);

          setTestimonialAll(testimonialUpdate);
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
    <Card title="All Testimonial">
      <div>
        <div className="main-box">
          <div className="fromInput">
            <div className="row">
              <div className="col-md-6 form-group">
                <input
                  type="text"
                  value={uname}
                  onChange={(e) => {
                    setUname(e.target.value);
                    setInputError((prev) => ({ ...prev, uname: "" }));
                  }}
                  className="form-control"
                  placeholder="User Name"
                />

                {inputError.uname && (
                  <ErrorMessage message={inputError.uname} />
                )}
              </div>

              <div className="col-md-6 form-group mt-3 mt-md-0">
                <input
                  key={fileKey}
                  className="form-control"
                  onChange={handleInputFile}
                  type="file"
                />

                {inputError.photo && (
                  <ErrorMessage message={inputError.photo} />
                )}
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-md-6 form-group">
                <textarea
                  className="form-control"
                  rows={5}
                  value={testimonialData}
                  onChange={(e) => {
                    setTestimonialData(e.target.value);
                    setInputError((prev) => ({ ...prev, testimonialData: "" }));
                  }}
                  placeholder="Testimonial"
                />

                {inputError.testimonialData && (
                  <ErrorMessage message={inputError.testimonialData} />
                )}
              </div>

              <div className="col-md-6 form-group mt-3 mt-md-0">
                <input
                  type="text"
                  value={designation}
                  onChange={(e) => {
                    setDesignation(e.target.value);
                  }}
                  className="form-control"
                  placeholder="Designation (Optional)"
                />
              </div>
            </div>

            <div className="mt-4">
              <div className="">
                {isLoading ? (
                  <div className="spinner-border" role="status"></div>
                ) : (
                  <button
                    onClick={handleAddTestimonial}
                    className="btn btn-primary"
                  >
                    Add Testimonial
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="tableData">
            <table className="table table-striped table-bordered table-hover">
              <thead>
                <tr>
                  <th>#Sl</th>
                  <th>Photo</th>
                  <th>User Name</th>
                  <th>Designation</th>
                  <th>Testimonial</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {testimonialAll.length !== 0 ? (
                  testimonialAll.map((el, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>

                      <td>
                        <div className="thumbnail-change">
                          <img
                            src={`${imageBaseURL}/${el.photo}`}
                            className="img-thumbnail"
                            alt={el.photo}
                          />
                        </div>
                      </td>
                      <td>{el.uname}</td>
                      <td>{el.designation}</td>
                      <td>
                        <p>{el.testimonial}</p>
                      </td>
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
                    <td colSpan={6} className="text-center">
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

export default Testimonial;
