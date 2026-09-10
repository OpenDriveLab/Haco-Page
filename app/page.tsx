'use client';

import Image from 'next/image';
import { useEffect, useState, type CSSProperties } from 'react';

const tasks = ['Insert poker', 'Open book', 'Draw on balloon', 'Unscrew cap', 'Squeeze toothpaste'];

const taskDisplayNames: Record<string, string> = {
  'Insert poker': 'Insert Poker Cards',
  'Open book': 'Open Book',
  'Draw on balloon': 'Draw on Balloon',
  'Unscrew cap': 'Unscrew Cap',
  'Squeeze toothpaste': 'Squeeze Toothpaste',
};

const groupedTasks = [
  { key: 'Insert poker', label: 'Insert Poker Cards', color: 'var(--task-poker)', height: '62%' },
  { key: 'Open book', label: 'Open Book', color: 'var(--task-book)', height: '76%' },
  { key: 'Draw on balloon', label: 'Draw on Balloon', color: 'var(--task-balloon)', height: '55%' },
  { key: 'Unscrew cap', label: 'Unscrew Cap', color: 'var(--task-cap)', height: '68%' },
  { key: 'Squeeze toothpaste', label: 'Squeeze Toothpaste', color: 'var(--task-paste)', height: '60%' },
];

const radarAxes = [
  { label: 'Friction', x: 280, y: 27, anchor: 'middle' as const },
  { label: 'Tangential', x: 475, y: 170, anchor: 'start' as const },
  { label: 'Fragile contact', x: 414, y: 402, anchor: 'middle' as const },
  { label: 'Rotational torque', x: 146, y: 402, anchor: 'middle' as const },
  { label: 'Deformable', x: 85, y: 170, anchor: 'end' as const },
];

const radarSeries = [
  { name: 'GR00T', values: [15, 0, 5, 35, 20], color: '#8097a1' },
  { name: 'GR00T + Tactile', values: [25, 10, 5, 45, 25], color: '#d48149' },
  { name: 'ViTacFormer', values: [0, 5, 0, 10, 5], color: '#5f9466' },
  { name: 'T-Rex', values: [20, 30, 10, 60, 55], color: '#447bb6' },
  { name: 'HACo', values: [90, 85, 70, 95, 75], color: '#367e68' },
];

const radarCenter = { x: 280, y: 220 };
const radarRadius = 160;
const radarPoint = (value: number, index: number) => {
  const angle = (-90 + index * 72) * Math.PI / 180;
  return [
    radarCenter.x + Math.cos(angle) * radarRadius * value,
    radarCenter.y + Math.sin(angle) * radarRadius * value,
  ];
};
const radarPoints = (values: number[]) => values.map((value, index) => radarPoint(value, index).map(coordinate => coordinate.toFixed(1)).join(',')).join(' ');

const outlineGroups = [
  { label: 'Overview', items: [
    { id: 'abstract', label: 'Abstract', number: '01' },
    { id: 'contributions', label: 'Contributions', number: '02' },
  ] },
  { label: 'System', items: [
    { id: 'hardware', label: 'Hardware', number: '03' },
    { id: 'method', label: 'Method', number: '04' },
    { id: 'architecture', label: 'Architecture', sub: true },
    { id: 'force-regulated-demonstrations', label: 'Force-regulated demos', sub: true },
    { id: 'compliant-action-learning', label: 'Compliant action learning', sub: true },
  ] },
  { label: 'Evaluation', items: [
    { id: 'benchmark', label: 'Benchmark', number: '05' },
    { id: 'results', label: 'Experiments', number: '06' },
    { id: 'main-comparison', label: 'Main comparison', sub: true },
    { id: 'perception', label: 'Haptic sensing', sub: true },
    { id: 'compliance', label: 'Compliance learning', sub: true },
    { id: 'integration', label: 'Grounding', sub: true },
    { id: 'wrist-camera', label: 'Wrist cameras', sub: true },
  ] },
  { label: 'Resources', items: [
    { id: 'failures', label: 'Failure cases', number: '07' },
    { id: 'citation', label: 'Citation', number: '08' },
  ] },
];

const outlineIds = outlineGroups.flatMap(group => group.items.map(item => item.id));

