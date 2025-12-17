import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, SoftShadows } from '@react-three/drei';
import CalendarGrid from './CalendarGrid';
import { GridItemData, TasksMap } from '../types';
import * as THREE from 'three';

interface SceneProps {
  items: GridItemData[];
  tasksMap: TasksMap;
  onGridClick: (id: string) => void;
  selectedId: string | null;
}

const Scene: React.FC<SceneProps> = ({ items, tasksMap, onGridClick, selectedId }) => {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 15, 15], fov: 45 }}
      style={{ background: 'linear-gradient(to bottom, #f0f9ff, #dcfce7)' }}
    >
      {/* Fog: Pushed back so it doesn't wash out the immediate grid */}
      <fog attach="fog" args={['#f0f9ff', 2, 75]} />
      
      {/* Lighting: Hemisphere light creates natural outdoor shading without HDRI */}
      <hemisphereLight 
        skyColor="#eff6ff" // Light blue sky
        groundColor="#dcfce7" // Light green ground bounce
        intensity={0.6} 
      />
      
      {/* Main sun light */}
      <directionalLight 
        position={[10, 20, 10]} 
        intensity={1.2} 
        castShadow 
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      
      {/* Subtle fill */}
      <ambientLight intensity={0.2} />
      
      {/* <SoftShadows size={10} samples={16} focus={0.5} /> */}

      {/* Render the actual Grid content */}
      <CalendarGrid 
        items={items} 
        tasksMap={tasksMap} 
        onGridClick={onGridClick} 
        selectedId={selectedId}
      />

      {/* Floor to catch shadows outside the grid */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#dcfce7" />
      </mesh>

      <OrbitControls 
        enablePan={true} 
        enableZoom={true} 
        maxPolarAngle={Math.PI / 2.2} // Don't go below ground
        minPolarAngle={0}
        maxDistance={50}
        dampingFactor={0.05}
      />
    </Canvas>
  );
};

export default Scene;