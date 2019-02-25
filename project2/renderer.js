const THREE = require('three');
init();


function init() {

    
        WIDTH  = 640,
        HEIGHT = 600;
        container = document.getElementById('treeview');
        renderer = new THREE.WebGLRenderer({antialias: true});
        //renderer.setPixelRatio(window.devicePixelRatio);
        
        
        w = container.offsetWidth;
        h = container.offsetHeight;
        container.appendChild( renderer.domElement );
        renderer.setSize(w,h);

        
        scene = new THREE.Scene(w,h);
            
        camera = new THREE.PerspectiveCamera(
            50,             // Field of view
            w/h,            // Aspect ratio
            .01,            // Near plane
            20000           // Far plane
        );
        camera.position.set(2,10,12);
        
        camera.lookAt(scene.position);
    
        scene.add(camera);

        // Create an event listener that resizes the renderer with the browser window.
        window.addEventListener('resize', function() {
          w = container.offsetWidth;
          h = container.offsetHeight;
            renderer.setSize(w,h);
            camera.aspect = w/h;
            camera.updateProjectionMatrix();
        });
    
        // Create a light, set its position, and add it to the scene.
        light = new THREE.PointLight( 0xFFFFFF );
        light.position.set( -100, 300, 200 );
        scene.add( light );
        
        //box creation
        geometry = new THREE.BoxGeometry( 8, 1, 8 );
        material = new THREE.MeshLambertMaterial( { color: 'lightgray' } );
        mesh = new THREE.Mesh( geometry, material );
        
        scene.add( mesh );

        // Set the background color of the scene.
        renderer.setClearColor(0x000000, 1);
        renderer.render( scene, camera );
                                                                                             
};