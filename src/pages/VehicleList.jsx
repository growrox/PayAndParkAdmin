import React, {
  useEffect,
  useState,
} from 'react';

import {
  Card,
  Flex,
  Image,
  message,
  Popconfirm,
  Table,
} from 'antd';
import {
  Link,
  Outlet,
} from 'react-router-dom';

import {
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons';

import useApiRequest from '../components/common/useApiRequest';
import { ROUTES } from '../utils/routes';

const GetVehicle = () => {
  const { sendRequest } = useApiRequest();
  const [isLoading, setIsLoading] = useState(false);
  const [vehicleList, setVehicleList] = useState([]);

  const {
    VEHICLE_TYPE: { GET_ALL, DELETE },
  } = ROUTES;

  const getVehicleList = async () => {
    try {
      setIsLoading(true);
      const data = await sendRequest({
        url: `${import.meta.env.VITE_BACKEND_URL}${GET_ALL}`,
        method: "GET",
        showNotification: false,
      });
      const vehicleList = data.map((dataInfo, index) => {
        return {
          serial: index + 1,
          ...dataInfo,
        };
      });
      setVehicleList(vehicleList);

      setIsLoading(false);
    } catch (error) {
      setVehicleList([]);

      console.error(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getVehicleList();
  }, []);

  const columns = [
    {
      title: "Sr No.",
      dataIndex: "serial",
      key: "serial",
      render: (text) => <a>{text}</a>,
      width: 40,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 100,
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      width: 100,
      render: (url) => <Image src={url} height={"150px"} width={"150px"} />,
    },
    {
      title: "Hourly Prices",
      dataIndex: "hourlyPrices", // Check if this should be "name"
      key: "hourlyPrices", // Matching with the key in the data object
      width: 70,
      render: (hourlyPrices) => {
        return (
          <>
            {hourlyPrices.map((info) => (
              <>
                <p>
                  Hour: {info.hour} Price: {info.price}
                </p>
              </>
            ))}
          </>
        );
      },
    },

    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Flex justify="space-evenly" align="center">
          <Link to={`/edit-vehicle/${record._id}`}>
            <EditOutlined
              style={{ color: "rgb(211 211 69)", fontSize: "18px" }}
            />
          </Link>

          <Popconfirm
            title="Delete Vehicle"
            description="Are you sure to delete this Vehicle?"
            onConfirm={() => handleDelete(record._id)}
            onCancel={cancel}
            okText="Yes"
            cancelText="No"
          >
            <DeleteOutlined style={{ color: "#D34545", fontSize: "18px" }} />
          </Popconfirm>
        </Flex>
      ),
      width: 40,
    },
  ];

  const handleDelete = async (id) => {
    try {
      setIsLoading(true);
      await sendRequest({
        url: `${import.meta.env.VITE_BACKEND_URL}${DELETE}/${id}`,
        method: "DELETE",
        showNotification: true,
        data: {},
      });

      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    } finally {
      getVehicleList();
    }
  };

  const cancel = (e) => {
    console.log(e);
    message.error("Click on No");
  };
  return (
    <>
      <Card title="Vehicle List" loading={isLoading}>
        <Table
          columns={columns}
          dataSource={vehicleList}
          size="small"
          loading={isLoading}
          scroll={{ x: 350, y: 800 }}
          pagination={true}
        />
      </Card>
      <Outlet />
    </>
  );
};

export default GetVehicle;
