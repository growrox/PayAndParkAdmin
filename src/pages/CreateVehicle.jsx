import React from "react";
import { Form, Input, Button, Upload, message, Space, Card } from "antd";
import {
  InboxOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { Outlet } from "react-router-dom";
import { ROUTES } from "../utils/routes";
import useApiRequest from "../components/common/useApiRequest";

const { Dragger } = Upload;

const CreateVehicleType = () => {
  const [form] = Form.useForm();
  const { VEHICLE_TYPE } = ROUTES;
  const { sendRequest } = useApiRequest();

  const onSubmit = async (values) => {
    try {
      console.log({ values });
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("hourlyPrices", JSON.stringify(values.hourlyPrices));
      if (values.image && values.image[0]) {
        formData.append("image", values.image[0].originFileObj);
      }
      // Debugging: Log out formData contents
      for (let [key, value] of formData.entries()) {
        console.log(key, value); // This will show each key and value in formData
      }

      const response = await sendRequest({
        url: `${import.meta.env.VITE_BACKEND_URL}${VEHICLE_TYPE.CREATE}`,
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        showNotification: true,
        data: formData,
      });
      console.log({ response });
      message.success("Vehicle type created successfully");
      form.resetFields();
    } catch (error) {
      console.log({ error });
      message.error("Failed to create vehicle type");
    }
  };
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList.slice(-1); // Take the last file to ensure only one file is processed
  };
  return (
    <>
      <Card title="Create Vehicle">
        <Form form={form} onFinish={onSubmit} layout="vertical">
          <Form.Item
            name="name"
            label="Vehicle Type Name"
            rules={[
              {
                required: true,
                message: "Please input the name of the vehicle type!",
              },
            ]}
          >
            <Input placeholder="Enter vehicle type name" />
          </Form.Item>

          <Form.List
            name="hourlyPrices"
            rules={[
              {
                validator: async (_, hourlyPrices) => {
                  if (!hourlyPrices || hourlyPrices.length < 1) {
                    return Promise.reject(
                      new Error("At least one hourly price must be entered")
                    );
                  }
                },
              },
            ]}
          >
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, fieldKey, ...restField }) => (
                  <Space
                    key={key}
                    style={{ display: "flex", marginBottom: 8 }}
                    align="baseline"
                  >
                    <Form.Item
                      {...restField}
                      name={[name, "hour"]}
                      fieldKey={[fieldKey, "hour"]}
                      rules={[{ required: true, message: "Missing hour" }]}
                    >
                      <Input type="number" placeholder="Hour" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "price"]}
                      fieldKey={[fieldKey, "price"]}
                      rules={[{ required: true, message: "Missing price" }]}
                    >
                      <Input type="number" placeholder="Price" />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Add Hourly Price
                </Button>
              </>
            )}
          </Form.List>

          <Form.Item
            name="image"
            label="Vehicle Type Image"
            valuePropName="fileList"
            getValueFromEvent={normFile} // Adjusted to handle file list from the upload
          >
            <Dragger
              name="file"
              maxCount={1}
              beforeUpload={() => false}
              listType="picture"
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
              <p className="ant-upload-hint">
                Support for a single upload. Drag or click here to add the
                image.
              </p>
            </Dragger>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Create Vehicle Type
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Outlet />
    </>
  );
};

export default CreateVehicleType;
