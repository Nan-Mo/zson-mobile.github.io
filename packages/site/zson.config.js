const path = require('path');

module.exports = {
  entries: {
    index: {
      entry: ['./web/index.js'],
      template: './web/index.html',
      favicon: './favicon.ico',
    },
    demo: {
      entry: ['./demo/index.js'],
      template: './demo/index.html',
      favicon: './favicon.ico',
    },
    // demo_umd: {
    //   template: './demo/index_umd.html',
    //   favicon: './favicon.ico',
    // },
  },
  resolve: {
    alias: {
      '@': path.join(process.cwd(), '/'),
      '@zson-mobileDir': path.join(process.cwd(), '../zson-mobile'),
      zson: path.join(process.cwd(), '../zson-mobile/src'),
    },
  },
  setBabelOptions: (options) => {
    options.plugins.push(['import', { libraryName: 'zarm-web', style: true }, 'zarm-web']);
    options.plugins.push([
      'prismjs',
      {
        languages: ['javascript', 'typescript', 'jsx', 'tsx', 'css', 'scss', 'markup', 'bash'],
        theme: 'default',
        css: true,
      },
    ]);
  },
  setRules: (rules) => {
    rules.push({
      test: /\.md$/,
      use: ['raw-loader'],
    });
  },
};
