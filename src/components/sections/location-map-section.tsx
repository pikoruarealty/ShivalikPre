import { Container } from "@/components/layout/container";
import { MapPlaceholder } from "@/components/ui/map-placeholder";
import { SectionLabel } from "@/components/ui/section-label";
import { project } from "@/data/project";

export function LocationMapSection() {
  const map = project.locationContext.map;
  return <section id="location" className="location-section map-section" aria-labelledby="map-title"><Container><div className="map-heading"><SectionLabel>22 / Location Map</SectionLabel><h2 id="map-title" className="section-heading">Located within<br /><em>GIFT City.</em></h2><p>{map.supportingLine}</p></div><MapPlaceholder coordinates={map.coordinates} landmarks={map.landmarks} mapLabel={map.label} /></Container></section>;
}
