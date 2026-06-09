<?php
include "config.php";

$data = json_decode(file_get_contents("php://input"), true);

$stmt = $conn->prepare("
  INSERT INTO tournaments
  (title, tournament_date, venue, prize_pool, organizer, registration_deadline, status)
  VALUES (?, ?, ?, ?, ?, ?, 'open')
");

$stmt->bind_param(
  "ssssss",
  $data["title"],
  $data["tournament_date"],
  $data["venue"],
  $data["prize_pool"],
  $data["organizer"],
  $data["registration_deadline"]
);

$success = $stmt->execute();

echo json_encode([
  "success" => $success,
  "message" => $success ? "Tournament created successfully." : "Failed to create tournament."
]);
?>