/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, Suspense, useMemo } from 'react';
import { Canvas, useThree, useFrame, useLoader } from '@react-three/fiber';
import { 
  OrbitControls, 
  PerspectiveCamera, 
  ContactShadows, 
  Html, 
  Environment, 
  Float,
  RoundedBox,
  useTexture,
  MeshReflectorMaterial
} from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RefreshCw, Star, Heart, MousePointer2 } from 'lucide-react';
import { STORAGE_AREAS, INITIAL_ITEMS, GameItem, Category, StorageArea } from './constants';

// --- Types ---
interface ItemState extends GameItem {
  isSorted: boolean;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
}

// --- Realistic Models ---

function FruitBasket({ color }: { color: string }) {
  return (
    <group>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.8, 0.6, 0.4, 32, 1, true]} />
        <meshStandardMaterial color={color} side={THREE.DoubleSide} roughness={0.8} />
      </mesh>
      <mesh position={[0, -0.2, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[0.6, 32]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.8, 0.05, 16, 100]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

function BookShelf() {
  return (
    <group>
      <RoundedBox args={[2, 2.5, 0.8]} radius={0.05} castShadow receiveShadow>
        <meshStandardMaterial color="#78350f" roughness={0.6} />
      </RoundedBox>
      {/* Shelves */}
      <mesh position={[0, 0.4, 0.05]}>
        <boxGeometry args={[1.9, 0.05, 0.7]} />
        <meshStandardMaterial color="#451a03" />
      </mesh>
      <mesh position={[0, -0.4, 0.05]}>
        <boxGeometry args={[1.9, 0.05, 0.7]} />
        <meshStandardMaterial color="#451a03" />
      </mesh>
    </group>
  );
}

function Wardrobe() {
  return (
    <group>
      <RoundedBox args={[2, 3.5, 1.2]} radius={0.1} castShadow receiveShadow>
        <meshStandardMaterial color="#fce7f3" roughness={0.4} />
      </RoundedBox>
      {/* Doors line */}
      <mesh position={[0, 0, 0.61]}>
        <planeGeometry args={[0.02, 3.3]} />
        <meshStandardMaterial color="#f472b6" />
      </mesh>
      {/* Handles */}
      <mesh position={[-0.2, 0, 0.65]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#f472b6" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0.2, 0, 0.65]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#f472b6" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

function ToyBox() {
  return (
    <group>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.8, 1, 1.8]} />
        <meshStandardMaterial color="#c084fc" transparent opacity={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, -0.45, 0]}>
        <boxGeometry args={[1.7, 0.1, 1.7]} />
        <meshStandardMaterial color="#a855f7" />
      </mesh>
    </group>
  );
}

function ShoeRack() {
  return (
    <group>
      <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 0.1, 1]} />
        <meshStandardMaterial color="#a8a29e" />
      </mesh>
      <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 0.1, 1]} />
        <meshStandardMaterial color="#a8a29e" />
      </mesh>
      {[[-0.9, -0.4], [0.9, -0.4], [-0.9, 0.4], [0.9, 0.4]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.4, z]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 1]} />
          <meshStandardMaterial color="#78716c" />
        </mesh>
      ))}
    </group>
  );
}

