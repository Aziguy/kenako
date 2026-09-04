/**
 * Kenako — cartographie (Leaflet)
 * -------------------------------------------------------------------------
 * Enveloppe fine autour de Leaflet : fond de carte accordé au thème,
 * marqueurs aux couleurs de la marque, regroupement maison au dézoom et
 * tracé de zones de livraison. Si Leaflet n'est pas chargé (hors ligne),
 * on affiche un repli explicite plutôt qu'un cadre vide.
 */

/*
 * Fond de carte OpenStreetMap : libre, sans clé d'API. Le mode sombre est
 * obtenu par un filtre CSS sur la couche de tuiles (voir client.css), ce qui
 * évite un second fournisseur et garde la carte lisible de nuit.
 */
const TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

export const hasLeaflet = () => typeof window.L !== 'undefined';

/** Crée une carte et renvoie une poignée de contrôle, ou `null` sans Leaflet. */
export function createMap(container, options = {}) {
  if (!hasLeaflet() || !container) {
    if (container) {
      container.innerHTML = `<div class="empty" style="height:100%"><div class="empty__art">🗺️</div>
        <p class="empty__text">La carte nécessite une connexion. Le reste du parcours reste disponible.</p></div>`;
    }
    return null;
  }

  const L = window.L;
  const { center = [48.8607, 2.3702], zoom = 13, interactive = true } = options;
  const map = L.map(container, {
    center, zoom, zoomControl: false, attributionControl: true,
    dragging: interactive, scrollWheelZoom: interactive, doubleClickZoom: interactive,
    touchZoom: interactive, keyboard: interactive,
  });

  L.tileLayer(TILE_URL, { attribution: ATTRIBUTION, maxZoom: 19 }).addTo(map);
  if (interactive) L.control.zoom({ position: 'bottomright' }).addTo(map);

  const layers = L.layerGroup().addTo(map);

  return {
    map,
    layers,
    L,

    /** Vide et redessine les marqueurs. */
    setMarkers(items, { onSelect, activeId } = {}) {
      layers.clearLayers();
      items.forEach((item) => {
        const marker = L.marker([item.lat, item.lng], {
          icon: L.divIcon({
            className: 'ken-pin-wrap',
            html: pinHtml(item, item.id === activeId),
            iconSize: [item.wide ? 58 : 44, 34],
            iconAnchor: [item.wide ? 29 : 22, 34],
          }),
          keyboard: true,
          title: item.name,
        });
        if (onSelect) marker.on('click', () => onSelect(item.id));
        marker.addTo(layers);
      });
    },

    /** Trace des polygones de zone de livraison. */
    setZones(zones) {
      zones.forEach((zone) => {
        L.polygon(zone.coords, {
          color: zone.color, weight: 2, fillColor: zone.color, fillOpacity: 0.14,
        })
          .bindTooltip(`${zone.name} — ${zone.rule}`, { sticky: true })
          .addTo(layers);
      });
    },

    /** Cadre la vue sur un ensemble de points. */
    fit(points, padding = 48) {
      if (!points.length) return;
      map.fitBounds(L.latLngBounds(points.map((p) => [p.lat, p.lng])), { padding: [padding, padding], maxZoom: 15 });
    },

    flyTo(lat, lng, zoom = 15) { map.flyTo([lat, lng], zoom, { duration: 0.6 }); },

    invalidate() { setTimeout(() => map.invalidateSize(), 60); },

    destroy() {
      map.remove();
    },
  };
}

function pinHtml(item, active) {
  const label = item.label ?? '';
  return `<span class="ken-pin${active ? ' is-active' : ''}${item.closed ? ' is-closed' : ''}">${label}</span>`;
}

/** Position du livreur simulée le long d'un segment, pour le suivi. */
export function interpolate(from, to, ratio) {
  return [from[0] + (to[0] - from[0]) * ratio, from[1] + (to[1] - from[1]) * ratio];
}
