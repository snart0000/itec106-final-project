<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

$conn = new mysqli("localhost", "root", "", "ml_team_system");

if ($conn->connect_error) {
  die(json_encode(["success" => false, "message" => "Database connection failed"]));
}
?>