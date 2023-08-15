import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";

function Categories({ swal }) {
  const [name, setName] = useState("");
  const [editedCategory, setEditedCategory] = useState(null);
  const [parentCategory, setParentCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [properties, setProperties] = useState([]);

  function editCategory(category) {
    // console.log("categories edit =>", category);

    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parent?._id);
    setProperties(
      category.properties.map(({ name, values }) => ({
        name,
        values: values.join(","),
      }))
    );
    // console.log("categories =>", category);
  }

  async function saveCategory(ev) {
    ev.preventDefault();
    const data = {
      name,
      parentCategory,
      properties: properties.map((p) => ({
        name: p.name,
        values: p.values.split(","),
      })),
    };
    // console.log('data =>', data)
    if (editedCategory) {
      data._id = editedCategory._id;
      await axios.put("/api/categories", data);
      setEditedCategory(null);
    } else {
      await axios.post("/api/categories", data);
    }
    setName("");
    setParentCategory("");
    setProperties([]);
    fetchCategories();
  }

  function fetchCategories() {
    axios.get("api/categories").then((result) => {
      setCategories(result.data);
    });
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  function deleteCategory(category) {
    swal
      .fire({
        title: "Are you sure?",
        text: `Do you want to delete ${category.name}?`,
        showCloseButton: true,
        showCancelButton: true,
        cancelButtonText: "Cancel",
        reverseButtons: true,
        confirmButtonColor: "#d55",
        confirmButtonText: "Yes, Delete!",
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          const { _id } = category;
          await axios.delete("api/categories?_id=" + _id);
          fetchCategories();
        }
      });
  }

  function addProperty() {
    setProperties((prev) => {
      return [...prev, { name: "", values: "" }];
    });
  }
  function handlePropertyHandleChange(index, property, newName) {
    // console.log({ index, property, newName });
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].name = newName;
      return properties;
    });
  }
  function handlePropertyValueChange(index, property, newValues) {
    // console.log("update => ", index, property);
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].values = newValues;
      return properties;
    });
  }

  function removeProperty(indexToRemove) {
    setProperties((prev) => {
      return [...prev].filter((p, pIndex) => {
        return pIndex !== indexToRemove;
      });
    });
  }

  return (
    <Layout>
      <h1>Categories</h1>
      <label>
        {editedCategory
          ? `Edit Category ${editCategory.name}`
          : "Create new category"}
        New Category name
      </label>
      <form onSubmit={saveCategory} className="">
        <div className="flex gap-1">
          <input
            onChange={(ev) => setName(ev.target.value)}
            value={name}
            type="text"
            placeholder="Category name"
          ></input>
          <select
            onChange={(ev) => setParentCategory(ev.target.value)}
            className="mb-0"
            value={parentCategory}
          >
            <option value="">No parent category</option>
            {categories.length > 0 &&
              categories.map((category, index) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
          </select>
        </div>

        <div className="mb-2">
          <label className="block">Properties</label>
          <button
            onClick={addProperty}
            type="button"
            className="btn-default text-sm mg-2"
          >
            Add new property
          </button>
        </div>

        {properties.length > 0 &&
          properties.map((property, index) => (
            <div key={index} className="flex gap-1 mb-2">
              <input
                className="mb-0"
                value={property.name}
                type="text"
                onChange={(ev) =>
                  handlePropertyHandleChange(index, property, ev.target.value)
                }
                placeholder="Property name (example: color)"
              ></input>
              <input
                className="mb-0"
                onChange={(ev) =>
                  handlePropertyValueChange(index, property, ev.target.value)
                }
                type="text"
                value={property.values}
                placeholder="Value, comma seperated"
              ></input>
              <button
                onClick={() => removeProperty(index)}
                type="button"
                className="btn-red"
              >
                Remove
              </button>
            </div>
          ))}
        <div className="gap-1 ">
          {editedCategory && (
            <button
              type="button"
              onClick={() => {
                setEditedCategory(null);
                setName("");
                setParentCategory("");
                setProperties([]);
              }}
              className="btn-default py-1"
            >
              Cancel
            </button>
          )}
          <button type="submit" className="btn-primary py-1">
            Save
          </button>
        </div>
      </form>
      {!editedCategory && (
        <table className="basic mt-4">
          <thead>
            <tr>
              <td>Category name</td>
              <td>Parent category</td>
              <td>Parent category</td>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 &&
              categories.map((category, index) => (
                <tr key={index}>
                  <td>{category.name}</td>
                  <td>{category?.parent?.name}</td>
                  <td>
                    <button
                      onClick={() => editCategory(category)}
                      className="btn-default mr-1"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteCategory(category)}
                      className="btn-red "
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
}

export default withSwal(({ swal }, ref) => <Categories swal={swal} />);
