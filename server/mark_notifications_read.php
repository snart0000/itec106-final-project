<?php
include "config.php";

$data = json_decode(file_get_contents("php://input"), true);
$user_id = $data["user_id"];

$stmt = $conn->prepare("
  UPDATE notifications
  SET is_read = 1
  WHERE user_id = ?
");

$stmt->bind_param("i", $user_id);

echo json_encode([
  "success" => $stmt->execute()
]);
?>