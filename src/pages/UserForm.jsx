import React, { useState } from "react";
import { Form, Input, Button, Select, Card } from "antd";
import useApiRequest from "../components/common/useApiRequest";
import { Outlet, useNavigate } from "react-router-dom";
import { ROUTES } from "../utils/routes";

const UserForm = () => {
  const [form] = Form.useForm();
  const { sendRequest, isLoading } = useApiRequest();
  const { USER } = ROUTES;
  const navigate = useNavigate();

  // State to track selected role
  const [role, setRole] = useState("accountant");

  const onFinish = async (data) => {
    console.log("Received values of form:", data);
    await sendRequest({
      url: `${import.meta.env.VITE_BACKEND_URL}${USER.SIGN_UP}`,
      method: "POST",
      showNotification: true,
      data,
    });
    form.resetFields();
  };

  const onFinishFailed = (errorInfo) => {
    console.error("Failed:", errorInfo);
  };

  const handleRoleChange = (value) => {
    setRole(value); // Update role when selection changes
  };

  return (
    <Card title="Create User" loading={isLoading}>
      <Form
        form={form}
        name="userForm"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        initialValues={{
          role: "accountant", // Default role
        }}
        layout="vertical"
        style={{ maxWidth: 600 }}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Please input your name!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Mobile Number"
          name="phone"
          rules={[
            {
              required: true,
              message: "Please input your mobile number!",
            },
            {
              pattern: new RegExp(/^(\+\d{1,3}[- ]?)?\d{10}$/),
              message: "Please enter a valid mobile number!",
            },
          ]}
        >
          <Input style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Role"
          name="role"
          rules={[{ required: true, message: "Please select a role!" }]}
        >
          <Select onChange={handleRoleChange}>
            <Select.Option value="accountant">Accountant</Select.Option>
            <Select.Option value="supervisor">Supervisor</Select.Option>
          </Select>
        </Form.Item>

        {/* Conditionally render the password field if the role is 'accountant' */}
        {role === "accountant" && (
          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please input the password!",
              },
              {
                min: 6,
                message: "Password must be at least 6 characters long!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
        )}

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
        <Outlet />
      </Form>
    </Card>
  );
};

export default UserForm;
