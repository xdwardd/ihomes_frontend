import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaEye, FaPen, FaTrash } from "react-icons/fa6";
import AddPropertyForm from "../component/AddPropertyForm";
import toCurrency from "../utils/toCurrency";

const TestDashboard = ({ properties, setProperties, setShowForm }) => {
  const [formOpen, setFormOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editData, setEditData] = useState({});
  const [editPreviews, setEditPreviews] = useState([]);

  const loggedUser = JSON.parse(localStorage.getItem("loggedInUser"));

  const filteredProperties = properties.filter((prop) => {
    if (filter === "all") return true;
    return prop.availability === filter;
  });

  const handleDelete = (index) => {
    if (confirm("Are you sure you want to delete this property?")) {
      const newProps = [...properties];
      newProps.splice(index, 1);
      setProperties(newProps);
    }
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditData(properties[index]);
    setEditPreviews(properties[index].images || []);
  };

  const handleEditFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map((file) => file);
    setEditData({
      ...editData,
      images: [...(editData.images || []), ...files],
    });
    setEditPreviews([...editPreviews, ...files]);
  };

  const handleDropEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      setEditData({
        ...editData,
        images: [...(editData.images || []), ...files],
      });
      setEditPreviews([...editPreviews, ...files]);
      e.dataTransfer.clearData();
    }
  };

  const handleDragOverEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const removeEditImage = (index) => {
    const updatedImages = editData.images.filter((_, i) => i !== index);
    const updatedPreviews = editPreviews.filter((_, i) => i !== index);
    setEditData({ ...editData, images: updatedImages });
    setEditPreviews(updatedPreviews);
  };

  const saveEdit = () => {
    const updatedProperties = [...properties];
    updatedProperties[editingIndex] = editData;
    setProperties(updatedProperties);
    setEditingIndex(null);
  };

  const [editingProperty, setEditingProperty] = useState(null);
  const [properties1, setProperties1] = useState([]);
  const [propertyFilePaths, setPropertyFilePaths] = useState([]);

  const getAllPropertyByManagerId = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/property/manager/${loggedUser.id}`,
      );
      setProperties1(response.data);

      // Parse the file paths for each property and store them in an array
      const filePaths = response.data.map(
        (property) => JSON.parse(property.files), // Assuming `files` is a JSON string in the database
      );
      setPropertyFilePaths(filePaths); // Store the array of file paths
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAllPropertyByManagerId();
  }, []);
  console.log(propertyFilePaths);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col text-gray-700">
      {formOpen === true ? (
        <AddPropertyForm setShowForm={setFormOpen} property={editingProperty} />
      ) : (
        <main className="p-6 lg:p-10 flex-1 flex flex-col">
          <div className="flex flex-col md:flex-row justify-between py-4">
            <h2 className="text-xl font-bold mb-4 ">Property Dashboard</h2>

            <button
              className="w-32 border p-1 hover:bg-gray-100"
              onClick={() => setShowForm(true)}
            >
              Add Properties
            </button>
          </div>

          <section className="flex-1 ">
            <div className="mt-2 grid grid-cols-1  md:grid-cols-2 lg:grid-cols-4 gap-4">
              {properties1.map((property, index) => (
                <div
                  className="px-4 py-2 border border-gray-200  shadow-md rounded-md hover:shadow-blue-700"
                  key={property.id}
                >
                  <div
                    className={`${property?.availability == "available" ? "text-green-600" : "text-red-500"} font-bold tracking-wider mb-4 mt-2`}
                  >
                    {property.availability.toUpperCase()}
                  </div>
                  <img
                    src={`http://localhost:3000/${propertyFilePaths[index] && propertyFilePaths[index][0]}`}
                    alt={`http://localhost:3000/${propertyFilePaths[index] && propertyFilePaths[index][0]}`}
                    // alt={property.property_title}
                    className=" rounded-md mx-auto h-50 w-80 cursor-pointer hover:scale-105 transition-transform duration-300 hover:shadow-lg"
                    // onClick={() => handleCondoClick(condo.id)}
                  />

                  {/* for multiple display of images */}
                  {/* {propertyFilePaths[index] &&
                 propertyFilePaths[index].map((filePath, i) => (
                   <img
                     key={i}
                     src={filePath}
                     alt={`${property.property_title} Image ${i + 1}`}
                     className="rounded-md w-full cursor-pointer hover:scale-105 transition-transform duration-300 hover:shadow-lg"
                   />
                 ))} */}
                  <div className="mt-2">
                    <p className="text-xl font-medium">
                      {property.property_title}
                    </p>
                    <p className="text-xs">{property.address}</p>
                    <p className="text-base text-blue-700 font-medium mt-2">
                      {toCurrency(property.monthly_price)}
                    </p>
                  </div>
                  <div className="flex gap-4 justify-end mt-4">
                    <button
                      className="rounded bg-gray-500 text-white text-sm h-10 px-3 hover:bg-gray-700 cursor-pointer"
                      onClick={() => {
                        setFormOpen(true);
                        setEditingProperty(property);
                      }}
                    >
                      Edit
                    </button>
                    <button className=" rounded bg-red-500 text-white text-sm px-3 hover:bg-red-700 cursor-pointer">
                      Delete
                    </button>
                    {/* <FaEye className="text-blue-500 text-xl" />
                    <FaPen className="text-green-800 text-xl" />
                    <FaTrash className="text-red-500 text-xl" /> */}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      )}
    </div>
  );
};

export default TestDashboard;
