const express = require('express');
const router = express.Router();
const prisma = require('../db');

router.get('/tools', async (req, res) => {
  try {
    const tools = await prisma.tool.findMany({ orderBy: { id: 'asc' } });
    res.json(tools);
  } catch (error) {
    res.status(500).json({ message: 'Unable to load tools.' });
  }
});

router.post('/tools', async (req, res) => {
  const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
  const description = typeof req.body.description === 'string' ? req.body.description.trim() : '';

  if (!name || !description) {
    return res.status(400).json({ message: 'Name and description are required.' });
  }

  try {
    const tool = await prisma.tool.create({
      data: { name, description, isAvailable: true },
    });
    return res.status(201).json(tool);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to create tool.' });
  }
});

router.patch('/tools/:id', async (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: 'Tool id must be an integer.' });
  }

  try {
    const existingTool = await prisma.tool.findUnique({ where: { id } });
    if (!existingTool) {
      return res.status(404).json({ message: 'Tool not found.' });
    }

    const updatedTool = await prisma.tool.update({
      where: { id },
      data: { isAvailable: !existingTool.isAvailable },
    });
    return res.json(updatedTool);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to update tool.' });
  }
});

module.exports = router;
