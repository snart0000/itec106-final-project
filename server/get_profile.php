<?php
include "config.php";

$user_id = $_GET["user_id"];

$stmt = $conn->prepare("
SELECT
id,
first_name,
middle_initial,
last_name,
email,
ign,
uid,
server,
role1,
role2
FROM users
WHERE id = ?
");

$stmt->bind_param("i", $user_id);
$stmt->execute();

$result = $stmt->get_result();

echo json_encode(
$result->fetch_assoc()
);