<?php
	include 'site/r76.php';
	
	define('emails', 'site/emails.json');
	define('template', 'site/template.php');
	
	get('/', template);
	post('/', function() {
		if (!isset($_POST['email']) OR !preg_match('#^[a-z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$#i', $_POST['email'])) go(url(array('error' => 'true')));
		$emails = json_decode(file_get_contents(emails), true);
		if (in_array($_POST['email'], $emails)) go(url(array('exists' => 'true')));
		$emails[] = $_POST['email'];
		file_put_contents(emails, json_encode($emails), LOCK_EX);
		go(url(array('subscribed' => 'true')));
	});
	
	run(function() { header('HTTP/1.0 404 Not Found', true, 404); exit('404 Error'); });
?>