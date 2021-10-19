<?php

namespace Dashboard;

trait Singleton {

	private static $instance;

	public static function get_instance() {
		if ( ! self::$instance ) {
			self::$instance = new static();
		}

		return self::$instance;
	}

}
