import { ChangeEvent, FormEvent, useMemo, useState } from 'react';

type AnalysisResult = {
  summary?: string;
  setup?: string;
  entryPrice?: string;
  direction?: string;
  stopLoss?: string;
  targets?: string[];
  patternLogic?: string;
  probabilityNotes?: string;
  riskNotes?: string;
};

const API_ENDPOINT = '/api/trader/analyze';

export function TraderAnalyzerPage() {
  const [image, setImage] = useState<File | null>(null);
  const [stock, setStock] = useState('');
  const [timeframe, setTimeframe] = useState('');
  const [setupType, setSetupType] = useState<'bullish' | 'bearish'>('bullish');
  const [direction, setDirection] = useState<'long' | 'short'>('long');
  const [entryPrice, setEntryPrice] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [targets, setTargets] = useState('T1: , RR: \nT2: , RR: ');
  const [patternLogic, setPatternLogic] = useState('');
  const [probabilityNotes, setProbabilityNotes] = useState('');
  const [riskNotes, setRiskNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const structuredPrompt = useMemo(
    () => `Analyze the attached chart and return this exact structure:\n\n` +
      `1) ${setupType} setup\n` +
      `2) entry price: ${entryPrice || '[provide value]'}\n` +
      `3) ${direction} direction\n` +
      `4) stop-loss: ${stopLoss || '[provide value]'}\n` +
      `5) targets with risk-reward: ${targets || '[provide target + RR]'}\n` +
      `6) chart pattern/price-action logic: ${patternLogic || '[explain pattern logic]'}\n` +
      `7) probability/risk notes: ${probabilityNotes || '[probability notes]'} | ${riskNotes || '[risk notes]'}`,
    [direction, entryPrice, patternLogic, probabilityNotes, riskNotes, setupType, stopLoss, targets]
  );

  const handleImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setImage(file);
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!image) {
      setError('Please upload a chart screenshot (PNG/JPG/WebP).');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const body = new FormData();
      body.append('image', image);
      body.append('stock', stock);
      body.append('timeframe', timeframe);
      body.append('setupType', setupType);
      body.append('entryPrice', entryPrice);
      body.append('direction', direction);
      body.append('stopLoss', stopLoss);
      body.append('targets', targets);
      body.append('patternLogic', patternLogic);
      body.append('probabilityNotes', probabilityNotes);
      body.append('riskNotes', riskNotes);
      body.append('prompt', structuredPrompt);

      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        body
      });

      if (!response.ok) {
        throw new Error(`Analysis API returned ${response.status}`);
      }

      const data = (await response.json()) as AnalysisResult;
      setResult(data);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to analyze chart.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="trader-layout">
      <form className="panel" onSubmit={onSubmit}>
        <h1>Trader Analyzer</h1>
        <p>Upload a chart screenshot and submit a structured setup request to the analysis API.</p>

        <label>
          Chart Screenshot (PNG/JPG/WebP)
          <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleImage} required />
        </label>

        <div className="grid-2">
          <label>
            Stock
            <input value={stock} onChange={(event) => setStock(event.target.value)} placeholder="e.g. TSLA" required />
          </label>
          <label>
            Timeframe
            <input
              value={timeframe}
              onChange={(event) => setTimeframe(event.target.value)}
              placeholder="e.g. 1H / 4H / 1D"
              required
            />
          </label>
        </div>

        <div className="grid-2">
          <label>
            Setup Bias
            <select value={setupType} onChange={(event) => setSetupType(event.target.value as 'bullish' | 'bearish')}>
              <option value="bullish">Bullish</option>
              <option value="bearish">Bearish</option>
            </select>
          </label>
          <label>
            Direction
            <select value={direction} onChange={(event) => setDirection(event.target.value as 'long' | 'short')}>
              <option value="long">Long</option>
              <option value="short">Short</option>
            </select>
          </label>
        </div>

        <div className="grid-2">
          <label>
            Entry Price
            <input value={entryPrice} onChange={(event) => setEntryPrice(event.target.value)} placeholder="e.g. 213.40" />
          </label>
          <label>
            Stop-Loss
            <input value={stopLoss} onChange={(event) => setStopLoss(event.target.value)} placeholder="e.g. 208.90" />
          </label>
        </div>

        <label>
          Targets with Risk-Reward
          <textarea
            value={targets}
            onChange={(event) => setTargets(event.target.value)}
            rows={3}
            placeholder="T1: 216.00, RR: 1.4R\nT2: 219.50, RR: 2.1R"
          />
        </label>

        <label>
          Chart Pattern / Price-Action Logic
          <textarea
            value={patternLogic}
            onChange={(event) => setPatternLogic(event.target.value)}
            rows={3}
            placeholder="e.g. break-and-retest above resistance with rising volume"
          />
        </label>

        <div className="grid-2">
          <label>
            Probability Notes
            <textarea value={probabilityNotes} onChange={(event) => setProbabilityNotes(event.target.value)} rows={3} />
          </label>
          <label>
            Risk Notes
            <textarea value={riskNotes} onChange={(event) => setRiskNotes(event.target.value)} rows={3} />
          </label>
        </div>

        <label>
          Prompt Preview
          <textarea readOnly value={structuredPrompt} rows={8} />
        </label>

        <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Analyze Setup'}
        </button>

        {error ? <p className="error">{error}</p> : null}
      </form>

      <aside className="panel result-panel">
        <h2>Analysis Result</h2>
        {!result ? <p>No analysis yet. Submit a setup to view structured output.</p> : null}

        {result ? (
          <div className="cards">
            <ResultCard title="Bullish/Bearish Setup" value={result.setup} />
            <ResultCard title="Entry Price" value={result.entryPrice} />
            <ResultCard title="Direction" value={result.direction} />
            <ResultCard title="Stop-Loss" value={result.stopLoss} />
            <ResultCard title="Targets with Risk-Reward" value={result.targets?.join('\n')} />
            <ResultCard title="Chart Pattern / Price-Action Logic" value={result.patternLogic} />
            <ResultCard title="Probability Notes" value={result.probabilityNotes} />
            <ResultCard title="Risk Notes" value={result.riskNotes} />
            <ResultCard title="Summary" value={result.summary} />
          </div>
        ) : null}
      </aside>
    </section>
  );
}

function ResultCard({ title, value }: { title: string; value?: string }) {
  return (
    <article className="result-card">
      <h3>{title}</h3>
      <p>{value && value.trim() ? value : '—'}</p>
    </article>
  );
}
