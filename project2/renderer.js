const THREE = require('three');
init();


function init() {

    
        WIDTH  = window.innerWidth ,
        HEIGHT = 600;
        drawingSurface = document.getElementById('treeview');
        renderer = new THREE.WebGLRenderer({antialias: true, canvas: drawingSurface});
        renderer.setSize( WIDTH,HEIGHT );
        document.body.appendChild( renderer.domElement );
            
        scene = new THREE.Scene();
            
        camera = new THREE.PerspectiveCamera(
            50,             // Field of view
            WIDTH/HEIGHT,   // Aspect ratio
            .01,              // Near plane
            20000           // Far plane
        );
        camera.position.set(2,10,12);
        
        camera.lookAt(scene.position);
    
        scene.add(camera);

        // Create an event listener that resizes the renderer with the browser window.
        window.addEventListener('resize', function() {
            WIDTH = window.innerWidth ,
            HEIGHT = window.innerHeight;
            renderer.setSize(WIDTH, HEIGHT);
            camera.aspect = WIDTH / HEIGHT;
            camera.updateProjectionMatrix();
        });
    
        // Create a light, set its position, and add it to the scene.
        light = new THREE.PointLight( 0xFFFFFF );
        light.position.set( -100, 300, 200 );
        scene.add( light );
        
        
        geometry = new THREE.BoxGeometry( 8, 1, 8 );
        material = new THREE.MeshLambertMaterial( { color: 'lightgray' } );
        mesh = new THREE.Mesh( geometry, material );
        
        scene.add( mesh );

        // Set the background color of the scene.
        renderer.setClearColor(0x000000, 1);
        renderer.render( scene, camera );
                                                                                             
};