const NodeCache = require('node-cache');

// Crear instancia de caché con tiempo de expiración de 1 hora
const imageCache = new NodeCache({ stdTTL: 3600 });

// Claves para el caché
const CACHE_KEYS = {
  IMAGE_URLS: (publicId) => `image_urls_${publicId}`,
  IMAGE_LIST: 'image_list',
  IMAGE_EXISTS: (publicId) => `image_exists_${publicId}`
};

// @desc    Obtener datos del caché
const getFromCache = (key) => {
  return imageCache.get(key);
};

// @desc    Guardar datos en el caché
const setInCache = (key, value, ttl = 3600) => {
  return imageCache.set(key, value, ttl);
};

// @desc    Eliminar datos del caché
const removeFromCache = (key) => {
  return imageCache.del(key);
};

// @desc    Limpiar todo el caché
const clearCache = () => {
  return imageCache.flushAll();
};

// @desc    Obtener URLs de imagen del caché
const getImageUrlsFromCache = (publicId) => {
  return getFromCache(CACHE_KEYS.IMAGE_URLS(publicId));
};

// @desc    Guardar URLs de imagen en el caché
const setImageUrlsInCache = (publicId, urls) => {
  return setInCache(CACHE_KEYS.IMAGE_URLS(publicId), urls);
};

// @desc    Obtener lista de imágenes del caché
const getImageListFromCache = () => {
  return getFromCache(CACHE_KEYS.IMAGE_LIST);
};

// @desc    Guardar lista de imágenes en el caché
const setImageListInCache = (images) => {
  return setInCache(CACHE_KEYS.IMAGE_LIST, images);
};

// @desc    Verificar si una imagen existe en el caché
const getImageExistsFromCache = (publicId) => {
  return getFromCache(CACHE_KEYS.IMAGE_EXISTS(publicId));
};

// @desc    Guardar estado de existencia de imagen en el caché
const setImageExistsInCache = (publicId, exists) => {
  return setInCache(CACHE_KEYS.IMAGE_EXISTS(publicId), exists, 3600);
};

// @desc    Invalidar caché de una imagen
const invalidateImageCache = (publicId) => {
  removeFromCache(CACHE_KEYS.IMAGE_URLS(publicId));
  removeFromCache(CACHE_KEYS.IMAGE_EXISTS(publicId));
};

module.exports = {
  getFromCache,
  setInCache,
  removeFromCache,
  clearCache,
  getImageUrlsFromCache,
  setImageUrlsInCache,
  getImageListFromCache,
  setImageListInCache,
  getImageExistsFromCache,
  setImageExistsInCache,
  invalidateImageCache
}; 