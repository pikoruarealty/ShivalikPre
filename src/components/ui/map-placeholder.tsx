type MapPlaceholderProps = {
  coordinates: readonly [number, number] | null;
  landmarks: readonly { name: string; coordinates?: readonly [number, number] }[];
  mapLabel: string;
};

export function MapPlaceholder({ mapLabel }: MapPlaceholderProps) {
  return (
    <div className="map-placeholder" role="img" aria-label={`${mapLabel} Visual location context only; an interactive map will be added once verified location data is available.`}>
      <div className="map-placeholder-grid" aria-hidden="true" />
      <div className="map-placeholder-river" aria-hidden="true" />
      <div className="map-placeholder-marker" aria-hidden="true"><i /></div>
      <span className="map-placeholder-label">{mapLabel}</span>
      <span className="map-placeholder-note">Location context</span>
    </div>
  );
}
