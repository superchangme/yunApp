   if(!Hammer.HAS_TOUCHEVENTS && !Hammer.HAS_POINTEREVENTS) {
            Hammer.plugins.showTouches();
   }

	 if(!Hammer.HAS_TOUCHEVENTS && !Hammer.HAS_POINTEREVENTS) {
            Hammer.plugins.fakeMultitouch();
        }

   var hammertime = Hammer(document.getElementById('canvasContainer'), {
        transform_always_block: true,
        transform_min_scale: 1,
        drag_block_horizontal: true,
        drag_block_vertical: true,
        drag_min_distance: 0,
    });

    var posX=0, posY=0,
		lastPosX=0, lastPosY=0,
		bufferX=0, bufferY=0,
        scale=1, last_scale=1 ,rotation= 1, last_rotation, dragReady=0;

    hammertime.on('touch drag dragend transform', function(ev) {
        elemRect = document.getElementById('canvasContainer');
		manageMultitouch(ev);
    });

	function manageMultitouch(ev){

		switch(ev.type) {
            case 'touch':
                last_scale = scale;
                last_rotation = rotation;

                break;

            case 'drag':
                	posX = ev.gesture.deltaX + lastPosX;
                	posY = ev.gesture.deltaY + lastPosY;
					$('#canvasContainer')
						.animateLayer('photo', {
						  x: posX, y: posY,
					}, 0);
                break;

            case 'transform':
                rotation = last_rotation + ev.gesture.rotation;
                scale = Math.max(0, Math.min(last_scale * ev.gesture.scale, 10));
				$('#canvasContainer')
						.animateLayer('photo', {
						 rotate: rotation,
						 scale:scale,
					}, 0);
                break;

			case 'dragend':
				lastPosX = posX;
				lastPosY = posY;
				break;
        }
	}