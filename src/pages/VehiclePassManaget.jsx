import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  message,
  Flex,
  Pagination,
  Card,
} from "antd";
import { ROUTES } from "../utils/routes";
import useApiRequest from "../components/common/useApiRequest";
import dayjs from "dayjs";

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
    PASS: { GET_ALL, CREATE, UPDATE },
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
      const passList = passes.map((pass, index) => {
        return {
          serial: (pagination.current - 1) * pagination.pageSize + index + 1,
          expireDate: dayjs(pass.expireDate).format("DD-MM-YYY"),
          ...pass,
        };
      });
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
        expireDate: dayjs(pass.expireDate),
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
      const data = {
        ...values,
        expireDate: values.expireDate.format("YYYY-MM-DD"),
      };
      await sendRequest({
        url,
        method,
        showNotification: true,
        data,
      });
      fetchVehiclePasses();
      setIsModalVisible(false);
    } catch (error) {
      console.log({ error });
    }
  };

  const handleDelete = async (id) => {
    try {
      //   await axios.delete(`${backendUrl}/vehicle-pass/${id}`);
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
    console.log({ value });
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
        <Table dataSource={vehiclePasses} rowKey="_id" pagination={false}>
          <Table.Column
            title="Serial No"
            dataIndex="serial"
            key="serial"
          />
          <Table.Column
            title="Vehicle Number"
            dataIndex="vehicleNo"
            key="vehicleNo"
          />
          <Table.Column
            title="Expiration Date"
            dataIndex="expireDate"
            key="expireDate"
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
          <Form.Item
            name="vehicleNo"
            label="Vehicle Number"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone Number"
            rules={[{ required: true, len: 10 }]}
          >
            <Input maxLength={10} />
          </Form.Item>
          <Form.Item
            name="expireDate"
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
