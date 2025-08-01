var chrome = window.chrome;
var audio_loader, loaderContainer, counter=1;
  function loader(){
    document.write("<div id='audios_container'> <audio id='base_loop' src='audio/base_loop.mp3' loop='true'></audio> <audio id='tone_1' src='audio/tone_1.mp3'></audio> <audio id='tone_2' src='audio/tone_2.mp3'></audio> <audio id='tone_3' src='audio/tone_3.mp3'></audio> <audio id='tone_4' src='audio/tone_4.mp3'></audio> <audio id='tone_5' src='audio/tone_5.mp3'></audio> <audio id='tone_6' src='audio/tone_6.mp3'></audio> <audio id='tone_7' src='audio/tone_7.mp3'></audio> <audio id='tone_8' src='audio/tone_8.mp3'></audio> <audio id='tone_9' src='audio/tone_9.mp3'></audio> <audio id='tone_0' src='audio/tone_0.mp3'></audio> <audio id='tone_q' src='audio/tone_q.mp3'></audio> <audio id='tone_w' src='audio/tone_w.mp3'></audio> <audio id='tone_e' src='audio/tone_e.mp3'></audio> <audio id='tone_r' src='audio/tone_rdz.mp3'></audio> <audio id='tone_t' src='audio/tone_t.mp3'></audio> <audio id='tone_y' src='audio/tone_y.mp3'></audio> <audio id='tone_u' src='audio/tone_u.mp3'></audio> <audio id='tone_i' src='audio/tone_i.mp3'></audio> <audio id='tone_o' src='audio/tone_o.mp3'></audio> <audio id='tone_p' src='audio/tone_p.mp3'></audio><audio id='tone_space' src='audio/tone_space.mp3'></audio></div> \x3Cscript src='js/three.min.js'></script> \x3Cscript src='js/AdditiveBlendShader.js'></script> \x3Cscript src='js/EffectComposer.js'></script> \x3Cscript src='js/BlurShader.js'></script> \x3Cscript src='js/shader.js'></script> \x3Cscript src='js/passes.js'></script> \x3Cscript src='js/behrensmeyer.js'></script> \x3Cscript src='js/go_rodriguez.js'></script>");
        audio_loader = document.getElementById('audio_loader');
    var canvas_loader = document.getElementById('canvas_loader');
    var txtCharge = document.getElementById('charging');
        loaderContainer = document.getElementById('loader_container');
        loaderContainer.style.display = 'block';

    var ctxWaves = canvas_loader.getContext('2d');
    var gradient = ctxWaves.createLinearGradient(0,60,0,0);

    var ctxloader = new AudioContext();
    var loaderAnalyser = ctxloader.createAnalyser();
        loaderAnalyser.connect(ctxloader.destination);
        loaderAnalyser.fftSize = 32;
        audio_loader.play();

    var sourceLoader = ctxloader.createMediaElementSource(audio_loader);
        sourceLoader.connect(loaderAnalyser);
        loadProcesser();

        gradient.addColorStop(0, 'rgba(0,165,255,0.1)');
        gradient.addColorStop(1, '#00a5ff');//

        ctxWaves.fillStyle = gradient;
        ctxWaves.fillRect(30,0,5,0);

        ctxWaves.shadowColor="#00a5ff";
        ctxWaves.shadowBlur = 10;

    var friend_name, loaded = false;

    function loadProcesser() {
      if(!loaded) window.webkitRequestAnimationFrame(loadProcesser);
      else txtCharge.style.opacity = 0;
      var loaderLines = new Uint8Array(loaderAnalyser.frequencyBinCount);
      var sizeImpulse = 0;
          loaderAnalyser.getByteFrequencyData(loaderLines);
          ctxWaves.clearRect(0, 0, 50, 60);
        for (var i = 0; i < loaderLines.length; ++i){
          ctxWaves.fillRect(i * 3, 60, 2, -(loaderLines[i]/4));
          sizeImpulse += loaderLines[i]/256;
        }
        sizeImpulse = sizeImpulse/16;
        txtCharge.style.opacity = sizeImpulse+0.4;
      }
      window.onload = function(){
        addSounds();
        loaderContainer.opacity = 0 ;
        volumeDown();
      };
    }

  function error(){
    document.write("<div id='error'> <div id='monitor'></div> <div id='something_error'><p>ALGO SALIÓ MAL</p></div> <div id='info_error'><p>Gracias por intentarlo, pero el sitio solo sirve <br><br><span style='color: #00a5ff; '>a traves del explorador de </span></p></div> <div id='chrome'> <p><span style='color: #438cc9; '>G</span><span style='color: #e4332e; '>o</span><span style='color: #f7ce08; '>o</span><span style='color: #438cc9; '>g</span><span style='color: #03ea50; '>l</span><span style='color: #e4332e; '>e</span> <span style='color: #438cc9; '>C</span><span style='color: #e4332e; '>h</span><span style='color: #f7ce08; '>r</span><span style='color: #438cc9; '>o</span><span style='color: #03ea50; '>m</span><span style='color: #e4332e; '>e</span> </p> <div id='download'></div> <a href='https://www.google.com/intl/es/chrome/browser/' target='_blank' title='Descarga aquí.'><div id='download_here'><p>Descarga aquí</p></div> </a> <h6 style='color: #00a5ff; '>Si no lo tienes</h6> </div>");
    window.addEventListener( 'resize', onErrorResize, false );
    onErrorResize();
    function onErrorResize(){
      var maxH = window.innerHeight;
      var error = document.getElementById('error');
          error.style.top = ((maxH-400)/2)+'px';
    }
  }

  function volumeDown(){
    counter++;
    if(counter==12){
      init();
      loaded = true;
      audio_loader.pause();
      audio_loader.volume = 0;
      loaderContainer.style.display='none';
      window.addEventListener( 'resize', onWindowResize, false );
    }else{
      setTimeout(volumeDown,300);
      audio_loader.volume = audio_loader.volume-0.1;
    }
  }

  if(chrome)loader();
  else error();