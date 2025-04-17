import { useEffect, useState } from "react";
import { Card, Flex, Rate, Image } from "antd";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "./css/Brands.css";
import ErrorMessage from "./../components/error/ErrorMessage";
import { useParams } from "react-router-dom";

const baseUrl = import.meta.env.VITE_API_BASE_URL;
const postToken = import.meta.env.VITE_API_BACKEND_POST_TOKEN;
const imageBaseURL = import.meta.env.VITE_API_IMAGE_URL_KEY;

const desc = ["terrible", "bad", "normal", "good", "wonderful"];

function ReviewEdit() {
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [fileKey, setFileKey] = useState(0);
  const [reviewEdit, setReviewEdit] = useState("");

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
      method: "post",
      maxBodyLength: Infinity,
      url: `${baseUrl}/backend/review/edit`,
      auth: {
        username: "user",
        password: postToken,
      },
      data: { id },
    };

    axios
      .request(config)
      .then((response) => {
        if ("success" in response.data) {
          setReviewEdit(response.data.success.data[0].photo);
          setRating(response.data.success.data[0].rating);
          setShortDesc(response.data.success.data[0].comment);
        }
      })
      .catch((error) => {
        // console.log(error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileKey]);

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

  const handleUpdateCoupon = () => {
    if (rating == "") {
      setRatingError("This field is Required!");
    } else if (shortDesc == "") {
      setShortDescError("This field is Required!");
    } else {
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${baseUrl}/backend/review/update`,
        headers: {
          "Content-Type": "application/json",
        },
        auth: {
          username: "user",
          password: postToken,
        },
        data: {
          id,
          rating,
          photoUrl: reviewEdit,
          photo: { ...imageInfo, imageBase64Data },
          comment: shortDesc,
        },
      };
      setIsLoading(true);
      axios
        .request(config)
        .then((response) => {
          if ("success" in response.data) {
            setIsLoading(false);

            setImageInfo({
              imageName: "",
              imageSize: "",
              imageType: "",
            });
            setImageBase64Data("");
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

            setImageInfo({
              imageName: "",
              imageSize: "",
              imageType: "",
            });
            setImageBase64Data("");
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
    <Card title="Update Review">
      <div>
        <div className="main-box">
          <div className="one">
            <div className="row changeRow mt-3">
              <div className="col-md-4 form-group">
                <div className="customBorder">
                  {reviewEdit == "" ? (
                    <Image width={70} src="/img/default.jpg" />
                  ) : (
                    <Image width={70} src={`${imageBaseURL}/${reviewEdit}`} />
                  )}
                </div>
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
                  <button
                    onClick={handleUpdateCoupon}
                    className="btn btn-primary"
                  >
                    Update Review
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

export default ReviewEdit;
