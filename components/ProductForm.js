import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";

export default function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  images: existingImages,
  category: assignedCategory,
  properties: assignProperties,
}) {
  const [title, setTitle] = useState(existingTitle || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [price, setPrice] = useState(existingPrice || "");
  const [goToProducts, setGoToProducts] = useState(false);
  const [images, setImages] = useState(existingImages || []);
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(assignedCategory || "");
  const [productProperties, setProductProperties] = useState(
    assignProperties || {}
  );

  async function saveProduct(ev) {
    ev.preventDefault();
    const data = {
      title,
      description,
      price,
      images,
      category,
      properties: productProperties,
    };
    // console.log(data, "<=data");
    if (_id) {
      // console.log({ ...data, _id });
      await axios.put("/api/products", { ...data, _id });
      //   await axios.put("/api/products", { ...data, _id });
    } else {
      await axios.post("/api/products", data);
    }
    setGoToProducts(true);
    // console.log(images);
  }

  if (goToProducts) {
    router.push("/products");
  }

  async function uploadImages(ev) {
    
    const files = ev.target?.files;
    if (files?.length > 0) {
      setIsUploading(true);
      const data = new FormData();
      for (const file of files) {
        data.append("file", file);
      }

      const res = await axios.post("/api/upload", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // console.log("images", res, images);
      setImages((oldImages) => {
        return [...oldImages, ...res.data.links];
      });
      // console.log(images);
    }
    setIsUploading(false);
  }

  function updateImagesOrder(images) {
    setImages(images);
  }

  useEffect(() => {
    axios.get("/api/categories").then((result) => setCategories(result.data));
  }, []);

  const propertiesToFill = [];
  if (categories.length > 0 && category) {
    let catInfo = categories.find(({ _id }) => _id === category);
    // console.log("catInfo => ", catInfo);
    propertiesToFill.push(...catInfo.properties);
    while (catInfo?.parent?._id) {
      const parentCat = categories.find(
        ({ _id }) => _id === catInfo?.parent?._id
      );
      propertiesToFill.push(...parentCat.properties);
      catInfo = parentCat;
    }
  }
  function setProductProp(propName, value) {
    setProductProperties((prev) => {
      const newProductProps = { ...prev };
      newProductProps[propName] = value;
      console.log(
        "newProductProps=>",
        newProductProps,
        "propName =>",
        propName,
        "value =>",
        value
      );
      return newProductProps;
    });
  }

  return (
    <form onSubmit={saveProduct}>
      <label> Product name</label>

      <input
        type="text"
        placeholder="product name"
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      ></input>

      <label>Category </label>
      <select onChange={(ev) => setCategory(ev.target.value)} value={category}>
        <option value={""}>Uncatogoriest</option>
        {categories.length > 0 &&
          categories.map((c) => (
            <option key={c._id} value={c._id}>
              <React.Fragment>{c.name}</React.Fragment>
            </option>
          ))}
      </select>

      {propertiesToFill.length > 0 &&
        propertiesToFill.map((p, index) => (
          <div key={index} className=" ">
            <label>{p.name[0].toUpperCase()+ p.name.substr(1)}</label>
            <div>
              <select
                value={productProperties[p.name]}
                onChange={(ev) => setProductProp(p.name, ev.target.value)}
              >
                {p.values.map((v, index2) => (
                  <option key={index2} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}

      <label>
        Photos
        <div className="mb-2 flex flex-wrap gap-1">
          <ReactSortable
            list={images}
            setList={updateImagesOrder}
            className="flex flex-wrap gap-1"
          >
            {!!images?.length &&
              images.map((link) => (
                <div key={link} className="h-24 bg-white p-4 shadow-sm rounded-sm border border-gray-200">
                  <img src={link} alt="photo" className="rounded-lg" />
                </div>
              ))}
          </ReactSortable>
          {isUploading && (
            <div className=" h-24  flex items-center">
              <Spinner />
            </div>
          )}
          <label className="cursor-pointer w-24 text-sm gap-1 rounded-sm bg-gray-200 text-primary h-24  text-center flex flex-col items-center justify-center shadow-sm border border-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              />
            </svg>
            <div>Add image</div>
            <input
              onChange={uploadImages}
              type="file"
              className="hidden"
            ></input>
          </label>
          {/* {!images?.length && <div>No photos on this product</div>} */}
        </div>
      </label>
      <label>Description</label>
      <textarea
        type="text"
        placeholder="description "
        value={description}
        onChange={(ev) => setDescription(ev.target.value)}
      ></textarea>
      <label>Price (in USD)</label>

      <input
        type="number"
        placeholder="price"
        value={price}
        onChange={(ev) => setPrice(ev.target.value)}
      ></input>

      <button type={"submit"} className="btn-primary">
        Save
      </button>
    </form>
  );
}
