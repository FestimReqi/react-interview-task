import React, { useState, useEffect } from "react";
import "./InventoryModal.css";

const InventoryModal = ({
  onClose,
  onSubmit,
  initialData = {},
  service,
  error,
  isSaving,
}) => {
  const [formData, setFormData] = useState({
    item: "",
    service: "",
    category: "",
    quantity: "",
    description: "",
    notes: "",
  });

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData(initialData);
    } else if (service) {
      setFormData((prev) => ({ ...prev, category: service }));
    }
  }, [initialData, service]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>{initialData?._id ? "Edit Item" : "Add New Item"}</h3>
          <p className="modal-info">
            Add or edit inventory items for this job site. All fields marked
            with * are required.
          </p>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="row">
            <div className="input-group">
              <label>Service Type</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                disabled={!!service}
              >
                <option value="">Select service type</option>
                <option value="Sidewalk Shed">Sidewalk Shed</option>
                <option value="Scaffold">Scaffold</option>
                <option value="Shoring">Shoring</option>
              </select>
            </div>

            <div className="input-group">
              <label>Item Name</label>
              <input
                type="text"
                name="item"
                value={formData.item}
                onChange={handleChange}
                placeholder="Enter item name"
                required
              />
            </div>

            <div className="input-group">
              <label>Quantity</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="Set Quantity"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="2"
              placeholder="Type the description..."
            />
          </div>

          <div className="input-group">
            <label>Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="2"
              placeholder="Type a note..."
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="modal-buttons">
            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button type="submit" className="save-btn" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InventoryModal;
