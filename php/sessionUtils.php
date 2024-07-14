<?php
function destroySession()
{
  $_SESSION = [];
  session_destroy();
  if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000, $params["path"], $params["domain"], $params["secure"], $params["httponly"]);
  }
}

function destroySessionWithMessage($message, $httpCode = 400)
{
  destroySession();
  http_response_code($httpCode);
  echo json_encode(['success' => false, 'message' => $message]);
  exit();
}
