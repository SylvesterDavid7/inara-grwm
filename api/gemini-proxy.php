<?php
// Set headers for CORS and content type
header("Access-Control-Allow-Origin: *"); // In production, restrict this to your domain
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

// Get the API key securely from the server environment
$apiKey = getenv('GEMINI_API_KEY');

// --- FALLBACK (Less Secure) ---
// If you absolutely cannot set environment variables in your cPanel, uncomment the line below.
// WARNING: This is less secure. Ensure this file's permissions are set to 600.
// if (!$apiKey) {
//     $apiKey = 'YOUR_GEMINI_API_KEY_HERE';
// }

if (!$apiKey) {
    http_response_code(500);
    echo json_encode(["error" => "API key is not configured on the server."]);
    exit();
}

// Get the JSON data from the POST request
$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (!$data || !isset($data['prompt'])) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid request. A 'prompt' is required."]);
    exit();
}

$prompt = $data['prompt'];
$model = 'gemini-pro'; // Default to the text-only model

$parts = [['text' => $prompt]];

// If image data is included, switch to the vision model and add the image part
if (isset($data['imageData']) && isset($data['mimeType'])) {
    $model = 'gemini-pro-vision';
    $parts[] = [
        'inline_data' => [
            'mime_type' => $data['mimeType'],
            'data' => $data['imageData']
        ]
    ];
}

$requestBody = [
    'contents' => [['parts' => $parts]],
    'generationConfig' => [
        "response_mime_type" => "application/json",
    ]
];

$url = "https://generativelanguage.googleapis.com/v1beta/models/" . $model . ":generateContent?key=" . $apiKey;

// Use cURL to make the secure, server-to-server API call
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($requestBody));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);

$response = curl_exec($ch);
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

if ($response === false) {
    http_response_code(500);
    echo json_encode(["error" => "cURL error: " . $error]);
    exit();
}

// Relay the response from Gemini back to the client
http_response_code($httpcode);
echo $response;

?>
