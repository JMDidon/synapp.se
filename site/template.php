<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Synapp.se</title>
  <link href='http://fonts.googleapis.com/css?family=Lato:300,400,700' rel='stylesheet' type='text/css'>
  <link rel="stylesheet" type="text/css" href="public/pulse.css">
</head>
<body>

  <h1>Synapp.se</h1>

  <form action="<?php echo root() ?>" method="post">
    <?php if ($_GET['error']): ?>
    <p>Wrong email syntax.</p>
    <?php elseif ($_GET['exists']): ?>
    <p>Already subscribed.</p>
    <?php elseif ($_GET['subscribed']): ?>
    <p>Welcome!</p>
    <?php endif ?>
    <input type="email" name="email">
    <input type="submit" value="Send">
  </form>

  <!-- Scripts -->
  <script src="public/pulse.js"></script>

</body>
</html>