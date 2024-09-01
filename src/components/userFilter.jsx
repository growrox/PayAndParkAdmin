import React, { useEffect, useState } from "react";
import { Cascader, Spin } from "antd";
import useApiRequest from "./common/useApiRequest";
import { ROUTES } from "../utils/routes";

const UserFilter = ({
  getTicketList,
  pagination,
  searchText,
  setSupervisors,
  setAssistants,
}) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const { sendRequest } = useApiRequest();
  const {
    USER: { GET_SUPERVISOR_WITH_ASSISTANT },
  } = ROUTES;

  useEffect(() => {
    const fetchSupervisorsWithAssistants = async () => {
      setLoading(true);
      try {
        const response = await sendRequest({
          url: `${
            import.meta.env.VITE_BACKEND_URL
          }${GET_SUPERVISOR_WITH_ASSISTANT}`,
          method: "GET",
          showNotification: false,
        });
        const formattedOptions = response.map((supervisor) => ({
          value: supervisor._id,
          label: supervisor.name,
          children: [
            ...supervisor.assistants.map((assistant) => ({
              value: `${supervisor._id}-${assistant._id}`,
              label: assistant.name,
            })),
          ],
        }));

        const allOptions = [
          {
            value: "all-supervisors",
            label: "All Supervisors",
          },
        ];

        setOptions([...formattedOptions, ...allOptions]);
      } catch (error) {
        console.error("Failed to fetch supervisors with assistants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSupervisorsWithAssistants();
  }, []);
  const handleChange = (selectedValues, selectedOptions) => {
    const result = {
      supervisors: [],
      assistants: [],
    };

    // Ensure selectedOptions is not undefined
    if (!selectedOptions || !selectedOptions.length) {
      console.error("selectedOptions is undefined or empty");
      getTicketList(
        pagination.current,
        pagination.limit,
        searchText,
        result.supervisors,
        result.assistants
      );
      setSupervisors([]);
      setAssistants([]);
      return;
    }

    // Check if "All Supervisors" is selected
    const allSupervisorsSelected = selectedValues.some((value) => {
      const lastValue = value[value.length - 1];
      console.log({ lastValue });

      return lastValue === "all-supervisors";
    });

    if (allSupervisorsSelected) {
      // If "All Supervisors" is selected, add all supervisor IDs to the result
      options.forEach((option) => {
        console.log({ option });

        if (option.value !== "all-supervisors") {
          result.supervisors.push(option.value);
        }
      });
    } else {
      // Handle individual selections
      selectedValues.forEach((value) => {
        const lastValue = value[value.length - 1];

        if (!lastValue.includes("-")) {
          // If the selected value is a supervisor ID (no "-" in the value)
          if (!result.supervisors.includes(lastValue)) {
            result.supervisors.push(lastValue);
          }
        } else {
          const [_, assistantId] = lastValue.split("-");
          result.assistants.push(assistantId);
        }
      });
    }
    console.log("Processed Selection:", result);
    setSupervisors(result.supervisors);
    setAssistants(result.assistants);
    getTicketList(
      pagination.current,
      pagination.limit,
      searchText,
      result.supervisors,
      result.assistants
    );
  };

  return (
    <Spin spinning={loading}>
      <Cascader
        options={options}
        onChange={(value, selectedOptions) =>
          handleChange(value, selectedOptions)
        }
        placeholder="Select Supervisor and Assistant"
        style={{ width: "100%" }}
        multiple
        maxTagCount="responsive"
      />
    </Spin>
  );
};

export default UserFilter;
