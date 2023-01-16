import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader';
import {RGBELoader } from 'three/addons/loaders/RGBELoader';
import { SubsurfaceScatteringShader } from 'three/addons/shaders/SubsurfaceScatteringShader.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';


let model;
//scene
const scene = new THREE.Scene()




   



initMaterial();


function initMaterial() {

    const loader = new THREE.TextureLoader();
    const imgTexture = loader.load( 'model/color.png' );
    const thicknessTexture = loader.load( 'model/thickness3.png' );

    const displacementTexture = loader.load( 'model/white.png' );


    displacementTexture.wrapS = displacementTexture.wrapT =  THREE.ClampToEdgeWrapping;



    imgTexture.wrapS = imgTexture.wrapT =  THREE.MirroredRepeatWrapping;
    
    thicknessTexture.wrapS = thicknessTexture.wrapT =  THREE.ClampToEdgeWrapping;

    thicknessTexture.flipY = false;
    thicknessTexture.minFilter = THREE.LinearFilter;
    thicknessTexture.anisotropy = 128;
    thicknessTexture.offset = {x: 1, y: 1};
    

    const shader = SubsurfaceScatteringShader;
    const uniforms = THREE.UniformsUtils.clone( shader.uniforms );
    console.log(uniforms);
   
    uniforms['map'].value = imgTexture;

    uniforms[ 'diffuse' ].value = new THREE.Vector3( 0.024, 0.107, 0.165 );
    uniforms[ 'shininess' ].value = 200;
    uniforms[ 'thicknessMap' ].value = thicknessTexture;
    uniforms[ 'thicknessColor' ].value = new THREE.Vector3( 0.172, 0.261, 0.128);
    uniforms[ 'thicknessDistortion' ].value = 0.;
    uniforms[ 'thicknessAmbient' ].value = 9.6;
    uniforms[ 'thicknessAttenuation' ].value = .4;
    uniforms[ 'thicknessPower' ].value =3;
    uniforms[ 'thicknessScale' ].value = 6;
    
    

   

    

    


    const material = new THREE.ShaderMaterial( {
        uniforms: uniforms,
        vertexShader: shader.vertexShader,
        fragmentShader: shader.fragmentShader,
        lights: true
        
    } );
    material.extensions.derivatives = true;


    // LOADER

    const loaderGlbf = new GLTFLoader();
    loaderGlbf.load( 'model/mellszobor_weblaphoz3.glb', function ( object ) {

        model = object.scene.children[0];
        model.position.set( 0, -1.5, 0 );
       model.scale.setScalar( 1 );
         model.material = material;
        scene.add( object.scene );
        console.log(object.scene)

    } );

}





//sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
}

//light



const directionalLight = new THREE.DirectionalLight( 0xffffff, .6 );

directionalLight.position.set( 0, 0.01, 0 );
scene.add( directionalLight );






//camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 10
scene.add(camera)



//renderer
const canvas = document.querySelector(".webgl")
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(3)
renderer.render(scene, camera)


//controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enablePan = false
controls.enableZoom = false
controls.autoRotate = true
controls.autoRotateSpeed = 3



//resize
window.addEventListener('resize', () => {
    //update sizes
    sizes.width = window.innerWidth ;
    sizes.height = window.innerHeight;
    //update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
})


function loop() {
    controls.update()
    renderer.render(scene, camera, )
    window.requestAnimationFrame(loop)
}
loop()



