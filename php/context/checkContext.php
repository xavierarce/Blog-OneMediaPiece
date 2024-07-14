<?php
session_start();

header('Content-Type: application/json');

if (isset($_SESSION['section'])) {
  echo json_encode(['success' => true, 'section' => $_SESSION['section']]);
} else {
  echo json_encode(['success' => false]);
}
