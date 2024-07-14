<?php
$DB_HOST = 'localhost';
$DB_PORT = 3306;
$DB_NAME = 'final_project';
$DB_USERNAME = 'root';
$DB_PASSWORD = '';

$dsn = "mysql:host=$DB_HOST;port=$DB_PORT;dbname=$DB_NAME";

try {
  $pdo = new PDO($dsn, $DB_USERNAME, $DB_PASSWORD);
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
  die("Connection failed: " . $e->getMessage());
}
