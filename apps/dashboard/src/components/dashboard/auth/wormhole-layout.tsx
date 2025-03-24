import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

const RealisticWormhole = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000510);
    
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 5);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }
    
    // Wormhole materials
    const wormholeTexture = new THREE.CanvasTexture(createWormholeTexture());
    wormholeTexture.wrapS = THREE.RepeatWrapping;
    wormholeTexture.wrapT = THREE.RepeatWrapping;
    
    // Create the central vortex
    const vortexGeometry = new THREE.PlaneGeometry(15, 15, 100, 100);
    const vortexMaterial = new THREE.MeshBasicMaterial({
      map: wormholeTexture,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    
    const vortexMesh = new THREE.Mesh(vortexGeometry, vortexMaterial);
    vortexMesh.rotation.x = Math.PI / 2;
    vortexMesh.position.z = -5;
    scene.add(vortexMesh);
    
    // Create the concentric rings
    const rings: THREE.Mesh[] = [];
    const ringCount = 8;
    
    for (let i = 0; i < ringCount; i++) {
      const geometry = new THREE.RingGeometry(
        2 + i * 0.7, // inner radius
        2.3 + i * 0.7, // outer radius
        64 // segments
      );
      
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color(0x3a8ea8),
        transparent: true,
        opacity: 0.8 - (i / ringCount) * 0.6,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      
      const ring = new THREE.Mesh(geometry, material);
      ring.rotation.x = Math.PI / 2;
      ring.position.z = -4 - i * 0.5;
      ring.userData = {
        initialZ: -4 - i * 0.5,
        rotationSpeed: 0.002 - (i * 0.0001)
      };
      
      scene.add(ring);
      rings.push(ring);
    }
    
    // Create wormhole glow
    const glowGeometry = new THREE.CircleGeometry(3, 32);
    const glowMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        varying vec2 vUv;
        
        void main() {
          vec2 center = vec2(0.5, 0.5);
          float dist = distance(vUv, center) * 2.0;
          
          // Create a soft glow that fades from center
          float glow = smoothstep(1.0, 0.0, dist);
          
          // Add subtle pulsing
          glow *= 0.8 + 0.2 * sin(time * 0.5);
          
          vec3 color = mix(
            vec3(0.8, 0.95, 1.0), // Inner color (bright cyan-white)
            vec3(0.2, 0.6, 0.7),  // Outer color (teal)
            dist
          );
          
          gl_FragColor = vec4(color, glow);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    
    const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
    glowMesh.rotation.x = Math.PI / 2;
    glowMesh.position.z = -3;
    scene.add(glowMesh);
    
    // Create stars
    const starsGeometry = new THREE.BufferGeometry();
    const starPositions: number[] = [];
    
    for (let i = 0; i < 5000; i++) {
      // Create stars all around, but avoid the wormhole center area
      let x: number = 0, y: number = 0, z: number = 0;
      let tooClose = true;
      
      while (tooClose) {
        x = (Math.random() - 0.5) * 100;
        y = (Math.random() - 0.5) * 100;
        z = (Math.random() - 0.5) * 100;
        
        // Don't place stars too close to the camera
        if (z > 2) {
          // Avoid the wormhole center from some viewing angles
          const distToCenter = Math.sqrt(x * x + y * y);
          if (z < -2 && distToCenter < 10) {
            tooClose = true;
          } else {
            tooClose = false;
          }
        } else {
          tooClose = false;
        }
      }
      
      starPositions.push(x, y, z);
    }
    
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
    
    const starsMaterial = new THREE.PointsMaterial({
      size: 0.12,
      color: 0xffffff,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
    
    // Create dust particles that flow into the wormhole
    const dustGeometry = new THREE.BufferGeometry();
    const dustPositions: number[] = [];
    const dustVelocities: number[] = [];
    const dustOpacities: number[] = [];
    
    for (let i = 0; i < 200; i++) {
      // Create dust particles in a disc around the wormhole
      const angle = Math.random() * Math.PI * 2;
      const radius = 5 + Math.random() * 15;
      
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const z = Math.random() * 10 - 20;
      
      dustPositions.push(x, y, z);
      
      // Velocity toward the wormhole center
      const speed = 0.05 + Math.random() * 0.1;
      dustVelocities.push(
        -x / radius * speed,
        -y / radius * speed,
        (z < -5) ? 0.1 : -0.1  // Move toward the wormhole entrance
      );
      
      dustOpacities.push(Math.random() * 0.5 + 0.1);
    }
    
    dustGeometry.setAttribute('position', new THREE.Float32BufferAttribute(dustPositions, 3));
    dustGeometry.setAttribute('velocity', new THREE.Float32BufferAttribute(dustVelocities, 3));
    dustGeometry.setAttribute('opacity', new THREE.Float32BufferAttribute(dustOpacities, 1));
    
    const dustMaterial = new THREE.PointsMaterial({
      size: 0.12,
      color: 0x66bbff,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    
    const dust = new THREE.Points(dustGeometry, dustMaterial);
    scene.add(dust);
    
    // Animation
    let clock = new THREE.Clock();
    
    const animate = function() {
      const elapsedTime = clock.getElapsedTime();
      
      // Update wormhole rotation
      vortexMesh.rotation.z = elapsedTime * 0.1;
      wormholeTexture.offset.y = elapsedTime * 0.05;
      
      // Update rings
      rings.forEach((ring, index) => {
        ring.rotation.z = elapsedTime * ring.userData.rotationSpeed * (index % 2 === 0 ? 1 : -1);
        ring.position.z = ring.userData.initialZ + Math.sin(elapsedTime * 0.2 + index * 0.2) * 0.2;
      });
      
      // Update glow
      glowMaterial.uniforms.time.value = elapsedTime;
      
      // Update dust particles flowing into wormhole
      const dustPositions = dust.geometry.getAttribute('position');
      const dustVelocities = dust.geometry.getAttribute('velocity');
      
      for (let i = 0; i < dustPositions.count; i++) {
        let x = dustPositions.getX(i);
        let y = dustPositions.getY(i);
        let z = dustPositions.getZ(i);
        
        const vx = dustVelocities.getX(i);
        const vy = dustVelocities.getY(i);
        const vz = dustVelocities.getZ(i);
        
        // Apply velocity
        x += vx;
        y += vy;
        z += vz;
        
        // If dust is too close to center or too far, reset it
        const distToCenter = Math.sqrt(x * x + y * y);
        if (distToCenter < 2 || z > 5 || z < -30) {
          const angle = Math.random() * Math.PI * 2;
          const radius = 5 + Math.random() * 15;
          
          x = Math.cos(angle) * radius;
          y = Math.sin(angle) * radius;
          z = -20 - Math.random() * 5;
          
          // Update velocity
          dustVelocities.setX(i, -x / radius * (0.05 + Math.random() * 0.1));
          dustVelocities.setY(i, -y / radius * (0.05 + Math.random() * 0.1));
          dustVelocities.setZ(i, 0.1);
        }
        
        // As particles get closer to the wormhole, increase their speed toward the center
        if (z > -8 && distToCenter > 3) {
          const gravityFactor = 1.01;
          dustVelocities.setX(i, vx * gravityFactor);
          dustVelocities.setY(i, vy * gravityFactor);
        }
        
        dustPositions.setX(i, x);
        dustPositions.setY(i, y);
        dustPositions.setZ(i, z);
      }
      
      dustPositions.needsUpdate = true;
      
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    
    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);
  
  // Create a canvas texture for the wormhole spiral
  function createWormholeTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      return canvas;
    }
    
    // Fill the background
    ctx.fillStyle = 'rgba(0, 0, 0, 0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Create a spiral effect
    const spiralCount = 6;
    const maxRadius = canvas.width / 2;
    
    for (let i = 0; i < 360 * spiralCount; i++) {
      const angle = (i * Math.PI) / 180;
      const radius = (i / (360 * spiralCount)) * maxRadius;
      
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      // Gradually reduce opacity as the spiral goes outward
      const opacity = 1 - (radius / maxRadius) * 0.8;
      
      // Create a gradient of blue-teal colors
      const hue = 190 + (radius / maxRadius) * 20;
      const lightness = 50 - (radius / maxRadius) * 10;
      
      // Draw a small line along the spiral
      ctx.beginPath();
      ctx.arc(x, y, 1 + (radius / maxRadius) * 2, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${hue}, 80%, ${lightness}%, ${opacity})`;
      ctx.fill();
    }
    
    return canvas;
  }
  
  return <div ref={mountRef} className="absolute inset-0 -z-10" />;
};

type EmailLoginFormProps = {
  children?: React.ReactNode;
};

const EmailLoginForm = ({ children }: EmailLoginFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // In a real app, this would authenticate with your backend
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 500);
  };

  return (
    <div className="relative flex items-center justify-center w-full h-screen overflow-hidden bg-black">
      {/* Wurmloch-Animation im Hintergrund */}
      <RealisticWormhole />

      {/* Glassmorphism Card */}
      <div className="relative z-10 w-full max-w-md p-8 mx-4 rounded-xl backdrop-blur-md bg-gray-900/30 border border-gray-700/50 shadow-2xl">
        {/* Logo und Titel */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 mb-4 bg-gray-800/80 rounded-full flex items-center justify-center shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-cyan-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-center text-cyan-100">PYRO SYSTEM</h1>
          <p className="mt-2 text-cyan-300/80 text-center">Bereite deinen Sprung vor</p>
        </div>

        {/* Login Formular oder children */}
        {children || (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-cyan-100">E-Mail</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 bg-gray-800/80 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 text-cyan-100"
                placeholder="deine@email.com"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-cyan-100">Passwort</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 bg-gray-800/80 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 text-cyan-100"
                placeholder="●●●●●●●●"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 bg-gray-800 border-gray-700 rounded focus:ring-cyan-600"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-cyan-100">
                  Angemeldet bleiben
                </label>
              </div>
              
              <a href="#" className="text-sm text-cyan-400 hover:text-cyan-300">
                Passwort vergessen?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="relative w-full py-3 mt-6 text-white bg-gray-800/80 hover:bg-gray-700/80 rounded-lg transition-all duration-200 flex items-center justify-center font-medium text-lg border border-cyan-800/50 shadow-lg shadow-cyan-900/20"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Initiiere Sprung...
                </>
              ) : (
                "Anmelden"
              )}
            </button>
          </form>
        )}

        <div className="mt-8 text-center text-sm text-gray-400">
          <p className="px-6 py-2 rounded-lg bg-gray-800/40 inline-block">
            Noch kein Konto? <a href="/auth/signup" className="text-cyan-400 hover:text-cyan-300">Registrieren</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailLoginForm;