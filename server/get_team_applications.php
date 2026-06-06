<?php
include "config.php";

$team_id = $_GET["team_id"] ?? 0;

$stmt = $conn->prepare("
  SELECT 
    ta.id,
    ta.user_id,
    ta.status,
    ta.created_at,
    u.first_name,
    u.last_name,
    u.ign,
    u.uid,
    u.server,
    u.role1
  FROM team_applications ta
  JOIN users u ON ta.user_id = u.id
  WHERE ta.team_id = ? AND ta.status = 'pending'
  ORDER BY ta.created_at DESC
");

$stmt->bind_param("i", $team_id);
$stmt->execute();

$result = $stmt->get_result();
$applications = [];

while ($row = $result->fetch_assoc()) {
  $applications[] = $row;
}

echo json_encode($applications);
?>