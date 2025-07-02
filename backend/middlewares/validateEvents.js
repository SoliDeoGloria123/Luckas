const validarCategorizacion = (req, res, next) => {
    const { categoria, subCategoria, etiquetas } = req.body;
    
    const categoriasValidas = [
        'Conferencia', 
        'Taller', 
        'Seminario', 
        'Retiro', 
        'Ministerial', 
        'Social', 
        'Otro'
    ];

    if (!categoriasValidas.includes(categoria)) {
        return res.status(400).json({
            success: false,
            message: 'Categoría no válida'
        });
    }

    if (subCategoria && subCategoria.length > 50) {
        return res.status(400).json({
            success: false,
            message: 'La subcategoría no puede exceder 50 caracteres'
        });
    }

    if (etiquetas && !Array.isArray(etiquetas)) {
        return res.status(400).json({
            success: false,
            message: 'Las etiquetas deben ser un array'
        });
    }

    next();
};

module.exports = { validarCategorizacion };