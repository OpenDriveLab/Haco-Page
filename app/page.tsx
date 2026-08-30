'use client';

import Image from 'next/image';
import { useEffect, useState, type CSSProperties } from 'react';

const tasks = ['Insert poker', 'Open book', 'Draw on balloon', 'Unscrew cap', 'Squeeze toothpaste'];

const groupedTasks = [
  { label: 'Insert poker', color: 'var(--task-poker)', height: '62%' },
  { label: 'Open book', color: 'var(--task-book)', height: '76%' },
  { label: 'Draw on balloon', color: 'var(--task-balloon)', height: '55%' },
  { label: 'Unscrew cap', color: 'var(--task-cap)', height: '68%' },
  { label: 'Squeeze toothpaste', color: 'var(--task-paste)', height: '60%' },
];

const demos = [
  { id: 'poker', button: 'Insert poker', title: 'Insert poker · multi-contact friction', description: 'Begin with two playing cards lying on the black platform. Use the right hand to pick up one card and transfer it to the left hand. Hold the first card upright and steady with the left hand. Then use the right hand to pick up the remaining card, align it with the card held in the left hand, and slide it into the same grip so that both cards are held together. Finish with both cards securely held in the left hand and the right hand released. Do not bend or drop either card.' },
  { id: 'book', button: 'Open book', title: 'Open book · tangential force', description: 'Begin with the closed book lying flat on the black platform. Use the left hand to separate and lift a thick section of pages near the middle of the book, then turn the section across the spine to open the book to an interior spread. Bring in the right hand to help guide the pages and press the book open and flat. Finish with both hands holding the selected pages flat for at least five seconds. Do not open only the front or back cover, move the book off the platform, or crease or tear any page.' },
  { id: 'balloon', button: 'Draw on balloon', title: 'Draw on balloon · curved fragile contact', description: 'Begin with the inflated yellow balloon and the black marker on the table. Gently pick up and steady the balloon with the left hand. Use the right hand to pick up the marker and draw a smiley face with two eyes and a curved smile, maintaining light and continuous contact with the balloon. After completing the drawing, set the marker down, lift and orient the balloon so that the finished face is clearly visible to the audience, and present it with the left hand while giving a thumbs-up beside it with the right hand. Do not let the balloon slip, deform excessively, or pop.' },
  { id: 'cap', button: 'Unscrew cap', title: 'Unscrew cap · rotational torque', description: 'Begin with the bottle standing upright on the white tray. Stabilize the bottle with the left hand while using the right hand to grasp the blue cap and turn it counterclockwise until it is completely detached. At the end, place the bottle upright on the white tray and set the cap down on the table beside the tray, then release both objects and move both hands away. Keep the bottle stable throughout, and do not crush, drop, or spill it.' },
  { id: 'paste', button: 'Squeeze toothpaste', title: 'Squeeze toothpaste · deformable interaction', description: 'Regulate squeeze force and reason about material deformation to produce a controlled continuous output.' },
];

const experiments = [
  { id: 'main-comparison', title: 'Main comparison', description: 'Seven representative dexterous-manipulation and VLA approaches evaluated under a shared task protocol.', head: 'Method', rows: ['DECO','ViTacFormer','T-Rex','GR00T','CGP','DexTeleop','HACo'], ours: 'HACo', caption: 'Table 1. Main comparison across the five real-world force-sensitive tasks.' },
  { id: 'perception', title: 'Haptic Perception Ablation', description: 'Isolate the contributions of fingertip tactile and joint-torque feedback and compare factorized and coupled haptic representations.', head: 'Haptic perception', rows: ['w/o Haptic Feedback','w/o Torque Feedback','w/o Tactile Feedback','w/o Coupled Encoding','HACo'], ours: 'HACo', caption: 'Table 2. Haptic perception ablation across sensing modalities and representation strategies.' },
  { id: 'compliance', title: 'Active Compliance Ablation', description: 'Hold haptic perception and compliance grounding fixed while varying compliance-intent supervision and the executed action formulation.', head: 'Active compliance', rows: ['w/o Active Compliance','w/o Compliance-Intent Supervision','HACo'], ours: 'HACo', caption: 'Table 3. Active compliance ablation across nominal, direct compliant, and complete action formulations.' },
  { id: 'integration', title: 'Compliance Grounding Ablation', description: 'Hold haptic observations and active compliance actions fixed while varying how the haptic state conditions action generation.', head: 'Compliance grounding', rows: ['Action-Suffix Fusion','Visuo–Haptic Fusion','Compliance Attention','Gated Compliance Attention'], ours: 'Gated Compliance Attention', caption: 'Table 4. Compliance grounding ablation across haptic-state conditioning mechanisms.' },
  { id: 'wrist-camera', title: 'Wrist-Camera Ablation', description: 'A compact observation study that isolates the contribution of wrist-mounted visual coverage while keeping haptic sensing and the HACo policy fixed.', head: 'Camera observation', rows: ['w/o Wrist Cameras','HACo'], ours: 'HACo', caption: 'Table 5. Wrist-camera observation ablation.' },
];

