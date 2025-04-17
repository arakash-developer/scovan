import { useEffect, useState } from "react";
import { Card, Select, Flex, Rate } from "antd";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "./css/Brands.css";
import ErrorMessage from "./../components/error/ErrorMessage";

const baseUrl = import.meta.env.VITE_API_BASE_URL;
const postToken = import.meta.env.VITE_API_BACKEND_POST_TOKEN;
const getToken = import.meta.env.VITE_API_BACKEND_GET_TOKEN;

const desc = ["terrible", "bad", "normal", "good", "wonderful"];

function ReviewAdd() {
  const [isLoading, setIsLoading] = useState(false);
  const [fileKey, setFileKey] = useState(0);

  const [uname, setUname] = useState("");
  const [unameError, setUnameError] = useState("");

  const [reviewStatus, setReviewStatus] = useState("");
  const [reviewStatusError, setReviewStatusError] = useState("");

  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState("");
  const [productError, setProductError] = useState("");

  const [imageInfo, setImageInfo] = useState({
    imageName: "",
    imageSize: "",
    imageType: "",
  });
  const [imageBase64Data, setImageBase64Data] = useState("");

  const [shortDesc, setShortDesc] = useState("");
  const [shortDescError, setShortDescError] = useState("");

  const [rating, setRating] = useState(3);
  const [ratingError, setRatingError] = useState("");

  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${baseUrl}/backend/product/all`,
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

          let productUpdate = response.data.success.data.map((el) => {
            return {
              _id: el._id,
              value: el._id,
              label: el.title,
            };
          });

          setProducts(productUpdate);
          // setRelatedProduct(productUpdate);
        }
      })
      .catch((error) => {
        // console.log(error);
      });
  }, []);

  const handleChangeProduct = (value) => {
    setProductId(value);
    setProductError("");
  };

  const handleInputFileThumbnail = (event) => {
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
  };

  const handleAddCoupon = () => {
    if (uname == "") {
      setUnameError("This field is Required!");
    } else if (reviewStatus == "") {
      setReviewStatusError("This field is Required!");
    } else if (productId == "") {
      setProductError("This field is Required!");
    } else if (rating == "") {
      setRatingError("This field is Required!");
    } else if (shortDesc == "") {
      setShortDescError("This field is Required!");
    } else {
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${baseUrl}/backend/review/store`,
        headers: {
          "Content-Type": "application/json",
        },
        auth: {
          username: "user",
          password: postToken,
        },
        data: {
          uname,
          rating,
          photo: { ...imageInfo, imageBase64Data },
          comment: shortDesc,
          productId,
          reviewStatus,
        },
      }; 
      setIsLoading(true);
      axios
        .request(config)
        .then((response) => {
          if ("success" in response.data) {
            setIsLoading(false);

            setUname("");
            setReviewStatus("");
            setProductId("");
            setImageInfo({
              imageName: "",
              imageSize: "",
              imageType: "",
            });
            setImageBase64Data("");
            setShortDesc("");
            setRating(3);
            setFileKey((prevKey) => prevKey + 1);

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

            setUname("");
            setReviewStatus("");
            setProductId("");
            setImageInfo({
              imageName: "",
              imageSize: "",
              imageType: "",
            });
            setImageBase64Data("");
            setShortDesc("");
            setRating(3);
            setFileKey((prevKey) => prevKey + 1);

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
    <Card title="Add Review">
      <div>
        <div className="main-box">
          <div className="one">
            <div className="row">
              <div className="col-md-4 form-group">
                <input
                  type="text"
                  value={uname}
                  onChange={(e) => {
                    setUname(e.target.value);
                    setUnameError("");
                  }}
                  className="form-control"
                  placeholder="User Name"
                />

                {unameError && <ErrorMessage message={unameError} />}
              </div>

              <div className="col-md-4 form-group">
                <select
                  onChange={(e) => {
                    setReviewStatus(e.target.value);
                    setReviewStatusError("");
                  }}
                  value={reviewStatus}
                  className="form-select"
                >
                  <option value="">Review Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>

                {reviewStatusError && (
                  <ErrorMessage message={reviewStatusError} />
                )}
              </div>

              <div className="col-md-4 form-group">
                <Select
                  showSearch
                  style={{ width: "100%" }}
                  key={fileKey}
                  placeholder="Search to Product"
                  onChange={handleChangeProduct}
                  optionFilterProp="label"
                  filterSort={(optionA, optionB) => {
                    var _a, _b;
                    return (
                      (_a =
                        optionA === null || optionA === void 0
                          ? void 0
                          : optionA.label) !== null && _a !== void 0
                        ? _a
                        : ""
                    )
                      .toLowerCase()
                      .localeCompare(
                        ((_b =
                          optionB === null || optionB === void 0
                            ? void 0
                            : optionB.label) !== null && _b !== void 0
                          ? _b
                          : ""
                        ).toLowerCase()
                      );
                  }}
                  options={products}
                />

                {productError && <ErrorMessage message={productError} />}
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-md-4 form-group">
                <input
                  key={fileKey}
                  className="form-control"
                  onChange={handleInputFileThumbnail}
                  type="file"
                />
              </div>

              <div className="col-md-4 form-group">
                <div className="customRating">
                  <Flex gap="middle" vertical>
                    <Rate
                      tooltips={desc}
                      onChange={(val) => {
                        setRating(val);
                        setRatingError("");
                      }}
                      value={rating}
                    />
                    {rating ? <span>{desc[rating - 1]}</span> : null}
                  </Flex>
                </div>

                {ratingError && <ErrorMessage message={ratingError} />}
              </div>

              <div className="col-md-4 form-group">
                <textarea
                  className="form-control"
                  rows={2}
                  value={shortDesc}
                  onChange={(e) => {
                    setShortDesc(e.target.value);
                    setShortDescError("");
                  }}
                  placeholder="Comment"
                />
                {shortDescError && <ErrorMessage message={shortDescError} />}
              </div>
            </div>

            <div className="mt-4">
              <div className="">
                {isLoading ? (
                  <div className="spinner-border" role="status"></div>
                ) : (
                  <button onClick={handleAddCoupon} className="btn btn-primary">
                    Add Review
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

export default ReviewAdd;
