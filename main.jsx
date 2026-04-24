import React, { useMemo, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Waves, Calculator, TrendingUp, Download, RotateCcw } from 'lucide-react';
import './style.css';

const fmt = new Intl.NumberFormat('zh-TW', { maximumFractionDigits: 0 });
const money = (n) => `NT$${fmt.format(Math.round(Number(n)||0))}`;
const pct = (n) => `${(Number(n)*100).toFixed(1)}%`;

const defaults = {
  monthlyExpense: 100000,
  currentAssets: 2000000,
  monthlyInvestment: 50000,
  annualReturn: 0.06,
  withdrawalRate: 0.04,
  years: 10,
  futureLightIncome: 50000,
  accumulationSideIncome: 0,
  reinvestSideIncome: true,
  inflationRate: 0.025
};

function calcPlan(input) {
  const annualExpense = input.monthlyExpense * 12;
  const netAnnualExpense = Math.max(0, (input.monthlyExpense - input.futureLightIncome) * 12);
  const targetWealth = netAnnualExpense / input.withdrawalRate;
  let assets = input.currentAssets;
  const data = [];
  for (let y = 0; y <= 30; y++) {
    const inflatedExpense = annualExpense * Math.pow(1 + input.inflationRate, y);
    const inflatedTarget = Math.max(0, inflatedExpense - input.futureLightIncome * 12) / input.withdrawalRate;
    if (y > 0) {
      const annualInvest = input.monthlyInvestment * 12 + (input.reinvestSideIncome ? input.accumulationSideIncome * 12 : 0);
      assets = assets * (1 + input.annualReturn) + annualInvest;
    }
    data.push({ year: y, assets: Math.round(assets), target: Math.round(inflatedTarget) });
  }
  const hit = data.find(d => d.assets >= d.target);
  return { annualExpense, netAnnualExpense, targetWealth, data, hitYear: hit?.year ?? null, finalAssets: data[input.years]?.assets ?? data[10].assets, targetAtYear: data[input.years]?.target ?? targetWealth };
}

function NumberInput({label, value, onChange, prefix='', suffix='', step=1000, help}) {
  return <label className="field"><span>{label}</span><div className="inputWrap">{prefix && <b>{prefix}</b>}<input type="number" value={value} step={step} onChange={e=>onChange(Number(e.target.value))}/>{suffix && <b>{suffix}</b>}</div>{help && <small>{help}</small>}</label>
}