function Cupboard() {
  return (
    <group>
      <RoundedBox args={[2, 2, 1]} radius={0.05} castShadow receiveShadow>
        <meshStandardMaterial color="#2dd4bf" roughness={0.3} />
      </RoundedBox>
      <mesh position={[0, 0, 0.51]}>
        <planeGeometry args={[1.8, 1.8]} />
        <meshStandardMaterial color="white" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

function Washstand() {
  return (
    <group>
      <RoundedBox args={[1.5, 1, 1]} radius={0.1} castShadow receiveShadow>
        <meshStandardMaterial color="#22d3ee" />
      </RoundedBox>
      <mesh position={[0, 0.51, 0]}>
        <cylinderGeometry args={[0.5, 0.4, 0.2, 32]} />
        <meshStandardMaterial color="white" />
      </mesh>
    </group>
  );
}

// --- Item Models ---

function AppleModel({ color }: { color: string }) {
  return (
    <group>
      <mesh castShadow>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial color={color} roughness={0.1} />
      </mesh>
      {/* Stem */}
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.15]} />
        <meshStandardMaterial color="#451a03" />
      </mesh>
      {/* Eyes */}
      <mesh position={[0.12, 0.05, 0.28]}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshStandardMaterial color="black" />
      </mesh>
      <mesh position={[-0.12, 0.05, 0.28]}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshStandardMaterial color="black" />
      </mesh>
      {/* Blush */}
      <mesh position={[0.2, -0.05, 0.25]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#ff9999" transparent opacity={0.6} />
      </mesh>
      <mesh position={[-0.2, -0.05, 0.25]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#ff9999" transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

function BookModel({ color }: { color: string }) {
  return (
    <group>
      <mesh castShadow>
        <boxGeometry args={[0.4, 0.5, 0.15]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 0, 0.01]} scale={[0.85, 0.9, 1.05]}>
        <boxGeometry args={[0.4, 0.5, 0.15]} />
        <meshStandardMaterial color="white" />
      </mesh>
      {/* Eyes */}
      <mesh position={[0.08, 0.1, 0.08]}>
        <sphereGeometry args={[0.025, 16, 16]} />
        <meshStandardMaterial color="black" />
      </mesh>
      <mesh position={[-0.08, 0.1, 0.08]}>
        <sphereGeometry args={[0.025, 16, 16]} />
        <meshStandardMaterial color="black" />
      </mesh>
    </group>
  );
}

function CupModel({ color }: { color: string }) {
  return (
    <group>
      <mesh castShadow>
        <cylinderGeometry args={[0.25, 0.2, 0.45, 32]} />
        <meshStandardMaterial color={color} roughness={0.1} />
      </mesh>
      <mesh position={[0.25, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.12, 0.04, 16, 32, Math.PI]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Eyes */}
      <mesh position={[0.08, 0.1, 0.22]}>
        <sphereGeometry args={[0.025, 16, 16]} />
        <meshStandardMaterial color="black" />
      </mesh>
      <mesh position={[-0.08, 0.1, 0.22]}>
        <sphereGeometry args={[0.025, 16, 16]} />
        <meshStandardMaterial color="black" />
      </mesh>
    </group>
  );
}

function ShoeModel({ color }: { color: string }) {
  return (
    <group rotation={[0, Math.PI / 2, 0]}>
      <RoundedBox args={[0.6, 0.25, 0.3]} radius={0.08} castShadow>
        <meshStandardMaterial color={color} />
      </RoundedBox>
      <mesh position={[0.15, 0.15, 0]}>
        <RoundedBox args={[0.3, 0.25, 0.25]} radius={0.05} />
        <meshStandardMaterial color="white" />
      </mesh>
      {/* Eyes */}
      <mesh position={[0.35, 0.05, 0.08]}>
        <sphereGeometry args={[0.025, 16, 16]} />
        <meshStandardMaterial color="black" />
      </mesh>
      <mesh position={[0.35, 0.05, -0.08]}>
        <sphereGeometry args={[0.025, 16, 16]} />
        <meshStandardMaterial color="black" />
      </mesh>
    </group>
  );
}

function ShirtModel({ color }: { color: string }) {
  return (
    <group>
      <mesh castShadow>
        <boxGeometry args={[0.6, 0.7, 0.15]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Sleeves */}
      <mesh position={[-0.35, 0.2, 0]} rotation={[0, 0, 0.6]}>
        <boxGeometry args={[0.3, 0.2, 0.15]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0.35, 0.2, 0]} rotation={[0, 0, -0.6]}>
        <boxGeometry args={[0.3, 0.2, 0.15]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Eyes */}
      <mesh position={[0.1, 0.1, 0.08]}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshStandardMaterial color="black" />
      </mesh>
      <mesh position={[-0.1, 0.1, 0.08]}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshStandardMaterial color="black" />
      </mesh>
    </group>
  );
}

function ToyPlaneModel({ color }: { color: string }) {
  return (
    <group>
      <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.8, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 0.05, 0.25]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 0.15, -0.3]}>
        <boxGeometry args={[0.1, 0.25, 0.15]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Eyes */}
      <mesh position={[0.06, 0.05, 0.35]}>
        <sphereGeometry args={[0.025, 16, 16]} />
        <meshStandardMaterial color="black" />
      </mesh>
      <mesh position={[-0.06, 0.05, 0.35]}>
        <sphereGeometry args={[0.025, 16, 16]} />
        <meshStandardMaterial color="black" />
      </mesh>
    </group>
  );
}

// --- Scene Components ---

