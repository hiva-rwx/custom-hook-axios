import axios from "axios";
import { useCallback, useEffect, useState } from "react";

const useDataGetter = (url, method, isFetch = false, config = null) => {
  const [state, setState] = useState({
    data: [],
    loading: false,
    error: "",
    request: false,
  });

  const axiosInstance = axios.create({
    baseURL: "http://localhost:3000",
  });

  axiosInstance.interceptors.response.use(null, (error) => {
    console.log(error?.response?.status);
    const errors =
      error.response &&
      error.response.status >= 400 &&
      error.response.status < 500;
    if (!errors) {
      console.log("The problem is the server");
      setState({ ...state, error: "The problem is the server" });
    }
    return Promise.reject(error);
  });

  const fetch = useCallback(async () => {
    setState({ ...state, loading: true });
    try {
      await axiosInstance
        .get(`/${url}`, config)
        .then((res) => {
          // console.log(res.data);
          setState({
            ...state,
            data: [...res.data],
          });
          // console.log(res.data);
        })
        .catch((error) => {
          setState({
            ...state,
            data: [],
            error: `error => ${error}`,
          });
        });
    } catch (error) {
      setState({
        ...state,
        data: [],
        error: `error => ${error}`,
      });
    }
  }, [axiosInstance, config, state, url]);

  const fetchData = useCallback(
    async (fetchData = null, id = null) => {
      setState({ ...state, loading: true });
      if (method === "get") {
        try {
          await axiosInstance[method](`/${url}`, config)
            .then((res) => {
              setState({
                ...state,
                data: res.data,
                loading: false,
                error: "",
                request: true,
              });
            })
            .catch((error) => {
              setState({
                ...state,
                data: [],
                loading: false,
                error: `error => ${error}`,
                request: false,
              });
            });
        } catch (error) {
          setState({
            ...state,
            data: [],
            loading: false,
            error: `error => ${error}`,
            request: false,
          });
        }
      }
      if (method === "post") {
        try {
          await axiosInstance
            .post("/posts", fetchData, config)
            .then((res) => {
              setState({
                data: [...state.data, res.data],
                loading: false,
                error: "",
                request: true,
              });
              // fetch();
            })
            .catch((error) => {
              setState({
                ...state,
                loading: false,
                error: `error => ${error}`,
                request: false,
              });
            });
        } catch (error) {
          setState({
            ...state,
            loading: false,
            error: `error => ${error}`,
            request: false,
          });
        }
      }
      if (method === "delete") {
        try {
          await axiosInstance
            .delete(`/posts/${id}`, config)
            .then((res) => {
              setState({
                data: state.data.filter((item) => item.id !== id),
                loading: false,
                error: "",
                request: true,
              });
            })
            .catch((error) => {
              setState({
                ...state,
                loading: false,
                error: `error => ${error}`,
                request: false,
              });
            });
        } catch (error) {
          setState({
            ...state,
            loading: false,
            error: `error => ${error}`,
            request: false,
          });
        }
      }
      if (method === "put") {
        try {
          await axiosInstance
            .put(`/posts/${id}`, fetchData, config)
            .then((res) => {
              // console.log(res);
              const newData = state.data.map((item) => {
                if (item.id === id) {
                  console.log([...state.data, { fetchData }]);
                  return [...state.data, { fetchData }];
                }
              });
              setState({
                data: newData,
                loading: false,
                error: "",
                request: true,
              });
            })
            .catch((error) => {
              setState({
                ...state,
                loading: false,
                error: `error => ${error}`,
                request: false,
              });
            });
        } catch (error) {
          setState({
            ...state,
            loading: false,
            error: `error => ${error}`,
            request: false,
          });
        }
      }
    },
    [axiosInstance, config, method, state, url]
  );
  useEffect(() => {
    if (isFetch) {
      fetch();
    }
  }, [fetch, isFetch]);

  const { error, loading, data, request } = state;

  return {
    error,
    loading,
    data,
    request,
    fetchData,
    fetch,
  };
};
export default useDataGetter;
