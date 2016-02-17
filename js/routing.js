var stream

function get_tokens(str, token)
{
	var tokens=[]

	do
	{
		var ind=str.indexOf(token)
		if(ind>0) 
			tokens.push(str.substr(0,ind))
		else if(str.length>0)
			tokens.push(str)
		str=str.substr(ind+1)
	}
	while(ind>0)

	return tokens
}

function getXmlHttp()
{ 
	var xmlhttp; 
	try 
	{ 
		xmlhttp = new ActiveXObject("Msxml2.XMLHTTP"); 
	} 
	catch (e) 
	{
		try 
		{ 
			xmlhttp = new ActiveXObject("Microsoft.XMLHTTP") 
		} 
		catch (E) 
		{ 
			xmlhttp = false 
		} 
	} 
	if (!xmlhttp && typeof XMLHttpRequest!='undefined')
		xmlhttp = new XMLHttpRequest()
	return xmlhttp
}

function redraw_loads(element)
{
	var loads=element.getElementsByTagName('load')
	if(loads)
	for(var i=0; i<loads.length; i++)
		if(loads[i].attributes)
			pathes.push(loads[i])
}

function redraw_buttons(element)
{
	var buttons=element.getElementsByTagName('button')
	for(var i in buttons)
	{
		if(buttons[i].attributes && buttons[i].attributes.href)
		buttons[i].onclick=function()
		{
			clearInterval(stream)
			window.location.hash=this.getAttribute('href')
		}
	}
}

var html_loaded=true

function get_html(url, paste) 
{
	html_loaded=false
	var xmlhttp = getXmlHttp()

	xmlhttp.open('GET', url, true)
	xmlhttp.onreadystatechange = function() 
	{
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
		{
			paste.innerHTML=xmlhttp.responseText;
			redraw_loads(paste)
			redraw_buttons(paste)
			html_loaded=true
		}
	}
	xmlhttp.send(null)
}

var is_init=false
var old_path=window.location.hash.slice(1)
var last_ui

function set_path(path)
{
	clearInterval(stream)
	html_loaded=true

	var path_tokens=get_tokens(path,'/')
	var cur_path=get_tokens(old_path, '/')
	var path_unchangeable=''

	var i=0
	if(is_init)
	{
		for(; i<path_tokens.length; i++)
		{
			if(!cur_path[i] || path_tokens[i]!=cur_path[i])
				break
			path_unchangeable+=path_tokens[i]+'/'
		}
	}
	if(path_unchangeable.length>0)
		path_unchangeable=path_unchangeable.slice(0, path_unchangeable.length-1)
	//alert(path_unchangeable)

	var buttons=document.getElementsByTagName('button')
	var uis=document.getElementsByTagName('load')

	if(buttons)
	for(var j=0; j<buttons.length; j++)
	{
		var s=buttons[j].getAttribute('href')
		var ind=s.indexOf(path_unchangeable)
		if(ind==0 && s.slice(ind).length<=0)
		{
			if(uis)
			for(var k=0; k<uis.length; k++)
				if(uis[k].getAttribute('place')===buttons[j].getAttribute('place'))
					uis[k].innerHTML=''
		}
	}
	
	stream=setInterval(function()
	{
		if(i>=path_tokens.length)
		{
			clearInterval(stream)

			if(cur_path[i])
			{
				var uis=document.getElementsByTagName('load')
				for(; i<cur_path.length; i++)
				{
					if(buttons)
					for(var j=0; j<buttons.length; j++)
					{
						var button_tokens=get_tokens(buttons[j].getAttribute('href'), '/')
						if(button_tokens[i] && button_tokens[i]===cur_path[i])
						{
							if(uis)
							for(var k=0; k<uis.length; k++)
								if(uis[k].getAttribute('place')===buttons[j].getAttribute('place'))
								{
									uis[k].innerHTML=''
									break
								}
						}
						else
						{
							;//buttons.splice
						}
					}
				}
			}
		}
		else if(html_loaded)
		{
			html_loaded=false

			if(buttons)
			for(var j=0; j<buttons.length; j++)
			{
				var button_tokens=get_tokens(buttons[j].getAttribute('href'), '/')
				if(button_tokens[i] && button_tokens[i]===path_tokens[i])
				{
					var uis=document.getElementsByTagName('load')

					if(uis)
					for(var k=0; k<uis.length; k++)
						if(uis[k].getAttribute('place')===buttons[j].getAttribute('place'))
						{
							uis[k].active=true
							get_html(buttons[j].getAttribute('src'), uis[k])
							i++
							break
						}
				}
				else 
				{
					;//buttons.splice
				}
			}
		}
	},1)
}

window.onpopstate=function()
{
	set_path(window.location.hash.slice(1))
	old_path=window.location.hash.slice(1)
}

var pathes=[]

if(is_require)
{
	window.onpopstate()
	is_init=true
	redraw_loads(document)
	redraw_buttons(document)
}
else
{
	window.onload=function()
	{
		window.onpopstate()
		is_init=true
		redraw_loads(document)
		redraw_buttons(document)
	}
}

is_require=false