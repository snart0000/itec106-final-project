<?php
include "config.php";

$search = $_GET["search"] ?? "";
$page = isset($_GET["page"]) ? (int)$_GET["page"] : 1;
$limit = 10;
$offset = ($page - 1) * $limit;

$searchTerm = "%" . $search . "%";

$countStmt = $conn->prepare("
  SELECT COUNT(*) AS total
  FROM users
  WHERE role = 'player'
  AND (
    first_name LIKE ?
    OR last_name LIKE ?
    OR email LIKE ?
    OR ign LIKE ?
    OR uid LIKE ?
    OR server LIKE ?
    OR role1 LIKE ?
    OR role2 LIKE ?
  )
");

$countStmt->bind_param(
  "ssssssss",
  $searchTerm,
  $searchTerm,
  $searchTerm,
  $searchTerm,
  $searchTerm,
  $searchTerm,
  $searchTerm,
  $searchTerm
);

$countStmt->execute();
$total = $countStmt->get_result()->fetch_assoc()["total"];
$totalPages = ceil($total / $limit);

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
  WHERE role = 'player'
  AND (
    first_name LIKE ?
    OR last_name LIKE ?
    OR email LIKE ?
    OR ign LIKE ?
    OR uid LIKE ?
    OR server LIKE ?
    OR role1 LIKE ?
    OR role2 LIKE ?
  )
  ORDER BY id DESC
  LIMIT ? OFFSET ?
");

$stmt->bind_param(
  "ssssssssii",
  $searchTerm,
  $searchTerm,
  $searchTerm,
  $searchTerm,
  $searchTerm,
  $searchTerm,
  $searchTerm,
  $searchTerm,
  $limit,
  $offset
);

$stmt->execute();
$result = $stmt->get_result();

$players = [];

while ($row = $result->fetch_assoc()) {
  $players[] = $row;
}

echo json_encode([
  "success" => true,
  "players" => $players,
  "total" => (int)$total,
  "page" => $page,
  "totalPages" => $totalPages
]);
?>