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
  { id: 'main-comparison', title: 'Main comparison', description: 'Seven representative dexterous-manipulation and VLA approaches evaluated under a shared task protocol.', head: 'Method', rows: ['DECO','ViTacFormer','T-Rex','GR00T','CGP','DexTeleop','PACE'], ours: 'PACE', caption: 'Table 1. Main comparison across the five real-world force-sensitive tasks.' },
  { id: 'perception', title: 'Whole-hand physical perception ablation', description: 'Test whether fingertip tactile sensing and distributed joint-torque sensing are complementary, and whether same-finger fusion is preferable to separate physical tokens.', head: 'Physical perception', rows: ['Vision only','Tactile only','Torque only','Torque + tactile · separate','Torque + tactile · fused'], ours: 'Torque + tactile · fused', caption: 'Table 2. Whole-hand physical perception ablation across sensing modalities and token organization.' },
  { id: 'compliance', title: 'Active compliance formulation ablation', description: 'Hold physical perception and feedback integration fixed while changing the action semantics used to supervise and execute the policy.', head: 'Action formulation', rows: ['PACE · q_compliance + delta_q','PACE-Direct · q_compliance','PACE-Nominal · q_nominal'], ours: 'PACE · q_compliance + delta_q', caption: 'Table 3. Active compliance formulation ablation: nominal motion, direct compliant motion, and delta-grounded compliant motion.' },
  { id: 'integration', title: 'Physical feedback integration ablation', description: 'Hold sensing and action formulation fixed while changing how tactile-force feedback enters and updates the shared action latent.', head: 'Feedback integration', rows: ['Suffix fusion','Image-memory fusion','Ungated physical cross-attention','Gated physical cross-attention'], ours: 'Gated physical cross-attention', caption: 'Table 4. Physical feedback integration ablation across token routing and compliance-update mechanisms.' },
  { id: 'wrist-camera', title: 'Wrist-camera observation ablation', description: 'A compact observation study that isolates the contribution of wrist-mounted visual coverage while keeping physical sensing and the PACE policy fixed.', head: 'Camera observation', rows: ['PACE · with wrist cameras','PACE · w/o wrist cameras'], ours: 'PACE · with wrist cameras', caption: 'Table 5. Small ablation on wrist-camera observations.' },
];

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
    return <figure className="result-figure"><div className="result-figure__frame"><div className="result-figure__note"><span>Task success rate by method</span><span>Repeated illustrative heights · awaiting results</span></div><div className="grouped-legend">{groupedTasks.map(task => <span key={task.label}><i style={{ '--c': task.color } as CSSProperties}/>{task.label}</span>)}</div><div className="grouped-chart">{experiment.rows.map(row => <div className={`model-group${row === experiment.ours ? ' is-ours' : ''}`} key={row}><div className="model-bars">{groupedTasks.map(task => <i className="task-bar" key={task.label} tabIndex={0} role="img" data-value={task.height} aria-label={`${task.label}: ${task.height} illustrative placeholder`} style={{ '--h': task.height, '--c': task.color } as CSSProperties}/>)}</div><span className="model-label">{row}</span></div>)}</div></div><figcaption>Figure 2. Planned grouped comparison. Each method contains five task-level success bars; the repeated placeholder heights demonstrate layout only and are not experimental results.</figcaption></figure>;
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
  return <figure className="result-figure"><div className="result-figure__frame"><div className="result-figure__note"><span>{labels[experiment.id]}</span><span>Awaiting results</span></div><div className="horizontal-bars">{experiment.rows.map(row => <div className={`horizontal-bar${row === experiment.ours ? ' is-ours' : ''}`} key={row}><span className="horizontal-bar__label">{row}</span><div className="horizontal-bar__track"><i className="horizontal-bar__fill"/></div><span className="horizontal-bar__value">TBD</span></div>)}</div></div><figcaption>{captions[experiment.id]}</figcaption></figure>;
}

