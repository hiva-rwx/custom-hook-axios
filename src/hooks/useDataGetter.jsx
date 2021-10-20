import axios from "axios";
import { useCallback, useEffect, useState } from "react";

const useDataGetter = (
  url,
  method,
  isFetch = false,
  fetchData = null,
  config = null
) => {
  const [state, setState] = useState({
    data: [],
    loading: false,
    error: "",
    request: false,
  });

  axios.interceptors.response.use(null, (error) => {
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

  const axiosInstance = axios.create({
    baseURL: "http://localhost:3000",
  });

  const fetch = useCallback(async () => {
    setState({ ...state, loading: true });
    try {
      await axiosInstance
        .get(`/${url}`, config)
        .then((res) => {
          setState({
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
  }, [axiosInstance, config, state, url]);

  const fetchDataGet = useCallback(async () => {
    setState({ ...state, loading: true });
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
  }, [axiosInstance, config, method, state, url]);

  const fetchDataPost = useCallback(async () => {
    setState({ ...state, loading: true });
    try {
      await axiosInstance
        .post("/posts", fetchData, config)
        .then((res) => {
            console.log(res);
          setState({
            data: [...state.data, res.data],
            loading: false,
            error: "",
            request: true,
          });
          fetch();
          console.log(state.data);
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
  }, [axiosInstance, config, fetch, fetchData, state]);

  const fetchDataDelete = useCallback(
    async (id) => {
      try {
        await axiosInstance
          .delete(`/posts/${id}`, config)
          .then((res) => {
            // console.log(res);
            fetch();
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        console.log(error);
      }
    },
    [axiosInstance, config, fetch]
  );

  const fetchDataPut = useCallback(
    async (id) => {
      try {
        await axiosInstance
          .put(`/posts/${id}`, fetchData, config)
          .then((res) => {
            fetch();
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        console.log(error);
      }
    },
    [axiosInstance, config, fetch, fetchData]
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
    fetchDataGet,
    fetchDataPost,
    fetchDataDelete,
    fetchDataPut,
  };
};
export default useDataGetter;
