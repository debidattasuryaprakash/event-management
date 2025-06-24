const Registration = require('../models/Registration');
const QRCode = require('qrcode');
const Event = require('../models/Event');

exports.registerForEvent = async (req, res) => {
  const { eventId } = req.body;
  const { userId, role } = req.user;

  if (role !== 'attendee') {
    return res.status(403).json({ msg: 'Only attendees can register' });
  }

  try {
    const alreadyRegistered = await Registration.findOne({ event: eventId, attendee: userId });
    if (alreadyRegistered) {
      return res.status(400).json({ msg: 'Already registered for this event' });
    }

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ msg: 'Event not found' });

    const qrData = `${eventId}_${userId}_${new Date().getTime()}`;

    const qrCode = await QRCode.toDataURL(qrData); // base64 PNG image

    const registration = await Registration.create({
      attendee: userId,
      event: eventId,
      qrCode
    });

    res.status(201).json({
      msg: 'Registered successfully',
      qrCode: registration.qrCode,
      registrationId: registration._id
    });

  } catch (err) {
    res.status(500).json({ msg: 'Registration failed', error: err.message });
  }
};

exports.checkInAttendee = async (req, res) => {
    const { qrData } = req.body;
    const { userId, role } = req.user;
  
    if (role !== 'organizer' && role !== 'admin') {
      return res.status(403).json({ msg: 'Only organizers or admins can check-in' });
    }
  
    try {
      // Example QR data format: eventId_userId_timestamp
      const [eventId, attendeeId] = qrData.split('_');
  
      const registration = await Registration.findOne({
        event: eventId,
        attendee: attendeeId
      });
  
      if (!registration) {
        return res.status(404).json({ msg: 'Registration not found' });
      }
  
      if (registration.checkedIn) {
        return res.status(400).json({ msg: 'Already checked in' });
      }
  
      registration.checkedIn = true;
      await registration.save();
  
      res.status(200).json({ msg: 'Check-in successful', registrationId: registration._id });
  
    } catch (err) {
      res.status(500).json({ msg: 'Check-in failed', error: err.message });
    }
  };
  
