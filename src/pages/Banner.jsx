import { useEffect, useState } from "react";
import { Card, Image } from "antd";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "./css/Brands.css";
import ErrorMessage from "./../components/error/ErrorMessage";

const postToken = import.meta.env.VITE_API_BACKEND_POST_TOKEN;
const getToken = import.meta.env.VITE_API_BACKEND_GET_TOKEN;
const baseUrl = import.meta.env.VITE_API_BASE_URL;
const imageBaseURL = import.meta.env.VITE_API_IMAGE_URL_KEY;

function Banner() {
  const [isLoading, setIsLoading] = useState(false);

  const [brands, setBrands] = useState([]);
  const [id, setId] = useState(null);

  const [brandInput, setBrandInput] = useState({
    brandName: "",
    brandLogo: "",
  });

  const [brandInputError, setBrandInputError] = useState({
    brandName: "",
    brandLogo: "",
  });

  const handleChangeInput = (el) => {
    let { name, value } = el.target;

    if (value !== "") {
      setBrandInputError({ ...brandInputError, [name]: "" });
    }
    setBrandInput({ ...brandInput, [name]: value });
  };

  const [description, setDescription] = useState("");
  const [descriptionError, setDescriptionError] = useState("");

  const [imageInfo, setImageInfo] = useState({
    imageName: "",
    imageSize: "",
    imageType: "",
  });
  const [imageBase64Data, setImageBase64Data] = useState("");
  const [fileKey, setFileKey] = useState(0);

  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${baseUrl}/backend/banner/all`,
      auth: {
        username: "user",
        password: getToken,
      },
    };

    axios
      .request(config)
      .then((response) => {
        if ("success" in response.data) {
          setBrands(response.data.success.data);
        }
      })
      .catch((error) => {
        // console.log(error);
      });
  }, []);
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
    setBrandInputError({ ...brandInputError, brandLogo: "" });
  };

  const handleAddBrand = () => {
    if (brandInput.brandName == "") {
      setBrandInputError({
        ...brandInputError,
        brandName: "Banner Title field is required.",
      });
    } else if (description == "") {
      setDescriptionError("Banner Description field is required.");
    } else if (imageInfo.imageName == "") {
      setBrandInputError({
        ...brandInputError,
        brandLogo: "Banner Image field is required.",
      });
    } else {
      let imageFormats = ["jpeg", "jpg", "png", "webp", "svg"];
      let checkImgFormate = imageFormats.includes(
        imageInfo.imageType.split("/")[1]
      );

      if (!checkImgFormate) {
        setBrandInputError({
          ...brandInputError,
          brandLogo: "Your file must be png, jpg, webp, jpeg and svg.",
        });
      } else if (brandInput.brandName != "" && checkImgFormate) {
        let config = {
          method: "post",
          maxBodyLength: Infinity,
          url: `${baseUrl}/backend/banner/store`,
          headers: {
            "Content-Type": "application/json",
          },
          auth: {
            username: "user",
            password: postToken,
          },
          data: {
            bannerTitle: brandInput.brandName,
            bannerDesc: description,
            brandLogo: { ...imageInfo, imageBase64Data },
          },
        };

        // return "sdfd";

        setIsLoading(true);
        axios
          .request(config)
          .then((response) => {
            if ("success" in response.data) {
              setIsLoading(false);

              setFileKey((prevKey) => prevKey + 1);

              setBrandInput({
                brandName: "",
                brandLogo: "",
              });
              setBrandInputError({
                brandName: "",
                brandLogo: "",
              });
              setDescription("");
              setImageInfo({
                imageName: "",
                imageSize: "",
                imageType: "",
              });
              setImageBase64Data("");

              setBrands((prev) => [...prev, response.data.success.data]);

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

              setBrandInput({
                brandName: "",
                brandLogo: "",
              });
              setBrandInputError({
                brandName: "",
                brandLogo: "",
              });
              setDescription("");

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
    }
  };

  const handleDelete = () => {
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${baseUrl}/backend/banner/destroy`,
      headers: {
        "Content-Type": "application/json",
      },
      auth: {
        username: "user",
        password: postToken,
      },
      data: { _id: id._id, imgURL: id.bannerImage },
    };

    axios
      .request(config)
      .then((response) => {
        if ("success" in response.data) {
          let brandUpdate = brands.filter((el) => el._id !== id._id);

          setBrands(brandUpdate);
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

  const handleActiveBanner = (id) => {
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${baseUrl}/backend/banner/status`,
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
          let productUpdate = brands.map((el) => {
            if (el._id == id) {
              let updateArrival =
                el.bannerStatus == "active" ? "inactive" : "active";
              return { ...el, bannerStatus: updateArrival };
            }
            return el;
          });
          setBrands(productUpdate);

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
    <Card title="All Banner">
      <div>
        <div className="main-box">
          <div className="one">
            <div className="row">
              <div className="col-md-6 form-group">
                <input
                  type="text"
                  name="brandName"
                  value={brandInput.brandName}
                  onChange={handleChangeInput}
                  className="form-control"
                  placeholder="Title"
                />

                {brandInputError?.brandName && (
                  <ErrorMessage message={brandInputError.brandName} />
                )}
              </div>

              <div className="col-md-6 form-group">
                <input
                  type="text"
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    setDescriptionError("");
                  }}
                  className="form-control"
                  placeholder="Description"
                />

                {descriptionError && (
                  <ErrorMessage message={descriptionError} />
                )}
              </div>

              <div className="col-md-6 form-group mt-3">
                <input
                  key={fileKey}
                  name="brandLogo"
                  className="form-control"
                  onChange={handleInputFile}
                  type="file"
                />

                {brandInputError?.brandLogo && (
                  <ErrorMessage message={brandInputError.brandLogo} />
                )}
              </div>
            </div>

            <div className="mt-4">
              <div className="">
                {isLoading ? (
                  <div className="spinner-border" role="status"></div>
                ) : (
                  <button onClick={handleAddBrand} className="btn btn-primary">
                    Add Banner
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
                  <th>Image</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {brands.length !== 0 ? (
                  brands.map((brand, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        <div className="customBorder">
                          <Image
                            width={70}
                            src={`${imageBaseURL}/${brand.bannerImage}`}
                          />
                        </div>
                      </td>
                      <td>{brand.bannerTitle}</td>
                      <td>{brand.bannerDesc}</td>
                      <td>
                        {brand.bannerStatus == "active" ? (
                          <span
                            onClick={() => handleActiveBanner(brand._id)}
                            className="btn btn-sm btn-success"
                          >
                            Active
                          </span>
                        ) : (
                          <span
                            onClick={() => handleActiveBanner(brand._id)}
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
                          <button
                            type="button"
                            className="btn btn-danger"
                            data-bs-toggle="modal"
                            onClick={() => setId(brand)}
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

export default Banner;
