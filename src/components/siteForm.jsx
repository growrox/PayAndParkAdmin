// src/components/SiteForm.js
import React, { useState, useEffect } from "react";
import { Card, Form, Input, Button } from "antd";
import useApiRequest from "./common/useApiRequest";
import { ROUTES } from "../utils/routes";

const SiteForm = ({ siteToEdit, onSave }) => {
  const [form] = Form.useForm();
  const { sendRequest } = useApiRequest();
  const { SITE } = ROUTES;

  useEffect(() => {
    if (siteToEdit) {
      form.setFieldsValue({
        name: siteToEdit.name,
        description: siteToEdit.description,
      });
    } else {
      form.resetFields();
    }
  }, [siteToEdit, form]);
  console.log({siteToEdit});
  
  const handleSubmit = async (values) => {
    try {
      const data = {
        name: values.name,
        description: values.description,
      };

      if (siteToEdit) {
        // Update site
        await sendRequest({
          url: `${import.meta.env.VITE_BACKEND_URL}${SITE.UPDATE}/${siteToEdit._id}`,
          method: "PUT",
          showNotification: true,
          data,
        });
      } else {
        // Create new site
        await sendRequest({
          url: `${import.meta.env.VITE_BACKEND_URL}${SITE.CREATE}`,
          method: "POST",
          showNotification: true,
          data,
        });
      }
      onSave(); // Callback to refresh the list or reset form
    } catch (error) {
      console.error("Error saving site:", error);
    }
  };

  return (
    <Card title={siteToEdit ? "Edit Site" : "Create Site"}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter the site name" }]}
        >
          <Input placeholder="Enter site name" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Please enter the site description" }]}
        >
          <Input.TextArea placeholder="Enter site description" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            {siteToEdit ? "Update" : "Create"}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default SiteForm;
