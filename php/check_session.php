<?php
session_start();
include 'sessionUtils.php'; // Ensure this file contains PDO initialization

header('Content-Type: application/json');

if (!isset($_SESSION['section'])) {
  $_SESSION['section'] = 'public';
}
if (isset($_SESSION['nickname'])) {
  echo json_encode(['success' => true, 'nickname' => $_SESSION['nickname'], 'role' => $_SESSION['role'], 'section' => $_SESSION['section']]);
} else {
  destroySession();
  echo json_encode(['success' => false]);
}
