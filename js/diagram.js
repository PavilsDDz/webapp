
	var months
	var values_to 
	var values
	var old_rot = 0
	var csl = 0.4 	//circle radius large
	var csm = 0.37 	//circle radius medium
	var css = 0.23 	//circle radius small
	var r1, r2;
	$.getJSON("data.json", function(json) {
	    // console.log(json); // this will show the info it in firebug console
	    months = json
		values = months[0]//['january']
		console.log(values)
		draw_diag(values['income'],values['expenses'],values['pars'])

		for (var i = 0; i < months.length; i++) {
			$('.time_line').append('<div class="month"><p>'+months[i]['month']+'</p></div>')
		}
	});
		Ww = $(window).width()
		canvas = document.getElementById('canvas1')
		cw = canvas.width = Ww*0.85<500 ? Ww*0.85 : 500
		ch = canvas.height = Ww*0.85<500 ? Ww*0.85 : 500
		ctx = canvas.getContext('2d')
	 	ctx.translate(cw/2,cw/2)
		ctx.rotate(210*Math.PI/180)

		var grd=ctx.createRadialGradient(0,0,cw*0.45,0,0,0);
		grd.addColorStop(0,"#FF2366");
		grd.addColorStop(0.5,"#8D4DE8");

		var grd2=ctx.createRadialGradient(0,0,cw*0.45,0,0,0);
		grd2.addColorStop(0,"#FD3F2F");
		grd2.addColorStop(0.5,"#FACE15");

	var now_deg	= {}
	var pars_now = []
	function draw_diag(a,b,pars){

		total = a+b+Math.abs(a-b)
		let dif = Math.abs(a-b)
		step = 300/total

		pars_now.push(pars[0]*step*Math.PI/180,pars[1]*step*Math.PI/180,pars[2]*step*Math.PI/180)


		ctx.beginPath()
		ctx.arc(0, 0, cw*csl, 0, step*a * Math.PI/180);
		now_deg.a=(step*a*Math.PI/180)
		ctx.lineTo(0,0)

		//ctx.stroke()

		ctx.fillStyle = grd
		ctx.fill()

		ctx.beginPath()
		ctx.arc(0, 0, cw*csl, 0, pars[0]*step * Math.PI/180);
		now_deg.a=(step*a*Math.PI/180)
		ctx.lineTo(0,0)
		ctx.fillStyle = "rgba(0,0,0,0.2)"
		ctx.fill()

		ctx.rotate(step*a*Math.PI/180)
		old_rot += r1 = step*a*Math.PI/180

		ctx.beginPath()
		ctx.arc(0, 0, cw*csm, 0, step*dif * Math.PI/180);
		now_deg.c=step*dif*Math.PI/180

		ctx.lineTo(0,0)
		ctx.fillStyle = '#aa11dd'
		ctx.fill()

		ctx.beginPath()
		ctx.arc(0, 0, cw*csm, 0, pars[1]*step * Math.PI/180);
		ctx.lineTo(0,0)
		ctx.fillStyle = 'rgba(0,0,0,0.2)'
		ctx.fill()
		

		ctx.rotate(step*dif*Math.PI/180)
		old_rot += r2 =step*dif*Math.PI/180 
		ctx.beginPath()
		ctx.arc(0, 0, cw*csl, 0, step*b * Math.PI/180);
		now_deg.b=(step*b*Math.PI/180)

		ctx.lineTo(0,0)
		ctx.fillStyle = grd2
		ctx.fill()


		ctx.beginPath()
		ctx.arc(0, 0, cw*csl, 0, pars[2]*step * Math.PI/180);
		ctx.lineTo(0,0)
		ctx.fillStyle = 'rgba(0,0,0,0.2)'
		ctx.fill()

		ctx.beginPath()

		ctx.arc(0, 0, cw*css, 0, 2 * Math.PI);


		ctx.fillStyle = "#161823"
		ctx.fill()

		ctx.rotate(-old_rot)

		$('.income').html(values['income'])
		$('.expenses').html(values['expenses'])
		console.log(now_deg.a,now_deg.c,now_deg.b)
		place_divs()
	}
	speed = 0.01
	progress = 0
	dif = {}
	now = {}
	dif_deg = [0,0,0]
	dif_pars = [0,0,0]
	now_pars = [0,0,0]
	dif_pars = [0,0,0]
	function caulculate_dif(to){
		values_to = months[to]

		dif.a = values_to['income']
		dif.b = values_to['expenses']
		dif.c = Math.abs(dif.a - dif.b)
		dif.total = values_to['income']+values_to['expenses']+Math.abs(values_to['income']-values_to['expenses'])
		dif.step = 300/dif.total

		now.a = values['income']
		now.b = values['expenses']
		now.c = Math.abs(now.a-now.b)

		dif_deg[0]=(now_deg.a - (dif.a*dif.step)*Math.PI/180)
		dif_deg[1]=(now_deg.c - (dif.c*dif.step)*Math.PI/180)
		dif_deg[2]=(now_deg.b - (dif.b*dif.step)*Math.PI/180)

		dif_pars[0] = pars_now[0]-values_to['pars'][0]*dif.step*Math.PI/180,
		dif_pars[1] = pars_now[1]-values_to['pars'][1]*dif.step*Math.PI/180,
		dif_pars[2] = pars_now[2]-values_to['pars'][2]*dif.step*Math.PI/180
		


		console.log(now_deg.a , (dif.a*dif.step)*Math.PI/180)


		
		//old_rot = 0;
		animate_diag()

		$('.income').html(values_to['income'])
		$('.expenses').html(values_to['expenses'])
		console.log(dif_deg)
	}
	progress_curve = 0
	function animate_diag(){
		old_rot = 0
		progress+=speed
		//ctx.restore()

		ctx.clearRect(-cw,-ch,2*cw,2*ch)
	
		
		ctx.beginPath()
		ctx.arc(0,0,cw*csl,0,now_deg.a-(dif_deg[0]*progress))
		ctx.lineTo(0,0)
		ctx.fillStyle = grd
		ctx.fill()

		ctx.beginPath()
		ctx.arc(0,0,cw*csl,0,pars_now[0]-(dif_pars[0]*progress))
		ctx.lineTo(0,0)
		ctx.fillStyle = 'rgba(0,0,0,0.2)'
		ctx.fill()


		r1=now_deg.a-(dif_deg[0]*progress)
		old_rot+=r1
		ctx.rotate(r1)

		ctx.beginPath()
		ctx.arc(0,0,cw*csm,0,now_deg.c-(dif_deg[1]*progress))
		ctx.lineTo(0,0)
		ctx.fillStyle = '#aa11dd'
		ctx.fill()


		ctx.beginPath()
		ctx.arc(0,0,cw*csm,0,pars_now[1]-(dif_pars[1]*progress))
		ctx.lineTo(0,0)
		ctx.fillStyle = 'rgba(0,0,0,0.2)'
		ctx.fill()
		

		r2=now_deg.c-(dif_deg[1]*progress)
		old_rot+=r2
		ctx.rotate(r2)

		ctx.beginPath()
		ctx.arc(0,0,cw*csl,0,now_deg.b-(dif_deg[2]*progress))
		ctx.lineTo(0,0)
		ctx.fillStyle = grd2
		ctx.fill()

		ctx.beginPath()
		ctx.arc(0,0,cw*csl,0,pars_now[2]-(dif_pars[2]*progress))
		ctx.lineTo(0,0)
		ctx.fillStyle = 'rgba(0,0,0,0.2)'
		ctx.fill()

		ctx.rotate(-old_rot)

		ctx.beginPath()


		ctx.arc(0, 0, cw*css, 0, 2 * Math.PI);


		ctx.fillStyle = "#161823"
		ctx.fill()
		
		place_divs()
		
		//console.log(progress)
		if (progress<1) {
			//console.log(progress)
			requestAnimationFrame(animate_diag)
		}else{
			now_deg.a = now_deg.a-dif_deg[0]
			now_deg.c = now_deg.c-dif_deg[1]
			now_deg.b = now_deg.b-dif_deg[2]

			pars_now[0] = pars_now[0]-dif_pars[0]
			pars_now[1] = pars_now[1]-dif_pars[1]
			pars_now[2] = pars_now[2]-dif_pars[2]

			progress = 0
		}
	}
	function place_divs(){
		$('#par1').css({
			'left':
			Math.sin(pars_now[0]+dif_pars[0]*progress+210*Math.PI/180)*(cw/2+cw/2)*csl+cw/2-10,
			'top':
			Math.cos(pars_now[0]+dif_pars[0]*progress+210*Math.PI/180)*(cw/2+cw/2)*csl+cw/2-10})

		$('#par3').css({
			'left':
			Math.sin(pars_now[1]-dif_pars[1]*progress+(r1)-60*Math.PI/180)*(cw/2+cw/2)*csm+cw/2-10,
			'top':
			-Math.cos(pars_now[1]-dif_pars[1]*progress+(r1)-60*Math.PI/180)*(cw/2+cw/2)*csm+cw/2-10})

		$('#par2').css({
			'left':
			Math.sin(pars_now[2]-dif_pars[2]*progress+(r1+r2)-60*Math.PI/180)*(cw/2+cw/2)*csl+cw/2-10,
			'top':
			-Math.cos(pars_now[2]-dif_pars[2]*progress+(r1+r2)-60*Math.PI/180)*(cw/2+cw/2)*csl+cw/2-10})

	}
	$(window).resize(function(){
		cw = canvas.width = Ww<500 ? Ww : 500
		ch = canvas.height = Ww<500 ? Ww : 500
	})

	$('.time_line').delegate('.month','click',function(){
	
			caulculate_dif($(this).index())

	})
