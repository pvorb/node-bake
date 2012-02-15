<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<title><%= title %> » <%= siteTitle %></title>
	</head>
	<body>
		<h1><%= title %></h1>
		<p>Written on <%= date %> by <%= author %></p>
<% if (has('foo')) { %>Something went wrong<% } %>
<%= __content %>

	</body>
</html>

