function changeStatus(req, res) {
  req.io.emit('status-changed', { status: 'ON' });
  // TODO : Call some script to check if it's running or use nodejs instead
  res.status(202).json({ message: 'Status successfully changed' });
}

module.exports = changeStatus;
