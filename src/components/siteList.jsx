// src/components/SiteList.js
import React, { useState, useEffect } from "react";
import { List, Button, Input } from "antd";
import useApiRequest from "./common/useApiRequest";
import { ROUTES } from "../utils/routes";

const { Search } = Input;

const SiteList = ({ onEdit, reload }) => {
  const [sites, setSites] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { sendRequest } = useApiRequest();
  const { SITE } = ROUTES;
  useEffect(() => {
    fetchSites();
  }, [searchTerm, reload]);

  const fetchSites = async () => {
    try {
      const response = await sendRequest({
        url: `${import.meta.env.VITE_BACKEND_URL}${
          SITE.GET_ALL
        }?search=${searchTerm}`,
        method: "GET",
        showNotification: false,
      });
      setSites(response);
    } catch (error) {
      console.error("Error fetching sites:", error);
    }
  };

  const deleteSite = async (id) => {
    try {
      // await api.delete(`/sites/${id}`);
      await sendRequest({
        url: `${import.meta.env.VITE_BACKEND_URL}${SITE.DELETE}/${id}`,
        method: "DELETE",
        showNotification: true,
        data: {},
      });
      fetchSites();
    } catch (error) {
      console.error("Error deleting site:", error);
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  return (
    <div>
      <Search
        placeholder="Search sites..."
        enterButton="Search"
        onSearch={handleSearch}
        style={{ marginBottom: "20px", width: "300px" }}
      />
      <List
        bordered
        dataSource={sites}
        renderItem={(site) => (
          <List.Item
            actions={[
              <Button type="link" onClick={() => onEdit(site)}>
                Edit
              </Button>,
              <Button type="link" danger onClick={() => deleteSite(site._id)}>
                Delete
              </Button>,
            ]}
          >
            {site.name} - {site.description}
          </List.Item>
        )}
      />
    </div>
  );
};

export default SiteList;
