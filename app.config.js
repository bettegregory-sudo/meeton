// Extends app.json. EXPO_BASE_URL is set by the GitHub Pages build so the site works under /<repo-name>.
module.exports = ({ config }) => ({
  ...config,
  web: { ...config.web, output: 'single' },
  experiments: { ...config.experiments, ...(process.env.EXPO_BASE_URL ? { baseUrl: process.env.EXPO_BASE_URL } : {}) },
});
