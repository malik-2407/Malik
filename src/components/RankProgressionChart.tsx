import React, { useRef, useEffect, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { UserRank, RankHistoryPoint } from '../types/valorant';
import { RANK_COLORS } from './RankBadge';
import { soundManager } from '../utils/audio';
import { TrendingUp, Award, Flame, RotateCcw, Plus, Minus, Info } from 'lucide-react';

interface RankProgressionChartProps {
  userRank: UserRank;
  onSimulateMatch?: (won: boolean) => void;
  onResetHistory?: () => void;
  compact?: boolean;
}

export const RankProgressionChart: React.FC<RankProgressionChartProps> = ({
  userRank,
  onSimulateMatch,
  onResetHistory,
  compact = false,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<RankHistoryPoint | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [selectedRange, setSelectedRange] = useState<'10' | '20' | 'all'>('10');

  // Filter history based on range
  const displayHistory = useMemo(() => {
    const list = userRank.history || [];
    if (selectedRange === '10') return list.slice(-10);
    if (selectedRange === '20') return list.slice(-20);
    return list;
  }, [userRank.history, selectedRange]);

  // Overall stats
  const stats = useMemo(() => {
    if (displayHistory.length === 0) return { netRR: 0, winRate: 0, highestRR: 0, lowestRR: 0 };
    const wins = displayHistory.filter(p => p.result === 'win').length;
    const winRate = Math.round((wins / displayHistory.length) * 100);
    const netRR = displayHistory.reduce((acc, p) => acc + p.rrChange, 0);
    const highestRR = Math.max(...displayHistory.map(p => p.rr));
    const lowestRR = Math.min(...displayHistory.map(p => p.rr));
    return { netRR, winRate, highestRR, lowestRR };
  }, [displayHistory]);

  const tierConf = RANK_COLORS[userRank.tier] || RANK_COLORS.Diamond;

  // D3 Chart rendering
  useEffect(() => {
    if (!svgRef.current || !containerRef.current || displayHistory.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous render

    const width = containerRef.current.clientWidth || 600;
    const height = compact ? 190 : 260;
    const margin = { top: 24, right: 30, bottom: 38, left: 42 };

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    svg
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`);

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // X Scale (Match index / sequence)
    const xScale = d3
      .scaleLinear()
      .domain([0, Math.max(displayHistory.length - 1, 1)])
      .range([0, innerWidth]);

    // Y Scale: 0 to 100 RR (or dynamic if Radiant/beyond)
    const maxRR = Math.max(100, ...displayHistory.map(d => d.rr));
    const yScale = d3
      .scaleLinear()
      .domain([0, maxRR])
      .range([innerHeight, 0])
      .nice();

    // Definitions (Gradients & Drop Shadows)
    const defs = svg.append('defs');

    // Area Gradient
    const areaGradient = defs
      .append('linearGradient')
      .attr('id', 'rr-area-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    areaGradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', tierConf.border)
      .attr('stop-opacity', 0.35);

    areaGradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', tierConf.border)
      .attr('stop-opacity', 0.0);

    // Line Glow Filter
    const filter = defs
      .append('filter')
      .attr('id', 'line-glow')
      .attr('x', '-20%')
      .attr('y', '-20%')
      .attr('width', '140%')
      .attr('height', '140%');

    filter
      .append('feGaussianBlur')
      .attr('stdDeviation', 3)
      .attr('result', 'coloredBlur');

    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Grid lines (Horizontal)
    const yTicks = yScale.ticks(5);
    g.append('g')
      .attr('class', 'grid-lines')
      .selectAll('line')
      .data(yTicks)
      .enter()
      .append('line')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', d => yScale(d))
      .attr('y2', d => yScale(d))
      .attr('stroke', 'rgba(255, 255, 255, 0.06)')
      .attr('stroke-dasharray', '3 3');

    // 100 RR Threshold line (Tier Promotion Line)
    if (maxRR >= 100) {
      g.append('line')
        .attr('x1', 0)
        .attr('x2', innerWidth)
        .attr('y1', yScale(100))
        .attr('y2', yScale(100))
        .attr('stroke', 'rgba(234, 179, 8, 0.35)')
        .attr('stroke-dasharray', '4 4')
        .attr('stroke-width', 1.5);

      g.append('text')
        .attr('x', innerWidth - 6)
        .attr('y', yScale(100) - 5)
        .attr('text-anchor', 'end')
        .attr('fill', '#eab308')
        .attr('font-size', '9px')
        .attr('font-family', 'monospace')
        .text('PROMOTION THRESHOLD (100 RR)');
    }

    // Y Axis (RR labels: 0 RR, 25 RR, 50 RR, 75 RR, 100 RR)
    const yAxis = d3
      .axisLeft(yScale)
      .ticks(5)
      .tickFormat(d => `${d} RR`);

    const yAxisGroup = g
      .append('g')
      .attr('class', 'y-axis')
      .call(yAxis);

    yAxisGroup.select('.domain').remove();
    yAxisGroup.selectAll('.tick line').remove();
    yAxisGroup
      .selectAll('text')
      .attr('fill', '#94a3b8')
      .attr('font-size', '10px')
      .attr('font-family', 'monospace')
      .attr('dx', '-4');

    // X Axis (Match Numbers)
    const xAxis = d3
      .axisBottom(xScale)
      .ticks(Math.min(displayHistory.length, 10))
      .tickFormat((_, i) => {
        const item = displayHistory[i];
        return item ? `M${item.matchIndex}` : '';
      });

    const xAxisGroup = g
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis);

    xAxisGroup.select('.domain').attr('stroke', 'rgba(255, 255, 255, 0.15)');
    xAxisGroup.selectAll('.tick line').attr('stroke', 'rgba(255, 255, 255, 0.15)');
    xAxisGroup
      .selectAll('text')
      .attr('fill', '#94a3b8')
      .attr('font-size', '10px')
      .attr('font-family', 'monospace')
      .attr('dy', '10');

    // D3 Area Generator
    const areaGen = d3
      .area<RankHistoryPoint>()
      .x((_, i) => xScale(i))
      .y0(innerHeight)
      .y1(d => yScale(d.rr))
      .curve(d3.curveMonotoneX);

    // Draw Filled Gradient Area
    g.append('path')
      .datum(displayHistory)
      .attr('class', 'area-path')
      .attr('fill', 'url(#rr-area-gradient)')
      .attr('d', areaGen);

    // D3 Line Generator
    const lineGen = d3
      .line<RankHistoryPoint>()
      .x((_, i) => xScale(i))
      .y(d => yScale(d.rr))
      .curve(d3.curveMonotoneX);

    // Draw Primary Line Path
    g.append('path')
      .datum(displayHistory)
      .attr('class', 'line-path')
      .attr('fill', 'none')
      .attr('stroke', tierConf.border)
      .attr('stroke-width', 2.8)
      .attr('filter', 'url(#line-glow)')
      .attr('d', lineGen);

    // Vertical Crosshair Cursor line (hidden by default)
    const focusLine = g
      .append('line')
      .attr('class', 'focus-line')
      .attr('y1', 0)
      .attr('y2', innerHeight)
      .attr('stroke', 'rgba(255, 255, 255, 0.35)')
      .attr('stroke-dasharray', '2 2')
      .style('opacity', 0)
      .style('pointer-events', 'none');

    // Data Circles (Interactive Nodes)
    const pointsGroup = g.append('g').attr('class', 'points-group');

    displayHistory.forEach((p, i) => {
      const cx = xScale(i);
      const cy = yScale(p.rr);
      const isWin = p.result === 'win';
      const isDraw = p.result === 'draw';
      const pointColor = isWin ? '#10b981' : isDraw ? '#f59e0b' : '#f43f5e';

      // Outer halo
      pointsGroup
        .append('circle')
        .attr('cx', cx)
        .attr('cy', cy)
        .attr('r', 6)
        .attr('fill', pointColor)
        .attr('opacity', 0.25);

      // Core point
      pointsGroup
        .append('circle')
        .attr('class', `point-node-${i}`)
        .attr('cx', cx)
        .attr('cy', cy)
        .attr('r', 3.8)
        .attr('fill', pointColor)
        .attr('stroke', '#0b1016')
        .attr('stroke-width', 1.5)
        .style('cursor', 'pointer');
    });

    // Invisible Overlay for Mousemove Scrubbing
    svg
      .append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .on('mousemove', (event: MouseEvent) => {
        const [mx] = d3.pointer(event, g.node());
        if (mx < 0 || mx > innerWidth) {
          focusLine.style('opacity', 0);
          setHoveredPoint(null);
          setTooltipPos(null);
          return;
        }

        // Find nearest point
        const iFloat = xScale.invert(mx);
        const idx = Math.min(Math.max(Math.round(iFloat), 0), displayHistory.length - 1);
        const pt = displayHistory[idx];

        if (pt) {
          const ptX = xScale(idx);
          focusLine
            .attr('x1', ptX)
            .attr('x2', ptX)
            .style('opacity', 1);

          setHoveredPoint(pt);
          const rect = containerRef.current?.getBoundingClientRect();
          if (rect) {
            setTooltipPos({
              x: margin.left + ptX,
              y: margin.top + yScale(pt.rr),
            });
          }
        }
      })
      .on('mouseleave', () => {
        focusLine.style('opacity', 0);
        setHoveredPoint(null);
        setTooltipPos(null);
      });

  }, [displayHistory, userRank.tier, tierConf, compact]);

  return (
    <div className="w-full bg-[#0c1219] border border-white/10 p-4 sm:p-5 shadow-xl relative overflow-hidden font-mono text-white">
      {/* Header bar: Title & Range Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rotate-45 border"
            style={{ backgroundColor: tierConf.bg, borderColor: tierConf.border }}
          />
          <div>
            <div className="text-[10px] uppercase tracking-widest text-[#ff4655] font-bold">
              Competitive Analytics · D3 Visualization
            </div>
            <h3 className="text-sm sm:text-base font-bold uppercase tracking-wide text-white flex items-center gap-2">
              <span>Rank Rating (RR) Progression</span>
              <span className="text-xs text-slate-400 font-normal">
                ({userRank.tier} {userRank.tier !== 'Radiant' ? userRank.subTier : ''} · {userRank.rr} RR)
              </span>
            </h3>
          </div>
        </div>

        {/* Range switcher tabs & Match simulation buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-black/40 border border-white/10 p-0.5 text-[11px]">
            <button
              type="button"
              onClick={() => setSelectedRange('10')}
              className={`px-2 py-0.5 transition-colors cursor-pointer ${
                selectedRange === '10' ? 'bg-[#ff4655] text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Last 10
            </button>
            <button
              type="button"
              onClick={() => setSelectedRange('20')}
              className={`px-2 py-0.5 transition-colors cursor-pointer ${
                selectedRange === '20' ? 'bg-[#ff4655] text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Last 20
            </button>
            <button
              type="button"
              onClick={() => setSelectedRange('all')}
              className={`px-2 py-0.5 transition-colors cursor-pointer ${
                selectedRange === 'all' ? 'bg-[#ff4655] text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Matches
            </button>
          </div>

          {onSimulateMatch && (
            <div className="flex items-center gap-1.5 pl-2 border-l border-white/10">
              <button
                type="button"
                onClick={() => {
                  soundManager.playPurchase();
                  onSimulateMatch(true);
                }}
                title="Simulate Match Win (+24 RR)"
                className="px-2 py-1 bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Plus className="w-3 h-3" />
                <span>+Win (RR)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  onSimulateMatch(false);
                }}
                title="Simulate Match Loss (-18 RR)"
                className="px-2 py-1 bg-rose-950/60 hover:bg-rose-900/80 border border-rose-500/40 text-rose-300 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Minus className="w-3 h-3" />
                <span>-Loss (RR)</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Metric Strips (Zero-Pill Discipline, quiet text metadata with separators) */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300 mb-3 font-mono">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500">Current:</span>
          <span className="font-bold text-white" style={{ color: tierConf.text }}>
            {userRank.tier} {userRank.tier !== 'Radiant' ? userRank.subTier : ''} ({userRank.rr} RR)
          </span>
        </div>
        <span className="text-slate-600">·</span>
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500">Period Net:</span>
          <span className={`font-bold ${stats.netRR >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {stats.netRR >= 0 ? `+${stats.netRR}` : stats.netRR} RR
          </span>
        </div>
        <span className="text-slate-600">·</span>
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500">Win Rate:</span>
          <span className="font-bold text-white">{stats.winRate}%</span>
        </div>
        <span className="text-slate-600">·</span>
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500">Peak:</span>
          <span className="font-bold text-amber-300">{userRank.peakTier || 'Diamond 3'}</span>
        </div>
        <span className="text-slate-600">·</span>
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500">Range Extremes:</span>
          <span className="text-slate-300">{stats.lowestRR} - {stats.highestRR} RR</span>
        </div>
      </div>

      {/* Responsive D3 Chart Container */}
      <div ref={containerRef} className="relative w-full">
        <svg ref={svgRef} className="w-full overflow-visible block" />

        {/* Dynamic Tooltip on Hover */}
        {hoveredPoint && tooltipPos && (
          <div
            className="absolute z-20 pointer-events-none bg-[#121922] border border-white/20 p-2.5 shadow-2xl text-xs font-mono transition-transform duration-75"
            style={{
              left: `${Math.min(tooltipPos.x + 12, (containerRef.current?.clientWidth || 400) - 170)}px`,
              top: `${Math.max(tooltipPos.y - 85, 10)}px`,
            }}
          >
            <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-1 mb-1">
              <span className="font-bold text-white">
                Match #{hoveredPoint.matchIndex} · {hoveredPoint.map}
              </span>
              <span
                className={`font-bold text-[11px] ${
                  hoveredPoint.result === 'win'
                    ? 'text-emerald-400'
                    : hoveredPoint.result === 'draw'
                    ? 'text-amber-400'
                    : 'text-rose-400'
                }`}
              >
                {hoveredPoint.result.toUpperCase()} ({hoveredPoint.rrChange >= 0 ? `+${hoveredPoint.rrChange}` : hoveredPoint.rrChange} RR)
              </span>
            </div>

            <div className="space-y-0.5 text-[11px] text-slate-300">
              <div className="flex justify-between gap-2">
                <span className="text-slate-400">Standing:</span>
                <span className="font-bold text-white">
                  {hoveredPoint.tier} {hoveredPoint.subTier} ({hoveredPoint.rr} RR)
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-slate-400">Score & Agent:</span>
                <span>{hoveredPoint.score} · {hoveredPoint.agent}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-slate-400">Combat K/D/A:</span>
                <span className="text-amber-300 font-bold">
                  {hoveredPoint.kills}/{hoveredPoint.deaths}/{hoveredPoint.assists}
                </span>
              </div>
              <div className="text-[10px] text-slate-500 pt-0.5">
                {hoveredPoint.timestamp}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Chart Footer Legend */}
      <div className="mt-3 pt-2.5 border-t border-white/10 flex flex-wrap items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Victory (+RR)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>Defeat (-RR)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-0.5 bg-amber-400" />
            <span>100 RR Tier Cap</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-500">
            Hover points for combat K/D/A telemetry
          </span>
          {onResetHistory && (
            <button
              type="button"
              onClick={onResetHistory}
              title="Reset sample match history"
              className="text-slate-500 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
