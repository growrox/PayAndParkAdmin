import React, { useState } from "react";
import { Radio, Button, Space, message } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { ROUTES } from "../utils/routes";
import userStore from "../store/userStore";
import axios from "axios";
import moment from "moment";

const DownloadReport = ({
  supervisors,
  assistants,
  startDate,
  endDate,
  searchText,
  setIsLoading,
}) => {
  const [format, setFormat] = useState("pdf"); // Default to PDF
  const { user, setUser, setIsLoggedIn } = userStore();

  const {
    TICKET: { GET_ALL },
  } = ROUTES;
  const handleDownload = async () => {
    try {
      setIsLoading(true);
      const response = await axios({
        url: `${
          import.meta.env.VITE_BACKEND_URL
        }${GET_ALL}?search=${searchText}&exportFormat=${format}`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          //   Authorization: localStorage.getItem("token"),
          "x-client-source": "web",
          userId: user?._id,
        },
        responseType: "blob",
        data: {
          supervisors,
          assistants,
          startDate,
          endDate,
        },
        withCredentials: true,
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      const timestamp = moment().format("YYYYMMDD_HHmm");
      const filename = `KT_ENTERPRISE_Ticket_Details_${timestamp}.xlsx`;
      link.setAttribute(
        "download",
        `${filename}.${format === "pdf" ? "pdf" : "xlsx"}`
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      message.success(`Downloaded tickets report as ${format.toUpperCase()}`);
    } catch (error) {
      console.error("Error downloading the report:", error);
      message.error("Failed to download the report.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Space direction="vertical" align="center">
      <Radio.Group
        value={format}
        onChange={(e) => setFormat(e.target.value)}
        buttonStyle="solid"
      >
        <Radio.Button value="pdf">PDF</Radio.Button>
        <Radio.Button value="excel">Excel</Radio.Button>
      </Radio.Group>
      <Button
        type="primary"
        icon={<DownloadOutlined />}
        onClick={handleDownload}
      >
        Download Report
      </Button>
    </Space>
  );
};

export default DownloadReport;
