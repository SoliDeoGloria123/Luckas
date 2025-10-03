const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const Reporte = require('../models/Reportes');

// Exportar reporte a PDF/Excel
router.get('/:tipoReporte', async (req, res) => {
	const { tipoReporte } = req.params;
	const { format } = req.query;
	try {
		// Buscar el reporte más reciente del tipo solicitado
		const reporte = await Reporte.findOne({ tipo: tipoReporte }).sort({ createdAt: -1 });
		if (!reporte) return res.status(404).send('Reporte no encontrado');
		if (format === 'pdf') {
			res.setHeader('Content-Type', 'application/pdf');
			res.setHeader('Content-Disposition', `attachment; filename="reporte-${tipoReporte}.pdf"`);
			const doc = new PDFDocument();
			doc.pipe(res);
			doc.fontSize(18).text(`Reporte: ${reporte.nombre}`);
			doc.fontSize(12).text(`Descripción: ${reporte.descripcion}`);
			doc.text(`Fecha: ${new Date(reporte.fechaGeneracion).toLocaleString()}`);
			doc.text('---');
			doc.text(JSON.stringify(reporte.datos, null, 2));
			doc.end();
		} else if (format === 'excel') {
			res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
			res.setHeader('Content-Disposition', `attachment; filename="reporte-${tipoReporte}.xlsx"`);
			const workbook = new ExcelJS.Workbook();
			const sheet = workbook.addWorksheet('Reporte');
			sheet.addRow(['Nombre', reporte.nombre]);
			sheet.addRow(['Descripción', reporte.descripcion]);
			sheet.addRow(['Fecha', new Date(reporte.fechaGeneracion).toLocaleString()]);
			sheet.addRow([]);
			// Agregar datos
			Object.entries(reporte.datos).forEach(([key, value]) => {
				sheet.addRow([key, typeof value === 'object' ? JSON.stringify(value) : value]);
			});
			await workbook.xlsx.write(res);
			res.end();
		} else {
			res.status(400).send('Formato no soportado');
		}
	} catch (error) {
		res.status(500).send('Error al exportar reporte: ' + error.message);
	}
});
const reportesController = require('../controllers/reportesControllers');
const { authJwt, role } = require('../middlewares');

// Middleware de autenticación para todas las rutas
router.use(authJwt.verifyToken);

// Rutas de reportes (solo admin y tesorero pueden ver reportes)
router.get('/dashboard', role.checkRole('admin', 'tesorero'), reportesController.getDashboardReport);
router.get('/reservas', role.checkRole('admin', 'tesorero'), reportesController.getReservasReport);
router.get('/inscripciones', role.checkRole('admin', 'tesorero'), reportesController.getInscripcionesReport);
router.get('/solicitudes', role.checkRole('admin', 'tesorero'), reportesController.getSolicitudesReport);
router.get('/usuarios', role.checkRole('admin', 'tesorero'), reportesController.getUsuariosReport);
router.get('/eventos', role.checkRole('admin', 'tesorero'), reportesController.getEventosReport);
router.get('/financiero', role.checkRole('admin', 'tesorero'), reportesController.getReporteFinanciero);
router.get('/actividad-usuarios', role.checkRole('admin', 'tesorero'), reportesController.getActividadUsuarios);

module.exports = router;