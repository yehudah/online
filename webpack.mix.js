let mix = require('laravel-mix');

mix.js('assets/src/js/app.js', 'js')
    .sass('assets/src/css/app.scss', 'css')
    .setPublicPath('assets/dist').browserSync('https://elementor.test');
