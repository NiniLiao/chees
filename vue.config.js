module.exports = {
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  css: {
    loaderOptions: {
      postcss: {
        postcssOptions: {
          config: './tailwind.config.js',
        },
      },
    },
  },
  chainWebpack: (config) => {
    config.module.rule('css').oneOf('vue').use('postcss-loader').tap((options) => {
      options.postcssOptions.plugins = [
        require('tailwindcss'),
        require('autoprefixer'),
        // 其他 postcss 插件
      ];
      return options;
    });
  },
};
