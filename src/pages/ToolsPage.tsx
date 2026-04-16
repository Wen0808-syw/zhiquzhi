import { useState } from 'react';
import {
  Upload,
  Grid,
  Calculator,
  Package,
  Settings,
  Download,
  Palette,
  Plus,
  Minus,
  Ruler,
  Scissors,
  RotateCcw,
  ChevronDown,
  Check,
  Info,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { mockYarns } from '@/data/mock';
import type { YarnInfo, ChartSymbol } from '@/types';

// ============== Constants ==============

type TabKey = 'chart' | 'calculator' | 'material';

const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: 'chart', label: '图解智能处理', icon: <Grid className="w-4 h-4" /> },
  { key: 'calculator', label: '量化计算器', icon: <Calculator className="w-4 h-4" /> },
  { key: 'material', label: '材料管家', icon: <Package className="w-4 h-4" /> },
];

const CHART_ROWS = 10;
const CHART_COLS = 20;

const stitchSymbols: (ChartSymbol & { bg: string })[] = [
  { symbol: '■', name: '下针(K)', description: '平针下针', color: '#F97316', bg: 'bg-orange-100' },
  { symbol: '□', name: '上针(P)', description: '平针上针', color: '#3B82F6', bg: 'bg-blue-100' },
  { symbol: '◆', name: '加针(INC)', description: '增加一针', color: '#22C55E', bg: 'bg-green-100' },
  { symbol: '◇', name: '减针(DEC)', description: '并针减针', color: '#EF4444', bg: 'bg-red-100' },
  { symbol: '○', name: '空针(YO)', description: '绕线加针', color: '#A855F7', bg: 'bg-purple-100' },
  { symbol: '△', name: '滑针(SL)', description: '滑过一针', color: '#EAB308', bg: 'bg-yellow-100' },
];

const yarnColors = [
  '#FFF8F0', '#FFB7C5', '#C5A3FF', '#A8D5BA',
  '#87CEEB', '#FFE599', '#F9A8D4', '#D4A373',
  '#264653', '#2A9D8F', '#E76F51', '#F4A261',
];

const needleSizes = ['2mm', '2.5mm', '3mm', '3.5mm', '4mm', '4.5mm', '5mm', '5.5mm', '6mm', '7mm', '8mm'];

const mockProjects = [
  { id: 'proj1', name: '春日花园开衫', difficulty: 3 },
  { id: 'proj2', name: '小熊玩偶', difficulty: 4 },
  { id: 'proj3', name: '费尔岛提花围巾', difficulty: 4 },
  { id: 'proj4', name: '贝雷帽', difficulty: 2 },
  { id: 'proj5', name: '蕾丝夏衫', difficulty: 5 },
];

const sizeChart = [
  { size: 'XS', chest: 80, waist: 60, hip: 86 },
  { size: 'S', chest: 84, waist: 64, hip: 90 },
  { size: 'M', chest: 88, waist: 68, hip: 94 },
  { size: 'L', chest: 92, waist: 72, hip: 98 },
  { size: 'XL', chest: 96, waist: 76, hip: 102 },
];

// ============== Sub-components ==============

