import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import InventoryModal from "../modal/InventoryModal";
import boxIcon from "../assets/box.svg";
import {
  getJobSiteInventory,
  createInventoryItem,
  updateInventoryItem,
} from "../services/api";
import "./Dashboard.css";

const JobSiteDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [inventoryList, setInventoryList] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const services = ["Sidewalk Shed", "Scaffold", "Shoring"];

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      setError(null);
      getJobSiteInventory(id)
        .then((data) => {
          setInventoryList(data);
        })
        .catch((err) => {
          console.error("Error fetching inventory:", err);
          setError("Failed to load inventory. Please try again.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [id]);

  const handleDoubleClick = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleCreate = () => {
    if (!selectedService) {
      alert("Please select a service first.");
      return;
    }
    setSelectedItem(null);
    setShowModal(true);
  };

  const handleSave = async (data) => {
    try {
      setError(null);
      setIsSaving(true);
      if (data._id) {
        await updateInventoryItem(id, data._id, data);
      } else {
        await createInventoryItem(id, {
          ...data,
          service: selectedService,
        });
      }
      const updated = await getJobSiteInventory(id);
      setInventoryList(updated);
      setShowModal(false);
    } catch (err) {
      console.error("Error saving inventory item:", err);
      setError("Failed to save item. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const filteredInventory = selectedService
    ? inventoryList.filter((item) => item.category === selectedService)
    : [];

  return (
    <div className="inventory-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h4>Job Site Inventory</h4>
        {services.map((service) => (
          <button
            key={service}
            onClick={() => setSelectedService(service)}
            className={`service-btn ${
              selectedService === service ? "active" : ""
            }`}
          >
            {service}
          </button>
        ))}
        <button className="go-back" onClick={() => navigate(-1)}>
          <FaArrowLeft style={{ marginRight: "8px" }} />
          Go Back
        </button>
      </div>

      {/* Main Panel */}
      <div className="datagrid">
        {selectedService ? (
          <>
            {/* Add Button */}
            <div className="toolbar">
              <button className="create-btn" onClick={handleCreate}>
                <span className="plus-icon">+</span> Add Item
              </button>
            </div>

            {isLoading ? (
              <div className="empty-state">
                <p>Loading inventory items...</p>
              </div>
            ) : error ? (
              <div className="empty-state error">
                <p>{error}</p>
              </div>
            ) : filteredInventory.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Description</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInventory.map((row, index) => (
                    <tr
                      key={row._id || index}
                      onDoubleClick={() => handleDoubleClick(row)}
                    >
                      <td data-label="Item">{row.item}</td>
                      <td data-label="Quantity">{row.quantity}</td>
                      <td data-label="Description">{row.description}</td>
                      <td data-label="Notes">{row.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-state">
                <p>No items available for {selectedService}</p>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <img src={boxIcon} alt="No Service Selected" width={80} />
            <p>Please select a service on your left to proceed.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <InventoryModal
          initialData={selectedItem}
          onClose={() => setShowModal(false)}
          onSubmit={handleSave}
          service={selectedService}
          error={error}
          isSaving={isSaving}
        />
      )}
    </div>
  );
};

export default JobSiteDetails;
