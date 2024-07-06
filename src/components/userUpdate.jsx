import React, { useEffect } from "react";
import { Modal, Form, Input, Select, Button, message } from "antd";
import useApiRequest from "./common/useApiRequest";
import { ROUTES } from "../utils/routes";

const { Option } = Select;

const UpdateUserModal = ({ visible, onCancel, user, shifts, getUserList }) => {
  const [form] = Form.useForm();
  const { sendRequest } = useApiRequest();
  const {
    USER: { UPDATE },
  } = ROUTES;
  useEffect(() => {
    if (user && visible) {
      form.setFieldsValue({
        name: user.name,
        supervisorCode: user.supervisorCode,
        shiftId: user.shift,
      });
    }
  }, [user, form, visible]);
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
        {user.role === "assistant" ? (
          <Form.Item
            name="supervisorCode"
            label="Supervisor Code"
            rules={[
              { required: true, message: "Please input the supervisor code!" },
            ]}
          >
            <Input />
          </Form.Item>
        ) : (
          <></>
        )}
        {user.role === "assistant" ? (
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
        ) : (
          <></>
        )}
      </Form>
    </Modal>
  );
};

export default UpdateUserModal;