const demos = [
  { id: 'poker', button: 'Insert Poker Cards', title: 'Insert Poker Cards · Multi-Contact Friction', videos: ['/videos/benchmark/poker/2.mp4', '/videos/benchmark/poker/3.mp4'], description: 'Begin with two playing cards lying on the black platform. Use the right hand to pick up one card and transfer it to the left hand. Hold the first card upright and steady with the left hand. Then use the right hand to pick up the remaining card, align it with the card held in the left hand, and slide it into the same grip so that both cards are held together. Finish with both cards securely held in the left hand and the right hand released. Do not bend or drop either card.' },
  { id: 'book', button: 'Open Book', title: 'Open Book · Tangential Force', videos: ['/videos/benchmark/book/1.mp4', '/videos/benchmark/book/2.mp4', '/videos/benchmark/book/3.mp4', '/videos/benchmark/book/4.mp4'], description: 'Begin with the closed book lying flat on the black platform. Use the left hand to separate and lift a thick section of pages near the middle of the book, then turn the section across the spine to open the book to an interior spread. Bring in the right hand to help guide the pages and press the book open and flat. Finish with both hands holding the selected pages flat for at least five seconds. Do not open only the front or back cover, move the book off the platform, or crease or tear any page.' },
  { id: 'balloon', button: 'Draw on Balloon', title: 'Draw on Balloon · Fragile Curved-Surface Contact', videos: ['/videos/benchmark/balloon/1.mp4', '/videos/benchmark/balloon/2.mp4', '/videos/benchmark/balloon/3.mp4'], description: 'Begin with the inflated yellow balloon and the black marker on the table. Gently pick up and steady the balloon with the left hand. Use the right hand to pick up the marker and draw a smiley face with two eyes and a curved smile, maintaining light and continuous contact with the balloon. After completing the drawing, set the marker down, lift and orient the balloon so that the finished face is clearly visible to the audience, and present it with the left hand while giving a thumbs-up beside it with the right hand. Do not let the balloon slip, deform excessively, or pop.' },
  { id: 'cap', button: 'Unscrew Cap', title: 'Unscrew Cap · Rotational Torque', videos: ['/videos/benchmark/cap/1.mp4', '/videos/benchmark/cap/2.mp4', '/videos/benchmark/cap/3.mp4'], description: 'Begin with the bottle standing upright on the white tray. Stabilize the bottle with the left hand while using the right hand to grasp the blue cap and turn it counterclockwise until it is completely detached. At the end, place the bottle upright on the white tray and set the cap down on the table beside the tray, then release both objects and move both hands away. Keep the bottle stable throughout, and do not crush, drop, or spill it.' },
  { id: 'paste', button: 'Squeeze Toothpaste', title: 'Squeeze Toothpaste · Deformable-Object Interaction', videos: ['/videos/benchmark/paste/1.mp4', '/videos/benchmark/paste/2.mp4', '/videos/benchmark/paste/3.mp4'], description: 'Begin with the purple toothbrush lying horizontally farther from the robot and the uncapped toothpaste tube positioned below it, closer to the robot. Use the right hand to pick up and hold the toothbrush with its bristles facing the toothpaste tube. Use the left hand to pick up the toothpaste tube, position the nozzle above the toothbrush bristles, and gently squeeze a small amount of toothpaste onto the bristles. Then place the toothpaste tube and toothbrush back on the table, release both objects, and move both hands away. Do not drop either object, damage the toothbrush, or dispense toothpaste anywhere except the bristles.' },
];

const rolloutNumber = (index: number) => String(index + 1);

const experiments = [
  { id: 'main-comparison', title: 'Main comparison', description: 'Five representative dexterous-manipulation approaches evaluated under a shared task protocol.', head: 'Method', rows: ['GR00T','GR00T + Tactile','ViTacFormer','T-Rex','HACo'], ours: 'HACo', caption: 'Table 1. Main comparison across the five real-world force-sensitive tasks.' },
  { id: 'perception', title: 'Haptic Perception Ablation', description: 'Isolate the contributions of fingertip tactile and joint-torque feedback and compare factorized and coupled haptic representations.', head: 'Haptic perception', rows: ['w/o Haptic Feedback','w/o Tactile Feedback','w/o Torque Feedback','w/o Coupled Encoding','HACo'], ours: 'HACo', caption: 'Table 2. Haptic perception ablation across sensing modalities and representation strategies.' },
  { id: 'compliance', title: 'Compliance Learning Ablation', description: 'Starting from nominal teleoperation targets, progressively introduce compliant actions generated by the compliance controller and auxiliary compliance-intent supervision.', head: 'Configuration', rows: ['Nominal Action','Compliant Action','+ Compliance-Intent Supervision'], ours: '+ Compliance-Intent Supervision', caption: 'Table 3. Progressive composition of compliant-action learning and compliance-intent supervision.' },
  { id: 'integration', title: 'Compliance Grounding Ablation', description: 'Hold haptic observations and active compliance actions fixed while varying how the haptic state conditions action generation.', head: 'Compliance grounding', rows: ['Visuo–Haptic Fusion','Action-Suffix Fusion','Compliance Attention','Gated Compliance Attention'], ours: 'Gated Compliance Attention', caption: 'Table 4. Compliance grounding ablation across haptic-state conditioning mechanisms.' },
  { id: 'wrist-camera', title: 'Wrist-Camera Ablation', description: 'A compact observation study that isolates the contribution of wrist-mounted visual coverage while keeping haptic sensing and the HACo policy fixed.', head: 'Camera observation', rows: ['w/o Wrist Cameras','w/ Wrist Cameras'], ours: 'w/ Wrist Cameras', caption: 'Table 5. Wrist-camera observation ablation.' },
];

