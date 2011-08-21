<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<title><%= file.title %> » <%= global.websiteTitle %></title>
	</head>
	<body>
		<h1><%= file.title %></h1>
		<p>Written on <%= file.date %> by <%= file.author %></p>

<%= file.__content %>

	</body>
</html>

