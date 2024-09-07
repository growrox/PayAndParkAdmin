import React, { useState } from "react";
import { Button, Card, Form, Input, message } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import useApiRequest from "../components/common/useApiRequest";
import { ROUTES } from "../utils/routes";
import Logo from "../../public/logo.png";

const ResetPasswordForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { USER } = ROUTES;
  const { sendRequest } = useApiRequest();
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const phone = new URLSearchParams(location.search).get("phone");

  // Handle form submission for resetting the password
  const onSubmitReset = async () => {
    if (password !== confirmPassword) {
      message.error("Passwords do not match!");
      return;
    }
    console.log({ phone, OTP: otp, password, confirmPassword });

    try {
      setLoading(true);
      const response = await sendRequest({
        url: `${import.meta.env.VITE_BACKEND_URL}${USER.UPDATE_PASSWORD}`,
        method: "PATCH",
        showNotification: true,
        data: { phone, OTP: otp, password, confirmPassword },
      });
      if (Object.keys(response).length > 0) {
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Card
        style={{
          minWidth: "300px",
          maxWidth: "600px",
          width: "100%",
          margin: "auto",
        }}
        loading={loading}
        title="Reset Password"
        extra={
          <div>
            <img src={Logo} width={70} alt="Logo" />
          </div>
        }
      >
        <Form
          name="resetPassword"
          labelCol={{ span: 6 }}
          onFinish={onSubmitReset}
          autoComplete="off"
        >
          <Form.Item
            label="OTP"
            name="otp"
            rules={[{ required: true, message: "Please input the OTP!" }]}
          >
            <Input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              minLength={6}
              maxLength={6}
            />
          </Form.Item>

          <Form.Item
            label="New Password"
            name="password"
            rules={[
              { required: true, message: "Please input a new password!" },
            ]}
          >
            <Input.Password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            rules={[
              { required: true, message: "Please confirm your new password!" },
            ]}
          >
            <Input.Password
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit" loading={loading}>
              Reset Password
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ResetPasswordForm;
