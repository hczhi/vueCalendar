const path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const glob = require('glob');

const config = {
  devtool: "cheap-eval-source-map",
  entry: {
    vue: ['vue']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: './js/[name].js',
    publicPath: '/dist/'
  },
  devServer: {
    inline: true,
    port: 8080
  },
  module: {
    rules: [{
      test: /\.css$/,
      // use: [
      //   'style-loader',
      //   'css-loader'
      // ],
      use: ExtractTextPlugin.extract({
        use: 'css-loader'
      })
    }, {
      test: /\.scss$/,
      use: ExtractTextPlugin.extract(['css-loader', 'sass-loader'])
    }, {
      test: /\.(png|svg|jpg|gif)$/,
      use: [{
        loader:'file-loader?name=img/[name].[ext]'
        }
      ]
    }, {
      test: /\.html$/,
      use: [{
        loader: 'html-loader',
        options: {
          minimize: true
        }
      }],
    }, {
      test: /\.vue$/,
      loader: 'vue-loader',
      options: {
                    loaders: {
                        // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
                        // the "scss" and "sass" values for the lang attribute to the right configs here.
                        // other preprocessors should work out of the box, no loader config like this nessessary.
                        'scss':  ExtractTextPlugin.extract(['css-loader', 'sass-loader'])
                    }
                    // other vue-loader options go here
                }
    }, {
      test: /\.(woff|woff2|eot|ttf|otf)$/,
      use: [{
        loader:'file-loader?name=font/[name].[ext]'
        }
      ]
    }]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin('./css/[name].css'),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vue' // 指定公共 bundle 的名字。
    })
  ],
  resolve: {
    alias: {
      'vue': 'vue/dist/vue.min.js'
    }
  }
};


// 获取指定路径下的入口文件
function getEntries(globPath) {
  const files = glob.sync(globPath),
    entries = {};

  files.forEach(function(filepath) {
    // 取倒数第二层(view下面的文件夹)做包名
    const split = filepath.split('/');
    let name = split[split.length - 1];
    name = name.split('.')[0];

    entries[name] = './src/' + name + "/index.js";
  });

  return entries;
}

const entries = getEntries('./views/*.html');
console.log('entries', entries);
Object.keys(entries).forEach(function(name) {
  // // 每个页面生成一个entry，如果需要HotUpdate，在这里修改entry
  config.entry[name] = entries[name];

  // // 每个页面生成一个html
  // const plugin = new HtmlWebpackPlugin({
  //     // 生成出来的html文件名
  //     filename: name + '.html',
  //     // 每个html的模版，这里多个页面使用同一个模版
  //     template: './template.html',
  //     // 自动将引用插入html
  //     inject: true,
  //     // 每个html引用的js模块，也可以在这里加上vendor等公用模块
  //     chunks: [name]
  // });
  // webpackConfig.plugins.push(plugin);
})


module.exports = config;