module.export = {
    webpackDevMiddleware: config => {
        config.watchOptions.pull = 300;
        return config;
    }
}