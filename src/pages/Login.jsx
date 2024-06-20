import React from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../utils/routes";
import { Form, Input, Button, Card, Checkbox, Flex } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import Logo from "../../public/logo.png";
import useApiRequest from "../components/common/useApiRequest";
import userStore from "../store/userStore";

const LoginForm = () => {
  const navigate = useNavigate();
  const { USER } = ROUTES;
  const { sendRequest } = useApiRequest();
  const { setUser, setIsLoggedIn } = userStore();
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const onSubmit = async (data) => {
    console.log({ data });
    try {
      const user = await sendRequest({
        url: `${import.meta.env.VITE_BACKEND_URL}${USER.LOGIN}`,
        method: "POST",
        showNotification: true,
        data,
      });
      if (user) {
        console.log({ user });
        setUser(user);
        setIsLoggedIn(true);
        setTimeout(() => {
          navigate("/");
        }, 1000);
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Flex justify="center" align="center" style={{ height: "100vh" }}>
      <Card
        title="Login Form"
        extra={
          <div>
            <img src={Logo} width={70} />
          </div>
        }
      >
        <Form
          name="basic"
          labelCol={{
            span: 10,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onSubmit}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Phone Number"
            name="phone"
            rules={[
              {
                required: true,
                message: "Please input your phone no!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="remember"
            valuePropName="checked"
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Flex>
  );
};

export default LoginForm;