type TaskResult = { rate: string; count: string };

const taskResults: Record<string, Record<string, Record<string, TaskResult>>> = {
  'main-comparison': {
    GR00T: {
      'Insert poker': { rate: '15%', count: '3/20' },
      'Open book': { rate: '20%', count: '4/20' },
      'Draw on balloon': { rate: '5%', count: '1/20' },
      'Unscrew cap': { rate: '60%', count: '12/20' },
    },
    HACo: {
      'Insert poker': { rate: '90%', count: '18/20' },
      'Open book': { rate: '85%', count: '17/20' },
      'Draw on balloon': { rate: '60%', count: '12/20' },
      'Unscrew cap': { rate: '95%', count: '19/20' },
    },
  },
  perception: {
    'w/o Haptic Feedback': { 'Unscrew cap': { rate: '65%', count: '13/20' } },
    'w/o Torque Feedback': { 'Unscrew cap': { rate: '80%', count: '16/20' } },
    'w/o Tactile Feedback': { 'Unscrew cap': { rate: '75%', count: '15/20' } },
    'w/o Coupled Encoding': { 'Unscrew cap': { rate: '90%', count: '18/20' } },
    HACo: { 'Unscrew cap': { rate: '95%', count: '19/20' } },
  },
  compliance: {
    HACo: { 'Unscrew cap': { rate: '95%', count: '19/20' } },
    'w/o Active Compliance': { 'Unscrew cap': { rate: '80%', count: '16/20' } },
    'w/o Compliance-Intent Supervision': { 'Unscrew cap': { rate: '85%', count: '17/20' } },
  },
  integration: {
    'Action-Suffix Fusion': { 'Unscrew cap': { rate: '60%', count: '12/20' } },
    'Visuo–Haptic Fusion': { 'Unscrew cap': { rate: '65%', count: '13/20' } },
    'Compliance Attention': { 'Unscrew cap': { rate: '90%', count: '18/20' } },
    'Gated Compliance Attention': { 'Unscrew cap': { rate: '95%', count: '19/20' } },
  },
  'wrist-camera': {
    'w/o Wrist Cameras': { 'Unscrew cap': { rate: '90%', count: '18/20' } },
    HACo: { 'Unscrew cap': { rate: '95%', count: '19/20' } },
  },
};

const scalingSweeps = [
  {
    id: 'steps',
    title: 'Optimization scaling',
    fixed: '100 demonstrations fixed',
    xLabel: 'Post-training steps',
    labels: ['10k', '20k', '30k', '40k', '50k'],
    points: ['34%', '48%', '61%', '71%', '77%'],
    shape: 'polygon(0 66%, 25% 52%, 50% 39%, 75% 29%, 100% 23%, 100% 100%, 0 100%)',
  },
  {
    id: 'samples',
    title: 'Data scaling',
    fixed: '50k steps fixed',
    xLabel: 'Post-training demonstrations',
    labels: ['10', '30', '50', '70', '100'],
    points: ['27%', '43%', '57%', '69%', '77%'],
    shape: 'polygon(0 73%, 25% 57%, 50% 43%, 75% 31%, 100% 23%, 100% 100%, 0 100%)',
  },
];