type TaskResult = { rate: string; count: string };

const hacoTaskResults: Record<string, TaskResult> = {
  'Insert poker': { rate: '90%', count: '18/20' },
  'Open book': { rate: '85%', count: '17/20' },
  'Draw on balloon': { rate: '70%', count: '14/20' },
  'Unscrew cap': { rate: '95%', count: '19/20' },
  'Squeeze toothpaste': { rate: '75%', count: '15/20' },
};

const taskResults: Record<string, Record<string, Record<string, TaskResult>>> = {
  'main-comparison': {
    GR00T: {
      'Insert poker': { rate: '15%', count: '3/20' },
      'Open book': { rate: '0%', count: '0/20' },
      'Draw on balloon': { rate: '5%', count: '1/20' },
      'Unscrew cap': { rate: '35%', count: '7/20' },
      'Squeeze toothpaste': { rate: '20%', count: '4/20' },
    },
    'GR00T + Tactile': {
      'Insert poker': { rate: '25%', count: '5/20' },
      'Open book': { rate: '10%', count: '2/20' },
      'Draw on balloon': { rate: '5%', count: '1/20' },
      'Unscrew cap': { rate: '45%', count: '9/20' },
      'Squeeze toothpaste': { rate: '25%', count: '5/20' },
    },
    ViTacFormer: {
      'Insert poker': { rate: '0%', count: '0/20' },
      'Open book': { rate: '5%', count: '1/20' },
      'Draw on balloon': { rate: '0%', count: '0/20' },
      'Unscrew cap': { rate: '10%', count: '2/20' },
      'Squeeze toothpaste': { rate: '5%', count: '1/20' },
    },
    'T-Rex': {
      'Insert poker': { rate: '20%', count: '4/20' },
      'Open book': { rate: '30%', count: '6/20' },
      'Draw on balloon': { rate: '10%', count: '2/20' },
      'Unscrew cap': { rate: '60%', count: '12/20' },
      'Squeeze toothpaste': { rate: '55%', count: '11/20' },
    },
    HACo: hacoTaskResults,
  },
  perception: {
    'w/o Haptic Feedback': {
      'Insert poker': { rate: '35%', count: '7/20' },
      'Open book': { rate: '10%', count: '2/20' },
      'Draw on balloon': { rate: '15%', count: '3/20' },
      'Unscrew cap': { rate: '40%', count: '8/20' },
      'Squeeze toothpaste': { rate: '35%', count: '7/20' },
    },
    'w/o Torque Feedback': {
      'Insert poker': { rate: '75%', count: '15/20' },
      'Open book': { rate: '80%', count: '16/20' },
      'Draw on balloon': { rate: '55%', count: '11/20' },
      'Unscrew cap': { rate: '70%', count: '14/20' },
      'Squeeze toothpaste': { rate: '60%', count: '12/20' },
    },
    'w/o Tactile Feedback': {
      'Insert poker': { rate: '40%', count: '8/20' },
      'Open book': { rate: '25%', count: '5/20' },
      'Draw on balloon': { rate: '35%', count: '7/20' },
      'Unscrew cap': { rate: '65%', count: '13/20' },
      'Squeeze toothpaste': { rate: '60%', count: '12/20' },
    },
    'w/o Coupled Encoding': {
      'Insert poker': { rate: '85%', count: '17/20' },
      'Open book': { rate: '70%', count: '14/20' },
      'Draw on balloon': { rate: '60%', count: '12/20' },
      'Unscrew cap': { rate: '65%', count: '13/20' },
      'Squeeze toothpaste': { rate: '70%', count: '14/20' },
    },
    HACo: hacoTaskResults,
  },
  compliance: {
    '+ Compliance-Intent Supervision': hacoTaskResults,
    'Nominal Action': {
      'Insert poker': { rate: '60%', count: '12/20' },
      'Open book': { rate: '55%', count: '11/20' },
      'Draw on balloon': { rate: '45%', count: '9/20' },
      'Unscrew cap': { rate: '70%', count: '14/20' },
      'Squeeze toothpaste': { rate: '65%', count: '13/20' },
    },
    'Compliant Action': {
      'Insert poker': { rate: '75%', count: '15/20' },
      'Open book': { rate: '75%', count: '15/20' },
      'Draw on balloon': { rate: '65%', count: '13/20' },
      'Unscrew cap': { rate: '80%', count: '16/20' },
      'Squeeze toothpaste': { rate: '70%', count: '14/20' },
    },
  },
  integration: {
    'Action-Suffix Fusion': {
      'Insert poker': { rate: '70%', count: '14/20' },
      'Open book': { rate: '45%', count: '9/20' },
      'Draw on balloon': { rate: '30%', count: '6/20' },
      'Unscrew cap': { rate: '55%', count: '11/20' },
      'Squeeze toothpaste': { rate: '35%', count: '7/20' },
    },
    'Visuo–Haptic Fusion': {
      'Insert poker': { rate: '50%', count: '10/20' },
      'Open book': { rate: '30%', count: '6/20' },
      'Draw on balloon': { rate: '35%', count: '7/20' },
      'Unscrew cap': { rate: '50%', count: '10/20' },
      'Squeeze toothpaste': { rate: '40%', count: '8/20' },
    },
    'Compliance Attention': {
      'Insert poker': { rate: '70%', count: '14/20' },
      'Open book': { rate: '75%', count: '15/20' },
      'Draw on balloon': { rate: '55%', count: '11/20' },
      'Unscrew cap': { rate: '80%', count: '16/20' },
      'Squeeze toothpaste': { rate: '50%', count: '10/20' },
    },
    'Gated Compliance Attention': hacoTaskResults,
  },
  'wrist-camera': {
    'w/o Wrist Cameras': {
      'Insert poker': { rate: '65%', count: '13/20' },
      'Open book': { rate: '75%', count: '15/20' },
      'Draw on balloon': { rate: '70%', count: '14/20' },
      'Unscrew cap': { rate: '90%', count: '18/20' },
      'Squeeze toothpaste': { rate: '80%', count: '16/20' },
    },
    'w/ Wrist Cameras': hacoTaskResults,
  },
};

