<?php
include "config.php";

$result = $conn->query("SHOW TABLES");
$tables = [];

while ($row = $result->fetch_array()) {
    $tables[] = $row[0];
}

echo json_encode([
    "success" => true,
    "tables" => $tables
]);