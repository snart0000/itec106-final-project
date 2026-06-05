<?php
include "config.php";

$q = $_GET["q"] ?? "";

$stmt = $conn->prepare("SELECT id, first_name, last_name, ign, uid, server, role1, role2 FROM users 
WHERE ign LIKE ? OR uid LIKE ? OR first_name LIKE ?");
$search = "%$q%";
$stmt->bind_param("sss", $search, $search, $search);
$stmt->execute();

$result = $stmt->get_result();
$users = [];

while ($row = $result->fetch_assoc()) {
  $users[] = $row;
}

echo json_encode($users);
?>