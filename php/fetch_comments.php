<?php
include 'config.php';
session_start();

try {
  $sql = "SELECT * FROM comments ORDER BY dateCreation DESC";
  $stmt = $pdo->prepare($sql);
  $stmt->execute();

  $comments = $stmt->fetchAll(PDO::FETCH_ASSOC);

  //add editable key
  if (isset($_SESSION['user_id'])) {
    if (isset($_SESSION['role']) && ($_SESSION['role'] == 3 || $_SESSION['role'] == 2)) {
      foreach ($comments as &$article) {
        $article['editable'] = true;
      }
    } else {
      foreach ($comments as &$article) {
        if ($article['user_id'] == $_SESSION['user_id']) {
          $article['editable'] = true;
        } else {
          $article['editable'] = false;
        }
      }
    }
  }

  header('Content-Type: application/json');
  echo json_encode($comments);
} catch (PDOException $e) {
  http_response_code(500);
  echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
  exit();
}
