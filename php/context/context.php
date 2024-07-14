<?php
session_start();

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);


$data['section'] = trim($data['section']);
$_SESSION['section'] = $data['section'];

if (isset($_SESSION['section'])) {
  echo json_encode(['success' => true, 'section' => $_SESSION['section']]);
} else {
  echo json_encode(['success' => false]);
}
