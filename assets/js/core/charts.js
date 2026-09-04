/**
 * Kenako — graphiques SVG sans dépendance
 * Courbes, barres, anneau et carte de chaleur. Chaque graphique est
 * accompagné d'un résumé textuel pour rester lisible aux lecteurs d'écran.
 */

import { esc } from './dom.js';

const pathFrom = (points) => points.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');

/** Courbe d'aire remplie — CA sur 30 jours, MRR sur 12 mois… */
export function areaChart(values, options = {}) {
  const {
    width = 640, height = 180, pad = 6, color = 'var(--primary)',
    fill = 'color-mix(in srgb, var(--primary) 16%, transparent)',
    label = 'Évolution', formatter = (v) => v, showLast = true,
  } = options;

  if (!values.length) return '';
  const max = Math.max(...values);
  const min = Math.min(...values);
  const span = max - min || 1;
  const stepX = (width - pad * 2) / (values.length - 1 || 1);
  const points = values.map((v, i) => [pad + i * stepX, height - pad - ((v - min) / span) * (height - pad * 2 - 12)]);
  const line = pathFrom(points);
  const area = `${line} L${points[points.length - 1][0].toFixed(1)} ${height} L${points[0][0].toFixed(1)} ${height} Z`;
  const last = points[points.length - 1];

  return `
    <figure style="margin:0">
      <svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" style="width:100%;height:${height}px;display:block" role="img"
           aria-label="${esc(label)} : de ${esc(formatter(values[0]))} à ${esc(formatter(values[values.length - 1]))}, maximum ${esc(formatter(max))}">
        <path d="${area}" fill="${fill}"/>
        <path d="${line}" fill="none" stroke="${color}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"/>
        ${showLast ? `<circle cx="${last[0].toFixed(1)}" cy="${last[1].toFixed(1)}" r="3.6" fill="${color}" stroke="var(--surface)" stroke-width="2"/>` : ''}
      </svg>
    </figure>`;
}

/** Mini-courbe intégrée à une tuile de KPI. */
export function sparkline(values, options = {}) {
  return areaChart(values, { width: 160, height: 44, pad: 2, showLast: false, ...options });
}

/** Barres horizontales — top des plats, répartition par ville. */
export function barList(rows, options = {}) {
  const { color = 'var(--primary)', formatter = (v) => v } = options;
  const max = Math.max(...rows.map((r) => r.value), 1);
  return `<ul class="stack-sm">${rows
    .map(
      (r) => `
      <li class="stack-sm" style="gap:5px">
        <div class="between" style="font-size:var(--fs-sm)">
          <span class="truncate" style="font-weight:600">${esc(r.label)}</span>
          <span class="num dim">${esc(formatter(r.value))}</span>
        </div>
        <div class="progress" style="height:8px">
          <div class="progress__bar" style="width:${((r.value / max) * 100).toFixed(1)}%;background:${r.color || color}"></div>
        </div>
      </li>`
    )
    .join('')}</ul>`;
}

/** Colonnes verticales — commandes par heure. */
export function columnChart(rows, options = {}) {
  const { height = 132, color = 'var(--herb)', highlight = 'var(--primary)', formatter = (v) => v, label = 'Répartition' } = options;
  const max = Math.max(...rows.map((r) => r.value), 1);
  return `
    <div role="img" aria-label="${esc(label)}" style="display:flex;align-items:flex-end;gap:4px;height:${height}px">
      ${rows
        .map((r) => {
          const h = Math.max(3, (r.value / max) * (height - 22));
          return `<div class="hint" data-hint="${esc(r.label)} · ${esc(formatter(r.value))}" style="flex:1;display:grid;justify-items:center;gap:4px">
            <div style="width:100%;height:${h.toFixed(0)}px;border-radius:4px 4px 2px 2px;background:${r.value >= max * 0.85 ? highlight : color};opacity:${r.value >= max * 0.85 ? 1 : 0.55}"></div>
            <span style="font-size:9px;color:var(--ink-3)">${esc(r.short ?? r.label)}</span>
          </div>`;
        })
        .join('')}
    </div>`;
}

/** Anneau de répartition — parts d'abonnements par formule. */
export function donut(slices, options = {}) {
  const { size = 128, thickness = 16, center = '' } = options;
  const total = slices.reduce((sum, s) => sum + s.value, 0) || 1;
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  let offset = 0;

  const rings = slices
    .map((s) => {
      const len = (s.value / total) * c;
      const el = `<circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${s.color}" stroke-width="${thickness}"
        stroke-dasharray="${len.toFixed(2)} ${(c - len).toFixed(2)}" stroke-dashoffset="${(-offset).toFixed(2)}" transform="rotate(-90 ${size / 2} ${size / 2})"/>`;
      offset += len;
      return el;
    })
    .join('');

  return `
    <div style="position:relative;width:${size}px;height:${size}px;flex-shrink:0">
      <svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img"
           aria-label="${esc(slices.map((s) => `${s.label} ${Math.round((s.value / total) * 100)} %`).join(', '))}">
        <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="var(--surface-3)" stroke-width="${thickness}"/>
        ${rings}
      </svg>
      ${center ? `<div class="center" style="position:absolute;inset:0;text-align:center;line-height:1.15">${center}</div>` : ''}
    </div>`;
}

/** Carte de chaleur jour × créneau — heures de pointe du restaurant. */
export function heatmap(matrix, options = {}) {
  const { rows = [], cols = [], label = 'Heures de pointe', formatter = (v) => v } = options;
  const flat = matrix.flat();
  const max = Math.max(...flat, 1);
  return `
    <div role="img" aria-label="${esc(label)}" style="display:grid;grid-template-columns:auto repeat(${cols.length}, 1fr);gap:3px;font-size:10px">
      <span></span>
      ${cols.map((c) => `<span class="dim" style="text-align:center">${esc(c)}</span>`).join('')}
      ${matrix
        .map(
          (row, i) => `
        <span class="dim" style="align-self:center;padding-right:6px">${esc(rows[i] ?? '')}</span>
        ${row
          .map((v) => {
            const ratio = v / max;
            return `<div class="hint" data-hint="${esc(rows[i])} ${esc(cols[0] ? '' : '')}${esc(formatter(v))}"
              style="aspect-ratio:1;border-radius:4px;background:color-mix(in srgb, var(--primary) ${(ratio * 100).toFixed(0)}%, var(--surface-2))"></div>`;
          })
          .join('')}`
        )
        .join('')}
    </div>`;
}
