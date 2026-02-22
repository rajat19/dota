export const getHeroRenderPng = (heroKey: string) => `https://cdn.cloudflare.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/${heroKey.replace(/-/g, '_')}.png`;
export const getAbilityIcon = (internalName: string) => `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/abilities/${internalName}.png`;
export const getFacetIcon = (iconName: string) => `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/icons/facets/${iconName}.png`;

export const getAttributeIcon = (attribute: string) => {
    const mapStr = attribute === 'str' ? 'strength'
        : attribute === 'agi' ? 'agility'
            : attribute === 'int' ? 'intelligence'
                : 'universal';
    return `https://cdn.steamstatic.com/apps/dota2/images/dota_react/icons/hero_${mapStr}.png`;
};