function StorageZone({ area, onDrop }: { area: StorageArea; onDrop: (itemId: string) => void }) {
  return (
    <group position={area.position}>
      {/* Stylized Mat/Zone like Match Food */}
      <mesh receiveShadow position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.2, 2.2]} />
        <meshStandardMaterial color={area.threeColor} transparent opacity={0.2} />
      </mesh>
      <mesh receiveShadow position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.4, 2.4]} />
        <meshStandardMaterial color="white" transparent opacity={0.5} />
      </mesh>

      {/* Simplified Model representation on the mat */}
      <group position={[0, 0.3, 0]} scale={0.9}>
        {area.id === 'fruit' && <AppleModel color={area.threeColor} />}
        {area.id === 'book' && <BookModel color={area.threeColor} />}
        {area.id === 'clothing' && <ShirtModel color={area.threeColor} />}
        {area.id === 'toy' && <ToyPlaneModel color={area.threeColor} />}
        {area.id === 'shoe' && <ShoeModel color={area.threeColor} />}
        {area.id === 'cup' && <CupModel color={area.threeColor} />}
        {area.id === 'dish' && <mesh castShadow><cylinderGeometry args={[0.4, 0.4, 0.05, 32]} /><meshStandardMaterial color={area.threeColor} /></mesh>}
        {area.id === 'snack' && <mesh castShadow><boxGeometry args={[0.5, 0.3, 0.5]} /><meshStandardMaterial color={area.threeColor} /></mesh>}
        {area.id === 'toiletries' && <mesh castShadow><cylinderGeometry args={[0.1, 0.1, 0.6, 16]} /><meshStandardMaterial color={area.threeColor} /></mesh>}
      </group>
      
      {/* Label */}
      <Html position={[0, 1.5, 0]} center distanceFactor={10}>
        <div className="bg-white/95 px-4 py-1.5 rounded-full border-2 border-amber-400 shadow-lg whitespace-nowrap transform hover:scale-110 transition-transform">
          <span className="text-xl font-black text-amber-900 tracking-tight">{area.label}</span>
        </div>
      </Html>
    </group>
  );
}

function DraggableItem({ 
  item, 
  onSorted 
}: { 
  item: ItemState; 
  onSorted: (itemId: string, category: Category) => void 
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [pos, setPos] = useState<[number, number, number]>(item.position);
  const { camera } = useThree();
  const meshRef = useRef<THREE.Group>(null);

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    setIsDragging(true);
    (document.body.style as any).cursor = 'grabbing';
  };

  const handlePointerUp = (e: any) => {
    e.stopPropagation();
    setIsDragging(false);
    (document.body.style as any).cursor = 'auto';

    const targetZonePos = STORAGE_AREAS.find(a => a.id === item.category)?.position;
    if (targetZonePos) {
      const dist = new THREE.Vector3(...pos).distanceTo(new THREE.Vector3(...targetZonePos));
      if (dist < 2.0) {
        onSorted(item.id, item.category);
      } else {
        // Snap back to floor height - ensure it's exactly on the floor
        setPos([pos[0], 0.3, pos[2]]);
      }
    }
  };

  const handlePointerMove = (e: any) => {
    if (!isDragging) return;
    // Plane is at y=0.3 to match item center height
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.3);
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(
      (e.clientX / window.innerWidth) * 2 - 1,
      -(e.clientY / window.innerHeight) * 2 + 1
    );
    raycaster.setFromCamera(mouse, camera);
    const intersectPoint = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, intersectPoint);
    if (intersectPoint) {
      setPos([intersectPoint.x, 0.3, intersectPoint.z]);
    }
  };

  if (item.isSorted) return null;

  return (
    <group 
      ref={meshRef}
      position={pos} 
      rotation={item.rotation}
      scale={item.scale}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
    >
      {item.category === 'fruit' && <AppleModel color={item.threeColor} />}
      {item.category === 'book' && <BookModel color={item.threeColor} />}
      {item.category === 'cup' && <CupModel color={item.threeColor} />}
      {item.category === 'shoe' && <ShoeModel color={item.threeColor} />}
      {item.category === 'clothing' && <ShirtModel color={item.threeColor} />}
      {item.category === 'toy' && <ToyPlaneModel color={item.threeColor} />}
      
      {/* Fallback for other items (snack, dish, toiletries) */}
      {!['fruit', 'book', 'cup', 'shoe', 'clothing', 'toy'].includes(item.category) && (
        <mesh castShadow>
          {item.shape === 'sphere' && <sphereGeometry args={[0.35, 32, 32]} />}
          {item.shape === 'box' && <boxGeometry args={[0.5, 0.5, 0.5]} />}
          {item.shape === 'cylinder' && <cylinderGeometry args={[0.3, 0.3, 0.6, 32]} />}
          {item.shape === 'torus' && <torusGeometry args={[0.2, 0.1, 16, 100]} />}
          <meshStandardMaterial color={item.threeColor} roughness={0.3} metalness={0.2} />
        </mesh>
      )}
      
      <Html position={[0, 0.6, 0]} center>
        <div className="pointer-events-none">
          <Star size={24} className="fill-yellow-400 text-yellow-400 animate-pulse drop-shadow-md" />
        </div>
      </Html>
    </group>
  );
}

