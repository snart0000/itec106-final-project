<?php
include "config.php";

$data = json_decode(file_get_contents("php://input"), true);

$password = password_hash($data["password"], PASSWORD_DEFAULT);

$stmt = $conn->prepare("
  INSERT INTO users
  (first_name, middle_initial, last_name, email, ign, uid, server, role1, role2, password, role)
  VALUES (?, ?, ?, ?, '', '', '', '', '', ?, 'admin')
");

$stmt->bind_param(
  "sssss",
  $data["first_name"],
  $data["middle_initial"],
  $data["last_name"],
  $data["email"],
  $password
);

$success = $stmt->execute();

echo json_encode([
  "success" => $success,
  "message" => $success ? "Admin created successfully." : "Failed to create admin."
]);
?>