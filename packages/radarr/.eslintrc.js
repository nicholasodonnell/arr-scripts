module.exports = {
  extends: [require.resolve('@arr-scripts/config/eslintrc.base.js')],
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
    tsconfigRootDir: __dirname,
  },
  root: true,
}
