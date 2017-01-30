
// Skybox texture from: https://github.com/mrdoob/three.js/tree/master/examples/textures/cube/skybox

const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
import Framework from './framework'

// called after the scene loads
function onLoad(framework) {
    var scene = framework.scene;
    var camera = framework.camera;
    var renderer = framework.renderer;
    var gui = framework.gui;
    var stats = framework.stats;

    // Basic Lambert white
    var lambertWhite = new THREE.MeshLambertMaterial({ color: 0xaaaaaa, side: THREE.DoubleSide });

    // Set light
    var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
    directionalLight.color.setHSL(0.1, 1, 0.95);
    directionalLight.position.set(1, 3, 2);
    directionalLight.position.multiplyScalar(10);

    // set skybox
    var loader = new THREE.CubeTextureLoader();
    var urlPrefix = '/images/skymap/';

    var skymap = new THREE.CubeTextureLoader().load([
        urlPrefix + 'px.jpg', urlPrefix + 'nx.jpg',
        urlPrefix + 'py.jpg', urlPrefix + 'ny.jpg',
        urlPrefix + 'pz.jpg', urlPrefix + 'nz.jpg'
    ] );

    scene.background = skymap;

    // load a simple obj mesh
    var objLoader = new THREE.OBJLoader();
    objLoader.load('/geo/feather.obj', function(obj) {

        // LOOK: This function runs after the obj has finished loading
        var featherGeo = obj.children[0].geometry;

        var featherMesh = new THREE.Mesh(featherGeo, lambertWhite);
        featherMesh.name = "feather";
//        scene.add(featherMesh);
		
/* 		var randomPoints = [];
		var rpos = new THREE.Vector3(0,0,0);
		randomPoints.push(rpos);
		rpos=(,0,1);
		randomPoints.push(rpos);
		rpos=(1,0,1);
		randomPoints.push(rpos);
		rpos=(1,0,1);
		randomPoints.push(rpos);
		//randomPoints.push(i);
		//for ( var i = 0; i < 10; i ++ ) {
		//	randomPoints.push( new THREE.Vector3( ( i - 4.5 ) * 50, THREE.Math.randFloat( - 50, 50 ), THREE.Math.randFloat( - 50, 50 ) ) );
		//	randomPoints.push(i);
		//}
		var randomSpline =  new THREE.CatmullRomCurve3(randomPoints); */
		var curve = new THREE.CatmullRomCurve3( [
			new THREE.Vector3( 0, 0, 0 ),
			new THREE.Vector3( -0.25, 0, 1),
			new THREE.Vector3( 0, 0, 2 ),
			new THREE.Vector3( 0.25, 0, 3 ),
			new THREE.Vector3( 0.15, 0, 3.5 ),
			new THREE.Vector3( 0.15, 0, 4 )
		] );
		var max=30;
		for(var i=1; i<max+1; i++) // LONG FEATHERS
		{
			//var FMCopy1 = new THREE.Mesh(featherGeo, lambertWhite);
			//var FMCopy2 = new THREE.Mesh(featherGeo, lambertWhite);
			var FMCopy = new THREE.Mesh(featherGeo, lambertWhite);
			//var a = new THREE.Euler( 0, 1, 10*i*3.14/180, 'XYZ' );
			//FMCopy.position.set(0,0,i/10);
			var ind = curve.getPoint( i/max );
			var pos = new THREE.Vector3(ind.x,ind.y,ind.z);
			FMCopy.position.x=pos.x;
			FMCopy.position.y=pos.y;
			FMCopy.position.z=pos.z;
			
			//console.log(FMCopy.position);
			
			//var quaternion = new THREE.Quaternion();
			//quaternion.setFromAxisAngle( new THREE.Vector3( 0, 1, 0 ), Math.PI / 2 );
			//FMCopy.quaternion.set( quaternion );
			//FMCopy.rotation.x = 10 * i * Math.PI/180;
			//FMCopy.rotation.y = curve.getTangent(i/10);
			if(i<=20) // MAIN WING - SOFT CURVE PART
			{
				FMCopy.rotation.y = i * Math.PI/180;
				FMCopy.scale.set(-0.9-0.1*(Math.abs(i-20)/20),-1,1);
			}
			else if(i>20) // SIDE WING - HARD CURVE PART
			{
				FMCopy.rotation.y = (10 * (i-20) + 20) * Math.PI/180;
				FMCopy.scale.set(-0.9-0.1*(Math.abs(i-20)/20),-1,1);
			}
			
			FMCopy.name = "feather_long"+i;
			//console.log(FMCopy.name);
			scene.add(FMCopy);
		}
		
		for(var i=1; i<max+1-1; i++) // SHORT FEATHERS
		{
			var FMCopy = new THREE.Mesh(featherGeo, lambertWhite);
			var ind = curve.getPoint((2*i-1)/max/2); // sample double and skip 1 to get mid points!!
			var pos = new THREE.Vector3(ind.x,ind.y,ind.z);
			FMCopy.position.x=pos.x;
			FMCopy.position.y=pos.y;
			FMCopy.position.z=pos.z;
			FMCopy.rotation.z= -3*(41-i)/30 * Math.PI/180;
			if(i<=20) // MAIN WING - SOFT CURVE PART
			{
				FMCopy.scale.set(-0.6-0.2*(Math.abs(i-20)/20),-1,1);
				FMCopy.rotation.y = i * 3/2 * Math.PI/180;
			}
			else if(i>20) // SIDE WING - HARD CURVE PART
			{
				FMCopy.scale.set(-0.6-0.2*(Math.abs(i-20)/20),-1,1);
				FMCopy.rotation.y = (10 * (i-20) + 25) * Math.PI/180;
			}
			FMCopy.name = "feather_short"+i;
			scene.add(FMCopy);
		}
		
		for(var i=1; i<21; i++) // VERY SHORT FEATHERS
		{
			var FMCopy = new THREE.Mesh(featherGeo, lambertWhite);
			var ind = curve.getPoint(i/max);
			var pos = new THREE.Vector3(ind.x,ind.y,ind.z);
			
			FMCopy.position.x=pos.x;
			FMCopy.position.y=pos.y;
			FMCopy.position.z=pos.z;
			FMCopy.rotation.z= -6*(41-i)/30 * Math.PI/180;
			
			FMCopy.scale.set(-0.4,-1,1);
			FMCopy.rotation.y = ((20-i)/20+2)/(4) * Math.PI/180;
			
			FMCopy.name = "feather_very_short"+i;
			scene.add(FMCopy);
		}
    });
	
    // set camera position
    camera.position.set(0, 1, 5);
    camera.lookAt(new THREE.Vector3(0,0,0));

    // scene.add(lambertCube);
    scene.add(directionalLight);

    // edit params and listen to changes like this
    // more information here: https://workshop.chromeexperiments.com/examples/gui/#1--Basic-Usage
    gui.add(camera, 'fov', 0, 180).onChange(function(newVal) {
        camera.updateProjectionMatrix();
    });
}

// called on frame updates
function onUpdate(framework) {
    for(var i=0; i<31; i++)
	{
		var feather1 = framework.scene.getObjectByName("feather_long"+i);  
		var feather2 = framework.scene.getObjectByName("feather_short"+i);
		var feather3 = framework.scene.getObjectByName("feather_very_short"+i);		
		if (feather1 !== undefined) {
			var date = new Date();
			feather1.position.y+=feather1.position.z/20 * Math.sin(date.getTime() / 1000);   
			//console.log(feather.name);
		}
		if(feather2 !== undefined) {
			var date = new Date();
			feather2.position.y+=feather2.position.z/20 * Math.sin(date.getTime() / 1000);   
			//console.log(feather.name);
		}
		if(feather3 !== undefined) {
			var date = new Date();
			feather3.position.y+=feather3.position.z/20 * Math.sin(date.getTime() / 1000);   
			//console.log(feather.name);
		}
	}
}

// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);