// src/App.js
import React, { useState } from "react";
import { Modal, Button, Card } from "antd";
import SiteList from "../components/siteList";
import SiteForm from "../components/siteForm";

const Site = () => {
  const [siteToEdit, setSiteToEdit] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [reload, setReload] = useState(true);
  const handleEdit = (site) => {
    setSiteToEdit(site);
    setIsModalVisible(true); // Show modal on edit
  };

  const handleCreate = () => {
    setSiteToEdit(null);
    setIsModalVisible(true); // Show modal for creating a new site
  };

  const handleSave = () => {
    setSiteToEdit(null);

    setIsModalVisible(false); // Hide modal after saving
    setReload(!reload);
  };

  const handleCancel = () => {
    setSiteToEdit(null);
    setIsModalVisible(false); // Hide modal when canceled
  };

  return (
    <div>
      <Card
        title={"Site Management"}
        extra={
          <Button type="primary" onClick={handleCreate}>
            Create Site
          </Button>
        }
      >
        <SiteList onEdit={handleEdit} reload={reload} />
      </Card>

      <Modal
        title={siteToEdit ? "Edit Site" : "Create Site"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null} // Footer is not needed as form will handle submission
      >
        <SiteForm siteToEdit={siteToEdit} onSave={handleSave} />
      </Modal>
    </div>
  );
};

export default Site;
