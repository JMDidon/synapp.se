<?php session_start(); if (!$_SESSION['access']) { header('location:../'); exit; } ?>
<a href="bridge.html">Test Dropbox</a>