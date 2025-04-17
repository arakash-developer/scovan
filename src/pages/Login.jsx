import { Link, useNavigate } from "react-router-dom";
import "./css/Login.css";
import ErrorMessage from "../components/error/ErrorMessage";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Loader from "../components/loader/Loader";
import { updateUser } from "../features/user/userSlice";

const loginToken = import.meta.env.VITE_LOGIN_TOKEN;
const baseUrl = import.meta.env.VITE_API_BASE_URL;

function encodeData(data) {
  const jsonString = JSON.stringify(data); // Convert object to string
  return btoa(
    new TextEncoder()
      .encode(jsonString)
      .reduce((acc, byte) => acc + String.fromCharCode(byte), "")
  );
}

function Login() {
  const userAuth = useSelector((state) => state.userInfo.userData);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const changePasswordType = useRef();

  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });
  const [loginError, setLoginError] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [iconToggle, setIconToggle] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (el) => {
    let { name, value } = el.target;
    setErrorMessage("");
    if (value !== "") {
      setLoginError({ ...loginError, [name]: "" });
    }
    setLoginInfo({ ...loginInfo, [name]: value });
  };

  useEffect(() => {
    if ("login" in userAuth) {
      if (userAuth.login) {
        navigate("/");
      }
    }
  }, [navigate, userAuth]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${baseUrl}/backend/authentication/login`,
      headers: {
        "Content-Type": "application/json",
      },
      auth: {
        username: "user",
        password: loginToken,
      },
      data: loginInfo,
    };

    axios
      .request(config)
      .then((response) => {
        if ("success" in response.data) {
          setLoginInfo({
            email: "",
            password: "",
          });

          setIsLoading(false);

          localStorage.setItem(
            "userInfo",
            encodeData(response.data.success.data)
          );

          dispatch(updateUser(response.data.success.data));

          toast.success(response.data.success.message, {
            position: "top-right",
            onClose: () => {
              navigate("/");
            },
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
          if (typeof response.data.error === "object") {
            if ("field" in response.data.error) {
              setLoginError({
                [response.data.error.field]: response.data.error.message,
              });
            } else {
              setErrorMessage(response.data.error.message);
            }
          } else {
            setErrorMessage(response.data.error);
          }
        }
      })
      .catch((error) => {
        // console.log(error);
      });
  };

  const handleIconChange = () => {
    setIconToggle(!iconToggle);

    if (changePasswordType.current) {
      changePasswordType.current.type = !iconToggle ? "text" : "password";
    }
  };

  return (
    <section className="container commonColor forms">
      <div className="form login">
        <div className="form-content  text-center">
          <h2>Login</h2>
          <form method="POST" onSubmit={handleLogin}>
            <div className=" form-group mt-3 ">
              <input
                type="email"
                className="form-control"
                name="email"
                onChange={handleChange}
                placeholder="Your Email"
                value={loginInfo.email}
              />

              {loginError?.email && <ErrorMessage message={loginError.email} />}
            </div>

            <div className="mb-4 mt-4 form-group iconposition">
              <input
                type="password"
                name="password"
                className="form-control "
                onChange={handleChange}
                value={loginInfo.password}
                placeholder="Your Password"
                ref={changePasswordType}
              />

              {iconToggle ? (
                <i
                  onClick={handleIconChange}
                  className="bi bi-eye-fill iconfill"
                ></i>
              ) : (
                <i
                  onClick={handleIconChange}
                  className="bi bi-eye-slash-fill iconfill"
                ></i>
              )}

              {loginError?.password && (
                <ErrorMessage message={loginError.password} />
              )}
              {errorMessage && <ErrorMessage message={errorMessage} />}
            </div>

            <div className="form-link">
              <Link to="/forgot" className="forgot-pass">
                Forgot password?
              </Link>
            </div>

            {isLoading ? (
              <Loader />
            ) : (
              <div className="button-fieldC">
                <button className="button-fieldBTN">Login</button>
              </div>
            )}
          </form>
          <div className="form-link">
            <span>
              Don&apos;t have an account?{" "}
              <Link to="/registrar" className="link signup-link">
                Signup
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

export default Login;
