<?php
include "config.php";
include "create_notification.php";

$data = json_decode(file_get_contents("php://input"), true);

$stmt = $conn->prepare("
  UPDATE users
  SET
    first_name = ?,
    middle_initial = ?,
    last_name = ?,
    email = ?,
    ign = ?,
    uid = ?,
    server = ?,
    role1 = ?,
    role2 = ?
  WHERE id = ?
");

$stmt->bind_param(
  "sssssssssi",
  $data["first_name"],
  $data["middle_initial"],
  $data["last_name"],
  $data["email"],
  $data["ign"],
  $data["uid"],
  $data["server"],
  $data["role1"],
  $data["role2"],
  $data["user_id"]
);

$success = $stmt->execute();

if ($success) {
  createNotification(
    $conn,
    $data["user_id"],
    "Profile Updated",
    "You updated your profile information.",
    "profile"
  );
}

echo json_encode([
  "success" => $success,
  "message" => $success ? "Profile updated." : "Failed to update profile."
]);
?>