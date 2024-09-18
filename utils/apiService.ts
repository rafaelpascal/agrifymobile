import Constants from "expo-constants";
import axios from "axios";
const apiUrl = Constants.expoConfig?.extra?.apiUrl;
const apiKey = Constants.expoConfig?.extra?.apiKey;

if (!apiUrl || !apiKey) {
  throw new Error("API URL or API Key is missing from the configuration.");
}

const StringapiUrl = apiUrl.toString();
axios.defaults.withCredentials = true;

const StringapiKey = apiKey.toString();
const key = `${StringapiKey}`;

// register
export const register = async (formData: any) => {
  try {
    const response = await axios.post(`${apiUrl}/api/auth/register`, formData, {
      headers: {
        "x-api-key": apiKey,
      },
    });

    return response.data;
  } catch (error: any) {
    throw error;
  }
};

// verify account
export const verifyacc = async (data: object) => {
  try {
    const response = await axios.post(
      `${StringapiUrl}/api/auth/verify_otp`,
      data,
      {
        headers: {
          "x-api-key": `${key}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

// create Pin
export const createpin = async (data: object) => {
  try {
    const response = await axios.post(
      `${StringapiUrl}/api/auth/marchant_pass`,
      data,
      {
        headers: {
          "x-api-key": `${key}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

// create Pin
export const sign_in = async (data: object) => {
  try {
    const response = await axios.post(
      `${StringapiUrl}/api/auth/sign_in`,
      data,
      {
        headers: {
          "x-api-key": `${key}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

// get marchant
export const marchant_acc = async (marchantId: string) => {
  try {
    const response = await axios.get(
      `${StringapiUrl}/api/auth/get_account/${marchantId}`,
      {
        headers: {
          "x-api-key": `${key}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create New Product
export const new_product = async (data: object) => {
  try {
    const response = await axios.post(
      `${StringapiUrl}/api/product/new_product`,
      data,
      {
        headers: {
          "x-api-key": `${key}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Marchant get products
export const all_product = async () => {
  try {
    const response = await axios.get(`${StringapiUrl}/api/product/allproduct`, {
      headers: {
        "x-api-key": `${key}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Marchant get products
export const categories = async () => {
  try {
    const response = await axios.get(`${StringapiUrl}/api/product/categories`, {
      headers: {
        "x-api-key": `${key}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Marchant get product names
export const product_names = async (catId: string) => {
  try {
    const response = await axios.get(
      `${StringapiUrl}/api/product/get_allproductname/${catId}`,
      {
        headers: {
          "x-api-key": `${key}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Marchant get product names
export const get_previous_sales = async (marchantId: string) => {
  console.log(marchantId);

  try {
    const response = await axios.get(
      `${StringapiUrl}/api/marchant_order/get_previous_sales/${marchantId}`,
      {
        headers: {
          "x-api-key": `${key}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Marchant get product names
export const get_pending_order = async (marchantId: string) => {
  try {
    const response = await axios.get(
      `${StringapiUrl}/api/marchant_order/get_pending_order/${marchantId}`,
      {
        headers: {
          "x-api-key": `${key}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Marchant get all order
export const get_all_order = async (marchantId: string) => {
  try {
    const response = await axios.get(
      `${StringapiUrl}/api/marchant_order/get_all_order/${marchantId}`,
      {
        headers: {
          "x-api-key": `${key}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

// Marchant get an order
export const get_order = async (orderId: string | undefined) => {
  try {
    const response = await axios.get(
      `${StringapiUrl}/api/marchant_order/get_order/${orderId}`,
      {
        headers: {
          "x-api-key": `${key}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// get Marchant get using device Id
export const get_deviceId = async (deviceId: string | undefined) => {
  try {
    const response = await axios.get(
      `${StringapiUrl}/api/auth/checkdevice/${deviceId}`,
      {
        headers: {
          "x-api-key": `${key}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const get_banks = async () => {
  try {
    const response = await axios.get(
      `${StringapiUrl}/api/marchant/acc/get_banks`,
      {
        headers: {
          "x-api-key": `${key}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const varify_acc = async (data: object) => {
  try {
    const response = await axios.post(
      `${StringapiUrl}/api/marchant/acc/validate_acc`,
      data,
      {
        headers: {
          "x-api-key": `${key}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const save_acc = async (data: object) => {
  try {
    const response = await axios.post(
      `${StringapiUrl}/api/marchant/acc/account_number`,
      data,
      {
        headers: {
          "x-api-key": `${key}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// change pin
export const change_pin = async (marchantId: object) => {
  try {
    const response = await axios.post(
      `${StringapiUrl}/api/auth/change_pin`,
      marchantId,
      {
        headers: {
          "x-api-key": `${key}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
// change pin
export const new_pin = async (data: object) => {
  try {
    const response = await axios.post(
      `${StringapiUrl}/api/auth/verify_otp_pin`,
      data,
      {
        headers: {
          "x-api-key": `${key}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
