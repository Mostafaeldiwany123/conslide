const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

async function getHttpsOptions() {
    // Only load dev certs in development mode
    if (process.env.NODE_ENV === 'development') {
        try {
            const devCerts = require("office-addin-dev-certs");
            const httpsOptions = await devCerts.getHttpsServerOptions();
            return httpsOptions;
        } catch (err) {
            return false;
        }
    }
    return false;
}

module.exports = async (env, options) => {
    const dev = options.mode === "development";
    return {
        mode: options.mode || 'production',
        entry: {
            // We use palette.js as the entry point
            palette: './desktop-ui/palette.js',
        },
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: '[name].bundle.js',
            clean: true,
        },
        resolve: {
            extensions: ['.js', '.jsx', '.json'],
        },
        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env', '@babel/preset-react'],
                        },
                    },
                },
                {
                    test: /\.css$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                        'postcss-loader',

                    ],
                },
                {
                    test: /\.(png|jpg|jpeg|gif|svg|ico)$/,
                    type: 'asset/resource',
                },
            ],
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: './desktop-ui/palette.html',
                filename: 'palette.html',
                chunks: ['palette'],
                // We'll let Webpack inject the bundle, so we should clean up the template
                inject: 'body',
                minify: false, // Keep it readable for debugging
            }),
            new MiniCssExtractPlugin({
                filename: 'palette.css',
            }),
            new CopyWebpackPlugin({
                patterns: [
                    { from: 'desktop-ui/api.js', to: 'api.js' },
                    { from: 'desktop-ui/chatbot.js', to: 'chatbot.js' },
                    { from: 'desktop-ui/assets', to: 'assets', noErrorOnMissing: true },
                    { from: 'desktop-ui/shortcuts.json', to: 'shortcuts.json', noErrorOnMissing: true },
                    { from: 'desktop-ui/conslide_favicon.png', to: 'conslide_favicon.png', noErrorOnMissing: true },
                ],
            }),
        ],
        devServer: {
            port: 3000,
            https: await getHttpsOptions(),
            hot: true,
            static: {
                directory: path.resolve(__dirname, 'desktop-ui'),
            },
        },
        devtool: 'source-map',
    };
};