function ResultsTable({ experiment }: { experiment: typeof experiments[number] }) {
  return <div className="experiment-group" id={experiment.id}>
    <h3>{experiment.title}</h3>
    <p>{experiment.description}</p>
    <ResultChart experiment={experiment}/>
    <div className="table-wrap"><table className="result-table">
      <thead><tr><th>{experiment.head}</th>{tasks.map(task => <th key={task}>{task}</th>)}<th>Mean</th></tr></thead>
      <tbody>{experiment.rows.map(row => <tr className={row === experiment.ours ? 'ours' : ''} key={row}><th>{row}</th>{tasks.map(task => <td key={task}>—</td>)}<td>—</td></tr>)}</tbody>
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
        {sweep.points.map((point, index) => <i className="scaling-dot" key={sweep.labels[index]} style={{ '--x': positions[index], '--y': point } as CSSProperties}/>) }
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
        <video autoPlay muted loop playsInline controls preload="metadata" poster="/placeholders/robot-hand.jpg" aria-label="PACE overview video placeholder"><source src="/placeholders/robot-hand-demo.mp4" type="video/mp4"/></video>
        <span className="hero-placeholder-label">Hero video placeholder · final five-task montage</span>
        <a className="scroll-cue" href="#article">Scroll to explore ↓</a>
      </section>

      <section className="article-body" id="article"><span className="legacy-anchor" id="paper" aria-hidden="true"/><div className="article-layout">
        <aside className="article-outline" aria-label="Article outline"><nav>
          <a href="#title">Title</a><a href="#abstract">Abstract</a><a href="#contributions">Contributions</a><a href="#method">Method</a><a data-level="2" href="#architecture">Architecture</a><a data-level="2" href="#data-flow">Data flow</a><a href="#benchmark">Benchmark</a><a href="#results">Results</a><a data-level="2" href="#main-comparison">Main comparison</a><a data-level="2" href="#perception">Perception</a><a data-level="2" href="#compliance">Active compliance</a><a data-level="2" href="#integration">Feedback integration</a><a data-level="2" href="#wrist-camera">Wrist cameras</a><a data-level="2" href="#posttraining-scaling">Post-training scaling</a><a href="#failures">Failure cases</a><a href="#citation">Citation</a>
        </nav></aside>

        <article className="article-shell">
          <header className="title-block" id="title"><div className="venue">PROJECT PAGE · ICLR 2027 WORKING DRAFT</div><h1><span>PACE:</span> Physically Grounded Active Compliance for Dexterous Force Control</h1><p className="authors">Anonymous authors</p><p className="affiliation">Under review · Internal experiment planning page</p><div className="article-links"><a className="article-link disabled" href="#" aria-disabled="true" data-url-placeholder="page" onClick={(event) => event.preventDefault()}>☁ Page</a><a className="article-link disabled" href="#" aria-disabled="true" data-url-placeholder="paper" onClick={(event) => event.preventDefault()}>▤ Paper</a><a className="article-link disabled" href="#" aria-disabled="true" data-url-placeholder="code" onClick={(event) => event.preventDefault()}>⌘ Code</a></div></header>

          <section id="abstract"><h2>Abstract</h2>
            <div className="abstract-language" lang="en">
              <h3>English</h3>
              <p>Contact-rich dexterous manipulation requires robots to generate precise motions while actively regulating forces across continuously evolving multi-finger, multi-contact interactions. Recent advances in tactile sensing have substantially improved contact adaptation under occlusion, slip, and object deformation. Yet most learning-based policies employ touch as an additional observation, an auxiliary prediction target, or an action-refinement signal for kinematic trajectory generation, leaving the relationship between policy outputs and the forces realized by the low-level controller largely underexplored.</p>
              <p>Compliance control provides a key connection between motion and force. A low-level position controller converts the discrepancy between a target reference and the contact-constrained realized configuration into joint torques, thereby generating and regulating interaction forces. Conventional approaches typically rely on contact-force estimation, robot models, and control Jacobians, which are difficult to apply to the distributed and continuously evolving contacts of high-DoF dexterous hands.</p>
              <p>We introduce <strong>PACE: Physically Grounded Active Compliance for Dexterous Force Control</strong>, a policy that learns active force regulation from physical feedback. PACE introduces <strong>Active–Reactive Force Perception</strong> to jointly sense the two coupled sides of physical interaction: joint torques characterize how forces are generated, transmitted, and distributed through the hand, while fingertip tactile signals capture local reaction forces, shear, and deformation at the contact interface. A <strong>Compliance Grounding Module</strong> then uses <strong>Gated Compliance Cross-Attention</strong> to progressively update the action representation according to the current force interaction. PACE directly generates controller-executable <strong>active compliance actions</strong>, expressing intended motion and active force regulation within a unified compliant joint command.</p>
              <p>We further introduce a real-world benchmark for dexterous force control spanning five interaction regimes: multi-contact friction, tangential interaction, high-curvature fragile contact, rotational torque, and deformable-object interaction. PACE outperforms motion-control and visuotactile action-prediction baselines, while ablations validate the contributions of active–reactive force perception, compliance grounding, and the active compliance action formulation.</p>
            </div>
            <div className="abstract-language abstract-language--zh" lang="zh-CN">
              <h3>中文</h3>
              <p>接触丰富的灵巧操作既要求机器人生成准确的运动，也要求其在持续变化的多指、多点接触中主动调节作用力。近年来，触觉感知显著提升了机器人在遮挡、滑动和物体形变条件下的接触适应能力。然而，现有学习型策略通常将触觉作为额外观测、辅助预测目标或动作修正信号，用于改善运动学轨迹，其动作输出与低层控制器所产生作用力之间的关系仍缺少显式建模。</p>
              <p>柔顺控制为连接运动与力提供了关键机制。低层位置控制器能够将目标 reference 与受接触约束的真实构型之间的偏差转化为关节力矩，从而产生并调节作用力。传统方法通常依赖接触力估计、机器人模型和控制 Jacobian，难以覆盖高自由度灵巧手中分布式、持续演化的多点接触。</p>
              <p>我们提出 <strong>PACE: Physically Grounded Active Compliance for Dexterous Force Control</strong>，一种从物理反馈中学习主动控力的策略。PACE 引入 <strong>Active–Reactive Force Perception</strong>，联合感知物理交互中的主动施力与接触反作用：关节力矩刻画作用力如何通过整只手产生、传递和分配，指尖触觉刻画接触界面的局部反作用、剪切与形变。随后，<strong>Compliance Grounding Module</strong> 通过 <strong>Gated Compliance Cross-Attention</strong>，根据当前力交互状态逐层更新动作表征。PACE 直接生成低层控制器可执行的 <strong>active compliance action</strong>，以统一的柔顺关节指令表达期望运动与主动施力。</p>
              <p>我们进一步构建真实世界灵巧力控 benchmark，包含多接触摩擦、切向作用、高曲率脆弱接触、旋转力矩和可变形物体交互五类任务。实验结果表明，PACE 优于运动控制与视触觉动作预测方法；消融实验进一步验证了主动—反作用力感知、柔顺反馈模块和主动柔顺动作表示的有效性。</p>
            </div>
          </section>

          <section id="contributions"><h2>Contributions</h2><ul><li><strong>Whole-hand physical perception.</strong> PACE fuses precise fingertip tactile fields with distributed joint-torque histories that capture transmitted and actively generated loads.</li><li><strong>Learned active compliance.</strong> The policy uses gated physical cross-attention to directly generate a compliant joint command and jointly ground the command&apos;s force-producing component, without explicit contact-model identification or Jacobian inversion.</li><li><strong>Real-World Force Benchmark.</strong> Five tasks isolate multi-contact friction, tangential force, curved fragile contact, rotational torque, and deformable interaction.</li><li><strong>A controlled evaluation plan.</strong> Main comparisons and controlled ablations isolate whole-hand physical perception, active compliance formulation, feedback integration, observation coverage, and post-training compute/data scaling.</li></ul></section>

          <section id="method"><h2>Method</h2><p>PACE augments a pretrained GR00T vision–language–action policy with a physical-feedback pathway. Language, vision, and robot state establish the evolving manipulation context, while fingertip tactile and joint-torque histories form a complementary whole-hand physical memory. Gated physical cross-attention repeatedly updates a shared action latent that directly generates the compliant joint command and, as an auxiliary grounded output, the command&apos;s active-compliance component.</p>
            <figure className="paper-figure" id="architecture"><div className="architecture-frame"><Image src="/placeholders/robot-hand.jpg" alt="Temporary image occupying the future PACE architecture figure" width={1280} height={1600}/><div className="architecture-copy"><b>PACE architecture figure</b><span>Vision + language → GR00T action latent<br/>Tactile + torque → physical memory → gated cross-attention<br/>Shared latent → q<sub>compliance</sub> + Δq<sub>intent</sub><br/>Executed command = q<sub>compliance</sub></span></div></div><figcaption>Figure 1. Architecture placeholder. The final figure will distinguish the visuomotor and tactile–force feedback loops and show how gated physical updates ground the directly executed compliant command.</figcaption></figure>
            <div className="signal-key"><article><b>Fingertip tactile sensing</b><p>Local contact area, geometry, deformation, shear, and fingertip wrench.</p></article><article><b>Joint-torque sensing</b><p>Distributed actuator effort, transmitted load, and active force generation through the full hand.</p></article></div>
            <figure className="paper-figure" id="data-flow"><video className="teaser-video" controls muted loop preload="metadata" poster="/placeholders/robot-hand.jpg" aria-label="PACE model data-flow placeholder"><source src="/placeholders/robot-hand-demo.mp4" type="video/mp4"/></video><figcaption>Video 2. Data-flow placeholder. The final animation will synchronize camera frames, tactile maps, joint-torque traces, physical tokens, predicted compliance offsets, and the resulting hand response through one closed-loop timestep.</figcaption></figure>
          </section>

          <section id="benchmark"><h2>Real-World Force Benchmark</h2><p>The benchmark organizes everyday manipulation by the physical role that determines success. This section is also the primary inference-demo gallery: each task will show an autonomous rollout together with its task-specific success definition.</p>
            <div className="benchmark-taxonomy" aria-label="Benchmark force taxonomy"><div className={selectedDemo.id === 'poker' ? 'active' : ''} aria-current={selectedDemo.id === 'poker' ? 'true' : undefined} style={color('var(--task-poker)')}>FRICTION</div><div className={selectedDemo.id === 'book' ? 'active' : ''} aria-current={selectedDemo.id === 'book' ? 'true' : undefined} style={color('var(--task-book)')}>SHEAR</div><div className={selectedDemo.id === 'balloon' ? 'active' : ''} aria-current={selectedDemo.id === 'balloon' ? 'true' : undefined} style={color('var(--task-balloon)')}>CURVATURE</div><div className={selectedDemo.id === 'cap' ? 'active' : ''} aria-current={selectedDemo.id === 'cap' ? 'true' : undefined} style={color('var(--task-cap)')}>TORQUE</div><div className={selectedDemo.id === 'paste' ? 'active' : ''} aria-current={selectedDemo.id === 'paste' ? 'true' : undefined} style={color('var(--task-paste)')}>DEFORMATION</div></div>
            <div className="demo-gallery"><div className="demo-pills" role="tablist" aria-label="Benchmark tasks">{demos.map(demo => <button className={`demo-pill${demo.id === selectedDemo.id ? ' active' : ''}`} key={demo.id} type="button" onClick={() => setSelectedDemo(demo)}>{demo.button}</button>)}</div><div className="demo-view"><video key={selectedDemo.id} autoPlay controls muted loop preload="metadata" poster="/placeholders/robot-hand.jpg" aria-label="Selected benchmark rollout placeholder"><source src="/placeholders/robot-hand-demo.mp4" type="video/mp4"/></video></div><div className="demo-caption"><b>{selectedDemo.title}</b><p>{selectedDemo.description}</p></div></div>
          </section>

          <section id="results"><h2>Experiments</h2><div className="result-intro"><p>Every planned study uses the same five-task benchmark and reports a macro mean. A grouped chart summarizes the main comparison, horizontal bars summarize component ablations, and paired scaling curves separate post-training compute from demonstration count.</p></div><div className="placeholder-warning">Planning state: tables are complete, but every numerical cell is intentionally empty.</div>{experiments.map(experiment => <ResultsTable experiment={experiment} key={experiment.id}/>) }<ScalingStudy/></section>

          <section id="failures"><h2>Failure Cases &amp; Limitations</h2><p>Failure cases will be grouped by the part of the closed loop that breaks. Each final example should pair the failed rollout with synchronized tactile, torque, and compliance-offset traces so the diagnosis is supported by evidence.</p><div className="failure-grid">{failures.map(failure => <article className="failure-card" key={failure.type}><video controls muted loop preload="metadata" poster="/placeholders/robot-hand.jpg" aria-label={`${failure.title} failure placeholder`}><source src="/placeholders/robot-hand-demo.mp4" type="video/mp4"/></video><div className="failure-card__copy"><span className="failure-card__type">{failure.type}</span><h3>{failure.title}</h3><p>{failure.description}</p></div></article>)}</div><div className="failure-note"><p><strong>Planned reporting rule.</strong> Categories are provisional until evaluation. Public failure demos should be consecutive, unedited trials rather than hand-selected isolated frames.</p></div></section>

          <section id="citation"><h2>Citation</h2><p>PACE is currently an anonymous working draft. Public citation information will be updated with the preprint.</p><pre className="bibtex">{`@misc{pace2027,\n  title  = {PACE: Physically Grounded Active Compliance for\n            Dexterous Force Control},\n  author = {Anonymous Authors},\n  year   = {2027}\n}`}</pre><p className="asset-credit">Temporary image: Oak Ridge National Laboratory, “Robotic hand,” CC BY 2.0. Temporary video: Giacomo Alessandroni, “Hand-made robotic arm with Arduino,” CC BY-SA 4.0; clipped and transcoded locally. Both will be replaced by project-owned media.</p></section>
        </article>
      </div></section>
    </main>
    <footer className="footer"><span>PACE · INTERNAL WORKING PAGE</span><span>All experiment cells intentionally blank until verified.</span><a href="#top">Back to top ↑</a></footer>
  </>;
}
