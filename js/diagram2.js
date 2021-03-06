
	var months
	var values_to 
	var values
	var old_rot = 0
	var csl = 0.4 	//circle radius large
	var csm = 0.37 	//circle radius medium
	var css = 0.23 	//circle radius small
	var speed = 0.04 //diagram speed

	var r1, r2;
	$.getJSON("data.json", function(json) {
	    months = json
		values = months[0]
		draw_diag(values['income'],values['expenses'],values['pars'])

		for (var i = 0; i < months.length; i++) {
			if (i==0) {
				$('.time_line').append('<div class="month active"><p>'+months[i]['month']+'</p><div class="line"><div></div>')
			}else{
				$('.time_line').append('<div class="month"><p>'+months[i]['month']+'</p><div class="line"><div></div>')
			}
			
		}



		inc_a = values['income']+'';
		inc_b = inc_a.split('.')
		
		exp_a = values['expenses']+''
		exp_b = exp_a.split('.')

		$('.income').html('<h3>$+'+inc_b[0]+'<span>'+inc_b[1]+'</span></h3>')
		$('.expenses').html('<h3>$-'+exp_b[0]+'<span>'+exp_b[1]+'</span></h3>')
		
		
		
		let bal_raw = values['income'] - values['expenses']// + ''
		let bal_a = bal_raw.toFixed(2)+''
		let bal_b = bal_a.split('.')
		
		$('.balance h3').html('$'+bal_b[0]+'<span>'+bal_b[1]+'</span>')

	});

	var Ww
	var Wh
	var cw
	var ch

	$(function(){

		Ww = $(window).width()
		Wh = $(window).height()
		canvas = document.getElementById('canvas1')
		ch = canvas.height = cw = canvas.width = Ww*0.85/Wh < 0.6 ? Ww*0.85 : Wh*0.6
		$('.diagarm').css({'height':ch,'width':cw})
		ctx = canvas.getContext('2d')
		$('.balance').css({'width':cw*css*2,'height':ch*css*2})

		 
		 $('.par').click(function(){
		 	let id = $(this).index()
		 	
		 	$(this).animate({ backgroundSize: '150%' }, {duration:300,step:function(a){$('.par.active').css('background-size',150-(a*0.8)+'%')},complete:function(){$('.par.active').removeClass('active');$(this).addClass('active')}});

		 	$('.info_par.active').animate({'opacity':0},150,function(){
	
		 		$(this).removeClass('active')
		 		$('.info_par:eq('+(id-1)+')').addClass('active')
		 		$('.info_par.active').animate({'opacity':1},150)
		 	})
		 })		
		})


	var grd
	var grd2
	var grd3

	var now_deg	= {}
	var pars_now = []

	function draw_diag(a,b,pars){

		old_rot = 0

		grd=ctx.createRadialGradient(0,0,cw*0.45,0,0,0);
		grd.addColorStop(0,"#FF2366");
		grd.addColorStop(0.5,"#8D4DE8");

		grd2=ctx.createRadialGradient(0,0,cw*0.45,0,0,0);
		grd2.addColorStop(0,"#FD3F2F");
		grd2.addColorStop(0.5,"#FACE15");

		grd3=ctx.createRadialGradient(0,0,cw*0.45,0,0,0);
		grd3.addColorStop(0,"#6956ec");
		grd3.addColorStop(0.5,"#56b2ba");

	 	ctx.translate(cw/2,cw/2)
		ctx.rotate(210*Math.PI/180)


		total = a+b+Math.abs(a-b)
		let dif = Math.abs(a-b)
		step = 300/total

		pars_now.push(pars[0]*step*Math.PI/180,pars[1]*step*Math.PI/180,pars[2]*step*Math.PI/180)


		ctx.beginPath()
		ctx.arc(0, 0, cw*0.35, 0, 2 * Math.PI);
		ctx.fillStyle = "#0e0f1a"
		ctx.fill()

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
		ctx.fillStyle = grd3
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

		place_divs()
	}


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
		

		animate_diag()


		inc_a = dif.a+'';
		inc_b = inc_a.split('.')
		exp_a = dif.b+''
		exp_b = exp_a.split('.')

		$('.income').html('<h3>$+'+inc_b[0]+'<span>'+inc_b[1]+'</span></h3>')
		$('.expenses').html('<h3>$-'+exp_b[0]+'<span>'+exp_b[1]+'</span></h3>')
		
		let bal_raw = dif.a - dif.b// + ''
		let bal_a = bal_raw.toFixed(2)+''
		let bal_b = bal_a.split('.')
		
		
		$('.balance h3').html('$'+bal_b[0]+'<span>'+bal_b[1]+'</span>')
	

	}

	progress_curve = 0

	function animate_diag(){

		place_divs(0)

		progress_curve +=speed
		

		progress = Math.sin((progress_curve*(Math.PI/4)))
		old_rot = 0
		


		ctx.clearRect(-cw,-ch,2*cw,2*ch)
	
		ctx.beginPath()
		ctx.arc(0, 0, cw*0.35, 0, 2 * Math.PI);
		ctx.fillStyle = "#0e0f1a"
		ctx.fill()
		
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
		ctx.fillStyle = grd3
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


		ctx.beginPath()
		ctx.arc(0, 0, cw*css, 0, 2 * Math.PI);
		ctx.fillStyle = "#161823"
		ctx.fill()
		
		 if (progress<0.99) {

			requestAnimationFrame(animate_diag)
		}else{
			place_divs(1)
			
			progress = 0
			progress_curve = 0

			now_deg.a = now_deg.a-dif_deg[0]
			now_deg.c = now_deg.c-dif_deg[1]
			now_deg.b = now_deg.b-dif_deg[2]

			pars_now[0] = pars_now[0]-dif_pars[0]
			pars_now[1] = pars_now[1]-dif_pars[1]
			pars_now[2] = pars_now[2]-dif_pars[2]

			clickable = true

		}
		ctx.rotate(-old_rot)
	}


		var resp = 0  
		var par_rot = [0,0,0]
		var deg = Math.PI/180

	function place_divs(l){
		resp = (15+Ww/100)/2-cw/2

		par_rot[0] = pars_now[0]-dif_pars[0]*progress+300*deg
		par_rot[1] = pars_now[2]-dif_pars[2]*progress+(r1+r2)-60*deg
		par_rot[2] = pars_now[1]-dif_pars[1]*progress+(r1)-60*deg

		$('#par1').css({
			'left':
			Math.sin(par_rot[0])*cw*csl-resp,
			'top':
			-Math.cos(par_rot[0])*cw*csl-resp})

		$('#par3').css({
			'left':
			Math.sin(par_rot[2])*cw*csm-resp,
			'top':
			-Math.cos(par_rot[2])*cw*csm-resp})
			
			   //Math.sin(pars_now[0]+dif_pars[0]*progress+210*Math.PI/180)*(cw/2+cw/2)*csl+cw/2-(15+Ww/100)/2,

		$('#par2').css({
			'left':
			Math.sin(par_rot[1])*cw*csl-resp,
			'top':
			-Math.cos(par_rot[1])*cw*csl-resp})

				
	}


	var month_now = 0
	$(window).resize(function(){
		Ww=$(window).width()
		Wh=$(window).height()
		 ch = canvas.height = cw = canvas.width = Ww*0.85/Wh < 0.6 ? Ww*0.85 : Wh*0.6
		
		$('.diagarm').css({'height':ch,'width':cw})
		draw_diag(months[month_now]['income'],months[month_now]['expenses'],months[month_now]['pars'])
		$('.balance').css({'width':cw*css*2,'height':ch*css*2})
	
	})

	var clickable = true

	$('.time_line').delegate('.month','click',function(){
			if(clickable){
				clickable=false
				month_now = $(this).index()
				caulculate_dif(month_now)
				$(this).children('.line').animate({'opacity':1},{
					duration: 300,
					step: function(o){
						$('.month.active .line').css({'opacity':1-o})
					},
					complete:function(){
						$('.month.active').removeClass('active')
						$(this).parent().addClass('active')
					}

				})
			}

	})

