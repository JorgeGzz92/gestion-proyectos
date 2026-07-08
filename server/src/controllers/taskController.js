const Task = require('../models/Task');

async function getTasks(req, res) {
  try {
    const tasks = await Task.find().populate('proyecto').populate('asignadoA');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getTaskById(req, res) {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Tarea no encontrada' });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function createTask(req, res) {
  try {
    const nuevaTask = new Task(req.body);
    const tareaGuardada = await nuevaTask.save();
    res.status(201).json(tareaGuardada);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function updateTask(req, res) {
  try {
    const tareaActualizada = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!tareaActualizada) return res.status(404).json({ error: 'Tarea no encontrada' });
    res.json(tareaActualizada);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function deleteTask(req, res) {
  try {
    const tareaEliminada = await Task.findByIdAndDelete(req.params.id);
    if (!tareaEliminada) return res.status(404).json({ error: 'Tarea no encontrada' });
    res.json({ mensaje: 'Tarea eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { getTasks, getTaskById, createTask, updateTask, deleteTask };