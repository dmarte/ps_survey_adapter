module.exports = {
  comments: false,
  sourceMaps: true,
    presets: [
      ['@babel/preset-env', {targets: {node: 'current'}}],
      ['minify', {
        removeConsole: true,
      }]
    ],
  };
