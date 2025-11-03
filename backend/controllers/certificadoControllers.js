const PDFDocument = require('pdfkit');
const path = require('node:path');
const mongoose = require('mongoose');
const User = require('../models/User');
const ProgramaAcademico = require('../models/ProgramaAcademico');
const Inscripcion = require('../models/Inscripciones');


function validarIds(userId, cursoId) {
  if (!userId || !cursoId) {
    return { valido: false, mensaje: 'Se requieren userId y cursoId' };
  }
  try {
    return {
      valido: true,
      userObjectId: mongoose.Types.ObjectId(userId),
      cursoObjectId: mongoose.Types.ObjectId(cursoId)
    };
  } catch (e) {
    console.error('Error al validar ObjectId:', e);
    return { valido: false, mensaje: 'ID de usuario o curso inválido', error: e.message };
  }
}

async function buscarInscripcion(userId, cursoId, userObjectId, cursoObjectId) {
  return await Inscripcion.findOne({
    $or: [
      { usuario: userId, referencia: cursoId },
      { usuario: userObjectId, referencia: cursoObjectId }
    ],
    estado: { $in: ['certificado', 'finalizado'] }
  });
}

exports.generarCertificado = async (req, res) => {
  try {
    const { userId, cursoId } = req.body;
    const validacion = validarIds(userId, cursoId);
    if (!validacion.valido) {
      return res.status(400).json({ success: false, message: validacion.mensaje });
    }
    const { userObjectId, cursoObjectId } = validacion;

    const inscripcion = await buscarInscripcion(userId, cursoId, userObjectId, cursoObjectId);
    if (!inscripcion) {
      return res.status(400).json({ success: false, message: 'El usuario no tiene una inscripción válida.' });
    }
    if (inscripcion.tipoReferencia !== 'ProgramaAcademico') {
      return res.status(400).json({ success: false, message: 'Solo se generan certificados para programas académicos.' });
    }

    const usuario = await User.findById(userId);
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado.' });

    const curso = await ProgramaAcademico.findById(cursoId);
    if (!curso) return res.status(404).json({ success: false, message: 'Programa académico no encontrado.' });

    const logoPath = path.join(__dirname, '../public/logo-luckas.png');

    // Genera el PDF en formato horizontal (landscape)
    const doc = new PDFDocument({
      layout: 'landscape',
      size: 'A4',
      margins: { top: 50, bottom: 50, left: 80, right: 80 }
    });
    let buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      let pdfData = Buffer.concat(buffers);
      res
        .writeHead(200, {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment;filename=certificado-${usuario.nombre}.pdf`,
          'Content-Length': pdfData.length
        })
        .end(pdfData);
    });

    // Agregar borde decorativo
    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).stroke();
    doc.rect(30, 30, doc.page.width - 60, doc.page.height - 60).stroke();

    // Logo centrado en la parte superior (ajustado)
    const logoWidth = 60;
    const logoHeight = 60;
    const logoX = (doc.page.width - logoWidth) / 2;
    const logoY = 40;
    doc.image(logoPath, logoX, logoY, { width: logoWidth, height: logoHeight });

    // Agregar espacio suficiente después del logo
    doc.y = logoY + logoHeight + 10; // Posición fija para evitar superposición

    // Título principal
    doc.fontSize(18).font('Helvetica-Bold').fillColor('#003366').text('SEMINARIO BAUTISTA DE COLOMBIA', { align: 'center' });
    doc.moveDown(0.3);
    doc.fontSize(14).font('Helvetica').fillColor('#666666').text('Fundado en [Año] - Resolución [Número]', { align: 'center' });

    // Línea separadora
    doc.moveDown(1);
    doc.moveTo(150, doc.y).lineTo(doc.page.width - 150, doc.y).stroke();

    // Título del certificado
    doc.moveDown(1);
    doc.fontSize(24).font('Helvetica-Bold').fillColor('#003366').text('CERTIFICADO DE FINALIZACIÓN', { align: 'center' });

    // Texto principal
    doc.moveDown(1.5);
    doc.fontSize(14).font('Helvetica').fillColor('black').text('Hace constar que', { align: 'center' });

    // Nombre del estudiante destacado
    doc.moveDown(0.8);
    doc.fontSize(20).font('Helvetica-Bold').fillColor('#003366').text(`${usuario.nombre.toUpperCase()} ${usuario.apellido.toUpperCase()}`, { align: 'center' });

    // Documento
    doc.moveDown(0.5);
    doc.fontSize(12).font('Helvetica').fillColor('black').text(`Con Cédula de Ciudadanía No. ${usuario.numeroDocumento}`, { align: 'center' });

    // Texto del curso/evento
    doc.moveDown(1);
    const tipoActividad = inscripcion.tipoReferencia === 'ProgramaAcademico' ? 'curso' : 'evento';
    doc.fontSize(14).font('Helvetica').text(`Ha completado satisfactoriamente el ${tipoActividad}:`, { align: 'center' });

    // Nombre del curso/evento destacado
    doc.moveDown(0.5);
    doc.fontSize(18).font('Helvetica-Bold').fillColor('#003366').text(`${curso.nombre.toUpperCase()}`, { align: 'center' });

    // Duración (según el tipo)
    doc.moveDown(0.5);
    if (inscripcion.tipoReferencia === 'ProgramaAcademico') {
      const duracion = curso.duracion || '[XX] horas';
      doc.fontSize(12).font('Helvetica').fillColor('black').text(`Con una intensidad horaria académica de ${duracion}`, { align: 'center' });
    } else {
      // Para eventos, mostrar la fecha del evento
      const fechaEvento = curso.fechaEvento ? new Date(curso.fechaEvento).toLocaleDateString('es-CO') : '[Fecha del evento]';
      doc.fontSize(12).font('Helvetica').fillColor('black').text(`Realizado el ${fechaEvento}`, { align: 'center' });
    }

    // Fecha y lugar
    doc.moveDown(1.5);
    const fecha = new Date().toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    doc.fontSize(12).font('Helvetica').text(`Dado en Colombia, a los ${fecha}`, { align: 'center' });

    // Espaciado para firmas
    doc.moveDown(3);

    // Firmas lado a lado
    const leftX = 150;
    const rightX = doc.page.width - 250;
    const signatureY = doc.y;

    // Firma izquierda
    doc.fontSize(10).font('Helvetica');
    doc.text('_____________________________', leftX, signatureY, { width: 200, align: 'center' });
    doc.text('DIRECTOR ACADÉMICO', leftX, signatureY + 20, { width: 200, align: 'center' });
    doc.text('Seminario Bautista de Colombia', leftX, signatureY + 35, { width: 200, align: 'center' });

    // Firma derecha
    doc.text('_____________________________', rightX, signatureY, { width: 200, align: 'center' });
    doc.text('COORDINADOR ACADÉMICO', rightX, signatureY + 20, { width: 200, align: 'center' });
    doc.text('Registro [Número]', rightX, signatureY + 35, { width: 200, align: 'center' });

    // ¡IMPORTANTE! Finalizar el documento PDF
    doc.end();
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: `Error al generar certificado: ${error.message}` 
    });
  }
};