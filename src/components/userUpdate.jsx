import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select, Button, message } from "antd";
import useApiRequest from "./common/useApiRequest";
import { ROUTES } from "../utils/routes";

const { Option } = Select;

const UpdateUserModal = ({ visible, onCancel, user, shifts, getUserList }) => {
  const [form] = Form.useForm();
  const { sendRequest } = useApiRequest();
  const [sites, setSites] = useState([]); // State to store sites list
  const {
    USER: { UPDATE },
    SITE: { GET_ALL }, // Assuming you have a route to list sites
  } = ROUTES;

  useEffect(() => {
    if (user && visible) {
      form.setFieldsValue({
        name: user.name,
        supervisorCode: user?.supervisorCode,
        shiftId: user?.shiftId?._id,
        siteId: user?.siteId?._id, // Assuming user has siteId field
      });

      // Fetch the list of sites when the modal is visible
      fetchSites();
    }
  }, [user, form, visible]);

  const fetchSites = async () => {
    try {
      const response = await sendRequest({
        url: `${import.meta.env.VITE_BACKEND_URL}${
          GET_ALL
        }`,
        method: "GET",
        showNotification: false,
      });
      console.log({response});
      
      setSites(response);
    } catch (error) {
      console.error("Error fetching sites:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      console.log("Received values of form: ", { values });
      const response = await sendRequest({
        url: `${import.meta.env.VITE_BACKEND_URL}${UPDATE}/${user._id}`,
        method: "PUT",
        showNotification: true,
        data: values,
      });
      onCancel();
      getUserList();
      form.resetFields();
    } catch (errorInfo) {
      console.log("Failed:", errorInfo);
    }
  };

  return (
    <Modal
      title="Update User"
      visible={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          Update
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" name="userForm">
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Please input the user name!" }]}
        >
          <Input />
        </Form.Item>
        {user.role === "assistant" && (
          <>
            <Form.Item
              name="supervisorCode"
              label="Supervisor Code"
              rules={[
                {
                  required: true,
                  message: "Please input the supervisor code!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="shiftId"
              label="Shift"
              rules={[{ required: true, message: "Please select a shift!" }]}
            >
              <Select placeholder="Select a shift">
                {shifts.map((shift) => (
                  <Option key={shift._id} value={shift._id}>
                    {shift.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="siteId"
              label="Site"
              rules={[{ required: true, message: "Please select a site!" }]}
            >
              <Select
                showSearch
                placeholder="Select a site"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
              >
                {sites.map((site) => (
                  <Option key={site._id} value={site._id}>
                    {site.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </>
        )}
      </Form>
    </Modal>
  );
};

export default UpdateUserModal;
