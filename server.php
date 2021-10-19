<?php

use Dashboard\DB;

require_once __DIR__ . '/vendor/autoload.php';

$content = trim(file_get_contents("php://input"));

if ( ! empty( $content ) ) {
    $data = json_decode( $content, true );
    $action = filter_var( $data['action'], FILTER_SANITIZE_STRING );
    $hash = '';

    if ( isset( $data['name'] ) ) {
        $name = filter_var( $data['name'], FILTER_SANITIZE_STRING );
    }

    if ( isset( $data['email'] ) ) {
        $email = filter_var( $data['email'], FILTER_SANITIZE_EMAIL );
    }

    if ( isset( $data['hash'] ) ) {
        $hash = filter_var( $data['hash'], FILTER_SANITIZE_EMAIL );
    }

    $response = [];

    switch ($action) :
        case 'login':
            $data = json_decode($content, true );

            DB::get_instance()->saveRecord( $name, $email );
            break;
        case 'updateStatus':
            DB::get_instance()->updateRecord( $name, $email);
            break;
        case 'getRecords':
            $response = DB::get_instance()->getRecords();
            break;
        case 'getUserInfo':
            $response = DB::get_instance()->getUserInfo($hash);
            break;
    endswitch;

    echo json_encode( ['success' => true, 'response' => $response, 'currentTime' => time() ] );
}

