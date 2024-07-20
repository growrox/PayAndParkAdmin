import React, { useEffect, useState } from "react";

import {
  Button,
  Card,
  DatePicker,
  Flex,
  Form,
  Input,
  message,
  Modal,
  Pagination,
  Table,
} from "antd";
import dayjs from "dayjs";

import useApiRequest from "../components/common/useApiRequest";
import { ROUTES } from "../utils/routes";

const { Search } = Input;

const VehiclePassManager = () => {
  const [form] = Form.useForm();
  const [vehiclePasses, setVehiclePasses] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentPass, setCurrentPass] = useState(null);
  const [searchText, setSearchText] = useState("");

  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 50,
    total: 0,
  });
  const {
    PASS: { GET_ALL, CREATE, UPDATE, DELETE },
  } = ROUTES;
  const { sendRequest } = useApiRequest();
  const fetchVehiclePasses = async () => {
    try {
      setLoading(true);
      const { passes, totalItems } = await sendRequest({
        url: `${import.meta.env.VITE_BACKEND_URL}${GET_ALL}?page=${
          pagination.current
        }&limit=${pagination.pageSize}&search=${searchText ? searchText : ""}`,
        method: "GET",
        showNotification: false,
      });
      const passList = passes.map((pass, index) => ({
        serial: (pagination.current - 1) * pagination.pageSize + index + 1,
        ...pass,
        passExpiryDate: pass.passExpiryDate
          ? dayjs(pass.passExpiryDate).format("MMMM D, YYYY h:mm A")
          : null,
        insuranceExpiryDate: pass.insuranceExpiryDate
          ? dayjs(pass.insuranceExpiryDate).format("MMMM D, YYYY h:mm A")
          : null,
      }));
      setVehiclePasses(passList);
      setPagination({
        ...pagination,
        total: totalItems,
      });
    } catch (error) {
      console.log({ error });
      setVehiclePasses([]);
      setPagination({
        ...pagination,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehiclePasses();
  }, [searchText]);

  const showModal = (pass) => {
    setCurrentPass(pass);
    setIsModalVisible(true);
    if (pass) {
      form.setFieldsValue({
        ...pass,
        passExpiryDate: dayjs(pass.passExpiryDate),
        insuranceExpiryDate: dayjs(pass.insuranceExpiryDate),
      });
    } else {
      form.resetFields();
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleFormSubmit = async (values) => {
    const method = currentPass ? "PUT" : "POST";
    const url = currentPass
      ? `${import.meta.env.VITE_BACKEND_URL}${UPDATE}/${currentPass._id}`
      : `${import.meta.env.VITE_BACKEND_URL}${CREATE}`;

    try {
      await sendRequest({
        url,
        method,
        showNotification: true,
        data: values,
      });
      fetchVehiclePasses();
      setIsModalVisible(false);
    } catch (error) {
      console.log({ error });
    }
  };

  const handleDelete = async (id) => {
    try {
      console.log({ id });
      //   await axios.delete(`${backendUrl}/vehicle-pass/${id}`);
      await sendRequest({
        url: `${import.meta.env.VITE_BACKEND_URL}${DELETE}/${id}`,
        method: "DELETE",
        showNotification: true,
        data: {},
      });
      fetchVehiclePasses();
      message.success("Vehicle pass deleted successfully");
    } catch (error) {
      message.error("Delete failed");
    }
  };

  const handlePageChange = (page, size) => {
    setPagination({
      ...pagination,
      current: page,
      pageSize: size,
    });
  };
  const handleSearch = (value) => {
    setSearchText(value);
    fetchVehiclePasses(value);
  };
  return (
    <div>
      <Card>
        <Flex
          justify="space-between"
          align="center"
          style={{ marginBottom: 16 }}
        >
          <Search
            placeholder="Search by name"
            onSearch={handleSearch}
            style={{ width: 200 }}
          />
          <Button type="primary" onClick={() => showModal(null)}>
            Create New Pass
          </Button>
        </Flex>
        <Table
          dataSource={vehiclePasses}
          rowKey="_id"
          pagination={false}
          loading={loading}
        >
          <Table.Column title="Serial No" dataIndex="serial" key="serial" />
          <Table.Column
            title="Expiration Date"
            dataIndex="passExpiryDate"
            key="passExpiryDate"
          />

          <Table.Column
            title="Insurance Expiry Date"
            dataIndex="insuranceExpiryDate"
            key="insuranceExpiryDate"
          />
          <Table.Column
            title="Vehicle Type"
            dataIndex="vehicleType"
            key="vehicleType"
          />
          <Table.Column
            title="Vehicle Model"
            dataIndex="vehicleModel"
            key="vehicleModel"
          />
          <Table.Column
            title="Vehicle Color"
            dataIndex="vehicleColor"
            key="vehicleColor"
          />
          <Table.Column title="Phone Number" dataIndex="phone" key="phone" />
          <Table.Column
            title="Action"
            key="action"
            render={(text, record) => (
              <Flex justify="space-around" align="center">
                <Button onClick={() => showModal(record)}>Edit</Button>
                <Button
                  type="primary"
                  danger
                  onClick={() => handleDelete(record._id)}
                >
                  Delete
                </Button>
              </Flex>
            )}
          />
        </Table>
        <Pagination
          size="small"
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={pagination.total}
          onChange={handlePageChange}
          showSizeChanger={true}
          className="user-pagination"
        />
      </Card>
      <Modal
        title={currentPass ? "Edit Vehicle Pass" : "Create Vehicle Pass"}
        visible={isModalVisible}
        onCancel={handleCancel}
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={handleFormSubmit} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="vehicleNo"
            label="Vehicle Number"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="vehicleType"
            label="Vehicle Type"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="vehicleModel"
            label="Model"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="vehicleColor"
            label="Color"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="insuranceExpiryDate"
            label="Insurance Expiry Date"
            rules={[{ required: true }]}
          >
            <DatePicker />
          </Form.Item>
          {/* <Form.Item
            name="purchaseDate"
            label="Purchase Date"
            rules={[{ required: true }]}
          >
            <DatePicker />
          </Form.Item> */}
          <Form.Item
            name="phone"
            label="Phone Number"
            rules={[{ required: true, len: 10 }]}
          >
            <Input maxLength={10} />
          </Form.Item>
          <Form.Item
            name="passExpiryDate"
            label="Expiration Date"
            rules={[{ required: true }]}
          >
            <DatePicker />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default VehiclePassManager;