// --- Body Silhouette SVG ---
function BodySilhouette({ chest, waist, hip }: { chest: number; waist: number; hip: number }) {
  const scale = 1.8;
  const chestW = chest / 10 * scale;
  const waistW = waist / 10 * scale;
  const hipW = hip / 10 * scale;
  const cx = 100;

  return (
    <svg viewBox="0 0 200 280" className="w-full max-w-[180px] mx-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Head */}
      <circle cx={cx} cy={30} r={20} fill="#FDBA74" opacity={0.6} />
      {/* Neck */}
      <rect x={cx - 6} y={50} width={12} height={20} fill="#FDBA74" opacity={0.6} rx={3} />
      {/* Shoulders + Chest */}
      <path
        d={`M${cx - chestW / 2} 70 Q${cx - chestW / 2 - 8} 70 ${cx - chestW / 2} 80 L${cx - chestW / 2} 110 Q${cx - waistW / 2} 125 ${cx - waistW / 2} 130`}
        stroke="#F97316" strokeWidth={2.5} fill="#FFF7ED" opacity={0.7}
      />
      <path
        d={`M${cx + chestW / 2} 70 Q${cx + chestW / 2 + 8} 70 ${cx + chestW / 2} 80 L${cx + chestW / 2} 110 Q${cx + waistW / 2} 125 ${cx + waistW / 2} 130`}
        stroke="#F97316" strokeWidth={2.5} fill="#FFF7ED" opacity={0.7}
      />
      {/* Waist to Hip */}
      <path
        d={`M${cx - waistW / 2} 130 Q${cx - hipW / 2} 160 ${cx - hipW / 2} 170 L${cx - hipW / 2} 210`}
        stroke="#F97316" strokeWidth={2.5} fill="#FFF7ED" opacity={0.7}
      />
      <path
        d={`M${cx + waistW / 2} 130 Q${cx + hipW / 2} 160 ${cx + hipW / 2} 170 L${cx + hipW / 2} 210`}
        stroke="#F97316" strokeWidth={2.5} fill="#FFF7ED" opacity={0.7}
      />
      {/* Arms */}
      <line x1={cx - chestW / 2 - 8} y1={75} x2={cx - chestW / 2 - 20} y2={170} stroke="#F97316" strokeWidth={2} opacity={0.5} />
      <line x1={cx + chestW / 2 + 8} y1={75} x2={cx + chestW / 2 + 20} y2={170} stroke="#F97316" strokeWidth={2} opacity={0.5} />
      {/* Measurement lines */}
      <line x1={cx - chestW / 2 - 25} y1={90} x2={cx + chestW / 2 + 25} y2={90} stroke="#3B82F6" strokeWidth={1} strokeDasharray="4 2" />
      <line x1={cx - waistW / 2 - 25} y1={130} x2={cx + waistW / 2 + 25} y2={130} stroke="#22C55E" strokeWidth={1} strokeDasharray="4 2" />
      <line x1={cx - hipW / 2 - 25} y1={170} x2={cx + hipW / 2 + 25} y2={170} stroke="#A855F7" strokeWidth={1} strokeDasharray="4 2" />
      {/* Labels */}
      <text x={cx + chestW / 2 + 30} y={93} fontSize={9} fill="#3B82F6" fontWeight="bold">{chest}cm</text>
      <text x={cx + waistW / 2 + 30} y={133} fontSize={9} fill="#22C55E" fontWeight="bold">{waist}cm</text>
      <text x={cx + hipW / 2 + 30} y={173} fontSize={9} fill="#A855F7" fontWeight="bold">{hip}cm</text>
      {/* Legs */}
      <line x1={cx - 12} y1={210} x2={cx - 15} y2={270} stroke="#FDBA74" strokeWidth={2.5} opacity={0.5} strokeLinecap="round" />
      <line x1={cx + 12} y1={210} x2={cx + 15} y2={270} stroke="#FDBA74" strokeWidth={2.5} opacity={0.5} strokeLinecap="round" />
    </svg>
  );
}

