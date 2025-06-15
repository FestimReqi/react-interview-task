import React, { useState, useEffect } from "react";
import InventoryModal from "../modal/InventoryModal";
import { FaArrowLeft } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import {
  getJobSites,
  getJobSiteInventory,
  updateInventoryItem,
  createInventoryItem,
} from "../services/api";
import boximg from "../assets/box.svg";
import "./Dashboard.css";

const JobSiteTable = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [jobSiteName, setJobSiteName] = useState("");
  const [inventoryList, setInventoryList] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [loading, setLoading] = useState(true);

  const services = ["Sidewalk Shed", "Scaffold", "Shoring"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sites = await getJobSites();
        console.log("All job sites:", sites);
        const found = sites.find((s) => s._id === id);

        if (found) {
          setJobSiteName(found.name);
        } else {
          console.warn("Job site not found for ID:", id);
          setJobSiteName("Unknown Job Site");
        }

        const inventory = await getJobSiteInventory(id);
        console.log("Inventory for this job site:", inventory);
        setInventoryList(inventory);

        if (inventory.length > 0 && !selectedService) {
          setSelectedService(inventory[0].category);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id, selectedService]);

  const handleDoubleClick = (item) => {
    setEditItem(item);
    setShowModal(true);
  };

  const handleCreate = () => {
    if (!selectedService) {
      alert("Please select a service before creating an item.");
      return;
    }
    setEditItem(null);
    setShowModal(true);
  };

  const handleSave = async (data) => {
    try {
      if (data._id) {
        await updateInventoryItem(id, data._id, data);
      } else {
        await createInventoryItem(id, {
          ...data,
          category: selectedService,
        });
      }
      const updated = await getJobSiteInventory(id);
      setInventoryList(updated);
      setShowModal(false);
    } catch (error) {
      console.error("Error saving inventory item:", error);
    }
  };

  const filteredInventory = selectedService
    ? inventoryList.filter((item) => item.category === selectedService)
    : [];

  return (
    <div className="inventory-container">
      <div className="sidebar">
        <h4>{jobSiteName}</h4>
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

      <div className="datagrid">
        {loading ? (
          <p>Loading...</p>
        ) : selectedService ? (
          <>
            <button onClick={handleCreate} className="create-btn">
              + Create New Item
            </button>

            {filteredInventory.length === 0 ? (
              <div className="empty-state">
                <p>No data for this service</p>
              </div>
            ) : (
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
            )}
          </>
        ) : (
          <div className="empty-state">
            <img src={boximg} alt="empty" style={{ height: 100 }} />
            <h3>No Service Selected</h3>
            <p>Please select a service on your left to proceed.</p>
          </div>
        )}
      </div>

      {showModal && (
        <InventoryModal
          initialData={editItem}
          onClose={() => setShowModal(false)}
          onSubmit={handleSave}
        />
      )}
    </div>
  );
};

export default JobSiteTable;
