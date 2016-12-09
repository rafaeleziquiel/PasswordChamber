jQuery(document).ready(function(){

    var color = 0; 
	var count = 0;
	var fileInput = document.getElementById('fileInput');
	var fileDisplayArea = document.getElementById('fileDisplayArea');
	var colors = ["1E88E5","673ab7","ff9800","00bcd4","009688"];	
	var colorID = 0;
	var cardClassColor = "";
	var id = 0;
	hasSub = 0;
	fileInput.addEventListener('change', function(e) {
		var file = fileInput.files[0];		
		var textType = /text.*/;

		if (file.type.match(textType)) {
			var reader = new FileReader();

			reader.onload = function(e) {				
				Obj = jQuery.parseJSON(reader.result);					
				jQuery.each(Obj.Items, function (key, data) {					
					if(!data.Registry && Object.keys(data).length > 0){						
						 var itensMenu = '<li class="dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">'+key+'<span class="caret"></span></a><ul class="dropdown-menu">';          				
						 var content = "";
						jQuery.each(data, function (key2, data2) {
							itensMenu += '<li id="li'+id+'" onclick="activeButton('+id+');"><a  href="#cor'+id+'" >'+key2+'</a></li>';
							content += '<div id="cor'+id+'" class="registry container-fluid color'+colorID+'"><h2 onclick="activeButton('+id+');" >'+key2+'</h2>';
							content = returnContent(content,colorID,colors,data2,1);		
							id ++;
						})
						jQuery("#items_list").append(itensMenu);	
						content +='</ul></li>';
					}else{
						jQuery("#items_list").append('<li id="li'+id+'" onclick="activeButton('+id+');"><a  href="#cor'+id+'" >'+key+'</a></li>');
						var content = '<div id="cor'+id+'" class="registry container-fluid color'+colorID+'"><h2 onclick="activeButton('+id+');" >'+key+'</h2>';
						content = returnContent(content,colorID,colors,data,0);
						id ++;
					}											
					jQuery("#items").append(content);
					
					for (i = 0; i < count; i++) {			
						jQuery('a[href="#ex'+i+'"]').click(function(event) {
					      event.preventDefault();
					      jQuery(this).modal({
					        fadeDuration: 150
					      });
					    });
					}
					
				})								
			}

			reader.readAsText(file);	
		} else {
			fileDisplayArea.innerText = "File not supported!";
		}
	});

	function returnContent(content,colorID,colors,data,hasSub){
		colorID ++;
		if(colorID >= colors.length){
			colorID = 0;
		}					
		content += '<style>#items.color #cor'+id+'{background-color: #'+colors[colorID]+'}</style>'; 
		content += '<div class="row col6" id="items'+id+'">';
		jQuery.each(data.Registry, function (index, val) {
			if(val.Password.Login == ""){
				login = "EMPTY";
			}else{
				login = val.Password.Login
			}					
			if(val.Image == ""){
				val.Image = "no-image.png";
			}
			if(val.Password.Pass == ""){
				pass = "EMPTY";
				cardClassColor = "cardRed";
			}else{
				pass = val.Password.Pass
				cardClassColor = "";
			}
			if(val.Desc == undefined){
				val.Desc = val.Title;
			}
			content += '<div class="card '+cardClassColor+'">';
			content += '<a href="#ex'+count+'"  >'+val.Title+'</a>'; //removido rel="modal:open"
			content += '<div class="modal" id="ex'+count+'" style="display:none;"> <h2>'+val.Title+'</h2><strong>'+val.Title+'</strong><br />';
			if(val.Desc !== undefined){
				content += ' <strong>Desc: </strong>'+val.Desc+'<br />';
			}
			if(val.Link !== undefined){
				content += ' <strong>Link: </strong><a target=\'_blank\' href='+val.Link+' >'+val.Link+'</a><br />';
			}
			content += '<strong>Login</strong>: '+login+'<br /><strong>Pass: </strong>  '+pass+'</div>';
			content += '<button type="button" class="btn btn-default btn-xs"  onclick="copyToClipboard(\''+pass+'\')" >';
			content += '<span class="glyphicon glyphicon-star" aria-hidden="true"></span>';
			content += 'Copy Pass</button></div>';		
			count ++;						
		})
		content += '</div></div>';
		if(hasSub){			
			jQuery.each(data.Registry, function (key2, data2) {	
				content += '</div>';
			})			
		}	
		return content;
	}

	jQuery( "#color" ).click(function() {
	  changeColor();
	});

	function changeColor(){
		if(color == 0){
			color = 1;
			jQuery("#items").addClass('color');
		}else{
			color = 0;
			jQuery("#items").removeClass('color');
		}
		
	}
	activeButton = function (id){
		obj = "#li"+id;
		var ul = jQuery(obj).parent();			
		if(ul.hasClass( "dropdown-menu" )){
			ul = jQuery(obj).parent().parent().parent();	
		}
		for(i = 0; i <= ul.children().length; i ++){
			$(ul.children()[i]).removeClass();
			jQuery("#cor"+i).removeClass("active");
			jQuery("#cor"+i).animate({opacity:0.6 }, 0);
		}
		jQuery.each(ul.children().children(), function (key, data) {			
			console.log(key);
			$("#li"+key).removeClass('active');
		})
		jQuery(obj).addClass("active");
		jQuery('body,html').animate({scrollLeft: jQuery("#cor"+id).offset().left - 500 }, 300);		
		jQuery("#cor"+id).addClass("active");		
		jQuery("#cor"+id).animate({opacity:100 }, 300);
		
	}

	copyToClipboard = function(val) {
		if (val == "EMPTY") {
			jQuery(".message").html('<div class="alert alert-danger fade in"> <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Error!</strong> Empty Pass.</div>')
		}else{
			var $temp = jQuery("<input>");
			jQuery("body").append($temp);
			$temp.val(val).select();
			document.execCommand("copy");
			$temp.remove();
			jQuery(".message").html('<div class="alert alert-success fade in"> <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Success!</strong> Copied to your clipboard.</div>')
		}
	}
	// ===== Scroll to Top ==== 
	$(window).scroll(function() {
		if ($(this).scrollTop() >= 50) {        // If page is scrolled more than 50px
			$('#return-to-top').fadeIn(200);    // Fade in the arrow
		} else {
			$('#return-to-top').fadeOut(200);   // Else fade out the arrow
		}
	});
	$('#return-to-top').click(function() {      // When arrow is clicked
		$('body,html').animate({
			scrollTop : 0                       // Scroll to top of body
		}, 500);
	});

	
});
