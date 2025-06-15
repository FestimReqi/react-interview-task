import React, { useState, useEffect } from "react";
import CreateJobSiteModal from "../modal/CreateJobSiteModal";
import { getJobSites, createJobSite } from "../services/api";
import { IoIosInformationCircle } from "react-icons/io";

import "./Dashboard.css";

const Dashboard = () => {
  const [jobSites, setJobSites] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // we test
  useEffect(() => {
    getJobSites()
      .then((data) => {
        setJobSites(data);
      })
      .catch(console.error);
  }, []);

  const handleCreateNew = async (formData) => {
    try {
      const newSite = await createJobSite(formData);
      if (newSite) {
        setJobSites((prev) => [...prev, newSite]);
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Failed to create job site:", error);
    }
  };

  const getStatusCount = (status) =>
    jobSites.filter((site) => site.status === status).length;

  const filteredJobSites = jobSites.filter((site) =>
    site.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard">
      <h1>Job Site Dashboard</h1>

      <div className="status-cards">
        <div className="status-card yellow">
          <strong>{getStatusCount("In Progress")}</strong> In Progress
        </div>
        <div className="status-card green">
          <strong>{getStatusCount("Completed")}</strong> Completed
        </div>
        <div className="status-card red">
          <strong>{getStatusCount("On Hold")}</strong> On Hold
        </div>
      </div>

      <div className="dashboard-header-bar">
        <h2 className="dashboard-title">Title</h2>
      </div>

      <div className="info-and-action">
        <div className="info-box">
          <span className="info-icon">
            <IoIosInformationCircle />
          </span>
          <p>
            Informative piece of text that can be used regarding this modal.
          </p>
        </div>
        <div className="search-create">
          <input
            type="text"
            placeholder="Search a driver"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="create-btn" onClick={() => setIsModalOpen(true)}>
            Create <span className="plus-icon">+</span>
          </button>
        </div>
      </div>

      <table className="jobsite-table">
        <thead>
          <tr>
            <th>Jobsite Name</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredJobSites.map((site, index) => (
            <tr
              key={site._id || site.id}
              className={index % 2 === 0 ? "even-row" : "odd-row"}
            >
              <td className="text-center">
                <a href={`/inventory/${site._id || site.id}`} className="link">
                  {site.name}
                </a>
              </td>
              <td className="text-center">
                <span
                  className={`status-label ${
                    site.status
                      ? site.status.replace(" ", "").toLowerCase()
                      : "unknown"
                  }`}
                >
                  {site.status || "Unknown"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <CreateJobSiteModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateNew}
        />
      )}
    </div>
  );
};

export default Dashboard;
