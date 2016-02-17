var MVC_loaded=false

include('js/routing.js')

include('js/MVC.js', function()
{
	controller('a', function(scope)
	{
		scope.firstname='Alexey'
		scope.lastname='Borisenko'
		scope.phone='+375257262119'
		scope.arr=[1,2,3,4,5,6,7]
	})
})

include('js/chat.js', function()
{
	var chats=document.getElementsByTagName('chat')
	var text=''

	controller('b', function(scope)
	{
		scope.message=''

		onmessage('get_news', function(data)
		{
			data=JSON.parse(data)
			if(data)
			for(var i=0; i<data.length; i++)
				scope.message+=data[i].text+'<br>'
		})
	})
})