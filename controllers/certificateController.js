const PDFDocument = require('pdfkit');
const Event = require('../models/Event');
const User = require('../models/User');
const Registration = require('../models/Registration');

exports.generateCertificate = async (req, res) => {
  const { eventId } = req.params;
  const { userId, role } = req.user;

  if (role !== 'attendee') {
    return res.status(403).json({ msg: 'Only attendees can generate certificates' });
  }

  try {
    // Check registration
    const registration = await Registration.findOne({ attendee: userId, event: eventId });
    if (!registration) return res.status(404).json({ msg: 'Not registered for this event' });

    if (!registration.checkedIn) {
      return res.status(400).json({ msg: 'Certificate available only after check-in' });
    }

    const user = await User.findById(userId);
    const event = await Event.findById(eventId);

    // Setup PDF
    const doc = new PDFDocument();
    const filename = `Certificate_${user.name.replace(" ", "_")}.pdf`;

    // Set headers
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.setHeader('Content-Type', 'application/pdf');

    // Pipe PDF to response
    doc.pipe(res);

    // Content
    doc.fontSize(28).text('Certificate of Participation', { align: 'center' });
    doc.moveDown();

    doc.fontSize(20).text(`This is to certify that`, { align: 'center' });
    doc.moveDown();

    doc.fontSize(24).text(`${user.name}`, { align: 'center', underline: true });
    doc.moveDown();

    doc.fontSize(20).text(`has successfully attended the event`, { align: 'center' });
    doc.moveDown();

    doc.fontSize(22).text(`${event.title}`, { align: 'center', italic: true });
    doc.moveDown();

    doc.fontSize(16).text(`on ${new Date(event.date).toDateString()}`, { align: 'center' });
    doc.moveDown(2);

    doc.text(`\n\n\n\n\n`, { align: 'center' });
    doc.text(`Authorized Signature`, { align: 'right', underline: true });

    doc.end();

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Certificate generation failed', error: err.message });
  }
};
