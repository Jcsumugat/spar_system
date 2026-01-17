<?php
require 'vendor/autoload.php';

use Dompdf\Dompdf;

$html = '<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <style>
        body { font-family: DejaVu Sans, sans-serif; }
    </style>
</head>
<body>
    <h1>Test PDF</h1>
    <p>This is a test with special characters: àáâãäå</p>
    <p>Numbers: 12345</p>
    <p>Business Name: Test Business</p>
</body>
</html>';

$dompdf = new Dompdf();
$dompdf->loadHtml($html);
$dompdf->setPaper('A4', 'portrait');
$dompdf->render();

file_put_contents('test-output.pdf', $dompdf->output());
echo "PDF generated successfully!";
