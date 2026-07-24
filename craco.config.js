// sql.js ships Emscripten glue that references Node core modules (fs / path /
// crypto) inside `ENVIRONMENT_IS_NODE` guards. Those branches never run in the
// browser, but webpack 5 (bundled with CRA 5) still tries to resolve the bare
// requires and fails the build. Marking them as `false` tells webpack to leave
// them out of the browser bundle.
module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
      return webpackConfig;
    },
  },
};
