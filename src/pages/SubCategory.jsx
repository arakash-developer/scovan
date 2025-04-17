import { useEffect, useState } from "react";
import { Card } from "antd";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "./css/Brands.css";
import ErrorMessage from "./../components/error/ErrorMessage";

const postToken = import.meta.env.VITE_API_BACKEND_POST_TOKEN;
const getToken = import.meta.env.VITE_API_BACKEND_GET_TOKEN;
const baseUrl = import.meta.env.VITE_API_BASE_URL;

function SubCategory() {
  const [isLoading, setIsLoading] = useState(false);
  const [refectData, setRefectData] = useState(false);

  const [subCategory, setSubCategory] = useState([]);
  const [categories, setCategories] = useState([]);

  const [subCategoryName, setSubCategoryName] = useState("");
  const [subCategoryNameError, setSubCategoryNameError] = useState("");

  const [categoryId, setCategoryId] = useState("");
  const [categoryIdError, setCategoryIdError] = useState("");

  const [storeCatInfo, setStoreCatInfo] = useState(null);
  const [storeCatStatus, setStoreCatStatus] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [storeCatName, setStoreCatName] = useState("");
  const [storeCatNameError, setStoreCatNameError] = useState("");
  const [storeCatId, setStoreCatId] = useState("");
  const [storeCatIdError, setStoreCatIdError] = useState("");

  const [deleteSubCat, setDeleteSubCat] = useState(false);

  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${baseUrl}/backend/category/all`,
      auth: {
        username: "user",
        password: getToken,
      },
    };

    axios
      .request(config)
      .then((response) => {
        if ("success" in response.data) {
          setCategories(response.data.success.data);
        }
      })
      .catch((error) => {
        // console.log(error);
      });
  }, []);

  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${baseUrl}/backend/subcategory/all`,
      auth: {
        username: "user",
        password: getToken,
      },
    };

    axios
      .request(config)
      .then((response) => {
        if ("success" in response.data) {
          setSubCategory(response.data.success.data);
          console.log(response.data.success.data);
        }
      })
      .catch((error) => {
        // console.log(error);
      });
  }, [refectData]);

  const handleAddSubCategory = () => {
    if (categoryId == "") {
      setCategoryIdError("This field is Required!");
    } else if (subCategoryName == "") {
      setSubCategoryNameError("This field is Required!");
    } else {
      //   return "sdf";

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${baseUrl}/backend/subcategory/store`,
        headers: {
          "Content-Type": "application/json",
        },
        auth: {
          username: "user",
          password: postToken,
        },
        data: {
          subCategory: subCategoryName,
          categoryId,
        },
      };

      setIsLoading(true);
      axios
        .request(config)
        .then((response) => {
          if ("success" in response.data) {
            setIsLoading(false);

            setSubCategoryName("");
            setSubCategoryNameError("");
            setCategoryId("");
            setCategoryIdError("");

            setRefectData(!refectData);

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

            setSubCategoryName("");
            setSubCategoryNameError("");
            setCategoryId("");
            setCategoryIdError("");

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
    if (storeCatId == "") {
      setStoreCatIdError("This field is Required!");
    } else {
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${baseUrl}/backend/subcategory/destroy`,
        headers: {
          "Content-Type": "application/json",
        },
        auth: {
          username: "user",
          password: postToken,
        },
        data: { catId: storeCatInfo._id, subCatId: storeCatId },
      };

      setIsLoading(true);

      axios
        .request(config)
        .then((response) => {
          if ("success" in response.data) {
            setStoreCatInfo(null);
            setStoreCatName("");
            setStoreCatId("");
            setCategoryName("");
            setDeleteSubCat(false);
            setIsLoading(false);
            setRefectData(!refectData);

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
            setStoreCatInfo(null);
            setStoreCatName("");
            setStoreCatId("");
            setCategoryName("");
            setDeleteSubCat(false);
            setIsLoading(false);
            setRefectData(!refectData);

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

  const handleUpdateSubCategory = () => {
    if (storeCatId == "") {
      setStoreCatIdError("This field is Required!");
    } else if (storeCatName == "") {
      setStoreCatNameError("This field is Required!");
    } else {
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${baseUrl}/backend/subcategory/update`,
        headers: {
          "Content-Type": "application/json",
        },
        auth: {
          username: "user",
          password: postToken,
        },
        data: {
          id: storeCatId,
          subCatName: storeCatName,
        },
      };

      setIsLoading(true);
      axios
        .request(config)
        .then((response) => {
          if ("success" in response.data) {
            setIsLoading(false);

            setStoreCatInfo(null);
            setStoreCatStatus(false);
            setCategoryName("");
            setStoreCatName("");
            setStoreCatNameError("");
            setStoreCatId("");
            setStoreCatIdError("");

            setRefectData(!refectData);
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
            setStoreCatInfo(null);
            setStoreCatStatus(false);
            setCategoryName("");
            setStoreCatName("");
            setStoreCatNameError("");
            setStoreCatId("");
            setStoreCatIdError("");

            setIsLoading(false);
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
    <Card title="All Sub Category">
      <div>
        <div className="main-box">
          {storeCatStatus ? (
            <div className="oneFromCustom">
              <div className="row">
                <div className="col-md-6 form-group">
                  <select
                    name="categoryId"
                    value={categoryName}
                    disabled
                    className="form-select"
                  >
                    <option value="">All Category</option>
                    <option>{categoryName}</option>
                  </select>
                </div>

                <div className="col-md-6 form-group">
                  <select
                    onChange={(e) => {
                      setStoreCatId(e.target.value);
                      setStoreCatName(
                        storeCatInfo.subCategoryId?.find(
                          (el) => el._id == e.target.value
                        )?.subCategory
                      );
                      setStoreCatIdError("");
                    }}
                    className="form-select"
                  >
                    <option value="">All Sub Category</option>
                    {storeCatInfo.subCategoryId?.map((option) => (
                      <option key={option._id} value={option._id}>
                        {option.subCategory}
                      </option>
                    ))}
                  </select>

                  {storeCatIdError && (
                    <ErrorMessage message={storeCatIdError} />
                  )}
                </div>
              </div>

              <div className="row">
                <div className="col-md-12 mt-3 form-group">
                  <input
                    type="text"
                    value={storeCatName}
                    onChange={(e) => {
                      setStoreCatName(e.target.value);
                      setStoreCatNameError("");
                    }}
                    className="form-control"
                    placeholder="Sub Category Name"
                  />

                  {storeCatNameError && (
                    <ErrorMessage message={storeCatNameError} />
                  )}
                </div>
              </div>

              <div className="mt-4">
                <div className="">
                  {isLoading ? (
                    <div className="spinner-border" role="status"></div>
                  ) : (
                    <button
                      onClick={handleUpdateSubCategory}
                      className="btn btn-primary"
                    >
                      Update Sub Category
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : deleteSubCat ? (
            <div className="oneFromCustom">
              <div className="row">
                <div className="col-md-6 form-group">
                  <select
                    name="categoryId"
                    value={categoryName}
                    disabled
                    className="form-select"
                  >
                    <option value="">All Category</option>
                    <option>{categoryName}</option>
                  </select>
                </div>

                <div className="col-md-6 form-group">
                  <select
                    onChange={(e) => {
                      setStoreCatId(e.target.value);
                      setStoreCatName(
                        storeCatInfo.subCategoryId?.find(
                          (el) => el._id == e.target.value
                        )?.subCategory
                      );
                      setStoreCatIdError("");
                    }}
                    className="form-select"
                  >
                    <option value="">All Sub Category</option>
                    {storeCatInfo.subCategoryId?.map((option) => (
                      <option key={option._id} value={option._id}>
                        {option.subCategory}
                      </option>
                    ))}
                  </select>

                  {storeCatIdError && (
                    <ErrorMessage message={storeCatIdError} />
                  )}
                </div>
              </div>

              <div className="row">
                <div className="col-md-12 mt-3 form-group">
                  <input
                    type="text"
                    value={storeCatName}
                    disabled
                    className="form-control"
                  />
                </div>
              </div>

              <div className="mt-4">
                <div className="">
                  {isLoading ? (
                    <div className="spinner-border" role="status"></div>
                  ) : (
                    <button onClick={handleDelete} className="btn btn-danger">
                      Confirm Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="oneFromCustom">
              <div className="row">
                <div className="col-md-6 form-group">
                  <select
                    name="categoryId"
                    onChange={(e) => {
                      setCategoryId(e.target.value);
                      setCategoryIdError("");
                    }}
                    value={categoryId}
                    className="form-select"
                  >
                    <option value="">All Category</option>
                    {categories.map((option) => (
                      <option key={option._id} value={option._id}>
                        {option.categoryName}
                      </option>
                    ))}
                  </select>

                  {categoryIdError && (
                    <ErrorMessage message={categoryIdError} />
                  )}
                </div>

                <div className="col-md-6 form-group">
                  <input
                    type="text"
                    name="categoryName"
                    value={subCategoryName}
                    onChange={(e) => {
                      setSubCategoryName(e.target.value);
                      setSubCategoryNameError("");
                    }}
                    className="form-control"
                    placeholder="Sub Category Name"
                  />

                  {subCategoryNameError && (
                    <ErrorMessage message={subCategoryNameError} />
                  )}
                </div>
              </div>

              <div className="mt-4">
                <div className="">
                  {isLoading ? (
                    <div className="spinner-border" role="status"></div>
                  ) : (
                    <button
                      onClick={handleAddSubCategory}
                      className="btn btn-primary"
                    >
                      Add Sub Category
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="oneTableCustom">
            <table className="table table-striped table-bordered table-hover">
              <thead>
                <tr>
                  <th>#Sl</th>
                  <th>Category</th>
                  <th>Sub Category</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {subCategory.length !== 0 ? (
                  subCategory.map((el, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{el.categoryName}</td>

                      <td>
                        {el.subCategoryId.length !== 0
                          ? el.subCategoryId
                              .map((subCat) => subCat.subCategory)
                              .join(", ")
                          : "Empty"}
                      </td>

                      <td>
                        <div
                          role="group"
                          className="btn-group btn-group-sm commonBtn"
                        >
                          <button
                            className="btn btn-primary"
                            onClick={() => {
                              setStoreCatInfo(el);
                              if (!storeCatStatus) {
                                setCategoryName(el.categoryName);
                              }
                              setStoreCatStatus(!storeCatStatus);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => {
                              setStoreCatInfo(el);
                              setStoreCatName("");
                              setStoreCatId("");
                              if (!storeCatStatus) {
                                setCategoryName(el.categoryName);
                              }
                              setDeleteSubCat(!deleteSubCat);
                            }}
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

export default SubCategory;
