if(is_require)
{
	is_require=false
}
else
{

}

function onmessage(message ,f)
{
	function read(e)
	{
		get(message, function(data)
		{
			f(data)
			onmessage(message, f)
		}, read)
	}

	read()
}

function send_message(message)
{
	function send()
	{
		post('redraw', {text:message}, function(){}, send)
	}
	send()
}

