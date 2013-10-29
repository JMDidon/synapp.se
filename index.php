<?php
session_start();
include 'site/helpers.php';
$site = include 'site/r76.php';

define('tokens', 'site/tokens.json');
$site->get('/', function() {
  if (!$_SESSION['access']) return false;
  go(url('app'));
});
$site->get('/@token', function() {
  $tokens = json_decode(file_get_contents(tokens), true);
  if (!in_array(sha1(uri('token')), $tokens)) return false;
  $_SESSION['access'] = true;
  go(url('app'));
});
$site->get('/add/@token', function() {
  if (sha1(get('pass')) != '52aed46e5779a541b46cc77c1cfd18acb08e69c0') return false;
  $tokens = is_file(tokens) ? json_decode(file_get_contents(tokens), true) : array();
  if (!in_array(sha1(uri('token')), $tokens)) $tokens[] = sha1(uri('token'));
  file_put_contents(tokens, json_encode($tokens), LOCK_EX);
  go(root());
});

$site->run(function() { header('HTTP/1.0 403 Access Denied', true, 403); exit('403 Error: Access Denied'); });