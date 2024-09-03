import React, { useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Upload,
  message,
  Space,
  Card,
  InputNumber,
} from "antd";
import {
  InboxOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "../utils/routes";
import useApiRequest from "../components/common/useApiRequest";
import userStore from "../store/userStore";

const { Dragger } = Upload;

const CreateVehicleType = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const { VEHICLE_TYPE } = ROUTES;
  const { sendRequest } = useApiRequest();
  const { user } = userStore();
  const navigate = useNavigate();
  const onSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("gstPercentage", values.gstPercentage);
      formData.append("hourlyPrices", JSON.stringify(values.hourlyPrices));
      if (values.image && values.image[0]) {
        formData.append("image", values.image[0].originFileObj);
      }
      if (id) {
        formData.append("folderName", "vehicle-type");
        console.log({ id });
        await sendRequest({
          url: `${import.meta.env.VITE_BACKEND_URL}${
            VEHICLE_TYPE.UPDATE
          }/${id}/vehicle-type`,
          method: "PUT",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          showNotification: true,
          data: formData,
        });
        getVehicleDetail();
      } else {
        await sendRequest({
          url: `${import.meta.env.VITE_BACKEND_URL}${
            VEHICLE_TYPE.CREATE
          }/vehicle-type`,
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          showNotification: true,
          data: formData,
        });
        form.resetFields();
        navigate("/vehicle-list");
      }
    } catch (error) {
      console.log({ error });
    }
  };
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList.slice(-1); // Take the last file to ensure only one file is processed
  };
  const getVehicleDetail = async () => {
    try {
      const response = await sendRequest({
        url: `${import.meta.env.VITE_BACKEND_URL}${
          VEHICLE_TYPE.GET_DETAIL
        }/${id}`,
        method: "GET",
        showNotification: false,
      });
      form.setFieldsValue({
        name: response.name,
        gstPercentage: response.gstPercentage,
        hourlyPrices: response.hourlyPrices,
      });
      if (response.image) {
        form.setFieldsValue({
          image: [
            {
              uid: "-1", // Negative id to avoid conflicts
              name: "image.png", // Name can be extracted from URL
              status: "done",
              url: response.image, // Full URL or a path from API
            },
          ],
        });
      }
    } catch (error) {
      console.log({ error });
      message.error("Failed to create vehicle type");
    }
  };
  useEffect(() => {
    if (id) {
      getVehicleDetail();
    }
  }, [id]);
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
          <Form.Item
            name="gstPercentage"
            label="GST Percentage"
            rules={[
              {
                required: true,
                message: "Please input the GST percentage of the vehicle type!",
              },
            ]}
          >
            <InputNumber placeholder="Enter GST" />
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
            label="Vehicle Image"
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
              {id ? "Update Vehicle" : "Create Vehicle"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Outlet />
    </>
  );
};

export default CreateVehicleType;
