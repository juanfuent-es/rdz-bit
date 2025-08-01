	var maxW = window.innerWidth,
		maxH = window.innerHeight,
		windowHalfX = maxW / 2,
		windowHalfY = maxH / 2,
		mouseX = 0, mouseY = 0;

	var starsCounter = 3072, maxScale = 10, starsPerChannel = parseInt(starsCounter/256);
	var stars = [], glows = [], context, analyser;
	var keys = [ 0, 49, 50, 51, 52, 53, 54, 55, 56, 57, 48, 80, 79, 81, 87, 69, 73, 84, 89, 85, 32, 82 ];
	var soundsArray = new Object();

	var cameraA,
		cameraB,
		sceneA,
		sceneB,
		render2Pass,
		renderer,
		instructions,
		instructions_children,
		footer_numbers,
		footer,
		welcomePass=true,
		friend_name = 'Los Rodríguez';

	function init() {
		var container = document.getElementById('cubes');
			container.style.opacity = 1;

		sceneA = new THREE.Scene();
		sceneB = new THREE.Scene();
		cameraA = new THREE.PerspectiveCamera( 60, maxW / maxH, 1, 10000 );
		cameraB = new THREE.PerspectiveCamera( 60, maxW / maxH, 1, 10000 );
		cameraA.position.z = 500;
		cameraB.position.z = 500;

		cloudsCube = THREE.ImageUtils.loadTextureCube(['img/px.jpg','img/nx.jpg','img/py.jpg','img/ny.jpg','img/pz.jpg','img/nz.jpg' ]);
		cloudsCube.format = THREE.RGBFormat;

		lightA = new THREE.DirectionalLight( 0xffffff );
		lightB = new THREE.PointLight( 0xffffff );
		lightA.position.set( 1, 1, 0.5 ).normalize();
		lightB.position.set( 1, 1, 1 ).normalize();
		sceneA.add(lightA);
		sceneA.add(lightB);

		lightAB = new THREE.DirectionalLight( 0xffffff );
		lightAB.position.set( 1, 1, 0.5 ).normalize();
		sceneB.add(lightAB);

		lightBB = new THREE.PointLight( 0xffffff );
		lightBB.position.set( 1, 1, 0 ).normalize();
		sceneB.add(lightBB);

		var skyPanorama = new THREE.CubeGeometry( 10000, 10000, 10000 );
	
		var shader = THREE.ShaderLib[ "cube" ];
			shader.uniforms[ "tCube" ].value = cloudsCube;
		var clouds = new THREE.ShaderMaterial({
			fragmentShader: shader.fragmentShader,
			vertexShader: shader.vertexShader,
			uniforms: shader.uniforms,
			transparency: true, 
			opacity: 0.1,
			side: THREE.BackSide
		});
		skyClouds = new THREE.Mesh( skyPanorama, clouds );
		skyClouds.position.set( 1, 1, 1 ).normalize();
		sceneA.add( skyClouds );
		var point = new THREE.CubeGeometry( 2, 2, 2 );
		var pointg = new THREE.CubeGeometry( 2.5, 2.5, 2.5 );
			starsCube = new THREE.Object3D();
			glowsCube = new THREE.Object3D();
		for ( var i = 0; i < starsCounter; i ++ ) {
			i%2?colorTrue = 0x08bcad:colorTrue = 0xffffff;
			if(i%3) colorTrue=0Xe4332e;
			var star = new THREE.Mesh( point, new THREE.MeshLambertMaterial( { color: colorTrue, shininess: 90, reflectivity: 10 } ) );
			var glow = new THREE.Mesh( pointg, new THREE.MeshLambertMaterial( { color: colorTrue, transparent: true, opacity: 0.5 } ) );
			xPosition = Math.random()*3000-1000;
			yPosition = Math.random()*3000-1000;
			zPosition = Math.random()*3000-1000;

			star.position.set(xPosition, yPosition, zPosition);
			glow.position.set(xPosition, yPosition, zPosition);
			star.updateMatrix();
			glow.updateMatrix();
			stars.push(star);
			glows.push(glow);
			starsCube.add(star);
			glowsCube.add(glow);
		}

		sceneA.add( starsCube );
		sceneB.add( glowsCube );
		textName(friend_name);
		renderer = new THREE.WebGLRenderer({ antialias:true });
		renderer.setSize( maxW, maxH );
		container.appendChild( renderer.domElement );

		document.addEventListener( 'mousemove', onDocumentMouseMove, false );

		var renderParams = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBuffer: false };
		var renderTarget = new THREE.WebGLRenderTarget( maxW, maxH, renderParams );
		glowBox = new THREE.EffectComposer( renderer, renderTarget );
		
		render2Pass = new THREE.RenderPass( sceneB, cameraB );
		glowBox.addPass( render2Pass );
		
		var effectHorizBlur = new THREE.ShaderPass( THREE.HorizontalBlurShader );
		var effectVertiBlur = new THREE.ShaderPass( THREE.VerticalBlurShader );
			effectHorizBlur.uniforms[ "h" ].value = 2 / maxW;
			effectVertiBlur.uniforms[ "v" ].value = 2 / maxH;
			glowBox.addPass( effectHorizBlur );
			glowBox.addPass( effectVertiBlur );
		
			finalComposer = new THREE.EffectComposer( renderer, renderTarget );

		var renderModel = new THREE.RenderPass( sceneA, cameraA );
			finalComposer.addPass( renderModel );

		var effectBlend = new THREE.ShaderPass( THREE.AdditiveBlendShader, "tDiffuse1" );
			effectBlend.uniforms[ 'tDiffuse2' ].value = glowBox.renderTarget2;
			effectBlend.renderToScreen = true;
			finalComposer.addPass( effectBlend );

		animate();
		welcome();
	}

	function textName(friend_name){
		if(friend_name.length>18) sizeTxt = 65-(friend_name.length-18);
		else sizeTxt = 70;
		text = new THREE.TextGeometry(friend_name, { size: sizeTxt, height: 10, font: "helvetiker", weight: "normal", style: "normal" });
		textMesh = new THREE.Mesh(text,new THREE.MeshLambertMaterial({ color: 0x08bcad }));

		text2 = new THREE.TextGeometry(friend_name, { size: sizeTxt, height: 15, font: "helvetiker", weight: "normal", style: "normal" });
		textMesh2 = new THREE.Mesh(text2,new THREE.MeshPhongMaterial({ color: 0x80d1ff, transparent:true, opacity:0.65 }));

		text.computeBoundingBox();
		text2.computeBoundingBox();

		var textWidth = text.boundingBox.max.x - text.boundingBox.min.x;
			textMesh.position.x = -0.5 * textWidth;
			textMesh.position.z = -100;

		var textWidth2 = text2.boundingBox.max.x - text2.boundingBox.min.x;
			textMesh2.position.x = -0.5 * textWidth2;
			textMesh2.position.z = -105;
		
		sceneA.add(textMesh);
		sceneB.add(textMesh2);
	}

	function onWindowResize() {
		maxW = window.innerWidth;
		maxH = window.innerHeight;

		windowHalfX = maxW / 2;
		windowHalfY = maxH / 2;

		cameraA.aspect = maxW / maxH;
		cameraB.aspect = maxW / maxH;
		cameraA.updateProjectionMatrix();
		cameraB.updateProjectionMatrix();

		instructions_children.style.top = (((maxH*.9)-525)/2+'px');

		renderer.setSize( maxW, maxH );
	}

	function onDocumentMouseMove(event) {
		mouseX = ( event.clientX - windowHalfX ) * 0.3;
		mouseY = ( event.clientY - windowHalfY ) * 0.3;
	}

	function animate() {
		requestAnimationFrame( animate );
		render();
	}

	function render() {
		var time = Date.now() * 0.001;
		var twirl = Math.sin( time * 0.25 ) * 0.1;
		if(welcomePass){
			starsCube.rotation.set(twirl, twirl, twirl);
			glowsCube.rotation.set(twirl, twirl, twirl);
			cameraA.position.y += ( - mouseY - cameraA.position.y ) * .9;
			cameraA.position.x += ( mouseX - cameraA.position.x ) * .9;
			cameraA.lookAt( sceneA.position );

			cameraB.position.y += ( - mouseY - cameraB.position.y ) * .9;
			cameraB.position.x += ( mouseX - cameraB.position.x ) * .9;
			cameraB.lookAt( sceneB.position );
		}

		var dataLines = new Uint8Array(analyser.frequencyBinCount);
			analyser.getByteFrequencyData(dataLines);
		for (var i = 0; i < dataLines.length; i++) {
			for (var j = 0; j < starsPerChannel; j++) {
				powerbit = ((dataLines[i]*maxScale)/dataLines.length);
				reduce = powerbit+(Math.sin(i));
				stars[i*j].scale.set(reduce,reduce,reduce);
				glows[i*j].scale.set(reduce,reduce,reduce);
			};
		}
        glowBox.render();
		finalComposer.render( sceneA, cameraA );
	}


	function addSounds(){
		context = new AudioContext();
		analyser = context.createAnalyser();
		analyser.connect(context.destination);
		analyser.fftSize = 512;
		var sounds = document.getElementById('audios_container').getElementsByTagName('audio');
		for (var i = 0; i < sounds.length; i++) {
			var sound = document.getElementById(sounds[i].id);
			var source = context.createMediaElementSource(sound);
		        soundsArray[keys[i]] = sound;
				source.connect(analyser);
	    };
	}

	function playSound(e){
	    var keyPress = e.keyCode;
	    console.log(keyPress)
	    if(soundsArray[keyPress]){
	    	if(keyPress>47 & keyPress<58){
	    		var active = document.getElementById('number_'+keyPress);
	    			active.className = active.className + " active_number";
	    			setTimeout(function(){ active.className = 'number'; },1000);
	    	}
	       	soundsArray[keyPress].currentTime = 0;
	        soundsArray[keyPress].play();
	    }else{
	    	soundsArray[49].currentTime = 0;
	        soundsArray[49].play();
	    }
	}

	function welcome(){
		instructions = document.getElementById('instructions');
		instructions_children = document.getElementById('instructions_children');
        welcomeBtn = document.getElementById('welcome');
        username = document.getElementById('username');
		footer_numbers = document.getElementById('footer_numbers');
        instructions.style.display = 'block';
        instructions_children.style.top = (((maxH*.9)-525)/2+'px');
        welcomeBtn.addEventListener('click', validate);
        username.addEventListener('keyup', function(e){
			friend_name=(username.value).replace('"','').replace("'","");
			soundsArray[73].currentTime = 0;
			soundsArray[73].play();
			if(username.value==''||username.value=='xxx') welcomeBtn.style.display='none';
			else welcomeBtn.style.display='block';
			if(e.keyCode==13)validate();
        });
        username.addEventListener('focusout', function(){
          if(username.value=='') friend_name = 'Los Rodríguez';
        });
        username.focus();

        function validate(){
        	if(username.value==''||username.value=='xxx'){
        		welcomeBtn.style.display='none';
        		username.value = '¿Nombre?';
        		setTimeout(function(){
        			username.value = '';
        			username.focus();
        		},1000);
        	}else{
        		soundsArray[89].currentTime = 0;
	        	soundsArray[89].play();
        		enterFriend();
        	}
        }
	}

	function enterFriend(){
		clicker();
		welcomePass=true;
		sceneA.remove(textMesh);
		sceneB.remove(textMesh2);
		instructions.style.opacity = 0;
		textName(friend_name);
		footer = document.getElementById('footer');
		document.addEventListener("keydown", playSound, false);
		setTimeout(function(){
			instructions.style.display='none';
			footer.style.display = 'block';
		},250);
	}

	function openSections(e){
		console.log(e);
	}

	function clicker(){
		var buttons = document.getElementsByClassName('open_close');
		var about = document.getElementById('rodriguez');
		var info = document.getElementById('info');

		for (var i = 0; i < buttons.length; i++) {
			buttons[i].addEventListener('click', function(e){
				switch(this.id){
					case 'open':
						this.style.display='none';
						document.getElementById('mini').style.display = 'block';
						footer.style.bottom = '40px';
					break;
					case 'mini':
						this.style.display='none';
						document.getElementById('open').style.display = 'block';
						footer.style.bottom = '10px';
					break;
					case 'close':
						welcomePass = true;
						info.style.opacity = 0;
						footer_numbers.style.opacity = 1;
						setTimeout(function(){ info.style.display = 'block'; },500);
					break;
				}
			});
		};

		about.addEventListener('click', function(){
			about.style.display = 'block';
			about.style.opacity = 1;
			footer_numbers.style.opacity = 0;
			info.style.display = 'block';
			info.style.opacity = 1;
			welcomePass = false;
		});
	};