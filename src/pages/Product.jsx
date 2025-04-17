import { useEffect, useState } from "react";
import { Card, Select, Space, Checkbox } from "antd";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "./css/Brands.css";
import ErrorMessage from "./../components/error/ErrorMessage";

const postToken = import.meta.env.VITE_API_BACKEND_POST_TOKEN;
const getToken = import.meta.env.VITE_API_BACKEND_GET_TOKEN;
const baseUrl = import.meta.env.VITE_API_BASE_URL;

function Product() {
  const [isLoading, setIsLoading] = useState(false);
  const [productInput, setProductInput] = useState("");
  const [productError, setProductError] = useState("");
  const [brandInput, setBrandInput] = useState("");

  const [capacityInput, setCapacityInput] = useState("");

  const [brands, setBrands] = useState([]);

  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [categoryError, setCategoryError] = useState("");

  const [subSategories, setSubCategories] = useState([]);
  const [subCategoryId, setSubCategoryId] = useState("");
  const [subCategoryError, setSubCategoryError] = useState("");

  const [capacity, setCapacity] = useState([]);
  const [tags, setTags] = useState([]);
  const [tagId, setTagId] = useState([]);
  const [tagError, setTagError] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [imageError, setImageError] = useState("");
  const [skuInput, setSkuInput] = useState("");

  const [relatedProduct, setRelatedProduct] = useState([]);
  const [relatedProductId, setRelatedProductId] = useState([]);

  const [amountInput, setAmountInput] = useState("");
  const [amountError, setAmountError] = useState("");

  const [shortDesc, setShortDesc] = useState("");
  const [shortDescError, setShortDescError] = useState("");

  const [description, setDescription] = useState("");
  const [descriptionError, setDescriptionError] = useState("");

  const [newArrival, setNewArrival] = useState(false);

  const [imageInfo, setImageInfo] = useState({
    imageName: "",
    imageSize: "",
    imageType: "",
  });
  const [imageBase64Data, setImageBase64Data] = useState("");
  const [thumbnailError, setThumbnailError] = useState("");

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
          // console.log("cat", response.data.success.data);
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

  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${baseUrl}/backend/tag/all`,
      auth: {
        username: "user",
        password: getToken,
      },
    };

    axios
      .request(config)
      .then((response) => {
        if ("success" in response.data) {
          // {
          //     label: "China",
          //     value: "china",
          //     desc: "China (中国)",
          //     _id: "dfg"
          //   }

          let tagsUpdate = response.data.success.data.map((el) => {
            return {
              _id: el._id,
              label: el.tagName,
              value: el.tagName,
              desc: el.tagName,
            };
          });

          setTags(tagsUpdate);
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
          let productUpdate = response.data.success.data.map((el) => {
            return {
              _id: el._id,
              label: el.title,
              value: el.title,
              desc: el.title,
            };
          });

          setRelatedProduct(productUpdate);
        }
      })
      .catch((error) => {
        // console.log(error);
      });
  }, [fileKey]);

  const handleChangeTags = (value) => {
    let selectedTags = tags
      .filter((tag) => value.includes(tag.value))
      .map((tag) => {
        return { _id: tag._id };
      }); // tag._id

    setTagError("");
    setTagId(selectedTags);
  };

  const handleChangeCategory = (e) => {
    let subCatArr = categories.filter((el) => el._id == e.target.value);
    setSubCategories(subCatArr[0].subCategoryId);
    setCategoryError("");
    setCategoryId(e.target.value);
  };

  const handleChangeSubCategory = (e) => {
    setSubCategoryError("");
    setSubCategoryId(e.target.value);
  };

  const handleInputFile = (event) => {
    const files = Array.from(event.target.files);

    const fileObjects = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          setImageError("");

          resolve({
            name: file.name,
            size: file.size,
            type: file.type,
            file: file,
            base64: reader.result,
          });
        };
      });
    });

    Promise.all(fileObjects).then((imageObjects) => {
      setSelectedImages((prevImages) => [...imageObjects]);
    });
  };

  const onChangeCheckbox = (e) => {
    setNewArrival(e.target.checked);
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
    setThumbnailError("");
  };

  const handleChangeRelatedProduct = (value) => {
    let selectedProduct = relatedProduct
      .filter((el) => value.includes(el.value))
      .map((el) => {
        return { _id: el._id };
      });

    setRelatedProductId(selectedProduct);
  };

  const handleAddProduct = () => {
    if (productInput === "") {
      setProductError("This field is Required!");
    } else if (categoryId === "") {
      setCategoryError("This field is Required!");
    } else if (subCategoryId === "") {
      setSubCategoryError("This field is Required!");
    } 
    else if (imageInfo.imageName === "") {
      setThumbnailError("This field is Required!");
    } 
    else if (selectedImages.length == 0) {
      setImageError("This field is Required!");
    } else if (tagId.length == 0) {
      setTagError("This field is Required!");
    } else if (amountInput == "") {
      setAmountError("This field is Required!");
    } else if (shortDesc == "") {
      setShortDescError("This field is Required!");
    } else if (description == "") {
      setDescriptionError("This field is Required!");
    } else if (
      productInput !== "" &&
      categoryId !== "" &&
      subCategoryId !== "" &&
      imageInfo.imageName !== "" &&
      selectedImages.length > 0 &&
      tagId.length > 0 &&
      amountInput !== "" &&
      shortDesc !== "" &&
      description !== ""
    ) {
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${baseUrl}/backend/product/store`,
        headers: {
          "Content-Type": "application/json",
        },
        auth: {
          username: "user",
          password: postToken,
        },
        data: {
          title: productInput,
          shortDesc,
          description,
          amount: amountInput,
          sku: skuInput,
          categoryId: categoryId,
          subcategoryId: subCategoryId,
          tagId,
          brandId: brandInput == "" ? null : brandInput,
          capacityId: capacityInput == "" ? null : capacityInput,
          thumbnails: {...imageInfo, imageBase64Data},
          imageArray: selectedImages,
          relatedProduct: relatedProductId,
          newArrivals: newArrival ? "active" : "inactive"
        },
      };

      setIsLoading(true);

      // console.log(categoryId);
      // console.log("relatedProductId", relatedProductId);

      // return "ok";
      axios
        .request(config)
        .then((response) => {
          if ("success" in response.data) {
            setIsLoading(false);

            setProductInput("");
            setBrandInput("");

            setCategoryId("");
            setCategoryError("");
            setSubCategories([]);
            setSubCategoryId("");
            setSubCategoryError("");

             setNewArrival(false);
             setImageInfo({
              imageName: "",
              imageSize: "",
              imageType: "",
            });
             setImageBase64Data("");
             setThumbnailError("");

            setCapacityInput("");
            setAmountInput("");
            setShortDesc("");
            setDescription("");

            setTagId([]);
            setSelectedImages([]);
            setSkuInput("");
            setRelatedProductId([]);

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

            setProductInput("");
            setBrandInput("");

            setCategoryId("");
            setCategoryError("");
            setSubCategories([]);
            setSubCategoryId("");
            setSubCategoryError("");

            setCapacityInput("");
            setAmountInput("");
            setNewArrival(false);
            setImageInfo({
             imageName: "",
             imageSize: "",
             imageType: "",
           });
            setImageBase64Data("");
            setThumbnailError("");

            setShortDesc("");
            setDescription("");

            setTagId([]);
            setSelectedImages([]);
            setSkuInput("");
            setRelatedProductId([]);
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
    <Card title="Add Product">
      <div>
        <div className="main-box">
          <div className="one">
            <div className="row">
              <div className="col-md-4 form-group">
                <input
                  type="text"
                  name="title"
                  className="form-control"
                  value={productInput}
                  onChange={(e) => {
                    setProductInput(e.target.value);
                    setProductError("");
                  }}
                  placeholder="Product Title"
                />

                {productError && <ErrorMessage message={productError} />}
              </div>

              <div className="col-md-4 form-group">
                <select
                  name="brandId"
                  onChange={(e) => setBrandInput(e.target.value)}
                  value={brandInput}
                  className="form-select"
                >
                  <option value="">All Brand</option>
                  {brands.map((option) => (
                    <option key={option._id} value={option._id}>
                      {option.brandName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4 form-group">
                <select
                  onChange={handleChangeCategory}
                  value={categoryId}
                  key={fileKey}
                  className="form-select"
                >
                  <option value="">All Category</option>
                  {categories.map((option) => (
                    <option key={option._id} value={option._id}>
                      {option.categoryName}
                    </option>
                  ))}
                </select>

                {categoryError && <ErrorMessage message={categoryError} />}
              </div>
            </div>

            <div className="row">
              <div className="col-md-4 mt-3 form-group">
                <select
                  onChange={handleChangeSubCategory}
                  value={subCategoryId}
                  key={fileKey}
                  className="form-select"
                >
                  <option value="">All Sub Category</option>
                  {subSategories.map((option) => (
                    <option key={option._id} value={option._id}>
                      {option.subCategory}
                    </option>
                  ))}
                </select>

                {subCategoryError && (
                  <ErrorMessage message={subCategoryError} />
                )}
              </div>

              <div className="col-md-4 mt-3 form-group">
                <input
                  key={fileKey}
                  name="brandLogo"
                  className="form-control"
                  onChange={handleInputFileThumbnail}
                  type="file"
                />

                {thumbnailError && <ErrorMessage message={thumbnailError} />}
              </div>

              <div className="col-md-4 mt-3 form-group">
                <Checkbox checked={newArrival} onChange={onChangeCheckbox}>
                  Show In New Arrival
                </Checkbox>
              </div>
            </div>

            <div className="row">
              <div className="col-md-4 form-group mt-3">
                <input
                  className="form-control"
                  type="file"
                  key={fileKey}
                  multiple
                  onChange={handleInputFile}
                />
                {imageError && <ErrorMessage message={imageError} />}
              </div>

              <div className="col-md-4 form-group mt-3">
                <select
                  name="capacityId"
                  onChange={(e) => setCapacityInput(e.target.value)}
                  value={capacityInput}
                  className="form-select"
                >
                  <option value="">Capacity</option>
                  {capacity.map((option) => (
                    <option key={option._id} value={option._id}>
                      {option.capacityName}
                    </option>
                  ))}
                </select>
              </div>
 
              <div className="col-md-4 form-group mt-3">
                <Select
                  mode="multiple"
                  style={{
                    width: "100%",
                  }}
                  placeholder="All Tags"
                  key={fileKey}
                  onChange={handleChangeTags}
                  options={tags}
                  optionRender={(option) => <Space>{option.data.desc}</Space>}
                />

                {tagError && <ErrorMessage message={tagError} />}
              </div>
            </div>

            <div className="row">
              <div className="col-md-4 form-group mt-3">
                <input
                  type="text"
                  name="sku"
                  className="form-control"
                  value={skuInput}
                  onChange={(e) => {
                    setSkuInput(e.target.value);
                  }}
                  placeholder="Product SKU"
                />
              </div>

              <div className="col-md-4 form-group mt-3">
                <Select
                  mode="multiple"
                  style={{
                    width: "100%",
                  }}
                  placeholder="Related Product"
                  key={fileKey}
                  onChange={handleChangeRelatedProduct}
                  options={relatedProduct}
                  optionRender={(option) => <Space>{option.data.label}</Space>}
                />
              </div>
              <div className="col-md-4 form-group mt-3">
                <input
                  type="text"
                  name="amount"
                  className="form-control"
                  value={amountInput}
                  onChange={(e) => {
                    setAmountInput(e.target.value);
                    setAmountError("");
                  }}
                  placeholder="Product Price"
                />

                {amountError && <ErrorMessage message={amountError} />}
              </div>
            </div>

            <div className="row">
              <div className="col-md-12 form-group mt-3">
                <textarea
                  className="form-control"
                  name="shortDesc"
                  rows={3}
                  value={shortDesc}
                  onChange={(e) => {
                    setShortDesc(e.target.value);
                    setShortDescError("");
                  }}
                  placeholder="Short Description"
                />
                {shortDescError && <ErrorMessage message={shortDescError} />}
              </div>
            </div>

            <div className="form-group mt-3">
              <textarea
                className="form-control"
                name="description"
                rows={5}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setDescriptionError("");
                }}
                placeholder="Description"
              />

              {descriptionError && <ErrorMessage message={descriptionError} />}
            </div>

            <div className="mt-3">
              <div className="text-center">
                {isLoading ? (
                  <div className="spinner-border" role="status"></div>
                ) : (
                  <button
                    onClick={handleAddProduct}
                    className="btn btn-primary"
                  >
                    Add Product
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

export default Product;
