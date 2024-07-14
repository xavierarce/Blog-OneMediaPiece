<?php
session_start();
header('Content-Type: application/json');

include 'config.php'; // Include your database connection

// Fetching article data from JSON input
$data = json_decode(file_get_contents('php://input'), true);

// Debugging: Print received JSON data
error_log('Received JSON data: ' . print_r($data, true));

// Validate input fields
$errors = [];
if (!isset($data['title'])) {
  $errors[] = 'Title is missing.';
}
if (!isset($data['content'])) {
  $errors[] = 'Content is missing.';
}
if (!isset($data['type'])) {
  $errors[] = 'Type is missing.';
}

// If any errors are found, return 400 Bad Request
if (!empty($errors)) {
  http_response_code(400); // Bad request
  echo json_encode(['success' => false, 'message' => implode(' ', $errors)]);
  exit();
}

$title = trim($data['title']);
$content = trim($data['content']);
$type = trim($data['type']);

// Retrieve user_id from cookie
if (!isset($_SESSION['user_id'])) {
  http_response_code(400); // Bad request
  echo json_encode(['success' => false, 'message' => 'User ID not found in cookie.']);
  exit();
}
$user_id = (int)$_SESSION['user_id']; // Ensure userId is converted to integer

// Additional validation if needed
if (empty($title) || empty($content) || empty($type) || $user_id <= 0) {
  http_response_code(400); // Bad request
  echo json_encode(['success' => false, 'message' => 'Please fill out all required fields.']);
  exit();
}

try {
  // Inserting article data into the database
  $sql = "INSERT INTO articles (title, content, type, user_id) VALUES (:title, :content, :type, :user_id)";
  $stmt = $pdo->prepare($sql);
  $stmt->bindParam(':title', $title);
  $stmt->bindParam(':content', $content);
  $stmt->bindParam(':type', $type);
  $stmt->bindParam(':user_id', $user_id);
  $stmt->execute();

  // Debugging: Print executed SQL statement and affected rows
  error_log('Executed SQL: ' . $sql);
  error_log('Affected rows: ' . $stmt->rowCount());

  if ($stmt->rowCount() > 0) {
    $response = [
      'success' => true,
      'message' => 'Article created successfully.'
    ];
    http_response_code(200); // OK
  } else {
    $response = [
      'success' => false,
      'message' => 'Failed to create article. Please try again.'
    ];
    http_response_code(500); // Server error
  }
} catch (PDOException $e) {
  $response = [
    'success' => false,
    'message' => 'Database error: ' . $e->getMessage()
  ];
  http_response_code(500); // Server error

  // Debugging: Log database error
  error_log('Database error: ' . $e->getMessage());
}

// Debugging: Print final response
error_log('Final response: ' . json_encode($response));

echo json_encode($response);