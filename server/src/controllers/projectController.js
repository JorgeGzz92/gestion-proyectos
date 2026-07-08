const Project = require('../models/Project');

async function getProjects(req, res) {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getProjectById(req, res) {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Proyecto no encontrado' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function createProject(req, res) {
  try {
    const nuevoProject = new Project(req.body);
    const proyectoGuardado = await nuevoProject.save();
    res.status(201).json(proyectoGuardado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function updateProject(req, res) {
  try {
    const proyectoActualizado = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!proyectoActualizado) return res.status(404).json({ error: 'Proyecto no encontrado' });
    res.json(proyectoActualizado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function deleteProject(req, res) {
  try {
    const proyectoEliminado = await Project.findByIdAndDelete(req.params.id);
    if (!proyectoEliminado) return res.status(404).json({ error: 'Proyecto no encontrado' });
    res.json({ mensaje: 'Proyecto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { getProjects, getProjectById, createProject, updateProject, deleteProject };