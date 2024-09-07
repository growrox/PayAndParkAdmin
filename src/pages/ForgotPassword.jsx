import React, { useState } from "react";
import { Button, Card, Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import useApiRequest from "../components/common/useApiRequest";
import { ROUTES } from "../utils/routes";
import Logo from "../../public/logo.png";

const ForgotPasswordForm = () => {
  const navigate = useNavigate();
  const { USER } = ROUTES;
  const { sendRequest } = useApiRequest();
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false); // Flag to manage OTP step
  const [phone, setPhone] = useState(""); // Store phone number

  // Handle form submission for sending OTP
  const onSubmitPhone = async (data) => {
    try {
      setLoading(true);
      console.log({ data });

      await sendRequest({
        url: `${import.meta.env.VITE_BACKEND_URL}${USER.FORGOT_PASSWORD}/${
          data.phone
        }`,
        method: "GET",
        showNotification: true,
      });

      setPhone(data.phone);
      setOtpSent(true);
      message.success("OTP sent to your phone number.");
    } catch (error) {
      console.error(error);
      message.error("Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  // Handle back to login
  const backToLogin = () => {
    navigate("/login");
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
          maxWidth: "500px",
          width: "100%",
          margin: "auto",
        }}
        loading={loading}
        title={!otpSent ? "Forgot Password" : "OTP Sent"}
        extra={
          <div>
            <img src={Logo} width={70} alt="Logo" />
          </div>
        }
      >
        {!otpSent ? (
          <Form
            name="forgotPassword"
            labelCol={{ span: 6 }}
            onFinish={onSubmitPhone}
            autoComplete="off"
          >
            <Form.Item
              label="Phone Number"
              name="phone"
              rules={[
                { required: true, message: "Please input your phone number!" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit" loading={loading}>
                Send OTP
              </Button>
            </Form.Item>
          </Form>
        ) : (
          <>
            <p>OTP has been sent to your phone. Please check your messages.</p>
            <Button type="link" onClick={backToLogin} disabled={loading}>
              Back to Login
            </Button>
            <Button
              type="primary"
              onClick={() => navigate(`/reset-password?phone=${phone}`)}
            >
              Proceed to Reset Password
            </Button>
          </>
        )}
      </Card>
    </div>
  );
};

export default ForgotPasswordForm;
