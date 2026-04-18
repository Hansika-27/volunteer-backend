const express = require('express');
const { v4: uuid } = require('uuid');
const { db } = require('../config/firebase');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Create a disaster zone
router.post('/', verifyToken, async (req, res) => {
  try {
    const { name, lat, lng, affectedPeople, severity, disasterId } = req.body;

    if (!name || !lat || !lng) {
      return res.status(400).json({ error: 'name, lat, lng are required' });
    }

    const zone = {
      id: uuid(),
      name,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      affectedPeople: affectedPeople || 0,
      severity: severity || 'medium',
      disasterId: disasterId || null,
      createdAt: new Date().toISOString(),
    };

    await db.collection('zones').doc(zone.id).set(zone);
    res.status(201).json({ message: 'Zone created', zone });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all zones
router.get('/', verifyToken, async (req, res) => {
  try {
    const { disasterId } = req.query;
    let query = db.collection('zones');
    if (disasterId) query = query.where('disasterId', '==', disasterId);

    const snapshot = await query.get();
    res.json({ zones: snapshot.docs.map(d => d.data()) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get one zone
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const doc = await db.collection('zones').doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ error: 'Zone not found' });
    res.json(doc.data());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;