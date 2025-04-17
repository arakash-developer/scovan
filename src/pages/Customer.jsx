import { Link, useParams } from "react-router-dom";
import { useGetCustomerQuery } from "../features/customer/customerAPISlice";
import { useDispatch } from "react-redux";
import { setDynamicToken } from "../features/user/userSlice";
import { useEffect, useState } from "react";
import GlobalErrorMessage from "./../components/error/GlobalErrorMessage";

// copy and rework this page
const backendGetToken = import.meta.env.VITE_API_BACKEND_GET_TOKEN;
const imageBaseURL = import.meta.env.VITE_API_IMAGE_URL_KEY;

function formatDateTime(timestamp) {
  const date = new Date(timestamp);
  const formatted = date
    .toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .replace(",", "")
    .replace(",", ",");

  return formatted;
}

function Customer() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    dispatch(setDynamicToken(backendGetToken));
  }, [dispatch]);

  const { data, isLoading, isSuccess, isError } = useGetCustomerQuery(id);

  useEffect(() => {
    if (data !== undefined && !isError) {
      if ("success" in data) {
        setErrorMessage("");
      } else {
        if (typeof data.error === "object") {
          setErrorMessage(data.error.message);
        } else {
          setErrorMessage(data.error);
        }
      }
    }

    if (isError) {
      setErrorMessage("There was an server-side Error.");
    }
  }, [data, isSuccess, isError]);

  return (
    <section id="appointment" className="appointment section light-background">
      <div className="container" data-aos="fade-up" data-aos-delay="100">
        {errorMessage && (
          <>
            <GlobalErrorMessage message={errorMessage} />
            <div className="customer-errorbtn">
              <Link to="/" className="customer-errorbtnEdit">
                Go To Homepage
              </Link>
            </div>
          </>
        )}

        {isLoading && <h4 className="text-center">Loading...</h4>}

        {isSuccess && data?.success?.data.length > 0 && (
          <table className="table table-striped table-bordered table-hover">
            <tbody>
              <tr>
                <th>Photo</th>
                <td>
                  <div className="thumbnail-big">
                    <img
                      src={
                        data?.success?.data[0]?.imageURL
                          ? `${imageBaseURL}/${data?.success?.data[0]?.imageURL}`
                          : "/public/img/default.jpg"
                      }
                      className="img-thumbnail"
                      alt={data?.success?.data[0]?.imageURL || "default.jpg"}
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <th>Name</th>
                <td>{data?.success?.data[0]?.uname}</td>
              </tr>
              <tr>
                <th>Email</th>
                <td>{data?.success?.data[0]?.email}</td>
              </tr>
              <tr>
                <th>Phone</th>
                <td>{data?.success?.data[0]?.phone}</td>
              </tr>
              <tr>
                <th>Subcontinent</th>
                <td>{data?.success?.data[0]?.subcontinents}</td>
              </tr>
              <tr>
                <th>Description</th>
                <td>{data?.success?.data[0]?.description}</td>
              </tr>
              <tr>
                <th>Date</th>
                <td>{formatDateTime(data?.success?.data[0]?.date)}</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}

export default Customer;
