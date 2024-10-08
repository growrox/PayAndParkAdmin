import { useState } from "react";

import { notification } from "antd";
import axios from "axios";
import { useNavigate } from "react-router";

import userStore from "../../store/userStore";

const useApiRequest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user, setUser, setIsLoggedIn } = userStore();
  const sendRequest = async ({
    url,
    method = "get",
    headers = {},
    data = null,
    defaultHeader = true,
    responseTypeBlod = false,
    showNotification = true,
  }) => {
    setIsLoading(true);
    try {
      // Prepare headers
      const defaultHeaders = {
        "Content-Type": "application/json",
        // Authorization: localStorage.getItem("token"),
        "x-client-source": "web",
        userId: user?._id,
      };
      const finalHeaders = defaultHeader
        ? { ...defaultHeaders, ...headers }
        : headers;
      const response = await axios({
        method,
        url,
        headers: finalHeaders,
        data,
        responseType: responseTypeBlod ? "blob" : "json",
        withCredentials: true,
      });
      if (showNotification && response.data.message) {
        notification.success({ message: response.data.message });
      }
      return response.data.result;
    } catch (error) {
      if (error.response) {
        const { status } = error.response;
        if (status === 401 || status === 500) {
          setUser({});
          setIsLoggedIn(false);
          navigate("/login");
        }
      }
      console.log({ error, showNotification });

      if (
        showNotification &&
        (error.response?.data?.message || error.response.data.error)
      ) {
        notification.error({
          message: error.response.data.error || error.response.data.message,
        });
      }
      console.error(error);
      return null; // Return null on error to handle it in the component where the hook is used.
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, sendRequest };
};

export default useApiRequest;
