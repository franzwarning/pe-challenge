// The source code including full typescript support is available at:
// https://github.com/shakacode/react_on_rails_demo_ssr_hmr/blob/master/config/webpack/commonWebpackConfig.js

// Common configuration applying to client and server configuration
const { generateWebpackConfig, merge } = require('shakapacker')
const webpack = require('webpack')

const baseClientWebpackConfig = generateWebpackConfig()

const commonOptions = {
  resolve: {
    extensions: ['.css', '.ts', '.tsx']
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [`style-loader`, 'css-loader', 'postcss-loader'],
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.DEBUG': JSON.stringify(process.env.DEBUG),
      'process.env.SUPABASE_URL': JSON.stringify(process.env.SUPABASE_URL),
      'process.env.SUPABASE_ANON_PUBLIC_KEY': JSON.stringify(process.env.SUPABASE_ANON_PUBLIC_KEY)
    })
  ]
}

// Copy the object using merge b/c the baseClientWebpackConfig and commonOptions are mutable globals
const commonWebpackConfig = () => merge({}, baseClientWebpackConfig, commonOptions)

module.exports = commonWebpackConfig
