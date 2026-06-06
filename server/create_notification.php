<?php
function createNotification($conn, $user_id, $title, $message, $type = "system") {
  $stmt = $conn->prepare("
    INSERT INTO notifications (user_id, title, message, type)
    VALUES (?, ?, ?, ?)
  ");

  $stmt->bind_param("isss", $user_id, $title, $message, $type);
  return $stmt->execute();
}
?>