const complianceComponents: Record<string, { activeCompliance: boolean; cis: boolean }> = {
  'Nominal Action': { activeCompliance: false, cis: false },
  'Compliant Action': { activeCompliance: true, cis: false },
  '+ Compliance-Intent Supervision': { activeCompliance: true, cis: true },
};

const failures = [
  { type: 'Failure F1 · Open Book', title: 'Insufficient Tangential Separation', video: '/videos/failures/open-book.mp4', description: 'Because the thumb fails to enter the middle of the page stack, it cannot establish enough tangential traction to separate the target section. The pages therefore move together instead of opening at the intended location.' },
  { type: 'Failure F2 · Draw on Balloon', title: 'Missed Contact Onset', video: '/videos/failures/draw-on-balloon.mp4', description: 'The balloon slips out of the left hand during drawing. This occurs because the right hand does not recognize that the marker has already made contact and continues its motion, creating a disturbance that exceeds the left hand’s stabilizing grip.' },
  { type: 'Failure F3 · Insert Poker Cards', title: 'Excessive Pickup Force', video: '/videos/failures/insert-poker.mp4', description: 'Due to excessive normal pressure from two right-hand fingers, inter-card friction rises at pickup, causing two cards to be lifted as one stack rather than separating a single layer.' },
  { type: 'Failure F4 · Squeeze Toothpaste', title: 'Nozzle–Brush Misalignment', video: '/videos/failures/squeeze-toothpaste.mp4', description: 'The toothpaste is dispensed beside the bristles instead of onto them. The reason is inaccurate nozzle–brush alignment: the policy produces the squeezing action without tightly coupling visual placement to haptic evidence of extrusion.' },
];

function ResultChart({ experiment }: { experiment: typeof experiments[number] }) {
  if (experiment.id === 'main-comparison') {
    return <figure className="result-figure"><div className="result-figure__frame"><div className="result-figure__note"><span>Task success rate by method</span><span>20 evaluation trials per task</span></div><div className="grouped-legend">{groupedTasks.map(task => <span key={task.label}><i style={{ '--c': task.color } as CSSProperties}/>{task.label}</span>)}</div><div className="grouped-chart">{experiment.rows.map(row => <div className={`model-group${row === experiment.ours ? ' is-ours' : ''}`} key={row}><div className="model-bars">{groupedTasks.map(task => {
      const taskResult = taskResults[experiment.id]?.[row]?.[task.key];
      const height = taskResult?.rate ?? '0%';
      const displayValue = taskResult?.rate ?? 'TBD';
      return <i className="task-bar" key={task.label} tabIndex={0} role="img" data-value={displayValue} data-tooltip={`${task.label} · ${displayValue}`} aria-label={taskResult ? `${task.label}: ${taskResult.count}, ${taskResult.rate}` : `${task.label}: result pending`} style={{ '--h': height, '--c': task.color } as CSSProperties}/>;
    })}</div><span className="model-label">{row}</span></div>)}</div></div><figcaption>Figure 2. Main comparison across five force-sensitive tasks.</figcaption></figure>;
  }
  const captions: Record<string, string> = {
    perception: 'Figure 3. Haptic perception ablation.',
    compliance: 'Figure 4. Compliant-action learning ablation.',
    integration: 'Figure 5. Compliance grounding ablation.',
    'wrist-camera': 'Figure 6. Wrist-camera ablation.',
  };
  const labels: Record<string, string> = {
    perception: 'Macro mean by perception configuration',
    compliance: 'Macro mean by compliant-action learning stage',
    integration: 'Macro mean by physical feedback integration',
    'wrist-camera': 'Macro mean with and without wrist cameras',
  };
  const resultStatus = 'Complete five-task results';
  return <figure className="result-figure"><div className="result-figure__frame"><div className="result-figure__note"><span>{labels[experiment.id]}</span><span>{resultStatus}</span></div><div className="horizontal-bars">{experiment.rows.map(row => {
    const mean = meanSuccessRate(taskResults[experiment.id]?.[row]);
    return <div className={`horizontal-bar${row === experiment.ours ? ' is-ours' : ''}`} key={row}><span className="horizontal-bar__label">{row}</span><div className="horizontal-bar__track"><i className="horizontal-bar__fill" style={mean === '—' ? undefined : { '--value': mean } as CSSProperties}/></div><span className="horizontal-bar__value">{mean === '—' ? 'TBD' : mean}</span></div>;
  })}</div></div><figcaption>{captions[experiment.id]}</figcaption></figure>;
}

