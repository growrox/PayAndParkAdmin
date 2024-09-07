import React, { useState } from "react";
import { Button, Card, Form, Input, message, Row, Typography, Col } from "antd";
import { useNavigate } from "react-router-dom";

import Logo from "../../public/logo.png";
import useApiRequest from "../components/common/useApiRequest";
import userStore from "../store/userStore";
import { ROUTES } from "../utils/routes";
const { Link } = Typography;

const LoginForm = () => {
  const navigate = useNavigate();
  const { USER } = ROUTES;
  const { sendRequest } = useApiRequest();
  const [loading, setLoading] = useState(false);
  const { setUser, setIsLoggedIn } = userStore();
  const [otpSent, setOtpSent] = useState(false); // Flag to manage OTP step
  const [loginData, setLoginData] = useState({}); // Store login data
  const [otp, setOtp] = useState(""); // OTP input state

  // Handle form submission for phone/password
  const onSubmitLogin = async (data) => {
    try {
      setLoading(true);
      await sendRequest({
        url: `${import.meta.env.VITE_BACKEND_URL}${USER.LOGIN}`,
        method: "POST",
        showNotification: true,
        data,
      });

      setLoginData(data);
      setOtpSent(true);
    } catch (error) {
      console.error(error);
      message.error("Login failed.");
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP verification
  const onSubmitOtp = async () => {
    try {
      setLoading(true);
      console.log({ loginData, otp });

      const response = await sendRequest({
        url: `${import.meta.env.VITE_BACKEND_URL}${USER.VERIFY_OTP}`,
        method: "POST",
        showNotification: true,
        data: { ...loginData, OTP: otp }, // Send OTP along with login data
      });
      if (Object.keys(response).length > 0) {
        setUser(response);
        setIsLoggedIn(true);
        setTimeout(() => {
          navigate("/"); // Redirect to admin page
        }, 100);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const backToLogin = () => {
    setOtpSent(false); // Reset the OTP flag to show the login form again
    setLoginData({}); // Clear any stored login data
    setOtp(""); // Clear the OTP input
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
        title={!otpSent ? "Login Form" : "OTP Verification"}
        extra={
          <div>
            <img src={Logo} width={70} alt="Logo" />
          </div>
        }
      >
        {!otpSent ? (
          // First form: Phone and password
          <Form
            name="login"
            labelCol={{ span: 6 }}
            initialValues={{ remember: true }}
            onFinish={onSubmitLogin}
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

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item style={{ textAlign: "end" }}>
              <Button type="primary" htmlType="submit" loading={loading}>
                Submit
              </Button>
            </Form.Item>
          </Form>
        ) : (
          // Second form: OTP verification
          <Form name="otpForm" onFinish={onSubmitOtp}>
            <Form.Item
              label="OTP"
              name="otp"
              rules={[
                {
                  required: true,
                  message: "Please enter the OTP sent to your phone!",
                },
              ]}
            >
              <Input
                value={otp}
                minLength={6}
                maxLength={6}
                onChange={(e) => setOtp(e.target.value)}
              />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit" loading={loading}>
                Verify OTP
              </Button>
            </Form.Item>
          </Form>
        )}
        <Row justify={"start"}>
          <Col
            xs={24}
            sm={12}
            md={8}
            lg={8}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button type="link" onClick={backToLogin} disabled={loading}>
              Back to Login
            </Button>
          </Col>
          <Col
            xs={24}
            sm={12}
            md={8}
            lg={8}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Link href="/forgot-password">Forgot Password</Link>{" "}
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default LoginForm;