function App(){
  const [input,setInput]=useState(()=>{
    try { return {...defaults, ...(JSON.parse(localStorage.getItem('fire-input')||'{}'))}; } catch { return defaults; }
  });
  useEffect(()=>localStorage.setItem('fire-input',JSON.stringify(input)),[input]);
  useEffect(()=>{ if('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js'); },[]);
  const update=(k,v)=>setInput(s=>({...s,[k]:v}));
  const plan=useMemo(()=>calcPlan(input),[input]);
  const gap = plan.finalAssets - plan.targetAtYear;
  const progress = Math.min(100, Math.max(0, plan.finalAssets / plan.targetAtYear * 100));
  const scenarios = useMemo(()=>[
    ['保守', {...input, monthlyInvestment: 30000, annualReturn: .04, accumulationSideIncome: 0}],
    ['基準', input],
    ['加速', {...input, monthlyInvestment: 70000, annualReturn: .06, accumulationSideIncome: 20000}],
    ['自由收入優先', {...input, monthlyInvestment: 50000, annualReturn: .06, futureLightIncome: 70000}],
  ].map(([name,i])=>({name, ...calcPlan(i)})),[input]);

  return <main>
    <section className="hero">
      <div><div className="badge"><Waves size={16}/> Financial Freedom Planner</div><h1>10年財務自由與海島生活規劃</h1><p>輸入生活費、資產、投入金額與未來輕量收入，快速判斷距離財務自由還差多少。</p></div>
      <button className="ghost" onClick={()=>setInput(defaults)}><RotateCcw size={16}/> 重設</button>
    </section>

    <section className="grid cards">
      <div className="card"><Calculator/><span>目標資產</span><strong>{money(plan.targetWealth)}</strong><small>已扣除未來輕量收入後，以提領率計算</small></div>
      <div className="card"><TrendingUp/><span>{input.years} 年後資產</span><strong>{money(plan.finalAssets)}</strong><small>{gap>=0?'預估已達標':'距離目標差距'}：{money(Math.abs(gap))}</small></div>
      <div className="card"><Download/><span>預估達標時間</span><strong>{plan.hitYear===null?'30年以上':`${plan.hitYear} 年`}</strong><small>含通膨調整目標線</small></div>
    </section>

    <section className="panel">
      <h2>輸入假設</h2>
      <div className="formGrid">
        <NumberInput label="理想每月生活費" value={input.monthlyExpense} onChange={v=>update('monthlyExpense',v)} prefix="NT$" />
        <NumberInput label="目前可投資資產" value={input.currentAssets} onChange={v=>update('currentAssets',v)} prefix="NT$" />
        <NumberInput label="每月投入投資" value={input.monthlyInvestment} onChange={v=>update('monthlyInvestment',v)} prefix="NT$" />
        <NumberInput label="年化報酬率" value={input.annualReturn} onChange={v=>update('annualReturn',v)} step="0.01" suffix="小數" help="例如 0.06 = 6%" />
        <NumberInput label="安全提領率" value={input.withdrawalRate} onChange={v=>update('withdrawalRate',v)} step="0.005" suffix="小數" />
        <NumberInput label="規劃年數" value={input.years} onChange={v=>update('years',Math.min(30,Math.max(1,v)))} step="1" suffix="年" />
        <NumberInput label="未來每月輕量收入" value={input.futureLightIncome} onChange={v=>update('futureLightIncome',v)} prefix="NT$" help="例如每天2–4小時輸出收入" />
        <NumberInput label="累積期每月副收入" value={input.accumulationSideIncome} onChange={v=>update('accumulationSideIncome',v)} prefix="NT$" />
        <NumberInput label="年通膨率" value={input.inflationRate} onChange={v=>update('inflationRate',v)} step="0.005" suffix="小數" />
      </div>
      <label className="check"><input type="checkbox" checked={input.reinvestSideIncome} onChange={e=>update('reinvestSideIncome',e.target.checked)}/> 累積期副收入全數再投入</label>
    </section>

    <section className="panel chartPanel">
      <div className="sectionHead"><h2>資產成長曲線</h2><span>進度 {progress.toFixed(0)}%</span></div>
      <ResponsiveContainer width="100%" height={330}>
        <LineChart data={plan.data.slice(0, Math.max(11, input.years+1))} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" tickFormatter={v=>`Y${v}`} />
          <YAxis tickFormatter={v=>`${Math.round(v/1000000)}M`} />
          <Tooltip formatter={(v)=>money(v)} labelFormatter={(v)=>`第 ${v} 年`} />
          <Line type="monotone" dataKey="assets" name="資產" strokeWidth={3} dot={false} />
          <Line type="monotone" dataKey="target" name="目標資產" strokeWidth={2} strokeDasharray="6 4" dot={false} />
          <ReferenceLine x={input.years} label="目標年" />
        </LineChart>
      </ResponsiveContainer>
    </section>

    <section className="panel">
      <h2>情境比較</h2>
      <div className="tableWrap"><table><thead><tr><th>情境</th><th>目標資產</th><th>{input.years}年後資產</th><th>達標時間</th></tr></thead><tbody>{scenarios.map(s=><tr key={s.name}><td>{s.name}</td><td>{money(s.targetWealth)}</td><td>{money(s.finalAssets)}</td><td>{s.hitYear===null?'30年以上':`${s.hitYear}年`}</td></tr>)}</tbody></table></div>
    </section>

    <footer>本工具為規劃與情境模擬用途，不構成投資建議。資料只儲存在你的瀏覽器。</footer>
  </main>
}

createRoot(document.getElementById('root')).render(<App/>);
