module.exports = {
  extends: ['@leocode/eslint-config/react'],
  plugins: [
    'svelte3'
  ],
  overrides: [
    {
      files: ['*.svelte'],
      processor: 'svelte3/svelte3'
    }
  ],
  settings: {
    'svelte3/typescript': true,
  }
};
