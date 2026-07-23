<?php
// CORS Headers - Allow any origin for development
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400'); // cache for 1 day
}
else {
    header("Access-Control-Allow-Origin: *");
}

// Access-Control headers are received during OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

    exit(0);
}

// Check if image data is actual image or fake image
if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

// Build the return array
$response = array('success' => false, 'message' => '', 'url' => '');

// Check if file was posted
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_FILES['file'])) {

    $target_dir = "uploads/";

    // Create uploads directory if it doesn't exist
    if (!file_exists($target_dir)) {
        mkdir($target_dir, 0755, true);
    }

    $original_name = basename($_FILES["file"]["name"]);
    $file_size = $_FILES["file"]["size"];
    $file_tmp = $_FILES["file"]["tmp_name"];
    $file_type = strtolower(pathinfo($original_name, PATHINFO_EXTENSION));

    // Allow certain file formats
    $allowed_types = array("jpg", "jpeg", "png", "gif", "webp");

    if (!in_array($file_type, $allowed_types)) {
        $response['message'] = "Sorry, only JPG, JPEG, PNG, GIF, & WEBP files are allowed.";
        echo json_encode($response);
        exit();
    }

    // Check file size (limit to 5MB)
    if ($file_size > 5000000) {
        $response['message'] = "Sorry, your file is too large. Max size is 5MB.";
        echo json_encode($response);
        exit();
    }

    // SANITIZATION: Remove spaces and special chars from filename
    // 1. Remove extension
    $filename_without_ext = pathinfo($original_name, PATHINFO_FILENAME);
    // 2. Replace spaces with hyphens and remove other special chars
    $clean_name = preg_replace('/[^a-zA-Z0-9-]/', '-', $filename_without_ext);
    // 3. Remove multiple hyphens
    $clean_name = preg_replace('/-+/', '-', $clean_name);
    // 4. Trim hyphens from ends
    $clean_name = trim($clean_name, '-');

    // Generate a unique name to prevent overwriting
    $new_file_name = uniqid() . '-' . $clean_name . '.' . $file_type;
    $target_file = $target_dir . $new_file_name;

    if (move_uploaded_file($file_tmp, $target_file)) {
        // Construct the public URL
        // Improved logic to correctly build the URL based on server environment
        $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http";
        $host = $_SERVER['HTTP_HOST'];

        // specific fix for Hostinger or different directory structures
        $script_dir = dirname($_SERVER['PHP_SELF']);

        // Ensure strictly no backslashes in URL (Windows servers might introduce them)
        $script_dir = str_replace('\\', '/', $script_dir);

        // Remove trailing slash if present
        $script_dir = rtrim($script_dir, '/');

        $public_url = "$protocol://$host$script_dir/$target_file";

        $response['success'] = true;
        $response['message'] = "The file has been uploaded.";
        $response['url'] = $public_url;
        // Debug info - helpful for verifying path issues
        $response['debug_path'] = realpath($target_file);
    }
    else {
        $response['message'] = "Sorry, there was an error uploading your file.";
        $response['debug_error'] = error_get_last();
    }

}
else {
    $response['message'] = "No file uploaded.";
}

header('Content-Type: application/json');
echo json_encode($response);
?>

