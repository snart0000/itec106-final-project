<?php
include "config.php";

$tournament_id = $_GET["tournament_id"] ?? 0;

$stmt = $conn->prepare("
SELECT 
  teams.id AS team_id,
  teams.team_name,
  users.first_name,
  users.last_name,
  users.ign
FROM tournament_registrations tr
INNER JOIN teams ON tr.team_id = teams.id
LEFT JOIN team_members tm 
  ON teams.id = tm.team_id AND tm.status = 'accepted'
LEFT JOIN users 
  ON tm.user_id = users.id
WHERE tr.tournament_id = ?
ORDER BY teams.team_name ASC
");

$stmt->bind_param("i", $tournament_id);
$stmt->execute();

$result = $stmt->get_result();

$teams = [];

while ($row = $result->fetch_assoc()) {
  $teamId = $row["team_id"];

  if (!isset($teams[$teamId])) {
    $teams[$teamId] = [
      "team_id" => $teamId,
      "team_name" => $row["team_name"],
      "members" => []
    ];
  }

  if ($row["first_name"]) {
    $teams[$teamId]["members"][] = [
      "name" => $row["first_name"] . " " . $row["last_name"],
      "ign" => $row["ign"]
    ];
  }
}

echo json_encode([
  "success" => true,
  "teams" => array_values($teams)
]);
?>