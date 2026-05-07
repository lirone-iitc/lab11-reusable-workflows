function formatRelease(version, environment) {
  if (!version) throw new Error('version is required');
  if (!environment) throw new Error('environment is required');
  return `[${environment.toUpperCase()}] Deploying v${version}`;
}

module.exports = { formatRelease };