function meanSuccessRate(rowResults?: Record<string, TaskResult>) {
  if (!rowResults || tasks.some(task => !rowResults[task])) return '—';
  const mean = tasks.reduce((sum, task) => sum + Number.parseFloat(rowResults[task].rate), 0) / tasks.length;
  return `${Number.isInteger(mean) ? mean.toFixed(0) : mean.toFixed(1)}%`;
}

function MainComparisonRadar() {
  const levels = [0.25, 0.5, 0.75, 1];
  return <figure className="result-figure radar-figure">
    <div className="result-figure__frame radar-figure__frame">
      <div className="result-figure__note"><span>Force-regulation profile</span><span>Normalized progress score</span></div>
      <svg className="radar-chart" viewBox="0 0 560 430" role="img" aria-labelledby="radar-title radar-description" style={{ display: 'block', width: 'min(100%, 620px)', height: 'auto', margin: '0 auto', overflow: 'visible' }}>
        <title id="radar-title">Five-task progress profile for HACo and evaluated baselines</title>
        <desc id="radar-description">A five-axis radar chart comparing normalized progress scores for friction, tangential interaction, fragile contact, rotational torque, and deformable-object manipulation. HACo leads on all five axes.</desc>
        <g className="radar-grid">
          {levels.map(level => <polygon key={level} points={radarPoints(Array(5).fill(level))} fill="rgba(255,255,255,.42)" stroke="rgba(54,73,67,.16)" strokeWidth="1"/>)}
          {radarAxes.map((axis, index) => {
            const [x2, y2] = radarPoint(1, index);
            return <line key={axis.label} x1={radarCenter.x} y1={radarCenter.y} x2={x2} y2={y2} stroke="rgba(54,73,67,.13)" strokeWidth="1"/>;
          })}
          {levels.map(level => <text key={level} x="287" y={radarCenter.y - radarRadius * level + 4} fill="rgba(54,73,67,.46)" fontSize="9">{Math.round(level * 100)}%</text>)}
        </g>
        <g className="radar-series-group">
          {radarSeries.map((series, index) => <polygon
            className={'radar-series' + (series.name === 'HACo' ? ' is-haco' : '')}
            key={series.name}
            points={radarPoints(series.values.map(value => value / 100))}
            style={{ '--radar-color': series.color, '--radar-delay': (index * 70) + 'ms' } as CSSProperties}
            fill={series.color}
            fillOpacity={series.name === 'HACo' ? 0.15 : 0.07}
            stroke={series.color}
            strokeWidth={series.name === 'HACo' ? 4 : 2.2}
            tabIndex={0}
            aria-label={series.name + ': ' + series.values.join(', ') + ' percent across the five benchmark tasks'}
          />)}
        </g>
        <g className="radar-axis-labels" aria-hidden="true" fill="#25302c" fontSize="13" fontWeight="700">
          {radarAxes.map(axis => <text key={axis.label} x={axis.x} y={axis.y} textAnchor={axis.anchor}>{axis.label}</text>)}
        </g>
      </svg>
      <div className="radar-legend" aria-label="Compared methods" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '9px 17px' }}>
        {radarSeries.map(series => <span className={series.name === 'HACo' ? 'is-haco' : ''} key={series.name} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><i style={{ '--radar-color': series.color, display: 'inline-block', width: 18, height: 3, borderRadius: 999, background: series.color } as CSSProperties}/>{series.name}</span>)}
      </div>
      <div className="radar-highlight"><span>HACo mean</span><strong>83%</strong></div>
    </div>
    <figcaption>Task-wise progress profile across five force-sensitive interaction regimes.</figcaption>
  </figure>;
}

