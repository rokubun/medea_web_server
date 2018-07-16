function changeStatus(req, res) {
  req.io.emit('status-changed', { status: 'ON'});
  res.status(202).json({ message: 'Status successfully changed' });
}

module.exports = changeStatus;
