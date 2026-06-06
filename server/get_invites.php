<?php
include "config.php";

$user_id = $_GET["user_id"];

$sql = "
  SELECT 
    tm.id,
    tm.status,
    tm.team_id,
    t.team_name,
    t.team_logo,

    CONCAT(leader.first_name, ' ', leader.last_name) AS leader_name,
    leader.ign AS leader_ign,

    CONCAT(inviter.first_name, ' ', inviter.last_name) AS inviter_name,
    inviter.ign AS inviter_ign,

    (
      SELECT COUNT(*) 
      FROM team_members 
      WHERE team_id = t.id AND status = 'accepted'
    ) AS member_count

  FROM team_members tm

  JOIN teams t 
    ON tm.team_id = t.id

  JOIN users leader 
    ON t.leader_id = leader.id

  LEFT JOIN users inviter 
    ON tm.invited_by = inviter.id

  WHERE tm.user_id = ? 
  AND tm.status = 'pending'
";

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