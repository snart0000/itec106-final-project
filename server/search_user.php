<?php
include "config.php";

$q = $_GET["q"] ?? "";
$my_team_id = $_GET["my_team_id"] ?? 0;
$waiting_hours = $_GET["waiting_hours"] ?? 24;

$stmt = $conn->prepare("
  SELECT 
    u.id,
    u.first_name,
    u.last_name,
    u.ign,
    u.uid,
    u.server,
    u.role1,
    u.role2,

    t.id AS team_id,
    t.team_name,
    t.team_logo,

    CASE 
      WHEN p.id IS NOT NULL 
      AND DATE_ADD(p.created_at, INTERVAL ? HOUR) > NOW()
      THEN 1 
      ELSE 0 
    END AS has_pending_invite

  FROM users u

  LEFT JOIN team_members tm 
    ON u.id = tm.user_id AND tm.status = 'accepted'

  LEFT JOIN teams t 
    ON tm.team_id = t.id

  LEFT JOIN team_members p
    ON u.id = p.user_id
    AND p.team_id = ?
    AND p.status = 'pending'

  WHERE u.ign LIKE ? 
     OR u.uid LIKE ? 
     OR u.first_name LIKE ?
     OR u.last_name LIKE ?
     OR u.role1 LIKE ?
     OR u.role2 LIKE ?
     OR t.team_name LIKE ?
");

$search = "%$q%";

$stmt->bind_param(
  "iisssssss",
  $waiting_hours,
  $my_team_id,
  $search,
  $search,
  $search,
  $search,
  $search,
  $search,
  $search
);

$stmt->execute();

$result = $stmt->get_result();
$users = [];

while ($row = $result->fetch_assoc()) {
  $users[] = $row;
}

echo json_encode($users);
?>