// Përdorim: checkRole(['Admin', 'Cashier'])
const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    // verifyToken duhet të ekzekutohet para checkRole
    if (!req.user || !req.user.roles) {
      return res.status(403).json({ message: 'No role information found.' });
    }

    // Kontrollo nëse useri ka të paktën një rol të lejuar
    const hasRole = req.user.roles.some(role => allowedRoles.includes(role));

    if (!hasRole) {
      return res.status(403).json({
        message: `Access denied. Required roles: ${allowedRoles.join(', ')}`
      });
    }

    next();
  };
};

module.exports = checkRole;