function ResultsTable({ experiment }: { experiment: typeof experiments[number] }) {
  const showComplianceComponents = experiment.id === 'compliance';
  return <div className="experiment-group" id={experiment.id}>
    <h3>{experiment.title}</h3>
    <p>{experiment.description}</p>
    <ResultChart experiment={experiment}/>
    {/* {experiment.id === 'main-comparison' && <MainComparisonRadar/>} */}
    <div className="table-wrap"><table className={`result-table${showComplianceComponents ? ' result-table--components' : ''}`}>
      <thead><tr><th>{experiment.head}</th>{showComplianceComponents && <><th className="component-head">Compliant Action</th><th className="component-head component-head--cis">CIS</th></>}{tasks.map(task => <th key={task}>{taskDisplayNames[task]}</th>)}<th>Mean</th></tr></thead>
      <tbody>{experiment.rows.map(row => {
        const rowResults = taskResults[experiment.id]?.[row];
        const components = complianceComponents[row];
        return <tr className={row === experiment.ours ? 'ours' : ''} key={row}><th>{row}</th>{showComplianceComponents && <><td className={`component-cell${components?.activeCompliance ? ' is-enabled' : ''}`}>{components?.activeCompliance ? '✓' : '—'}</td><td className={`component-cell component-cell--cis${components?.cis ? ' is-enabled' : ''}`}>{components?.cis ? '✓' : '—'}</td></>}{tasks.map(task => <td key={task}>{rowResults?.[task]?.count ?? '—'}</td>)}<td>{meanSuccessRate(rowResults)}</td></tr>;
      })}</tbody>
    </table></div>
    <p className="table-caption">{experiment.caption}</p>
  </div>;
}

