<?php
include "config.php";

$result = $conn->query("SELECT id, email, ign FROM users");

$users = [];

while ($row = $result->fetch_assoc()) {
    $users[] = $row;
}

echo json_encode($users);