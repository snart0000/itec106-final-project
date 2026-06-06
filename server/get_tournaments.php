<?php
include "config.php";

$user_id = $_GET["user_id"] ?? 0;

$teamStmt = $conn->prepare("
  SELECT t.id AS team_id
  FROM teams t
  INNER JOIN team_members tm ON t.id = tm.team_id
  WHERE tm.user_id = ? AND tm.status = 'accepted'
  LIMIT 1
");

$teamStmt->bind_param("i", $user_id);
$teamStmt->execute();
$teamResult = $teamStmt->get_result();

$team_id = 0;
$member_count = 0;

if ($teamResult->num_rows > 0) {
  $team = $teamResult->fetch_assoc();
  $team_id = $team["team_id"];

  $countStmt = $conn->prepare("
    SELECT COUNT(*) AS total 
    FROM team_members 
    WHERE team_id = ? AND status = 'accepted'
  ");
  $countStmt->bind_param("i", $team_id);
  $countStmt->execute();
  $countResult = $countStmt->get_result()->fetch_assoc();
  $member_count = $countResult["total"];
}

$stmt = $conn->prepare("
  SELECT 
    tr.id AS registration_id,
    t.id,
    t.title,
    t.tournament_date,
    t.venue,
    t.prize_pool,
    t.organizer,
    t.registration_deadline,
    CASE
      WHEN t.status = 'complete' THEN 'complete'
      WHEN t.registration_deadline < NOW() THEN 'closed'
      ELSE 'open'
    END AS tournament_status
  FROM tournaments t
  LEFT JOIN tournament_registrations tr
    ON t.id = tr.tournament_id AND tr.team_id = ?
  ORDER BY t.tournament_date ASC
");

$stmt->bind_param("i", $team_id);
$stmt->execute();

$result = $stmt->get_result();
$tournaments = [];

while ($row = $result->fetch_assoc()) {
  $tournaments[] = $row;
}

echo json_encode([
  "team_id" => $team_id,
  "member_count" => $member_count,
  "tournaments" => $tournaments
]);
?>