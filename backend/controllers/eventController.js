const Event = require('../models/Event');

// @desc Create new event
exports.createEvent = async (req, res) => {
  const { title, description, date, time, location, bannerUrl, maxAttendees } = req.body;
  const { userId, role } = req.user;

  if (role !== 'organizer' && role !== 'admin') {
    return res.status(403).json({ msg: 'Unauthorized' });
  }

  try {
    const event = await Event.create({
      title,
      description,
      date,
      time,
      location,
      bannerUrl,
      maxAttendees,
      createdBy: userId
    });
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ msg: 'Event creation failed', error: err.message });
  }
};

// @desc Get all events (public)
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ msg: 'Fetching events failed', error: err.message });
  }
};

// @desc Get single event
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ msg: 'Event not found' });
    res.status(200).json(event);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching event', error: err.message });
  }
};

// @desc Delete event
exports.deleteEvent = async (req, res) => {
  const { userId, role } = req.user;
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ msg: 'Event not found' });

    if (event.createdBy.toString() !== userId && role !== 'admin') {
      return res.status(403).json({ msg: 'Not allowed to delete this event' });
    }

    await event.remove();
    res.status(200).json({ msg: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Delete failed', error: err.message });
  }
};
