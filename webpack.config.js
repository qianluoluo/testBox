var path = require('path')
var webpack = require('webpack')

const htmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
// 关于静态资源(图片...)等等，就自己建一个static文件夹放里面吧
module.exports = {
    entry: './src/main.js',
    output: {
        //__dirname指向当前执行脚本所在的目录。
        path: path.resolve(__dirname, './dist'),
        //在所有关于路径的引用前面加上这个变量的值
        publicPath: './', 
        // 加上5位hash以防浏览器请求本地缓存，css文件名同理'js/build.[hash:5].js'
        filename: 'js/build.js'
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                	loaders:{
                        // 必须这么写
	                    css: ExtractTextPlugin.extract({
	                        use: 'css-loader!sass-loader',
	                        fallback: 'vue-style-loader'
	                    })
	                }
	            }
            },{
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                // 将超过限制大小的图片存入img文件夹，小于限制大小的图片会被转为base64在浏览器显示
                loader: 'url-loader?limit=8192&name=img/[name].[ext]'
            },{
                test: /\.css$/,
                // 将css抽离出来
                loader: ExtractTextPlugin.extract("vue-style-loader", 'css-loader')
            },{
            	// webpack处理sass的时候要用到node-sass和sass-loader,vue文件里面的style标签的lang属性写成sass
                test: /\.sass$/,
                loader: ExtractTextPlugin.extract("vue-style-loader", 'css-loader!sass-loader')
            }
        ]
    },
    /*
        plugin是一个具有apply属性的js对象，提供了对整个编译周期的访问权
        plugins是一个数组，里面的元素必须是新的实例
    */
    plugins: [
    	new htmlWebpackPlugin({
	        filename: 'index.html',	//打包后的index.html入口文件
	        template: './index.html', // 需要展示的html文件
	        inject: 'body'	//将打包后的js注入到html文件的那个里面
	    }),
	    // 此插件一定要写，不然抽不出来
	    new ExtractTextPlugin({filename: 'css/style.css', allChunks: true}),
        new webpack.HotModuleReplacementPlugin()
    ],
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        },
        extensions: ['.js', '.json', '.css', '.vue']
    },
    //webpack-dev-server配置
    devServer: {
        historyApiFallback: true,//不跳转
        noInfo: true,
        // hot: true,  实时刷新
        port: '9000', //监听端口
        // 默认webpack-dev-server会为根文件夹提供本地服务器，如果想为另外一个目录下的文件提供本地服务器
        contentBase: "dist",
        inline: true//实时刷新
    },
    // performance：配置webpack的通知提示
    // 当打包文件过大时会提示性能警告，可以用 performance.hints = false 禁用警告信息；建议在开发环境禁用，但是生产环境保留
    performance: {
        hints: false
    },
    // 错误定位,一共四种类型
    /*
        1.source-map:在一个单独的文件中产生一个完整且功能完全的文件。
                     这个文件具有最好的source map，但是它会减慢打包速度；
        2.cheap-module-source-map:在一个单独的文件中生成一个不带列映射的map，
                                  不带列映射提高了打包速度，但是也使得浏览器开发者工具只能对应到具体的行，
                                  不能对应到具体的列（符号），会对调试造成不便；
        3.eval-source-map:使用eval打包源文件模块，在同一个文件中生成干净的完整的source map。
                          这个选项可以在不影响构建速度的前提下生成完整的sourcemap，
                          但是对打包后输出的JS文件的执行具有性能和安全的隐患。在开发阶段这是一个非常好的选项，
                          在生产阶段则一定不要启用这个选项；
        4.cheap-module-eval-source-map:这是在打包文件时最快的生成source map的方法，
                                       生成的Source Map 会和打包后的JavaScript文件同行显示，
                                       没有列映射，和eval-source-map选项具有相似的缺点；
    */
    devtool: '#eval-source-map'
}

if (process.env.NODE_ENV === 'production') {
    module.exports.devtool = '#source-map'
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            compress: {
                warnings: false
            }
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        })
    ])
}