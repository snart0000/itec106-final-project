<?php
include "config.php";
include "create_notification.php";

$data = json_decode(file_get_contents("php://input"), true);

if (
  !isset($data["user_id"]) ||
  !isset($data["old_password"]) ||
  !isset($data["new_password"])
) {
  echo json_encode([
    "success" => false,
    "message" => "Missing required fields."
  ]);
  exit;
}

$stmt = $conn->prepare("
  SELECT password
  FROM users
  WHERE id = ?
");

$stmt->bind_param("i", $data["user_id"]);
$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows === 0) {
  echo json_encode([
    "success" => false,
    "message" => "User not found."
  ]);
  exit;
}

$user = $result->fetch_assoc();

if (!password_verify($data["old_password"], $user["password"])) {
  echo json_encode([
    "success" => false,
    "message" => "Old password incorrect."
  ]);
  exit;
}

$newPassword = password_hash($data["new_password"], PASSWORD_DEFAULT);

$update = $conn->prepare("
  UPDATE users
  SET password = ?
  WHERE id = ?
");

$update->bind_param("si", $newPassword, $data["user_id"]);

$success = $update->execute();

if ($success) {
  createNotification(
    $conn,
    $data["user_id"],
    "Password Changed",
    "You changed your account password.",
    "security"
  );
}

echo json_encode([
  "success" => $success,
  "message" => $success ? "Password updated." : "Failed to update password."
]);
?>