export const httpService = {
  fancyGet: async (url) => {
    const response = await fetch(url);
    return await response.json();
  },
  get: async (url, params) => {
    const queryParams =
      params &&
      Object.keys(params)
        .map((key) => key + "=" + params[key])
        .join("&");

    const propperUrl = params ? `${url}?${queryParams}` : url;
    const response = await fetch(propperUrl);

    return await response.json();
  },
  post: async (url, body) => {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(body),
    });

    return await response.json();
  },
};
