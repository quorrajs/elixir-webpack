import fs from 'fs';
import {extend} from 'underscore';

let gulpWebpack;

class WebpackTask extends Elixir.Task {

    /**
     * Create a new JavaScriptTask instance.
     *
     * @param  {string}      name
     * @param  {GulpPaths}   paths
     * @param  {object|null} options
     */
    constructor(name, paths, options) {
        super(name, null, paths);

        this.options = options;
    }


    /**
     * Lazy load the task dependencies.
     */
    loadDependencies() {
        gulpWebpack = require('webpack-stream');
    }


    /**
     * Build up the Gulp task.
     */
    gulpTask() {
        return (
            gulp
            .src(this.src.path)
            .pipe(this.webpack())
            .on('error', this.onError())
            .pipe(this.minify())
            .on('error', this.onError())
            .pipe(this.saveAs(gulp))
            .pipe(this.onSuccess())
        );
    }


    /**
     * Run the files through Webpack.
     */
    webpack() {
        this.recordStep('Transforming ES2015 to ES5');
        this.recordStep('Writing Source Maps');

        return gulpWebpack(extend({
            watch: Elixir.isWatching(),
            devtool: Elixir.config.sourcemaps ? 'eval-cheap-module-source-map' : '',
            output: {
                filename: this.output.name
            },
            module: {
                loaders: Elixir.config.js.webpack.loaders
            },
            babel: Elixir.config.js.webpack.babel || {},
            stats: {
                assets: false,
                version: false
            }
        }, Elixir.config.webpack, this.options), require('webpack'));
    }
}


export default WebpackTask;
