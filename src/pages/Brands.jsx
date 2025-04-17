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

function Brands() {
  const [isLoading, setIsLoading] = useState(false);

  const [brands, setBrands] = useState([]);
  const [id, setId] = useState("");

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
      url: `${baseUrl}/backend/brand/all`,
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

  // delete
  // useEffect(() => {
  //   let config = {
  //     method: "get",
  //     maxBodyLength: Infinity,
  //     url: `${baseUrl}/frontend/product/subcategory`,
  //     // url: `http://localhost:1010/api/v1/frontend/product/view/67f22189610b76eb6cd27b5a`,
  //     auth: {
  //       username: "user",
  //       password: postToken,
  //     },
  //     data: { id: "67ef9514603ec250a9a34214" },
  //   };

  //   axios
  //     .request(config)
  //     .then((response) => {
  //       if ("success" in response.data) {
  //         console.log(response.data.success.data);
  //       }
  //     })
  //     .catch((error) => {
  //       // console.log(error);
  //     });
  // }, []);

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
        brandName: "Brand Name field is required.",
      });
    } else if (imageInfo.imageName == "") {
      setBrandInputError({
        ...brandInputError,
        brandLogo: "Brand Logo field is required.",
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
          url: `${baseUrl}/backend/brand/store`,
          headers: {
            "Content-Type": "application/json",
          },
          auth: {
            username: "user",
            password: postToken,
          },
          data: { ...brandInput, brandLogo: { imageInfo, imageBase64Data } },
        };

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
      url: `${baseUrl}/backend/brand/destroy`,
      headers: {
        "Content-Type": "application/json",
      },
      auth: {
        username: "user",
        password: postToken,
      },
      data: { _id: id._id, imgURL: id.brandLogo },
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

  return (
    <>
      <Card title="All Brand">
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
                    placeholder="Brand Name"
                  />

                  {brandInputError?.brandName && (
                    <ErrorMessage message={brandInputError.brandName} />
                  )}
                </div>

                <div className="col-md-6 form-group mt-3 mt-md-0">
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
                    <button
                      onClick={handleAddBrand}
                      className="btn btn-primary"
                    >
                      Add Brand
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
                    <th>Brand Name</th>
                    <th>Brand Logo</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {brands.length !== 0 ? (
                    brands.map((brand, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{brand.brandName}</td>
                        <td>
                          <div className="thumbnail-change">
                            <img
                              src={`${imageBaseURL}/${brand.brandLogo}`}
                              className="img-thumbnail"
                              alt={brand.brandLogo}
                            />
                          </div>
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
                      <td colSpan={4} className="text-center">
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
    </>
  );
}

export default Brands;
