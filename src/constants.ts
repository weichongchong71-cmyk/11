import { 
  Apple, 
  Book, 
  Coffee, 
  Footprints, 
  Shirt, 
  Gamepad2, 
  Cookie, 
  Utensils, 
  Bath 
} from 'lucide-react';

export type Category = 
  | 'fruit' 
  | 'book' 
  | 'cup' 
  | 'shoe' 
  | 'clothing' 
  | 'toy' 
  | 'snack' 
  | 'dish' 
  | 'toiletries';

export interface GameItem {
  id: string;
  name: string;
  category: Category;
  icon: any;
  color: string;
  threeColor: string;
  shape: 'sphere' | 'box' | 'cylinder' | 'torus';
}

export interface StorageArea {
  id: Category;
  name: string;
  label: string;
  color: string;
  threeColor: string;
  position: [number, number, number];
  icon: any;
}

export const STORAGE_AREAS: StorageArea[] = [
  { id: 'fruit', name: '果篮', label: '果篮', color: 'bg-orange-200 border-orange-400', threeColor: '#fb923c', position: [-4, 0.5, -4], icon: Apple },
  { id: 'book', name: '书架', label: '书架', color: 'bg-blue-200 border-blue-400', threeColor: '#60a5fa', position: [-2, 1, -4.5], icon: Book },
  { id: 'cup', name: '桌子', label: '桌子', color: 'bg-yellow-200 border-yellow-400', threeColor: '#facc15', position: [0, 0.75, -4], icon: Coffee },
  { id: 'shoe', name: '鞋架', label: '鞋架', color: 'bg-stone-200 border-stone-400', threeColor: '#a8a29e', position: [2, 0.5, -4.5], icon: Footprints },
  { id: 'clothing', name: '衣柜', label: '衣柜', color: 'bg-pink-200 border-pink-400', threeColor: '#f472b6', position: [4, 1.5, -4], icon: Shirt },
  { id: 'toy', name: '玩具框', label: '玩具框', color: 'bg-purple-200 border-purple-400', threeColor: '#c084fc', position: [-4, 0.5, 4], icon: Gamepad2 },
  { id: 'snack', name: '零食盒', label: '零食盒', color: 'bg-red-200 border-red-400', threeColor: '#f87171', position: [-2, 0.5, 4.5], icon: Cookie },
  { id: 'dish', name: '碗柜', label: '碗柜', color: 'bg-teal-200 border-teal-400', threeColor: '#2dd4bf', position: [2, 1, 4], icon: Utensils },
  { id: 'toiletries', name: '洗漱台', label: '洗漱台', color: 'bg-cyan-200 border-cyan-400', threeColor: '#22d3ee', position: [4, 1, 4.5], icon: Bath },
];

export const INITIAL_ITEMS: GameItem[] = [
  { id: 'apple', name: '苹果', category: 'fruit', icon: Apple, color: 'text-red-500', threeColor: '#ef4444', shape: 'sphere' },
  { id: 'book1', name: '故事书', category: 'book', icon: Book, color: 'text-blue-600', threeColor: '#2563eb', shape: 'box' },
  { id: 'cup1', name: '水杯', category: 'cup', icon: Coffee, color: 'text-cyan-500', threeColor: '#06b6d4', shape: 'cylinder' },
  { id: 'shoe1', name: '运动鞋', category: 'shoe', icon: Footprints, color: 'text-stone-700', threeColor: '#44403c', shape: 'box' },
  { id: 'shirt1', name: '上衣', category: 'clothing', icon: Shirt, color: 'text-pink-500', threeColor: '#ec4899', shape: 'box' },
  { id: 'toy1', name: '小飞机', category: 'toy', icon: Gamepad2, color: 'text-purple-600', threeColor: '#9333ea', shape: 'torus' },
  { id: 'snack1', name: '饼干', category: 'snack', icon: Cookie, color: 'text-amber-700', threeColor: '#b45309', shape: 'cylinder' },
  { id: 'dish1', name: '盘子', category: 'dish', icon: Utensils, color: 'text-slate-500', threeColor: '#64748b', shape: 'cylinder' },
  { id: 'bath1', name: '牙刷', category: 'toiletries', icon: Bath, color: 'text-blue-400', threeColor: '#60a5fa', shape: 'cylinder' },
];
