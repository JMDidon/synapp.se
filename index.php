<?php
# Initialize
  session_start();
  include 'site/helpers.php';
  $site = include 'site/r76.php';
  
  define('tokens', 'site/tokens.json');
  
  
  
# Home
  $site->get('/', function() {
    // abort if access denied
    if (!$_SESSION['access']) return false;
    
    // redirect to app
    go(url('app'));
  });
  
  
# Validate access
  $site->get('/@token', function() {
    // load tokens
    $tokens = json_decode(file_get_contents(tokens), true);
    
    // abord if token doesn't exist
    if (!in_array(sha1(uri('token')), $tokens)) return false;
    
    // grant access & redirect to app
    $_SESSION['access'] = true;
    go(url('app'));
  });
  
  
  
# Create access token
# /add/@token/pass:enterThePasswordHere
  $site->get('/add/@token', function() {
    // abort if wrong password
    if (sha1(get('pass')) != '52aed46e5779a541b46cc77c1cfd18acb08e69c0') return false;
    
    // load tokens
    $tokens = is_file(tokens) ? json_decode(file_get_contents(tokens), true) : array();
    
    // add token
    if (!in_array(sha1(uri('token')), $tokens)) $tokens[] = sha1(uri('token'));
    
    // save token & redirect to root
    file_put_contents(tokens, json_encode($tokens), LOCK_EX);
    go(root());
  });



# Run (default callback: display an error)
  $site->run(function() { 
    header('HTTP/1.0 403 Access Denied', true, 403); 
    exit('403 Error: Access Denied'); 
  });