import { useEffect, useState } from "react";
import { Card, Image } from "antd";
import axios from "axios";
import "./css/Brands.css";
import { Link, useParams } from "react-router-dom";

const getToken = import.meta.env.VITE_API_BACKEND_GET_TOKEN;
const baseUrl = import.meta.env.VITE_API_BASE_URL;
const imageBaseURL = import.meta.env.VITE_API_IMAGE_URL_KEY;

function ProductView() {
  const { id } = useParams();
  const [product, setproduct] = useState({});

  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${baseUrl}/backend/product/view/${id}`,
      auth: {
        username: "user",
        password: getToken,
      },
    };

    axios
      .request(config)
      .then((response) => {
        if ("success" in response.data) {
          setproduct(response.data.success.data[0]);
          // console.log(response.data.success.data[0]);
        }
      })
      .catch((error) => {
        // console.log(error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card title="View Product">
      <div>
        <div className="main-box">
          <div className="one">
            <table className="table table-striped table-bordered table-hover">
              <thead>
                <tr>
                  <th>Title</th>
                  <td>{product?.title}</td>
                </tr>

                <tr>
                  <th>Thumbnail</th>
                  <td>
                    <div className="customBorder">
                      <Image
                        width={70}
                        src={`${imageBaseURL}/${product?.thumbnails}`}
                      />{" "}
                    </div>
                  </td>
                </tr>

                <tr>
                  <th>Product Photo</th>
                  <td>
                    <div className="dflexImage">
                      {product?.imageArray?.map(
                        (el) =>
                          el.id !== 1 && (
                            <span key={el.id}>
                              <Image
                                width={70}
                                src={`${imageBaseURL}/${el.imageURL}`}
                              />
                            </span>
                          )
                      )}
                    </div>
                  </td>
                </tr>

                <tr>
                  <th>Amount</th>
                  <td>${product?.amount}</td>
                </tr>
                <tr>
                  <th>SKU</th>
                  <td>{product?.sku ? product?.sku : "Empty"}</td>
                </tr>
                <tr>
                  <th>Short Description</th>
                  <td>{product?.shortDesc}</td>
                </tr>
                <tr>
                  <th>Brand Name</th>
                  <td>
                    {product?.brandId?.brandName
                      ? product?.brandId?.brandName
                      : "Empty"}
                  </td>
                </tr>

                <tr>
                  <th>Capacity</th>
                  <td>
                    {product?.capacityId?.capacityName
                      ? product?.capacityId?.capacityName
                      : "Empty"}
                  </td>
                </tr>

                <tr>
                  <th>Categories</th>
                  <td>{product?.categoryId?.categoryName}</td>
                </tr>

                <tr>
                  <th>SubCategory</th>
                  <td>{product?.subcategoryId?.subCategory}</td>
                </tr>

                <tr>
                  <th>Tags</th>
                  <td>
                    {product?.tagId?.map((tag) => tag.tagName).join(", ")}
                  </td>
                </tr>

                <tr>
                  <th>Related Product</th>
                  <td className="d-flex column-gap-3">
                    {product?.relatedProduct
                      ? product?.relatedProduct?.map((el, index) => (
                          <div key={index}>
                            <p>{el[0].title}</p>
                            <div className="customBorder">
                              <Image
                                width={70}
                                src={`${imageBaseURL}/${el[0]?.imageArray?.[0].imageURL}`}
                              />{" "}
                            </div>
                          </div>
                        ))
                      : "Empty"}
                  </td>
                </tr>

                <tr>
                  <th>Description</th>
                  <td>
                    {product?.description ? product?.description : "Empty"}
                  </td>
                </tr>
              </thead>
            </table>

            <Link to={`/products`} className="btn btn-primary">
              Back to Product
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default ProductView;