const failures = [
  { type: 'Failure F1 · Perception ambiguity', title: 'Aliased multi-contact load', description: 'Different contact configurations can produce similar joint-torque patterns, leading to an incorrect physical-state estimate.' },
  { type: 'Failure F2 · Sensing coverage', title: 'Contact outside tactile regions', description: 'Side or palm contacts may be visible only indirectly through torque and can remain poorly localized.' },
  { type: 'Failure F3 · Control bandwidth', title: 'Late or saturated correction', description: 'Fast impacts or large disturbances can exceed policy update bandwidth or available joint actuation.' },
  { type: 'Failure F4 · Distribution shift', title: 'Unseen physical regime', description: 'Extreme friction, stiffness, deformation, or visually ambiguous task progress can fall outside the learned interaction distribution.' },
];

function ResultChart({ experiment }: { experiment: typeof experiments[number] }) {
  if (experiment.id === 'main-comparison') {
    return <figure className="result-figure"><div className="result-figure__frame"><div className="result-figure__note"><span>Task success rate by method</span><span>Reported task results shown; remaining bars are placeholders</span></div><div className="grouped-legend">{groupedTasks.map(task => <span key={task.label}><i style={{ '--c': task.color } as CSSProperties}/>{task.label}</span>)}</div><div className="grouped-chart">{experiment.rows.map(row => <div className={`model-group${row === experiment.ours ? ' is-ours' : ''}`} key={row}><div className="model-bars">{groupedTasks.map(task => {
      const taskResult = taskResults[experiment.id]?.[row]?.[task.label];
      const height = taskResult?.rate ?? task.height;
      return <i className="task-bar" key={task.label} tabIndex={0} role="img" data-value={height} data-tooltip={`${task.label} · ${height}`} aria-label={taskResult ? `${task.label}: ${taskResult.count}, ${taskResult.rate}` : `${task.label}: ${height} illustrative placeholder`} style={{ '--h': height, '--c': task.color } as CSSProperties}/>;
    })}</div><span className="model-label">{row}</span></div>)}</div></div><figcaption>Figure 2. Planned grouped comparison. Each method contains five task-level success bars; unreported task heights remain layout placeholders and are not experimental results.</figcaption></figure>;
  }
  const captions: Record<string, string> = {
    perception: 'Figure 3. Planned horizontal summary of the perception ablation; the full table retains task-wise results.',
    compliance: 'Figure 4. Planned horizontal summary of active compliance formulations.',
    integration: 'Figure 5. Planned horizontal summary of physical feedback integration mechanisms.',
    'wrist-camera': 'Figure 6. Planned compact summary of the wrist-camera observation ablation.',
  };
  const labels: Record<string, string> = {
    perception: 'Macro mean by perception configuration',
    compliance: 'Macro mean by active compliance formulation',
    integration: 'Macro mean by physical feedback integration',
    'wrist-camera': 'Macro mean with and without wrist cameras',
  };
  return <figure className="result-figure"><div className="result-figure__frame"><div className="result-figure__note"><span>{labels[experiment.id]}</span><span>Awaiting complete five-task means</span></div><div className="horizontal-bars">{experiment.rows.map(row => <div className={`horizontal-bar${row === experiment.ours ? ' is-ours' : ''}`} key={row}><span className="horizontal-bar__label">{row}</span><div className="horizontal-bar__track"><i className="horizontal-bar__fill"/></div><span className="horizontal-bar__value">TBD</span></div>)}</div></div><figcaption>{captions[experiment.id]}</figcaption></figure>;
}

function ResultsTable({ experiment }: { experiment: typeof experiments[number] }) {
  return <div className="experiment-group" id={experiment.id}>
    <h3>{experiment.title}</h3>
    <p>{experiment.description}</p>
    <ResultChart experiment={experiment}/>
    <div className="table-wrap"><table className="result-table">
      <thead><tr><th>{experiment.head}</th>{tasks.map(task => <th key={task}>{task}</th>)}<th>Mean</th></tr></thead>
      <tbody>{experiment.rows.map(row => {
        const rowResults = taskResults[experiment.id]?.[row];
        return <tr className={row === experiment.ours ? 'ours' : ''} key={row}><th>{row}</th>{tasks.map(task => <td key={task}>{rowResults?.[task]?.count ?? '—'}</td>)}<td>—</td></tr>;
      })}</tbody>
    </table></div>
    <p className="table-caption">{experiment.caption}</p>
  </div>;
}

