import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  IconButton,
  TextField,
  Typography,
  Alert,
  Backdrop,
  CircularProgress
} from '@mui/material';
import { Add as AddIcon, Refresh as RefreshIcon, Delete as DeleteIcon, Transform as TransformIcon } from '@mui/icons-material';
import * as imageService from '../services/imageService.js';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

const ImageManager = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [transformDialogOpen, setTransformDialogOpen] = useState(false);
  const [transformParams, setTransformParams] = useState({ width: '', height: '' });

  const loadImages = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await imageService.getAllImages();
      setImages(data);
    } catch (err) {
      setError('Error al cargar las imágenes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadImages();
  }, []);

  const validateFile = (file) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new Error('Solo se permiten imágenes JPG, PNG, GIF y WEBP');
    }
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('El archivo excede el tamaño máximo permitido');
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      validateFile(file);
      setLoading(true);
      setError('');
      await imageService.uploadImage(file);
      await loadImages();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      setError('');
      await imageService.deleteImage(id);
      await loadImages();
    } catch (err) {
      setError('Error al eliminar la imagen');
    } finally {
      setLoading(false);
    }
  };

  const handleTransformClick = (image) => {
    setSelectedImage(image);
    setTransformDialogOpen(true);
  };

  const handleTransform = async () => {
    try {
      setLoading(true);
      setError('');
      await imageService.transformImage(selectedImage.id, transformParams);
      await loadImages();
      setTransformDialogOpen(false);
    } catch (err) {
      setError('Error al transformar la imagen');
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    const kb = bytes / 1024;
    return `${kb.toFixed(2)} KB`;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Backdrop open={loading} sx={{ zIndex: 9999 }}>
        <CircularProgress />
      </Backdrop>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>Gestión de Imágenes</Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadImages}
            sx={{ mr: 1 }}
            data-testid="refresh-button"
          >
            Actualizar
          </Button>
          <label>
            <Button
              variant="contained"
              component="span"
              startIcon={<AddIcon />}
            >
              Subir Imagen
            </Button>
            <input
              type="file"
              hidden
              accept={ALLOWED_TYPES.join(',')}
              onChange={handleFileUpload}
              data-testid="file-input"
              aria-label="subir imagen"
            />
          </label>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {images.map((image) => (
          <Grid item xs={12} sm={6} md={4} key={image.id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={image.url}
                alt={image.name}
              />
              <CardContent>
                <Typography variant="body1">{image.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatFileSize(image.size)}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                  <IconButton
                    onClick={() => handleDelete(image.id)}
                    data-testid={`delete-button-${image.id}`}
                  >
                    <DeleteIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleTransformClick(image)}
                    data-testid={`transform-button-${image.id}`}
                  >
                    <TransformIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={transformDialogOpen}
        onClose={() => setTransformDialogOpen(false)}
      >
        <DialogTitle>Transformar Imagen</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              label="Ancho"
              type="number"
              fullWidth
              value={transformParams.width}
              onChange={(e) => setTransformParams({ ...transformParams, width: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Alto"
              type="number"
              fullWidth
              value={transformParams.height}
              onChange={(e) => setTransformParams({ ...transformParams, height: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTransformDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleTransform} variant="contained">
            Transformar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ImageManager; 