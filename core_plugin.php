<?php
	namespace sv_core;
	
	/**
	 * @author			straightvisions GmbH
	 * @package			sv100
	 * @copyright       2019 straightvisions GmbH
	 * @link			https://straightvisions.com
	 * @since			1.0
	 * @license			See license.txt or https://straightvisions.com
	 */
	
	require_once( 'core/core.php' );
	
	class init extends \sv_core\core {
		const version = 4000;
		const version_core_match = 4000;
	}
	
	$GLOBALS['sv_core_plugin'] = new init();