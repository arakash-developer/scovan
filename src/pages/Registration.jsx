import { Link, useNavigate } from "react-router-dom";
import ErrorMessage from "../components/error/ErrorMessage";
import { useEffect, useState, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "./css/Login.css";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/loader/Loader";
import axios from "axios";

const registrationToken = import.meta.env.VITE_REGISTRATION_TOKEN;
const baseUrl = import.meta.env.VITE_API_BASE_URL;

function Registration() {
  const userAuth = useSelector((state) => state.userInfo.userData);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const changePasswordType = useRef();
  const changeCPasswordType = useRef();

  const [registerInfo, setRegisterInfo] = useState({
    uname: "",
    email: "",
    password: "",
    cpassword: "",
  });
  const [registerError, setRegisterError] = useState({
    uname: "",
    email: "",
    password: "",
    cpassword: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [iconTogglePassword, setIconTogglePassword] = useState(false);
  const [iconToggleCPassword, setIconToggleCPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (el) => {
    let { name, value } = el.target;
    setErrorMessage("");
    setIsLoading(false);
    if (value !== "") {
      setRegisterError({ ...registerError, [name]: "" });
    }
    setRegisterInfo({ ...registerInfo, [name]: value });
  };

  useEffect(() => {
    if ("login" in userAuth) {
      if (userAuth.login) {
        navigate("/");
      }
    }
  }, [navigate, userAuth]);

  const handleRegistration = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${baseUrl}/backend/authentication/store`,
      headers: {
        "Content-Type": "application/json",
      },
      auth: {
        username: "user",
        password: registrationToken,
      },
      data: registerInfo,
    };

    axios
      .request(config)
      .then((response) => {
        if ("error" in response.data) {
          setIsLoading(false);

          if (typeof response.data.error === "object") {
            if ("field" in response.data.error) {
              setRegisterError({
                [response.data.error.field]: response.data.error.message,
              });
            } else {
              setErrorMessage(response.data.error.message);
            }
          } else {
            setErrorMessage(response.data.error);
          }
        } else if ("success" in response.data) {
          setRegisterInfo({
            uname: "",
            email: "",
            password: "",
            cpassword: "",
          });
          setIsLoading(false);
          toast.success(response.data.success.message, {
            position: "top-right",
            onClose: () => {
              navigate("/login");
            },
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
        console.log(error);
      });
  };

  const handleIconChangePassword = () => {
    setIconTogglePassword(!iconTogglePassword);

    if (changePasswordType.current) {
      changePasswordType.current.type = !iconTogglePassword
        ? "text"
        : "password";
    }
  };

  const handleIconChangeCPassword = () => {
    setIconToggleCPassword(!iconToggleCPassword);

    if (changeCPasswordType.current) {
      changeCPasswordType.current.type = !iconToggleCPassword
        ? "text"
        : "password";
    }
  };

  return (
    <section className="container commonColor forms">
      <div className="form login">
        <div className="form-content  text-center">
          <h2>Signup</h2>
          <form method="POST" onSubmit={handleRegistration}>
            <div className="mb-4 mt-4 form-group">
              <input
                type="text"
                name="uname"
                className="form-control"
                placeholder="Your Name"
                onChange={handleChange}
                value={registerInfo.uname}
              />
              {registerError?.uname && (
                <ErrorMessage message={registerError.uname} />
              )}
            </div>

            <div className=" form-group mt-3 ">
              <input
                type="email"
                className="form-control"
                name="email"
                placeholder="Your Email"
                onChange={handleChange}
                value={registerInfo.email}
              />
              {registerError?.email && (
                <ErrorMessage message={registerError.email} />
              )}
            </div>

            <div className="mb-4 mt-4 form-group iconposition">
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Your Password"
                onChange={handleChange}
                ref={changePasswordType}
                value={registerInfo.password}
              />

              {iconTogglePassword ? (
                <i
                  onClick={handleIconChangePassword}
                  className="bi bi-eye-fill iconfill"
                ></i>
              ) : (
                <i
                  onClick={handleIconChangePassword}
                  className="bi bi-eye-slash-fill iconfill"
                ></i>
              )}

              {registerError?.password && (
                <ErrorMessage message={registerError.password} />
              )}
            </div>

            <div className="mb-4 mt-4 form-group iconposition">
              <input
                type="password"
                name="cpassword"
                className="form-control"
                ref={changeCPasswordType}
                placeholder="Confirm Password"
                onChange={handleChange}
                value={registerInfo.cpassword}
              />

              {iconToggleCPassword ? (
                <i
                  onClick={handleIconChangeCPassword}
                  className="bi bi-eye-fill iconfill"
                ></i>
              ) : (
                <i
                  onClick={handleIconChangeCPassword}
                  className="bi bi-eye-slash-fill iconfill"
                ></i>
              )}

              {registerError?.cpassword && (
                <ErrorMessage message={registerError.cpassword} />
              )}

              {errorMessage && <ErrorMessage message={errorMessage} />}
            </div>
            {isLoading ? (
              <Loader />
            ) : (
              <div className="button-fieldC">
                <button className="button-fieldBTN">Signup</button>
              </div>
            )}
          </form>
          <div className="form-link">
            <span>
              Already have an account?{" "}
              <Link to="/login" className="link signup-link">
                Login
              </Link>
            </span>
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
        theme="light"
      />
    </section>
  );
}

export default Registration;
