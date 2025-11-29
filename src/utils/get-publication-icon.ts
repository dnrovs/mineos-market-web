import { PublicationCategory } from 'mineos-market-client'

const placeholders = {
    [PublicationCategory.Applications]: '/placeholders/applications.png',
    [PublicationCategory.Libraries]: '/placeholders/libraries.png',
    [PublicationCategory.Scripts]: '/placeholders/scripts.png',
    [PublicationCategory.Wallpapers]: '/placeholders/wallpapers.png'
}

export default function getPublicationIcon(
    icon: string | undefined,
    category: PublicationCategory
) {
    return placeholders[category]
}