function ScalingPanel({ sweep }: { sweep: typeof scalingSweeps[number] }) {
  const positions = ['0%', '25%', '50%', '75%', '100%'];
  return <section className="scaling-panel" aria-label={`${sweep.title}: ${sweep.fixed}`}>
    <div className="scaling-panel__header"><b>{sweep.title}</b><span>{sweep.fixed}</span></div>
    <div className="scaling-plot">
      <div className="scaling-y-axis"><span>100</span><span>50</span><span>0</span></div>
      <div className="scaling-canvas">
        <div className="scaling-area" style={{ '--shape': sweep.shape } as CSSProperties}/>
        {sweep.points.map((point, index) => <i className="scaling-dot" key={sweep.labels[index]} tabIndex={0} role="img" data-value={point} aria-label={`${sweep.labels[index]}: ${point} illustrative placeholder`} style={{ '--x': positions[index], '--y': point } as CSSProperties}/>) }
      </div>
    </div>
    <div className="scaling-x-labels">{sweep.labels.map(label => <span key={label}>{label}</span>)}</div>
    <div className="scaling-axis-title">{sweep.xLabel}</div>
  </section>;
}

function ScalingStudy() {
  return <div className="experiment-group" id="posttraining-scaling">
    <h3>Post-training compute and data scaling</h3>
    <p>Evaluate one representative task with two controlled sweeps. The left panel fixes 100 post-training demonstrations and varies optimization steps; the right fixes 50k steps and varies the number of demonstrations.</p>
    <figure className="result-figure scaling-figure">
      <div className="result-figure__note"><span>Single-task success rate · shared 0–100% scale</span><span>Representative task: TBD · awaiting results</span></div>
      <div className="scaling-panels">{scalingSweeps.map(sweep => <ScalingPanel sweep={sweep} key={sweep.id}/>)}</div>
      <figcaption>Figure 7. Paired post-training scaling study on one representative task. Add uncertainty intervals once repeated evaluations are available; the trajectories shown here are layout placeholders only.</figcaption>
    </figure>
  </div>;
}

