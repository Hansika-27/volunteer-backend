const express = require('express');
const { db } = require('../config/firebase');
const { verifyToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all assignments with optional filters
router.get('/', verifyToken, async (req, res) => {
  try {
    const { volunteerId, taskId, status } = req.query;
    let query = db.collection('assignments');

    if (volunteerId) query = query.where('volunteerId', '==', volunteerId);
    if (taskId) query = query.where('taskId', '==', taskId);
    if (status) query = query.where('status', '==', status);

    const snapshot = await query.get();
    const assignments = snapshot.docs.map(doc => doc.data());
    res.json({ count: assignments.length, assignments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Volunteer marks their task as done
router.patch('/:id/complete', verifyToken, async (req, res) => {
  try {
    const assignmentRef = db.collection('assignments').doc(req.params.id);
    const assignmentDoc = await assignmentRef.get();

    if (!assignmentDoc.exists) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    const assignment = assignmentDoc.data();

    // Mark assignment complete
    await assignmentRef.update({
      status: 'completed',
      completedAt: new Date().toISOString(),
    });

    // Free the volunteer back to available
    await db.collection('volunteers').doc(assignment.volunteerId).update({
      status: 'available',
    });

    // Check if all volunteers on this task are done
    const allAssignments = await db.collection('assignments')
      .where('taskId', '==', assignment.taskId)
      .get();

    const allDone = allAssignments.docs.every(
      d => d.data().status === 'completed' || d.id === req.params.id
    );

    if (allDone) {
      await db.collection('tasks').doc(assignment.taskId).update({
        status: 'completed',
        completedAt: new Date().toISOString(),
      });
    }

    res.json({ message: 'Task marked complete, volunteer is now available again' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin verifies the task was actually completed properly
router.patch('/:id/verify', verifyToken, async (req, res) => {
  try {
    const assignmentRef = db.collection('assignments').doc(req.params.id);
    const assignmentDoc = await assignmentRef.get();

    if (!assignmentDoc.exists) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    const assignment = assignmentDoc.data();

    await assignmentRef.update({
      adminVerified: true,
      verifiedAt: new Date().toISOString(),
    });

    // Update volunteer stats — they earned this
    const volRef = db.collection('volunteers').doc(assignment.volunteerId);
    const volDoc = await volRef.get();
    const volunteer = volDoc.data();

    await volRef.update({
      tasksCompleted: volunteer.tasksCompleted + 1,
    });

    res.json({ message: 'Assignment verified. Volunteer stats updated.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;