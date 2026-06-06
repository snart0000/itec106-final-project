<?php
include "config.php";

$user_id = $_GET["user_id"];

$stmt = $conn->prepare("
  SELECT COUNT(*) AS total
  FROM notifications
  WHERE user_id = ? AND is_read = 0
");

$stmt->bind_param("i", $user_id);
$stmt->execute();

$result = $stmt->get_result();
$row = $result->fetch_assoc();

echo json_encode([
  "count" => $row["total"]
]);
?>