
import api from "./axios";

// Get all products
export const getProducts = async (params = {}) => {
  const response = await api.get("/products", { params });

  return (response.data.products || []).map((product) => ({
    ...product,
    id: product._id,
  }));
};

// Get single product
export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);

  const product = response.data.product || response.data;

  return {
    ...product,
    id: product._id,
  };
};

// Create product
export const createProduct = async (productData) => {
  const response = await api.post("/products", productData);
  return response.data;
};

// Update product
export const updateProduct = async (id, productData) => {
  const response = await api.put(`/products/${id}`, productData);
  return response.data;
};

// Delete product
export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};
