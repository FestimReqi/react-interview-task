import { useState } from "react";
import {
  AiOutlineInfoCircle,
  AiOutlineClose,
  AiOutlineCheck,
} from "react-icons/ai";
import "./ModalForm.css";

const CreateJobSiteModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    status: "",
  });

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
          <h3>Title</h3>
          <p className="modal-info">
            <AiOutlineInfoCircle className="info-icon" />
            Informative piece of text that can be used regarding this modal.
          </p>
          <span className="close-btn" onClick={onClose}>
            &times;
          </span>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Name</label>
            <input
              name="name"
              type="text"
              placeholder="Type the jobsite's name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="row">
            <div className="input-group">
              <label>Category Included</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="Sidewalk Shed">Sidewalk Shed</option>
                <option value="Scaffold">Scaffold</option>
                <option value="Shoring">Shoring</option>
              </select>
            </div>

            <div className="input-group">
              <label>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="">Select one</option>
                <option value="Completed">Completed</option>
                <option value="In Progress">In Progress</option>
                <option value="On Hold">On Hold</option>
              </select>
            </div>
          </div>

          <div className="modal-buttons">
            <button type="button" className="cancel-btn" onClick={onClose}>
              <AiOutlineClose className="btn-icon" /> Cancel Changes
            </button>
            <button type="submit" className="save-btn">
              <AiOutlineCheck className="btn-icon" /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateJobSiteModal;
