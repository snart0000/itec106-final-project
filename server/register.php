<?php
include "config.php";

$data = json_decode(file_get_contents("php://input"), true);

$password = password_hash($data["password"], PASSWORD_DEFAULT);

$sql = "INSERT INTO users 
(first_name, middle_initial, last_name, email, ign, uid, server, role1, role2, password)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
$stmt->bind_param(
  "ssssssssss",
  $data["first_name"],
  $data["middle_initial"],
  $data["last_name"],
  $data["email"],
  $data["ign"],
  $data["uid"],
  $data["server"],
  $data["role1"],
  $data["role2"],
  $password
);

$success = $stmt->execute();

echo json_encode([
  "success" => $success,
  "message" => $success ? "Registered successfully" : "Registration failed"
]);
?>