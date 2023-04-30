export default function setAllLayersVisibility(map, slug, essentialsVisibility) {
    if (map) {
        map.setLayoutProperty(slug, 'visibility', essentialsVisibility);
        map.setLayoutProperty(`${slug}-fill`, 'visibility', essentialsVisibility);
    }
}