export default function Home() {
  const [selectedDemo, setSelectedDemo] = useState(demos[0]);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);
  const [activeSection, setActiveSection] = useState('abstract');
  const color = (value: string) => ({ '--c': value } as CSSProperties);

  useEffect(() => {
    const figures = document.querySelectorAll<HTMLElement>('.result-figure');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      figures.forEach(figure => figure.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -7% 0px' });
    figures.forEach(figure => observer.observe(figure));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const updateActiveSection = () => {
      let current = outlineIds[0];
      for (const id of outlineIds) {
        const section = document.getElementById(id);
        if (section && section.getBoundingClientRect().top <= window.innerHeight * 0.34) current = id;
      }
      setActiveSection(current);
    };
    updateActiveSection();
    window.addEventListener('scroll', updateActiveSection, { passive: true });
    window.addEventListener('resize', updateActiveSection);
    return () => {
      window.removeEventListener('scroll', updateActiveSection);
      window.removeEventListener('resize', updateActiveSection);
    };
  }, []);

  return <>
    <main>
      <section className="hero-cover" id="top">
        <video autoPlay muted loop playsInline controls preload="metadata" aria-label="HACo demonstration video"><source src="/videos/hero/HACo_ICRA2027_demo_v22_green_continuous.mp4" type="video/mp4"/></video>
        <a className="scroll-cue" href="#article">Scroll to explore ↓</a>
      </section>

      <section className="article-body" id="article"><span className="legacy-anchor" id="paper" aria-hidden="true"/><div className="article-layout">
        <aside className="article-outline" aria-label="Article outline"><nav>
          {outlineGroups.map(group => <div className="outline-group" key={group.label}>
            <span className="outline-group__label">{group.label}</span>
            <div className="outline-group__links">
              {group.items.map(item => <a
                className={'outline-link' + (item.sub ? ' outline-link--sub' : '') + (activeSection === item.id ? ' is-active' : '')}
                href={'#' + item.id}
                key={item.id}
                aria-current={activeSection === item.id ? 'location' : undefined}
              ><span className="outline-link__index">{item.number ?? '·'}</span><span>{item.label}</span></a>)}
            </div>
          </div>)}
        </nav></aside>

        <article className="article-shell">
          <header className="title-block" id="title"><h1>Learning <span className="title-h">H</span>aptic <span className="title-a">A</span>ctive <span className="title-c">C</span><span className="title-o">o</span>mpliance for Force-Aware Dexterous Manipulation</h1><p className="authors">Naisheng Ye, Yinzhe Zhou, Junkai Zhao, Yuhang Lu<br/>Checheng Yu, Zhenjie Yang, Pengwei Wang, and Hongyang Li</p><div className="article-links"><a className="article-link disabled" href="#" aria-disabled="true" data-url-placeholder="page" onClick={(event) => event.preventDefault()}>☁ Page</a><a className="article-link disabled" href="#" aria-disabled="true" data-url-placeholder="paper" onClick={(event) => event.preventDefault()}>▤ Paper</a><a className="article-link disabled" href="#" aria-disabled="true" data-url-placeholder="code" onClick={(event) => event.preventDefault()}>⌘ Code</a></div></header>

          <section id="abstract">
<h2>Abstract</h2>
<div className="abstract-language" lang="en">
<p>Contact-rich dexterous manipulation requires robots to generate precise motions while actively regulating forces across evolving multi-contact interactions. Haptic observations reveal contact, but learning to act on them also requires supervision that captures the controller reference needed to sustain or adjust that contact. Nominal teleoperation commands can encode excessive loading, whereas observed configurations omit motion constrained by the object.</p>
<p>We introduce <strong>HACo</strong>, a <strong>Haptic Active Compliance</strong> policy that learns force-regulating actions directly from haptic feedback. Compliance-regulated teleoperation converts operator commands into controller-executable compliant actions that preserve motion intent while regulating interaction loads. HACo learns these compliant actions directly, with their command–state discrepancy providing auxiliary compliant-intent supervision. It integrates fingertip tactile and joint-torque feedback as complementary observations of local contact and load transmission through the articulated hand. A <strong>Compliance Grounding Module</strong> grounds action generation in the evolving haptic state through gated compliance attention, enabling closed-loop force regulation without explicit online contact modeling.</p>
<p>We evaluate HACo on a real-world benchmark spanning multi-contact friction, tangential interaction, fragile curved-surface contact, rotational torque, and deformable-object manipulation. Across 20 trials per task, HACo achieves an 83% mean progress score versus 35% for the strongest evaluated baseline. HACo variants without compliant-intent supervision and with nominal action targets achieve 73% and 59%, respectively. These results motivate learning both executable references and their contact-dependent command–state relationship.</p>
</div>
</section>
<section id="contributions">
<h2>Contributions</h2>
<ul>
<li><strong>Complementary haptic perception.</strong> We couple fingertip tactile sensing with joint-torque feedback to represent both local contact and loads transmitted through the articulated hand.</li>
<li><strong>Active compliance learning.</strong> We learn from force-regulated demonstrations by combining controller-executable compliant actions, compliant-intent supervision, and haptic-grounded action generation.</li>
<li><strong>A real-world dexterous force benchmark.</strong> We evaluate force regulation across multi-contact friction, tangential interaction, fragile curved-surface contact, rotational torque, and deformable-object manipulation.</li>
</ul>
</section>
<section id="hardware"><h2>Hardware setup</h2><p>Our platform combines two UR5 arms with Sharpa dexterous hands, wrist-mounted RealSense D405 cameras, and a head-mounted ZED Mini. For teleoperation, MANUS Metagloves Pro capture finger articulation while VIVE Trackers provide wrist poses; the hands also supply fingertip tactile and joint-torque feedback during data collection and execution.</p><figure className="paper-figure"><div className="architecture-frame"><img src="/hardware/fig05-platform.png" width="2400" height="2063" loading="lazy" alt="HACo hardware platform with dual UR5 arms, Sharpa hands, cameras, MANUS gloves, and VIVE trackers"/></div><figcaption>Hardware platform for haptic-aware dexterous manipulation.</figcaption></figure></section>

<section id="method">
<h2>Method</h2>
<p className="method-lead">HACo maps multi-view images, language, robot state, and haptic histories to executable compliant-action chunks. Compliant intent is predicted only as auxiliary supervision.</p>
<div className="method-detail" id="architecture">
<h3>Architecture</h3>
<p>Multi-view images, language, and robot state condition a flow-based action expert. For each finger, HACo fuses fingertip wrench and deformation features with torque signals from the same kinematic chain, then models interactions across digits as structured haptic memory. The Compliance Grounding Module lets action features query this memory through gated cross-attention. The model predicts executable compliant actions together with auxiliary compliant intent; only the compliant actions are sent to the robot.</p>
</div>
<figure className="paper-figure">
<div className="architecture-frame"><img src="/method/haco-architecture.png?v=20260910-fig02" width="2780" height="1036" alt="HACo model architecture: structured haptic perception and gated compliance attention condition a flow-based action expert"/></div>
<figcaption>HACo architecture with haptic-grounded action generation.</figcaption>
</figure>
<div className="method-detail" id="force-regulated-demonstrations">
<h3>Force-regulated demonstrations</h3>
<p>Motion retargeting provides nominal arm and hand references. Cartesian admittance and fingertip force regulation adjust them before execution, preserving task motion while limiting excessive loads. The resulting compliant references are recorded with synchronized visual, state, tactile, and torque observations.</p>
</div>
<figure className="paper-figure">
<div className="architecture-frame"><img src="/method/compliant-teleoperation.png" width="2400" height="2084" loading="lazy" alt="Compliance-regulated teleoperation: retargeting, arm admittance, hand force regulation, and synchronized recording"/></div>
<figcaption>Compliance-regulated teleoperation for force-aware demonstrations.</figcaption>
</figure>
<div className="method-detail" id="compliant-action-learning">
<h3>Compliant action learning</h3>
<p>Observed motion omits commands blocked by contact, while nominal commands can apply excessive force. HACo instead learns the regulated compliant command. Its discrepancy from the observed hand state, <strong>Δq<sup>ci</sup><sub>t</sub> = q<sup>cmp</sup><sub>t</sub> − q<sup>obs</sup><sub>t</sub></strong>, supplies compliant-intent supervision during conditional flow matching and is never added to the executed action.</p>
</div>
<figure className="paper-figure">
<div className="architecture-frame"><img src="/method/compliant-intent.png" width="2400" height="1644" loading="lazy" alt="Nominal, observed, and compliant hand configurations under contact, illustrating compliant intent and the correction to the nominal command"/></div>
<figcaption>Nominal, observed, and compliant hand configurations under contact.</figcaption>
</figure>
          </section>

          <section id="benchmark"><h2>Real-World Force Benchmark</h2><p>The benchmark organizes everyday manipulation by the physical role that determines success. This section is also the primary inference-demo gallery: each task will show an autonomous rollout together with its task-specific success definition.</p>
            <div className="benchmark-taxonomy" aria-label="Benchmark force taxonomy"><div className={selectedDemo.id === 'poker' ? 'active' : ''} aria-current={selectedDemo.id === 'poker' ? 'true' : undefined} style={color('var(--task-poker)')}>FRICTION</div><div className={selectedDemo.id === 'book' ? 'active' : ''} aria-current={selectedDemo.id === 'book' ? 'true' : undefined} style={color('var(--task-book)')}>SHEAR</div><div className={selectedDemo.id === 'balloon' ? 'active' : ''} aria-current={selectedDemo.id === 'balloon' ? 'true' : undefined} style={color('var(--task-balloon)')}>CURVATURE</div><div className={selectedDemo.id === 'cap' ? 'active' : ''} aria-current={selectedDemo.id === 'cap' ? 'true' : undefined} style={color('var(--task-cap)')}>TORQUE</div><div className={selectedDemo.id === 'paste' ? 'active' : ''} aria-current={selectedDemo.id === 'paste' ? 'true' : undefined} style={color('var(--task-paste)')}>DEFORMATION</div></div>
            <div className="demo-gallery"><div className="demo-pills" role="tablist" aria-label="Benchmark tasks">{demos.map(demo => <button className={`demo-pill${demo.id === selectedDemo.id ? ' active' : ''}`} key={demo.id} type="button" onClick={() => { setSelectedDemo(demo); setSelectedVideoIndex(0); }}>{demo.button}</button>)}</div><div className="demo-view"><video key={`${selectedDemo.id}-${selectedVideoIndex}`} autoPlay controls muted loop playsInline preload="metadata" aria-label={`${selectedDemo.button} rollout ${rolloutNumber(selectedVideoIndex)}`}><source src={selectedDemo.videos[selectedVideoIndex]} type="video/mp4"/></video></div><div className="demo-caption"><div className="demo-caption__head"><b>{selectedDemo.title}</b><div className="demo-video-pills" role="tablist" aria-label={`${selectedDemo.button} rollout selection`}>{selectedDemo.videos.map((video, index) => <button className={`demo-video-pill${index === selectedVideoIndex ? ' active' : ''}`} key={video} type="button" aria-selected={index === selectedVideoIndex} onClick={() => setSelectedVideoIndex(index)}>{rolloutNumber(index)}</button>)}</div></div><p>{selectedDemo.description}</p></div></div>
          </section>

          <section id="results"><h2>Experiments</h2>{experiments.map(experiment => <ResultsTable experiment={experiment} key={experiment.id}/>) }</section>

          <section id="failures"><h2>Failure Cases &amp; Limitations</h2><p>Representative unsuccessful rollouts reveal distinct limitations in contact-rich manipulation.</p><div className="failure-grid">{failures.map(failure => <article className="failure-card" key={failure.type}><video controls muted loop playsInline preload="metadata" aria-label={`${failure.title} failure rollout`}><source src={failure.video} type="video/mp4"/></video><div className="failure-card__copy"><span className="failure-card__type">{failure.type}</span><h3>{failure.title}</h3><p>{failure.description}</p></div></article>)}</div></section>

          <section id="citation"><h2>Citation</h2><p>Citation details will be updated with the public preprint.</p><pre className="bibtex">{`@misc{haco2027,\n  title  = {Learning Haptic Active Compliance for\n            Force-Aware Dexterous Manipulation},\n  author = {Anonymous Authors},\n  year   = {2027}\n}`}</pre></section>
        </article>
      </div></section>
    </main>
    <footer className="footer"><span>HACo · PROJECT PAGE</span><a href="#top">Back to top ↑</a></footer>
  </>;
}
