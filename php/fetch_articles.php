<?php
// Include your PDO initialization file (config.php)
include 'config.php';
session_start();

try {
  // Query to fetch articles from the database
  $sql = "SELECT articles.*, users.nickname 
        FROM articles 
        INNER JOIN users ON articles.user_id = users.user_id 
        WHERE articles.type = :type
        ORDER BY articles.dateModification DESC";

  if (isset($_SESSION['section'])) {
    $section = $_SESSION['section'];
  } else {
    $section = 'public';
  }

  // Prepare and execute the SQL query
  $stmt = $pdo->prepare($sql);
  $stmt->bindParam(':type', $section); // Assuming $_SESSION['section'] contains the type value
  $stmt->execute();

  // Fetch all rows as associative array
  $articles = $stmt->fetchAll(PDO::FETCH_ASSOC);

  //add editable key
  if (isset($_SESSION['user_id'])) {
    if (isset($_SESSION['role']) && ($_SESSION['role'] == 3 || $_SESSION['role'] == 2)) {
      foreach ($articles as &$article) {
        $article['editable'] = true;
      }
    } else {
      foreach ($articles as &$article) {
        if ($article['user_id'] == $_SESSION['user_id']) {
          $article['editable'] = true;
        } else {
          $article['editable'] = false;
        }
      }
    }
  }


  // Output articles as JSON
  header('Content-Type: application/json');
  echo json_encode($articles);
} catch (PDOException $e) {
  // Handle database errors
  http_response_code(500); // Internal Server Error
  echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
  exit();
}