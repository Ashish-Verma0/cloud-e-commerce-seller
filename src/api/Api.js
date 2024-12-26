import axios from "axios";
import { toast } from "react-toastify";
const token = localStorage.getItem("token");

export const getFetch = async (url) => {
  try {
    const response = await axios({
      method: "get",
      url: `${url}`,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response;
  } catch (error) {
    console.log("ashish", error);
    if (error.status === 401) {
      localStorage.removeItem("token");
      toast("Token expired Please Login");
      window.location.reload();
    }
    return error;
  }
};

export const getFetchByLimit = async (url, limit, page) => {
  try {
    const response = await axios({
      method: "GET",
      url: `${url}/${limit}/${page}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
    if (response.status === 200) {
      return response?.data;
    }
  } catch (error) {
    if (error.status === 401) {
      localStorage.removeItem("token");
      toast("Token expired Please Login");
      window.location.reload();
    }
    return error;
  }
};

export const getOneFetch = async (url, id) => {
  try {
    const response = await axios({
      method: "GET",
      url: `${url}/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
    if (response?.status === 200) {
      return response?.data;
    }
  } catch (error) {
    console.log(error);
    if (error.status === 401) {
      localStorage.removeItem("token");
      toast("Token expired Please Login");
      window.location.reload();
    }
    return error;
  }
};

export const postFetch = async (url, data) => {
  try {
    const response = await axios({
      method: "post",
      url,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type":
          "multipart/form-data; boundary=<calculated when request is sent>",
      },
      data,
    });
    console.log("aspi", response);

    if (response) {
      return response;
    }
  } catch (error) {
    if (error.status === 401) {
      localStorage.removeItem("token");
      toast("Token expired Please Login");
      window.location.reload();
    }
    return error;
  }
};

export const postFetchUser = async (url, data) => {
  try {
    const response = await axios({
      method: "post",
      url,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data,
    });
    if (response) {
      return response;
    }
  } catch (error) {
    if (error.status === 401) {
      localStorage.removeItem("token");
      toast("Token expired Please Login");
      window.location.reload();
    }
    return error;
  }
};

export const postFetchContent = async (url, data) => {
  try {
    const response = await axios.post(url, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    if (error.status === 401) {
      localStorage.removeItem("token");
      toast("Token expired Please Login");
      window.location.reload();
    }
    throw error;
  }
};

export const patchFetch = async (url, id, data) => {
  try {
    const response = await axios({
      method: "patch",
      url: `${url}/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
      withCredentials: true,
    });
    if (response?.status === 200) {
      return response;
    }
  } catch (error) {
    if (error.status === 401) {
      localStorage.removeItem("token");
      toast("Token expired Please Login");
      window.location.reload();
    }
    throw error;
  }
};

export const putFetch = async (url, data) => {
  try {
    const response = await axios({
      method: "put",
      url: `${url}`,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type":
          "multipart/form-data; boundary=<calculated when request is sent>",
      },
      data,
    });
    if (response.status === 200) {
      return response;
    }
  } catch (error) {
    if (error.status === 401) {
      localStorage.removeItem("token");
      toast("Token expired Please Login");
      window.location.reload();
    }
    throw error;
  }
};

export const putFetchById = async (url) => {
  try {
    const response = await axios({
      method: "put",
      url: `${url}`,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      // withCredentials: true,
    });
    if (response.status === 200) {
      return response;
    }
  } catch (error) {
    if (error.status === 401) {
      localStorage.removeItem("token");
      toast("Token expired Please Login");
      window.location.reload();
    }
    throw error;
  }
};

export const putFetchData = async (url, data) => {
  try {
    const response = await axios({
      method: "put",
      url: `${url}`,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data,
    });
    if (response) {
      return response;
    }
  } catch (error) {
    if (error.status === 401) {
      localStorage.removeItem("token");
      toast("Token expired Please Login");
      window.location.reload();
    }
    throw error;
  }
};

export const deleteFetch = async (url, id) => {
  try {
    const response = await axios({
      method: "delete",
      url: `${url}/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      return response;
    }
  } catch (error) {
    if (error.status === 401) {
      localStorage.removeItem("token");
      toast("Token expired Please Login");
      window.location.reload();
    }
    throw error;
  }
};
export const deleteFetchByUrl = async (url) => {
  try {
    const response = await axios({
      method: "delete",
      url: `${url}`,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      return response;
    }
  } catch (error) {
    if (error.status === 401) {
      localStorage.removeItem("token");
      toast("Token expired Please Login");
      window.location.reload();
    }
    throw error;
  }
};

export const postFetchData = async (url, data) => {
  try {
    const response = await axios({
      method: "post",
      url: `${url}`,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data,
      // withCredentials: true,
    });
    console.log("aspi", response);
    if (response) {
      return response?.data;
    }
  } catch (error) {
    if (error.status === 401) {
      localStorage.removeItem("token");
      toast("Token expired Please Login");
      window.location.reload();
    }
    throw error;
  }
};
