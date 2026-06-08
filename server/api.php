<?php
header("Content-Type: application/json");

$name = $_GET['name'] ?? 'Guest';
$age = $_GET['age'] ?? null;

echo json_encode([
    "status" => true,
    "message" => "GET request successful",
    "data" => [
        "name" => $name,
        "age" => $age
    ]
]);