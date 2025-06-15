<?php
// On s'assure que le fichier de log existe et qu'on peut écrire dedans
$logFile = 'visitors.txt';

// Récupérer les informations
$ipAddress = $_SERVER['REMOTE_ADDR']; // L'adresse IP du visiteur
$dateTime = date('Y-m-d H:i:s'); // La date et l'heure actuelles
$userAgent = $_SERVER['HTTP_USER_AGENT']; // Le navigateur et le système d'exploitation du visiteur

// Formater la ligne à enregistrer
// Format : DATE | IP | USER_AGENT
$logLine = $dateTime . " | " . $ipAddress . " | " . $userAgent . "\n";

// Ajouter la ligne au fichier de log
// FILE_APPEND pour ne pas écraser les anciennes entrées
// LOCK_EX pour éviter que deux visiteurs n'écrivent en même temps
file_put_contents($logFile, $logLine, FILE_APPEND | LOCK_EX);

// (Optionnel) Envoyer une réponse pour dire que c'est fait
header('Content-Type: application/json');
echo json_encode(['status' => 'success']);
?>
