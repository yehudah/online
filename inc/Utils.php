<?php
namespace Dashboard;


class Utils {

    public static function getBaseUrl() {
        return 'https://post-smtp.test/elementor';
    }

    public static function redirect($url = false) {
        if ( ! $url ) {
            $url = self::getBaseUrl();
        }

        header("Location: {$url}");
        die();
    }

    public static function get_db_path() {
        return dirname( __DIR__ ) . '/db/db.json';
    }

    public static function getIP() {

        if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
            $ip = $_SERVER['HTTP_CLIENT_IP'];
        } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
        } else {
            $ip = $_SERVER['REMOTE_ADDR'];
        }

        return $ip;
    }

}