// ============== Tab 1: Pattern Chart Processor ==============
function PatternChartProcessor() {
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [isRecognized, setIsRecognized] = useState(false);
  const [activeSymbol, setActiveSymbol] = useState(0);
  const [activeColor, setActiveColor] = useState('#FFB7C5');
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [chartGrid, setChartGrid] = useState<(number | null)[][]>(
    Array.from({ length: CHART_ROWS }, () => Array(CHART_COLS).fill(null))
  );
  const [saved, setSaved] = useState(false);
  const [exported, setExported] = useState(false);

  const handleCellClick = (row: number, col: number) => {
    setSelectedCell({ row, col });
    setChartGrid(prev => {
      const next = prev.map(r => [...r]);
      next[row][col] = next[row][col] === activeSymbol ? null : activeSymbol;
      return next;
    });
  };

  const handleAIRecognize = () => {
    setIsRecognizing(true);
    setTimeout(() => {
      const sampleGrid: (number | null)[][] = Array.from({ length: CHART_ROWS }, (_, r) =>
        Array.from({ length: CHART_COLS }, (_, c) => {
          if (r === 0 || r === CHART_ROWS - 1) return 0; // K stitch border
          if (c === 0 || c === CHART_COLS - 1) return 1; // P stitch border
          if (r % 3 === 1 && c % 4 === 2) return 2; // INC
          if (r % 3 === 1 && c % 4 === 3) return 3; // DEC
          if (r % 5 === 2 && c % 6 === 3) return 4; // YO
          return Math.random() > 0.7 ? Math.floor(Math.random() * 4) : null;
        })
      );
      setChartGrid(sampleGrid);
      setIsRecognizing(false);
      setIsRecognized(true);
    }, 2000);
  };

  const handleReset = () => {
    setChartGrid(Array.from({ length: CHART_ROWS }, () => Array(CHART_COLS).fill(null)));
    setIsRecognized(false);
    setSelectedCell(null);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleExport = () => {
    setExported(true);
    setTimeout(() => setExported(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* AI Recognition Section */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-orange-500" />
              AI 智能图解识别
            </h3>
            <p className="text-sm text-gray-500 mt-1">上传编织图解照片，AI 自动识别针法符号并生成可编辑图解</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleAIRecognize}
              disabled={isRecognizing}
              className={cn(
                'flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all',
                isRecognizing
                  ? 'bg-orange-200 text-orange-400 cursor-wait'
                  : 'bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-200 hover:shadow-orange-300'
              )}
            >
              {isRecognizing ? (
                <>
                  <div className="w-4 h-4 border-2 border-orange-300 border-t-white rounded-full animate-spin" />
                  识别中...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  AI识别
                </>
              )}
            </button>
            <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm bg-white border border-orange-200 text-orange-600 hover:bg-orange-50 cursor-pointer transition-all">
              <Upload className="w-4 h-4" />
              上传图片
              <input type="file" className="hidden" accept="image/*" />
            </label>
          </div>
        </div>
      </div>

      {/* Chart Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
        {/* Grid */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50/50">
            <span className="text-sm font-medium text-gray-700">编辑区域</span>
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span>{CHART_ROWS} 行 × {CHART_COLS} 列</span>
              {selectedCell && (
                <span className="text-orange-500 font-medium">
                  行 {selectedCell.row + 1} / 列 {selectedCell.col + 1}
                </span>
              )}
            </div>
          </div>
          <div className="p-4 overflow-x-auto">
            {/* Row numbers */}
            <div className="flex gap-0">
              <div className="flex flex-col w-8 shrink-0">
                <div className="h-6" /> {/* spacer for col numbers */}
                {Array.from({ length: CHART_ROWS }, (_, i) => (
                  <div key={i} className="h-8 flex items-center justify-center text-[10px] text-gray-400 font-mono">
                    {CHART_ROWS - i}
                  </div>
                ))}
              </div>
              {/* Grid */}
              <div className="flex flex-col flex-1">
                {/* Col numbers */}
                <div className="flex h-6">
                  {Array.from({ length: CHART_COLS }, (_, i) => (
                    <div key={i} className="w-8 flex items-center justify-center text-[10px] text-gray-400 font-mono">
                      {i + 1}
                    </div>
                  ))}
                </div>
                {/* Cells */}
                {chartGrid.map((row, ri) => (
                  <div key={ri} className="flex">
                    {row.map((cell, ci) => {
                      const symbol = cell !== null ? stitchSymbols[cell] : null;
                      return (
                        <button
                          key={ci}
                          onClick={() => handleCellClick(ri, ci)}
                          className={cn(
                            'w-8 h-8 flex items-center justify-center text-sm border transition-all duration-150',
                            selectedCell?.row === ri && selectedCell?.col === ci
                              ? 'ring-2 ring-orange-400 ring-offset-1 z-10'
                              : '',
                            symbol
                              ? cn('font-bold', symbol.bg)
                              : 'bg-white border-gray-200 hover:bg-orange-50 hover:border-orange-200'
                          )}
                          style={symbol ? { color: symbol.color } : undefined}
                        >
                          {symbol ? symbol.symbol : ''}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Bottom toolbar */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50/50">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              重置
            </button>
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className={cn(
                  'flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium transition-all',
                  saved
                    ? 'bg-green-100 text-green-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
              >
                {saved ? <Check className="w-3.5 h-3.5" /> : <Settings className="w-3.5 h-3.5" />}
                {saved ? '已保存' : '保存'}
              </button>
              <button
                onClick={handleExport}
                className={cn(
                  'flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium transition-all',
                  exported
                    ? 'bg-green-100 text-green-600'
                    : 'bg-orange-500 text-white hover:bg-orange-600'
                )}
              >
                {exported ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
                {exported ? '已导出' : '导出'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel: Symbols + Colors */}
        <div className="space-y-4">
          {/* Stitch Symbols */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Scissors className="w-4 h-4 text-orange-500" />
              针法符号
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {stitchSymbols.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setActiveSymbol(i)}
                  className={cn(
                    'flex items-center gap-2 p-2.5 rounded-xl text-xs transition-all border',
                    activeSymbol === i
                      ? 'border-orange-300 bg-orange-50 shadow-sm'
                      : 'border-gray-100 hover:bg-gray-50'
                  )}
                >
                  <span
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-base font-bold shrink-0"
                    style={{ color: s.color, backgroundColor: s.color + '18' }}
                  >
                    {s.symbol}
                  </span>
                  <div className="text-left">
                    <div className="font-medium text-gray-800 leading-tight">{s.name}</div>
                    <div className="text-[10px] text-gray-400 mt-0.5">{s.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Color Picker */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Palette className="w-4 h-4 text-orange-500" />
              线材颜色
            </h4>
            <div className="grid grid-cols-6 gap-2">
              {yarnColors.map((c, i) => (
                <button
                  key={i}
                  onClick={() => setActiveColor(c)}
                  className={cn(
                    'w-9 h-9 rounded-xl border-2 transition-all shadow-sm',
                    activeColor === c
                      ? 'border-orange-400 scale-110 shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2">
              <div className="w-5 h-5 rounded-md border" style={{ backgroundColor: activeColor }} />
              <span className="text-xs text-gray-500 font-mono">{activeColor}</span>
            </div>
          </div>

          {/* Row Counter */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Ruler className="w-4 h-4 text-orange-500" />
              行数计数器
            </h4>
            {selectedCell ? (
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">当前行</span>
                  <span className="font-semibold text-orange-600">第 {selectedCell.row + 1} 行</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">当前列</span>
                  <span className="font-semibold text-orange-600">第 {selectedCell.col + 1} 列</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">针法</span>
                  <span className="font-semibold text-gray-700">
                    {chartGrid[selectedCell.row][selectedCell.col] !== null
                      ? stitchSymbols[chartGrid[selectedCell.row][selectedCell.col]!].name
                      : '空'}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-gray-400 text-center py-2">点击网格单元格查看信息</p>
            )}
          </div>
        </div>
      </div>

      {/* Recognition success toast */}
      {isRecognized && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 animate-pulse">
          <Check className="w-5 h-5 text-green-500" />
          <div>
            <p className="text-sm font-medium text-green-700">图解识别完成！</p>
            <p className="text-xs text-green-600 mt-0.5">已生成示例图解，您可以点击单元格编辑针法符号</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ============== Tab 2: Quantitative Calculator ==============
function QuantitativeCalculator() {
  const [selectedYarn, setSelectedYarn] = useState(mockYarns[0].id);
  const [needleSize, setNeedleSize] = useState('4mm');
  const [rowsPer10cm, setRowsPer10cm] = useState(28);
  const [stitchesPer10cm, setStitchesPer10cm] = useState(22);
  const [chest, setChest] = useState(88);
  const [waist, setWaist] = useState(68);
  const [hip, setHip] = useState(94);
  const [armLength, setArmLength] = useState(56);
  const [bodyLength, setBodyLength] = useState(62);
  const [calculated, setCalculated] = useState(false);
  const [showSizeChart, setShowSizeChart] = useState(false);

  const yarn = mockYarns.find(y => y.id === selectedYarn) || mockYarns[0];

  const handleCalculate = () => {
    setCalculated(true);
  };

  // Computed results
  const chestStitches = Math.round((chest * stitchesPer10cm) / 10);
  const waistStitches = Math.round((waist * stitchesPer10cm) / 10);
  const hipStitches = Math.round((hip * stitchesPer10cm) / 10);
  const bodyRows = Math.round((bodyLength * rowsPer10cm) / 10);
  const sleeveRows = Math.round((armLength * rowsPer10cm) / 10);
  const frontStitches = Math.round(chestStitches / 2) + 4; // +4 for overlap
  const backStitches = chestStitches;
  const sleeveStitches = Math.round(armLength * stitchesPer10cm / 10) * 0.7;
  const totalArea = ((chest * bodyLength * 2 * 0.8) + (armLength * 30 * 2)) / 100;
  const totalYarn = Math.round((totalArea * (stitchesPer10cm * rowsPer10cm / 100)) * 1.15);
  const totalWeight = Math.round((totalYarn / yarn.yardage) * yarn.weight);
  const estimatedTime = Math.round(totalYarn / 80);

  const sizeInputs = [
    { label: '胸围', value: chest, set: setChest, min: 60, max: 140, unit: 'cm' },
    { label: '腰围', value: waist, set: setWaist, min: 50, max: 120, unit: 'cm' },
    { label: '臀围', value: hip, set: setHip, min: 70, max: 130, unit: 'cm' },
    { label: '臂长', value: armLength, set: setArmLength, min: 40, max: 80, unit: 'cm' },
    { label: '衣长', value: bodyLength, set: setBodyLength, min: 40, max: 90, unit: 'cm' },
  ];

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Yarn & Gauge */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
            <Package className="w-4 h-4 text-orange-500" />
            线材与针号
          </h3>

          {/* Yarn selector */}
          <div className="space-y-1.5">
            <label className="text-sm text-gray-600 font-medium">线材选择</label>
            <div className="relative">
              <select
                value={selectedYarn}
                onChange={e => setSelectedYarn(e.target.value)}
                className="w-full appearance-none px-4 py-2.5 pr-10 rounded-xl border border-gray-200 text-sm bg-white hover:border-orange-300 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all outline-none"
              >
                {mockYarns.map(y => (
                  <option key={y.id} value={y.id}>
                    {y.brand} - {y.name} ({y.color})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            {yarn && (
              <div className="flex items-center gap-2 mt-2 p-2 rounded-lg bg-gray-50 text-xs text-gray-500">
                <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: yarn.colorCode }} />
                <span>{yarn.composition} | {yarn.weight}g/团 | {yarn.yardage}m/团</span>
              </div>
            )}
          </div>

          {/* Needle size */}
          <div className="space-y-1.5">
            <label className="text-sm text-gray-600 font-medium">针号</label>
            <div className="relative">
              <select
                value={needleSize}
                onChange={e => setNeedleSize(e.target.value)}
                className="w-full appearance-none px-4 py-2.5 pr-10 rounded-xl border border-gray-200 text-sm bg-white hover:border-orange-300 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all outline-none"
              >
                {needleSizes.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Gauge */}
          <div className="space-y-3">
            <label className="text-sm text-gray-600 font-medium">编织密度</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">行数 / 10cm</label>
                <input
                  type="number"
                  value={rowsPer10cm}
                  onChange={e => setRowsPer10cm(Number(e.target.value))}
                  min={10}
                  max={60}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-center hover:border-orange-300 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">针数 / 10cm</label>
                <input
                  type="number"
                  value={stitchesPer10cm}
                  onChange={e => setStitchesPer10cm(Number(e.target.value))}
                  min={10}
                  max={60}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-center hover:border-orange-300 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Body Measurements + Silhouette */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
            <Ruler className="w-4 h-4 text-orange-500" />
            人体尺寸
          </h3>

          <div className="flex gap-4">
            {/* Silhouette */}
            <div className="shrink-0">
              <BodySilhouette chest={chest} waist={waist} hip={hip} />
            </div>

            {/* Sliders */}
            <div className="flex-1 space-y-2.5">
              {sizeInputs.map(item => (
                <div key={item.label} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-xs text-gray-500 font-medium">{item.label}</label>
                    <span className="text-xs font-semibold text-orange-600">{item.value}{item.unit}</span>
                  </div>
                  <input
                    type="range"
                    min={item.min}
                    max={item.max}
                    value={item.value}
                    onChange={e => item.set(Number(e.target.value))}
                    className="w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer accent-orange-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Calculate Button */}
      <div className="flex justify-center">
        <button
          onClick={handleCalculate}
          className={cn(
            'px-8 py-3 rounded-2xl text-base font-semibold transition-all shadow-lg',
            calculated
              ? 'bg-green-500 text-white shadow-green-200'
              : 'bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 shadow-orange-200 hover:shadow-orange-300 hover:scale-[1.02]'
          )}
        >
          {calculated ? (
            <span className="flex items-center gap-2"><Check className="w-5 h-5" /> 计算完成</span>
          ) : (
            <span className="flex items-center gap-2"><Calculator className="w-5 h-5" /> 开始计算</span>
          )}
        </button>
      </div>

      {/* Results Section */}
      {calculated && (
        <div className="space-y-6 animate-in">
          {/* Stitch Counts */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Grid className="w-4 h-4 text-orange-500" />
              各部位针数估算
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-100">
                <div className="text-sm font-semibold text-orange-700 mb-3">前片</div>
                <div className="space-y-1.5 text-xs text-gray-600">
                  <div className="flex justify-between"><span>起针数</span><span className="font-mono font-semibold">{frontStitches} 针</span></div>
                  <div className="flex justify-between"><span>编织行数</span><span className="font-mono font-semibold">{bodyRows} 行</span></div>
                  <div className="flex justify-between"><span>胸围</span><span className="font-mono">{chest}cm</span></div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                <div className="text-sm font-semibold text-blue-700 mb-3">后片</div>
                <div className="space-y-1.5 text-xs text-gray-600">
                  <div className="flex justify-between"><span>起针数</span><span className="font-mono font-semibold">{backStitches} 针</span></div>
                  <div className="flex justify-between"><span>编织行数</span><span className="font-mono font-semibold">{bodyRows} 行</span></div>
                  <div className="flex justify-between"><span>胸围</span><span className="font-mono">{chest}cm</span></div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                <div className="text-sm font-semibold text-purple-700 mb-3">袖子（×2）</div>
                <div className="space-y-1.5 text-xs text-gray-600">
                  <div className="flex justify-between"><span>起针数</span><span className="font-mono font-semibold">{Math.round(sleeveStitches)} 针</span></div>
                  <div className="flex justify-between"><span>编织行数</span><span className="font-mono font-semibold">{sleeveRows} 行</span></div>
                  <div className="flex justify-between"><span>臂长</span><span className="font-mono">{armLength}cm</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center mx-auto mb-2">
                <Package className="w-5 h-5 text-amber-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{totalWeight}g</div>
              <div className="text-xs text-gray-500 mt-1">预计用线量</div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center mx-auto mb-2">
                <Settings className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{Math.ceil(totalYarn / yarn.yardage)} 团</div>
              <div className="text-xs text-gray-500 mt-1">需要团数</div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center mx-auto mb-2">
                <Sparkles className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">~{estimatedTime}h</div>
              <div className="text-xs text-gray-500 mt-1">预计编织时间</div>
            </div>
          </div>

          {/* Size Comparison Chart */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <button
              onClick={() => setShowSizeChart(!showSizeChart)}
              className="w-full flex items-center justify-between text-base font-semibold text-gray-800"
            >
              <span className="flex items-center gap-2">
                <Ruler className="w-4 h-4 text-orange-500" />
                尺码对照表
              </span>
              <ChevronDown className={cn('w-4 h-4 text-gray-400 transition-transform', showSizeChart && 'rotate-180')} />
            </button>
            {showSizeChart && (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="py-2 px-3 text-left text-gray-500 font-medium text-xs">尺码</th>
                      <th className="py-2 px-3 text-center text-gray-500 font-medium text-xs">胸围</th>
                      <th className="py-2 px-3 text-center text-gray-500 font-medium text-xs">腰围</th>
                      <th className="py-2 px-3 text-center text-gray-500 font-medium text-xs">臀围</th>
                      <th className="py-2 px-3 text-center text-gray-500 font-medium text-xs">匹配</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sizeChart.map(s => {
                      const isClose =
                        Math.abs(s.chest - chest) <= 4 &&
                        Math.abs(s.waist - waist) <= 4 &&
                        Math.abs(s.hip - hip) <= 4;
                      const isBest =
                        Math.abs(s.chest - chest) + Math.abs(s.waist - waist) + Math.abs(s.hip - hip) <= 6;
                      return (
                        <tr
                          key={s.size}
                          className={cn(
                            'border-b border-gray-50 transition-colors',
                            isBest ? 'bg-orange-50' : 'hover:bg-gray-50'
                          )}
                        >
                          <td className="py-2.5 px-3 font-semibold text-gray-700">{s.size}</td>
                          <td className="py-2.5 px-3 text-center text-gray-600">{s.chest}cm</td>
                          <td className="py-2.5 px-3 text-center text-gray-600">{s.waist}cm</td>
                          <td className="py-2.5 px-3 text-center text-gray-600">{s.hip}cm</td>
                          <td className="py-2.5 px-3 text-center">
                            {isClose && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                                <Check className="w-3 h-3" /> 推荐
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ============== Tab 3: Material Manager ==============
function MaterialManager() {
  const [selectedProject, setSelectedProject] = useState(mockProjects[0].id);
  const [selectedYarns, setSelectedYarns] = useState<Record<string, number>>({
    y1: 3,
    y2: 2,
  });
  const [addedToCart, setAddedToCart] = useState(false);

  const toggleYarn = (yarnId: string) => {
    setSelectedYarns(prev => {
      const next = { ...prev };
      if (next[yarnId] !== undefined) {
        delete next[yarnId];
      } else {
        next[yarnId] = 1;
      }
      return next;
    });
    setAddedToCart(false);
  };

  const updateQuantity = (yarnId: string, delta: number) => {
    setSelectedYarns(prev => {
      const curr = prev[yarnId] || 0;
      const next = curr + delta;
      if (next <= 0) {
        const copy = { ...prev };
        delete copy[yarnId];
        return copy;
      }
      return { ...prev, [yarnId]: next };
    });
    setAddedToCart(false);
  };

  const selectedYarnList = mockYarns.filter(y => selectedYarns[y.id] !== undefined);
  const totalWeight = selectedYarnList.reduce((sum, y) => sum + (selectedYarns[y.id] || 0) * y.weight, 0);
  const totalCost = selectedYarnList.reduce((sum, y) => sum + (selectedYarns[y.id] || 0) * y.price, 0);
  const totalBalls = Object.values(selectedYarns).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      {/* Project Selector */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Grid className="w-4 h-4 text-orange-500" />
          选择图解 / 项目
        </h3>
        <div className="relative">
          <select
            value={selectedProject}
            onChange={e => setSelectedProject(e.target.value)}
            className="w-full appearance-none px-4 py-3 pr-10 rounded-xl border border-gray-200 text-sm bg-white hover:border-orange-300 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all outline-none"
          >
            {mockProjects.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} {'⭐'.repeat(p.difficulty)}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Selected Yarns */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Package className="w-4 h-4 text-orange-500" />
          已选线材
        </h3>
        {selectedYarnList.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Package className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p className="text-sm">请从下方表格中选择需要的线材</p>
          </div>
        ) : (
          <div className="space-y-3">
            {selectedYarnList.map(y => (
              <div key={y.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                <div className="w-10 h-10 rounded-lg shrink-0 border" style={{ backgroundColor: y.colorCode }} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-800 truncate">{y.brand} - {y.name}</div>
                  <div className="text-xs text-gray-400">{y.color} | {y.composition} | {y.weight}g/团</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(y.id, -1)}
                    className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:bg-red-50 hover:border-red-200 transition-all"
                  >
                    <Minus className="w-3 h-3 text-gray-500" />
                  </button>
                  <span className="w-8 text-center text-sm font-semibold text-gray-800">
                    {selectedYarns[y.id]}
                  </span>
                  <button
                    onClick={() => updateQuantity(y.id, 1)}
                    className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:bg-green-50 hover:border-green-200 transition-all"
                  >
                    <Plus className="w-3 h-3 text-gray-500" />
                  </button>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-semibold text-orange-600">¥{(selectedYarns[y.id]! * y.price).toFixed(1)}</div>
                  <div className="text-[10px] text-gray-400">¥{y.price}/团</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Totals */}
        {selectedYarnList.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="text-center p-3 rounded-xl bg-orange-50 border border-orange-100">
              <div className="text-lg font-bold text-orange-700">{totalBalls}</div>
              <div className="text-[10px] text-orange-500">总团数</div>
            </div>
            <div className="text-center p-3 rounded-xl bg-blue-50 border border-blue-100">
              <div className="text-lg font-bold text-blue-700">{totalWeight}g</div>
              <div className="text-[10px] text-blue-500">总重量</div>
            </div>
            <div className="text-center p-3 rounded-xl bg-green-50 border border-green-100">
              <div className="text-lg font-bold text-green-700">¥{totalCost.toFixed(1)}</div>
              <div className="text-[10px] text-green-500">预估总价</div>
            </div>
          </div>
        )}
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
            <Info className="w-4 h-4 text-orange-500" />
            线材比价表
          </h3>
          <p className="text-xs text-gray-400 mt-1">点击行选择线材，查看不同品牌的性价比对比</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs text-gray-500">
                <th className="py-3 px-4 text-left font-medium">选择</th>
                <th className="py-3 px-3 text-left font-medium">品牌</th>
                <th className="py-3 px-3 text-left font-medium">名称</th>
                <th className="py-3 px-3 text-left font-medium">颜色</th>
                <th className="py-3 px-3 text-center font-medium">单价</th>
                <th className="py-3 px-3 text-center font-medium">克/团</th>
                <th className="py-3 px-3 text-center font-medium">小计</th>
                <th className="py-3 px-3 text-center font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {mockYarns.map(y => {
                const isSelected = selectedYarns[y.id] !== undefined;
                const qty = selectedYarns[y.id] || 0;
                return (
                  <tr
                    key={y.id}
                    onClick={() => toggleYarn(y.id)}
                    className={cn(
                      'border-b border-gray-50 cursor-pointer transition-colors',
                      isSelected ? 'bg-orange-50' : 'hover:bg-gray-50'
                    )}
                  >
                    <td className="py-3 px-4">
                      <div
                        className={cn(
                          'w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all',
                          isSelected ? 'bg-orange-500 border-orange-500' : 'border-gray-300'
                        )}
                      >
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-gray-700 font-medium">{y.brand}</td>
                    <td className="py-3 px-3 text-gray-600">{y.name}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full border shrink-0" style={{ backgroundColor: y.colorCode }} />
                        <span className="text-gray-600">{y.color}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center font-semibold text-gray-800">¥{y.price}</td>
                    <td className="py-3 px-3 text-center text-gray-500">{y.weight}g</td>
                    <td className="py-3 px-3 text-center font-semibold text-orange-600">
                      {isSelected ? `¥${(qty * y.price).toFixed(1)}` : '-'}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <a
                        href="#"
                        onClick={e => e.stopPropagation()}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-orange-50 text-orange-600 text-xs font-medium hover:bg-orange-100 transition-colors"
                      >
                        购买
                        <Download className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add to Cart */}
      {selectedYarnList.length > 0 && (
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-gray-800">购物车汇总</h3>
              <p className="text-sm text-gray-500 mt-1">
                已选 {totalBalls} 团线材，总重 {totalWeight}g
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-orange-600">¥{totalCost.toFixed(1)}</div>
                <div className="text-xs text-gray-400">预估总费用</div>
              </div>
              <button
                onClick={() => {
                  setAddedToCart(true);
                  setTimeout(() => setAddedToCart(false), 2500);
                }}
                className={cn(
                  'px-6 py-3 rounded-xl font-semibold text-sm transition-all shadow-lg flex items-center gap-2',
                  addedToCart
                    ? 'bg-green-500 text-white shadow-green-200'
                    : 'bg-orange-500 text-white hover:bg-orange-600 shadow-orange-200 hover:shadow-orange-300'
                )}
              >
                {addedToCart ? (
                  <><Check className="w-4 h-4" /> 已添加到购物车</>
                ) : (
                  <><Plus className="w-4 h-4" /> 添加到购物车</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============== Main Page Component ==============
export function ToolsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('chart');

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/50 via-white to-amber-50/30">
      {/* Page Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-200">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">专业编织工具箱</h1>
                <p className="text-sm text-gray-500">智能图解处理 · 精准量化计算 · 材料管理</p>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-1 -mb-px">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-all rounded-t-lg',
                  activeTab === tab.key
                    ? 'border-orange-500 text-orange-600 bg-orange-50/50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                )}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'chart' && <PatternChartProcessor />}
        {activeTab === 'calculator' && <QuantitativeCalculator />}
        {activeTab === 'material' && <MaterialManager />}
      </div>
    </div>
  );
}
