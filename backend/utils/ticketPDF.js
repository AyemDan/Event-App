import QRCode from 'qrcode';
import PDFDocument from 'pdfkit';

export const generateTicketPDF = async (ticketData, res) => {
  try {
    // Create a new PDF document
    const doc = new PDFDocument();

    // Set up response headers for downloading the PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="ticket-${ticket_id}.pdf"`);

    // Pipe the document to the response stream
    doc.pipe(res);

    // Add content to the PDF
    doc.fontSize(20).text('Event Ticket', { align: 'center' });
    doc.fontSize(14).text(`Name: ${ticketData.name}`, { align: 'left' });
    doc.text(`Email: ${ticketData.email}`, { align: 'left' });
    doc.text(`Ticket Category: ${ticketData.ticket_category}`, { align: 'left' });

    // Add the QR code image to the PDF
    doc.image(qrCodeBuffer, {
      fit: [100, 100],
      align: 'center',
      valign: 'center'
    });

    // Finalize the document
    doc.end();
  } catch (error) {
    throw new Error('Error generating PDF: ' + error.message);
  }
};
