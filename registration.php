<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '/var/www/lexstatus.ua/PHPMailer/src/Exception.php';
require '/var/www/lexstatus.ua/PHPMailer/src/PHPMailer.php';
require '/var/www/lexstatus.ua/PHPMailer/src/SMTP.php';

$recepient = "lexstatus2016@gmail.com, project+15195@lexstatus.planfix.ua";
$sitename = "Технічне обстеження будівель та споруд";

function post($key) {
	return isset($_POST[$key]) ? trim($_POST[$key]) : '';
}

$mail = post("mail");
$phone = post("phone");
$data_form = post("data_form");
$name = post("name");
$city = post("city");
$utm_source = post("utm_source");
$utm_campaign = post("utm_campaign");
$utm_medium = post("utm_medium");
$date_submitted = date('Y-m-d');
$time_submitted = date("H:i");
$ip_address = $_SERVER["REMOTE_ADDR"];
$page_url = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]" . rtrim(dirname($_SERVER['REQUEST_URI']), '/') . '/';
$GA_client_id = isset($_COOKIE['_ga']) ? $_COOKIE['_ga'] : '';

$pagetitle = "Заявка на $sitename";
$messageHTML = "
<b> $pagetitle </b><br><br>
👤 <b>Ім'я:</b> $name<br>
📞 <b>Телефон:</b> $phone<br>
🏙 <b>Місто:</b> $city<br>
🔗 <b>Сторінка:</b> <a href='$page_url'>$page_url</a><br>
📅 <b>Дата:</b> $date_submitted<br>
⏰ <b>Час:</b> $time_submitted<br>
📋 <b>Форма:</b> $data_form<br>
🆔 <b>GA Client ID:</b> $GA_client_id<br>
";

// Відправка в Telegram
function sendMessage($chatID, $message, $token)
{
	$url = "https://api.telegram.org/" . $token . "/sendMessage?chat_id=" . $chatID;
	$url .= "&text=" . urlencode($message);
	$ch = curl_init();
	curl_setopt_array($ch, array(
			CURLOPT_URL => $url,
			CURLOPT_RETURNTRANSFER => true
	));
	curl_exec($ch);
	curl_close($ch);
}

$telegramMessage = "
‼ $pagetitle ‼
👤 Ім'я: $name
☎ Телефон: $phone
🏙 Місто: $city
📝 Відправлена форма: $data_form
🔗 page_url: $page_url
📅 date_submitted: $date_submitted
⏲ time_submitted: $time_submitted
";
sendMessage("-263605975", $telegramMessage, "bot546026860:AAGbAoQE9a8EdJVBXB7IkbxavL6gkvLUrCU");

// Відправка email через SMTP
$mailer = new PHPMailer(true);

try {
	$mailer->isSMTP();
	$mailer->Host = 'mail.lexstatus.com.ua';
	$mailer->SMTPAuth = true;
	$mailer->Username = 'lexsendmailpf@lexstatus.ua';
	$mailer->Password   = '123qweasDzxC!'; 
	$mailer->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
	$mailer->Port = 587;

	$mailer->CharSet = 'UTF-8';
	$mailer->setFrom('lexsendmailpf@lexstatus.ua', 'LexStatus');
	
	foreach (explode(',', $recepient) as $email) {
			$mailer->addAddress(trim($email));
	}

	$mailer->isHTML(true);
	$mailer->Subject = $pagetitle;
	$mailer->Body    = $messageHTML;

	$mailer->send();
} catch (Exception $e) {
	error_log("Помилка надсилання листа: {$mailer->ErrorInfo}");
}