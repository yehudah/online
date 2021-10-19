<?php
namespace Dashboard;

class DB {

    use Singleton;

    private $users = [];

    private function __construct()
    {
        $this->refreshDB();
    }

    public function __call($name, $arguments)
    {
        self::get_instance()->{$name}($arguments);
    }

    private function refreshDB() {
        $db_path = Utils::get_db_path();
        $json = file_get_contents( $db_path );

        $this->users = json_decode( $json, true );
    }

    private function saveDB() {
        file_put_contents( Utils::get_db_path(), json_encode( $this->users ) );
    }

    public function getRecords() {
        return $this->users;
    }

    public function saveRecord( $name, $email ) {
        $hash = sha1( $name . $email );

        $visits = isset( $this->users[ $hash ] ) ? $this->users[$hash]['Visits']+1 : 1;

        $this->users[$hash] = [
            'hash' => $hash,
            'Name' => $name,
            'Email' => $email,
            'UserAgent' => filter_var( $_SERVER['HTTP_USER_AGENT'], FILTER_SANITIZE_STRING ),
            'EntranceTime' => time(),
            'LastUpdate' => time(),
            'IP' => Utils::getIP(),
            'Visits' => $visits,
        ];

        $this->saveDB();
    }

    public function updateRecord( $name, $email ) {
        $hash = sha1( $name . $email );
        if ( isset( $this->users[$hash] ) ) {
            $this->users[$hash]['LastUpdate'] = time();
        }
        $this->saveDB();
    }

    public function getUserInfo($hash) {
        $this->users[$hash]['EntranceTime'] = date('d-m-Y H:i', $this->users[$hash]['EntranceTime'] );
        $this->users[$hash]['LastUpdate'] = date('d-m-Y H:s', $this->users[$hash]['LastUpdate'] );

        return $this->users[$hash];
    }

}
