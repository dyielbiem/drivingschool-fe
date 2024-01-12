"use client";

import { useEffect, useState } from "react";
import { adminRefreshAccessToken } from "@/utils/fetch/refreshAccessToken";
import Cookies from "js-cookie";

const useAdminFetch = (fetchCallBack) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    if (typeof fetchCallBack != "function")
      throw Error("useAdminFetch only accepts function as argument");

    const fetch = async () => {
      const response = await fetchCallBack();

      if (response.ok) return setData(response);

      if (response.json.error != "TokenExpiredError") return setData(response);

      const refreshResponse = await adminRefreshAccessToken();

      if (!refreshResponse.ok) return setData(response);

      Cookies.set("accessToken", refreshResponse.json.accessToken);

      const retryResponse = await fetchCallBack();

      setData(retryResponse);
    };

    fetch();
  }, [fetchCallBack]);

  return data;
};

export default useAdminFetch;