function Room() {
  return (
    <group>
      {/* Diorama Base - A large rounded platform */}
      <RoundedBox args={[24, 1, 20]} radius={0.8} smoothness={4} position={[0, -0.5, 0]} receiveShadow>
        <meshStandardMaterial color="#f8fafc" roughness={1} />
      </RoundedBox>

      {/* Background - Soft gradient-like sky */}
      <mesh position={[0, 0, -20]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#cbd5e1" />
      </mesh>

      {/* Room Corner Accents - Simple stylized walls */}
      <mesh position={[-12.5, 4.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[20, 10, 0.5]} />
        <meshStandardMaterial color="#f1f5f9" />
      </mesh>
      <mesh position={[0, 4.5, -10.5]}>
        <boxGeometry args={[25, 10, 0.5]} />
        <meshStandardMaterial color="#f1f5f9" />
      </mesh>

      {/* Skirting board */}
      <mesh position={[0, 0.1, -10.2]}>
        <boxGeometry args={[25, 0.2, 0.1]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>
      <mesh position={[-12.2, 0.1, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[20, 0.2, 0.1]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>
    </group>
  );
}

// --- Main App ---

export default function App() {
  const [items, setItems] = useState<ItemState[]>([]);
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'hint' | null }>({ text: '', type: null });
  const [showWin, setShowWin] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const initGame = () => {
    const newItems: ItemState[] = INITIAL_ITEMS.map((item) => ({
      ...item,
      isSorted: false,
      position: [
        (Math.random() - 0.5) * 12,
        0.3,
        (Math.random() - 0.5) * 8 + 4,
      ],
      rotation: [
        0,
        Math.random() * Math.PI * 2,
        0,
      ],
      scale: 1.4 + Math.random() * 0.2,
    }));
    setItems(newItems);
    setShowWin(false);
    setFeedback({ text: '', type: null });
  };

  const startGame = () => {
    setGameStarted(true);
    initGame();
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleSorted = (itemId: string, category: Category) => {
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, isSorted: true } : item))
    );
    
    const item = INITIAL_ITEMS.find(i => i.id === itemId);
    const area = STORAGE_AREAS.find(a => a.id === category);
    setFeedback({ 
      text: `太棒啦！${item?.name}要放进${area?.label}哦～`, 
      type: 'success' 
    });

    // Auto-clear feedback after 3 seconds
    setTimeout(() => {
      setFeedback(prev => prev.text.includes(item?.name || '') ? { text: '', type: null } : prev);
    }, 3000);

    const remaining = items.filter(i => i.id === itemId ? false : !i.isSorted).length;
    if (remaining === 0) {
      setTimeout(() => setShowWin(true), 1200);
    }
  };

  const sortedCount = items.filter(i => i.isSorted).length;

  return (
    <div className="game-canvas bg-slate-50 flex flex-col overflow-hidden font-sans">
      {/* 2D UI Overlay */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-10 pointer-events-none">
        <div className="pointer-events-auto">
          <motion.h1 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-4xl font-black text-slate-900 flex items-center gap-3 drop-shadow-sm"
          >
            <Heart className="fill-red-500 text-red-500 w-10 h-10" /> 找一找 3D Match
          </motion.h1>
          <p className="text-slate-500 font-medium mt-1">整理小达人挑战</p>
        </div>
        <div className="flex flex-col items-end gap-4 pointer-events-auto">
          {gameStarted && (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white px-6 py-3 rounded-3xl border-4 border-amber-400 flex items-center gap-3 shadow-lg"
            >
              <Star className="fill-yellow-400 text-yellow-400 w-8 h-8" />
              <span className="text-3xl font-black text-amber-900">{sortedCount} / {INITIAL_ITEMS.length}</span>
            </motion.div>
          )}
          <button 
            onClick={() => { setGameStarted(false); initGame(); }}
            className="p-3 bg-white hover:bg-slate-50 rounded-full border-2 border-slate-200 shadow-md active:scale-90 transition-all"
          >
            <RefreshCw className="text-slate-700 w-8 h-8" />
          </button>
        </div>
      </div>

      {/* 3D Scene */}
      <div className="flex-1 w-full h-full relative">
        <Canvas shadows dpr={[1, 2]}>
          <Suspense fallback={<Html center><div className="text-slate-900 text-2xl font-bold animate-pulse">正在布置房间...</div></Html>}>
            <PerspectiveCamera makeDefault position={[0, 12, 18]} fov={40} />
            <OrbitControls 
              enablePan={false} 
              maxPolarAngle={Math.PI / 2.5} 
              minDistance={10} 
              maxDistance={25}
              makeDefault
            />
            
            <ambientLight intensity={0.7} />
            <directionalLight
              position={[10, 20, 10]}
              intensity={1}
              castShadow
              shadow-mapSize={[1024, 1024]}
            />
            <pointLight position={[-10, 10, -10]} intensity={0.5} />
            
            <Room />
            
            {STORAGE_AREAS.map((area) => (
              <StorageZone 
                key={area.id} 
                area={area} 
                onDrop={() => {}} 
              />
            ))}

            {gameStarted && items.map((item) => (
              <DraggableItem 
                key={item.id} 
                item={item} 
                onSorted={handleSorted} 
              />
            ))}

            <Environment preset="city" />
          </Suspense>
        </Canvas>

        {/* Start Screen Overlay */}
        {!gameStarted && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-sm z-30">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-12 rounded-[50px] shadow-2xl border-[10px] border-amber-400 flex flex-col items-center gap-8 max-w-md w-full"
            >
              <div className="relative">
                <div className="absolute -top-12 -left-12">
                  <Star size={48} className="fill-yellow-400 text-yellow-400 animate-bounce" />
                </div>
                <div className="absolute -top-12 -right-12">
                  <Star size={48} className="fill-yellow-400 text-yellow-400 animate-bounce delay-100" />
                </div>
                <p className="text-5xl font-black text-amber-900 text-center leading-tight">
                  把地上的东西<br/>放回原位吧！
                </p>
              </div>
              
              <button 
                onClick={startGame}
                className="w-full py-6 bg-amber-400 hover:bg-amber-500 text-white text-4xl font-black rounded-3xl shadow-[0_10px_0_rgb(214,158,0)] active:translate-y-[6px] active:shadow-none transition-all"
              >
                开始游戏
              </button>
            </motion.div>
          </div>
        )}
      </div>

      {/* Feedback Message */}
      <AnimatePresence mode="wait">
        {feedback.text && (
          <motion.div
            key={feedback.text}
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className={`fixed bottom-12 left-1/2 -translate-x-1/2 px-10 py-6 rounded-[32px] shadow-xl border-4 z-20 text-center min-w-[400px] ${
              feedback.type === 'success' ? 'bg-emerald-50 border-emerald-400 text-emerald-900' : 
              'bg-amber-50 border-amber-400 text-amber-900'
            }`}
          >
            <p className="text-4xl font-black tracking-tight">{feedback.text}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Win Modal */}
      <AnimatePresence>
        {showWin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-xl p-4"
          >
            <motion.div
              initial={{ scale: 0.5, rotate: -5 }}
              animate={{ scale: 1, rotate: 0 }}
              className="bg-white rounded-[48px] p-12 max-w-lg w-full text-center shadow-[0_30px_100px_rgba(0,0,0,0.5)] border-[12px] border-yellow-400 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400" />
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Trophy size={140} className="text-yellow-500 drop-shadow-xl" />
                  </motion.div>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 -m-8 border-4 border-dashed border-yellow-300/50 rounded-full"
                  />
                </div>
              </div>
              <h2 className="text-6xl font-black text-slate-900 mb-6 tracking-tighter">超级棒！</h2>
              <p className="text-2xl text-slate-600 mb-10 font-medium leading-relaxed">房间变得整整齐齐啦！<br/>你真是个了不起的收纳小天才！</p>
              <button
                onClick={initGame}
                className="w-full py-6 bg-yellow-400 hover:bg-yellow-500 text-amber-950 text-4xl font-black rounded-3xl shadow-[0_10px_0_rgb(214,158,0)] active:translate-y-[6px] active:shadow-none transition-all flex items-center justify-center gap-4"
              >
                <RefreshCw size={40} /> 再玩一次
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
