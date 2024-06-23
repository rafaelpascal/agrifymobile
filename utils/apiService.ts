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
