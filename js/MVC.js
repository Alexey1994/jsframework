var old_scope=[]

function controller(name, f)
{
	for(var i=0; i<old_scope.length; i++)
		if(old_scope[i].ctrl===name)
		{
			eval('var ctrl='+old_scope[i].ctrl)
			f(ctrl)
			update_for(old_scope[i].element.getElementsByTagName('for'), old_scope[i].v)
		}
}

function update_controller(controllers)
{
	if(controllers)
	for(var i=0; i<controllers.length; i++)
	{
		var controller_defined=false
		window.eval('if(typeof '+controllers[i].getAttribute('name')+'!=="undefined") {controller_defined=true}')

		if(controller_defined)
		{
			console.log('внимание: одинаковые имена для контроллера '+controllers[i].getAttribute('name')+' и существующей переменной, следовательно контроллер не создан')
		}
		else
		{
			var views=controllers[i].getElementsByTagName('v')
			var t={v:[]}

			if(views)
			for(var j=0; j<views.length; j++)
			{
				var str=views[j].innerHTML
				var ind=str.indexOf('[')
				if(ind>0)
					str=str.substr(0,ind)

				eval('t.ctrl="'+controllers[i].getAttribute('name')+'"')
				eval('t.element=controllers[i]')
				eval('t.v.push({name:"'+views[j].innerHTML+'", element:views[j]'+'})')

				window.eval('var '+controllers[i].getAttribute('name')+'={}')
				window.eval(controllers[i].getAttribute('name')+'.'+str+'=""')

				views[j].innerHTML=''
			}
			old_scope.push(t)
		}
	}
}

function update_view(elem, ctrl_views)
{
	var r=elem.getElementsByTagName('r')
	if(r)
	for(var i=0; i<r.length; i++)
	{
		var str=r[i].innerHTML
		var ind
		var rez=''

		while(true)
		{
			ind=str.indexOf('[')
			if(ind<=0)
				break
			rez+=str.substr(0,ind)
			rez+='['
			rez+=i
			rez+=']'
			str=str.substr(0,ind)
		}

		ctrl_views.push({element:r[i], name:rez})
		r[i].innerHTML=''
	}
}

function update_for(fors, ctrl)
{
	var for_defined

	if(fors)
	for(var i=0; i<fors.length; i++)
	{
		window.eval('if(typeof '+fors[i].getAttribute('i')+'!=="undefined") {for_defined=true}')
		if(for_defined)
		{
			console.log('внимание: одинаковые имена для for '+fors[i].getAttribute('i')+' и существующей переменной, следовательно for не создан')
		}
		else
		{
			var k=0
			eval('var l='+fors[i].getAttribute('end'))
			eval('var m='+fors[i].getAttribute('step'))
			window.eval('var '+fors[i].getAttribute('i')+'='+fors[i].getAttribute('start'))
			eval('k='+fors[i].getAttribute('start'))
			console.log(ctrl)
			
			var str=fors[i].innerHTML
			fors[i].innerHTML=''

			for(k; k<l; k+=m)
			{
				fors[i].innerHTML+=str
			}

			update_view(fors[i], ctrl)
			for_defined=false
		}
	}
}

if(is_require)
{
	update_controller(document.getElementsByTagName('controller'))
	is_require=false
}
else
{

}

setInterval(function()
{
	var t
	for(var i=0; i<old_scope.length; i++)
	{
		for(var j=0; j<old_scope[i].v.length; j++)
		{
			eval('t='+old_scope[i].ctrl+'.'+old_scope[i].v[j].name)

			if(t!=old_scope[i].v[j].element.innerHTML)
				old_scope[i].v[j].element.innerHTML=t
		}
	}
}, 20)