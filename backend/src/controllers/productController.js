const Product = require('../models/Product');

// @desc    Obtener todos los productos
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const { category, search, sort, page = 1, limit = 10 } = req.query;
    
    // Construir query
    const query = {};
    if (category) query.category = category;
    if (search) {
      query.$text = { $search: search };
    }
    query.active = true;

    // Construir opciones de ordenamiento
    let sortOption = {};
    if (sort) {
      const sortFields = sort.split(',').map(field => {
        const order = field.startsWith('-') ? -1 : 1;
        return [field.replace('-', ''), order];
      });
      sortOption = Object.fromEntries(sortFields);
    }

    // Ejecutar query con paginación
    const products = await Product.find(query)
      .sort(sortOption)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Obtener total de documentos
    const total = await Product.countDocuments(query);

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener productos', error: error.message });
  }
};

// @desc    Obtener un producto por ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener producto', error: error.message });
  }
};

// @desc    Crear un nuevo producto
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear producto', error: error.message });
  }
};

// @desc    Actualizar un producto
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      Object.assign(product, req.body);
      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar producto', error: error.message });
  }
};

// @desc    Eliminar un producto
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      product.active = false;
      await product.save();
      res.json({ message: 'Producto eliminado' });
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar producto', error: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
}; 