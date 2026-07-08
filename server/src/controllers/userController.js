const User = require('../models/User');

async function getUsers(req, res) {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getUserById(req, res) {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function createUser(req, res) {
  try {
    const nuevoUser = new User(req.body);
    const usuarioGuardado = await nuevoUser.save();
    const { password, ...usuarioSinPassword } = usuarioGuardado.toObject();
    res.status(201).json(usuarioSinPassword);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function updateUser(req, res) {
  try {
    const usuarioActualizado = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    if (!usuarioActualizado) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(usuarioActualizado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function deleteUser(req, res) {
  try {
    const usuarioEliminado = await User.findByIdAndDelete(req.params.id);
    if (!usuarioEliminado) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser };