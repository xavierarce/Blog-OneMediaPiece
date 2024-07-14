<?php
include 'config.php';
session_start();

$data = json_decode(file_get_contents('php://input'), true);

// Debugging: Print received JSON data
error_log('Received JSON data: ' . print_r($data, true));

// Validate input fieldsarticle_id
$errors = [];
if (!isset($data['content'])) {
  $errors[] = 'Content is missing.';
}
if (!isset($data['article_id'])) {
  $errors[] = 'Article_id is missing.';
}
if (!empty($errors)) {
  http_response_code(400); // Bad request
  echo json_encode(['success' => false, 'message' => implode(' ', $errors)]);
  exit();
}


try {
  $sql = "INSERT INTO comments (content, user_id, article_id) VALUES (:content, :user_id, :article_id)";
  $stmt = $pdo->prepare($sql);
  $stmt->bindParam(':content', $data['content'], PDO::PARAM_STR);
  $stmt->bindParam(':user_id', $_SESSION['user_id'], PDO::PARAM_INT);
  $stmt->bindParam(':article_id', $data['article_id'], PDO::PARAM_INT);
  $stmt->execute();

  http_response_code(200); // Success
  echo json_encode(['message' => 'Comment posted successfully']);
} catch (PDOException $e) {
  http_response_code(500); // Internal Server Error
  echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
