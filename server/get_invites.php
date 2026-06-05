<?php
include "config.php";

$user_id = $_GET["user_id"];

$sql = "SELECT tm.id, tm.status, t.team_name, t.team_logo
FROM team_members tm
JOIN teams t ON tm.team_id = t.id
WHERE tm.user_id = ? AND tm.status = 'pending'";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();

$result = $stmt->get_result();
$invites = [];

while ($row = $result->fetch_assoc()) {
  $invites[] = $row;
}

echo json_encode($invites);
?>