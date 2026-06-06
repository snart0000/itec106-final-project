<?php
include "config.php";

$user_id = $_GET["user_id"];

$stmt = $conn->prepare("
  SELECT *
  FROM notifications
  WHERE user_id = ?
  ORDER BY created_at DESC
");

$stmt->bind_param("i", $user_id);
$stmt->execute();

$result = $stmt->get_result();
$notifications = [];

while ($row = $result->fetch_assoc()) {
  $notifications[] = $row;
}

echo json_encode($notifications);
?>