export default function Home() {
  const [selectedDemo, setSelectedDemo] = useState(demos[0]);
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

  return <>
    <main>
      <section className="hero-cover" id="top">
        <video autoPlay muted loop playsInline controls preload="metadata" poster="/placeholders/robot-hand.jpg" aria-label="HACo overview video placeholder"><source src="/placeholders/robot-hand-demo.mp4" type="video/mp4"/></video>
        <span className="hero-placeholder-label">Hero video placeholder · final five-task montage</span>
        <a className="scroll-cue" href="#article">Scroll to explore ↓</a>
      </section>

      <section className="article-body" id="article"><span className="legacy-anchor" id="paper" aria-hidden="true"/><div className="article-layout">
        <aside className="article-outline" aria-label="Article outline"><nav>
          <a href="#title">Title</a><a href="#abstract">Abstract</a><a href="#contributions">Contributions</a><a href="#method">Method</a><a data-level="2" href="#architecture">Architecture</a><a data-level="2" href="#data-flow">Data flow</a><a href="#benchmark">Benchmark</a><a href="#results">Results</a><a data-level="2" href="#main-comparison">Main comparison</a><a data-level="2" href="#perception">Haptic perception</a><a data-level="2" href="#compliance">Active compliance</a><a data-level="2" href="#integration">Compliance grounding</a><a data-level="2" href="#wrist-camera">Wrist cameras</a><a data-level="2" href="#posttraining-scaling">Post-training scaling</a><a href="#failures">Failure cases</a><a href="#citation">Citation</a>
        </nav></aside>

        <article className="article-shell">
          <header className="title-block" id="title"><div className="venue">PROJECT PAGE · ICLR 2027 WORKING DRAFT</div><h1><span className="title-acronym"><span className="title-h">H</span><span className="title-a">A</span><span className="title-c">C</span><span className="title-o">o</span>:</span> <span className="title-h">H</span>aptic <span className="title-a">A</span>ctive <span className="title-c">C</span><span className="title-o">o</span>mpliance for Dexterous Force Control</h1><p className="authors">Anonymous authors</p><p className="affiliation">Under review · Internal experiment planning page</p><div className="article-links"><a className="article-link disabled" href="#" aria-disabled="true" data-url-placeholder="page" onClick={(event) => event.preventDefault()}>☁ Page</a><a className="article-link disabled" href="#" aria-disabled="true" data-url-placeholder="paper" onClick={(event) => event.preventDefault()}>▤ Paper</a><a className="article-link disabled" href="#" aria-disabled="true" data-url-placeholder="code" onClick={(event) => event.preventDefault()}>⌘ Code</a></div></header>

          <section id="abstract"><h2>Abstract</h2>
            <div className="abstract-language" lang="en">
              <h3>English</h3>
              <p>Contact-rich dexterous manipulation requires robots to generate precise motions while actively regulating forces across evolving multi-finger, multi-contact interactions. Yet existing tactile-augmented manipulation policies use tactile as an additional observation or action-refinement signal for kinematic control, leaving the loop from haptic perception to active force control incomplete. Compliance control enables interaction forces to be regulated through motion references, but conventional model-based formulations scale poorly to dexterous hands.</p>
              <p>We introduce <strong>HACo</strong>, a <strong>Haptic Active Compliance</strong> policy for dexterous force control. HACo integrates fingertip tactile and joint-torque feedback as complementary haptic observations of contact and load states. A <strong>Compliance Grounding Module</strong> conditions action generation on the evolving haptic state through gated compliance attention, while <strong>compliance-intent supervision</strong> teaches the policy to represent the force-producing component within each unified joint command. HACo directly generates active compliance actions that jointly encode desired motion and force regulation, enabling closed-loop force control without explicit contact modeling.</p>
              <p>We further introduce a real-world benchmark spanning multi-contact friction, tangential interaction, fragile curved-surface contact, rotational torque, and deformable-object manipulation. Experiments demonstrate that HACo consistently outperforms visuomotor and visuotactile action policies, while ablations validate the contributions of haptic perception, compliance grounding, and active compliance action formulation.</p>
            </div>
            <div className="abstract-language abstract-language--zh" lang="zh-CN">
              <h3>中文</h3>
              <p>接触丰富的灵巧操作要求机器人在不断变化的多指、多点接触中生成准确运动，并主动调节作用力。然而，现有触觉增强操作策略通常将触觉作为运动学控制的额外观测或动作修正信号，使从触觉感知到主动力控制的闭环仍不完整。柔顺控制使机器人能够通过运动参考调节交互作用力，但传统的模型化方法难以扩展到灵巧手。</p>
              <p>我们提出 <strong>HACo</strong>，一种面向灵巧力控制的 <strong>Haptic Active Compliance</strong> 策略。HACo 将指尖触觉与关节力矩反馈整合为接触状态和载荷状态的互补触觉观测。<strong>Compliance Grounding Module</strong> 通过 gated compliance attention，使动作生成持续受当前触觉状态调节；同时，<strong>compliance-intent supervision</strong> 引导策略表征统一关节指令中用于产生作用力的分量。HACo 直接生成统一表达期望运动与力调节的主动柔顺动作，从而实现无需显式接触建模的闭环力控制。</p>
              <p>我们进一步构建了一个真实世界 benchmark，覆盖多接触摩擦、切向作用、高曲率脆弱接触、旋转力矩和可变形物体交互。实验表明，HACo 持续优于视觉运动和视触觉动作策略；消融实验进一步验证了触觉感知、柔顺状态注入和主动柔顺动作设计的作用。</p>
            </div>
          </section>

          <section id="contributions"><h2>Contributions</h2><ul><li><strong>Haptic perception.</strong> HACo integrates fingertip tactile and joint-torque feedback as complementary haptic observations of contact and load states, providing a unified representation of dexterous interaction.</li><li><strong>Active compliance.</strong> HACo combines gated compliance grounding with compliance-intent supervision to condition action generation on evolving haptic feedback and explicitly learn the force-producing component within unified joint commands.</li><li><strong>Real-World Dexterous Force Benchmark.</strong> We introduce five real-world tasks spanning multi-contact friction, tangential interaction, fragile curved-surface contact, rotational torque, and deformable-object manipulation.</li></ul></section>

          <section id="method"><h2>Method</h2>
            <p className="method-lead">HACo extends a GR00T-style vision–language–action policy from motion generation to closed-loop dexterous force control. Instead of treating haptic feedback as a late action correction, HACo grounds the action-denoising process in fused fingertip tactile and joint-torque observations. The policy jointly denoises a compliant action and an intent bias, allowing task-directed motion and contact-responsive regulation to be learned within one action expert.</p>
            <figure className="paper-figure" id="architecture"><div className="architecture-frame"><Image src="/method/haco-architecture.png" alt="HACo architecture with a Qwen3-VLM backbone, repeated action-expert blocks, fingertip tactile and joint-torque fusion, compliance cross-attention, and compliant-action and intent-bias outputs" width={1630} height={1390} priority/></div><figcaption>Figure 1. HACo architecture. A Qwen3-VLM backbone supplies language and visual context to a repeated action expert. Fused fingertip tactile and joint-torque tokens enter every block through compliance cross-attention and a gated residual update. The expert jointly denoises the compliant action and intent bias.</figcaption></figure>

            <div className="method-detail">
              <h3>Multimodal action denoising</h3>
              <p>The text encoder and image encoder are coupled by the Qwen3-VLM backbone, producing language and visual tokens that condition the action expert through separate cross-attention stages. Robot state is embedded by a state encoder, while noisy compliant-action and intent-bias tokens initialize the action suffix. Within each of the <em>N</em> repeated blocks, the suffix first attends to language, exchanges information through action self-attention, and then attends to visual observations. This preserves the pretrained policy&apos;s semantic and visuomotor reasoning while exposing the evolving action representation to physical feedback.</p>
            </div>

            <div className="method-detail">
              <h3>Whole-hand haptic fusion</h3>
              <p>HACo represents dexterous contact with two complementary signals. Fingertip tactile observations encode localized contact geometry, deformation, pressure, and shear, whereas joint torque captures distributed load transmission and the hand&apos;s active effort beyond the tactile sensing surface. Modality-specific MLPs map both histories into token sequences, and a haptic-fusion module couples them into a shared physical context. The resulting tokens describe not only where contact occurs, but also how force propagates through the articulated hand.</p>
            </div>

            <div className="method-detail">
              <h3>Compliance-grounded action expert</h3>
              <p>After language, action, and vision attention, each block queries the fused haptic tokens through compliance cross-attention. A gated MLP converts the attended physical context into a residual update, so haptic feedback modulates action generation only when it is relevant and does so repeatedly throughout denoising rather than at the output alone. The final suffix is decoded into two coupled predictions: the <em>compliant action</em> executed by the robot and an <em>intent bias</em> used as auxiliary supervision to separate task-directed intent from compliance-mediated adjustment. This formulation turns active force regulation into a learned joint-space prediction problem, avoiding explicit contact-parameter estimation and hand Jacobian inversion.</p>
            </div>
            <figure className="paper-figure" id="data-flow"><video className="teaser-video" controls muted loop preload="metadata" poster="/placeholders/robot-hand.jpg" aria-label="HACo model data-flow placeholder"><source src="/placeholders/robot-hand-demo.mp4" type="video/mp4"/></video><figcaption>Video 2. Data-flow placeholder. The final animation will synchronize camera frames, tactile maps, joint-torque traces, haptic tokens, predicted compliance intent, and the resulting hand response through one closed-loop timestep.</figcaption></figure>
          </section>

          <section id="benchmark"><h2>Real-World Force Benchmark</h2><p>The benchmark organizes everyday manipulation by the physical role that determines success. This section is also the primary inference-demo gallery: each task will show an autonomous rollout together with its task-specific success definition.</p>
            <div className="benchmark-taxonomy" aria-label="Benchmark force taxonomy"><div className={selectedDemo.id === 'poker' ? 'active' : ''} aria-current={selectedDemo.id === 'poker' ? 'true' : undefined} style={color('var(--task-poker)')}>FRICTION</div><div className={selectedDemo.id === 'book' ? 'active' : ''} aria-current={selectedDemo.id === 'book' ? 'true' : undefined} style={color('var(--task-book)')}>SHEAR</div><div className={selectedDemo.id === 'balloon' ? 'active' : ''} aria-current={selectedDemo.id === 'balloon' ? 'true' : undefined} style={color('var(--task-balloon)')}>CURVATURE</div><div className={selectedDemo.id === 'cap' ? 'active' : ''} aria-current={selectedDemo.id === 'cap' ? 'true' : undefined} style={color('var(--task-cap)')}>TORQUE</div><div className={selectedDemo.id === 'paste' ? 'active' : ''} aria-current={selectedDemo.id === 'paste' ? 'true' : undefined} style={color('var(--task-paste)')}>DEFORMATION</div></div>
            <div className="demo-gallery"><div className="demo-pills" role="tablist" aria-label="Benchmark tasks">{demos.map(demo => <button className={`demo-pill${demo.id === selectedDemo.id ? ' active' : ''}`} key={demo.id} type="button" onClick={() => setSelectedDemo(demo)}>{demo.button}</button>)}</div><div className="demo-view"><video key={selectedDemo.id} autoPlay controls muted loop preload="metadata" poster="/placeholders/robot-hand.jpg" aria-label="Selected benchmark rollout placeholder"><source src="/placeholders/robot-hand-demo.mp4" type="video/mp4"/></video></div><div className="demo-caption"><b>{selectedDemo.title}</b><p>{selectedDemo.description}</p></div></div>
          </section>

          <section id="results"><h2>Experiments</h2><div className="result-intro"><p>Every planned study uses the same five-task benchmark and reports a macro mean. A grouped chart summarizes the main comparison, horizontal bars summarize component ablations, and paired scaling curves separate post-training compute from demonstration count.</p></div><div className="placeholder-warning">Planning state: tables are complete, but every numerical cell is intentionally empty.</div>{experiments.map(experiment => <ResultsTable experiment={experiment} key={experiment.id}/>) }<ScalingStudy/></section>

          <section id="failures"><h2>Failure Cases &amp; Limitations</h2><p>Failure cases will be grouped by the part of the closed loop that breaks. Each final example should pair the failed rollout with synchronized tactile, torque, and compliance-offset traces so the diagnosis is supported by evidence.</p><div className="failure-grid">{failures.map(failure => <article className="failure-card" key={failure.type}><video controls muted loop preload="metadata" poster="/placeholders/robot-hand.jpg" aria-label={`${failure.title} failure placeholder`}><source src="/placeholders/robot-hand-demo.mp4" type="video/mp4"/></video><div className="failure-card__copy"><span className="failure-card__type">{failure.type}</span><h3>{failure.title}</h3><p>{failure.description}</p></div></article>)}</div><div className="failure-note"><p><strong>Planned reporting rule.</strong> Categories are provisional until evaluation. Public failure demos should be consecutive, unedited trials rather than hand-selected isolated frames.</p></div></section>

          <section id="citation"><h2>Citation</h2><p>HACo is currently an anonymous working draft. Public citation information will be updated with the preprint.</p><pre className="bibtex">{`@misc{haco2027,\n  title  = {HACo: Haptic Active Compliance for\n            Dexterous Force Control},\n  author = {Anonymous Authors},\n  year   = {2027}\n}`}</pre><p className="asset-credit">Temporary image: Oak Ridge National Laboratory, “Robotic hand,” CC BY 2.0. Temporary video: Giacomo Alessandroni, “Hand-made robotic arm with Arduino,” CC BY-SA 4.0; clipped and transcoded locally. Both will be replaced by project-owned media.</p></section>
        </article>
      </div></section>
    </main>
    <footer className="footer"><span>HACo · INTERNAL WORKING PAGE</span><span>All experiment cells intentionally blank until verified.</span><a href="#top">Back to top ↑</a></footer>
  </>;
}
