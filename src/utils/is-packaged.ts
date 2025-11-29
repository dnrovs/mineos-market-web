import { PublicationCategory } from 'mineos-market-client'

const isPackaged = (
    category: PublicationCategory
): category is
    | PublicationCategory.Applications
    | PublicationCategory.Wallpapers =>
    [PublicationCategory.Applications, PublicationCategory.Wallpapers].includes(
        category
    )

export default isPackaged
