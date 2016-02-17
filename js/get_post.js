var is_require=false
var error=undefined
var is_loaded=false

window.onload=function()
{
	is_loaded=true
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

function get(str, f, err) 
{
	var xmlhttp = getXmlHttp()

	xmlhttp.onerror=err
	xmlhttp.open('GET', str, true)
	xmlhttp.onreadystatechange = function() 
	{
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
			f(xmlhttp.responseText)
	}
	xmlhttp.send(null)

}

function post(url, data, f, err) 
{
	var xmlhttp = getXmlHttp()

	xmlhttp.onerror=err
	xmlhttp.timeout=0
	xmlhttp.open('POST', url, true)
	xmlhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8')

	xmlhttp.onreadystatechange = function()
	{
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
			f(xmlhttp.responseText)
	}
	xmlhttp.send(JSON.stringify(data))
}

var include=function(url, f)
{
	if(typeof(url)!='string' && (typeof(f)!='function' && typeof(f)!='undefined'))
	{
		console.log('внимание: include("' + url + '", ' + f + ') include должен принимать первым аргументом строку, вторым - функцию')
		return
	}
	else if(typeof(url)!='string')
	{
		console.log('внимание: include("' + url + '", ' + f + ') include должен принимать первым аргументом строку')
		return
	}
	else if(typeof(f)!='function' && typeof(f)!='undefined')
	{
		console.log('внимание: include("' + url + '", ' + f + ') include должен принимать вторым аргументом функцию')
		return
	}

  	var js_data=getXmlHttp()
    
  	js_data.open('GET', url, true)
  	js_data.onreadystatechange = function()
  	{
    	if(js_data.readyState == 4 && js_data.status == 200)
    	{
    		is_require=true
        	window.eval(js_data.responseText)
        	if(f)
        		f()
    	}
	}
	js_data.send(null)
}