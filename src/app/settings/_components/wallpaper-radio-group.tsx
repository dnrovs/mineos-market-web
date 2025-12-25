import { Field, FieldLabel } from '@/components/ui/shadcn/field'
import { RadioGroup, RadioGroupItem } from '@/components/ui/shadcn/radio-group'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger
} from '@/components/ui/shadcn/tooltip'
import { chatWallpapers } from '@/lib/constants'
import { Ban } from 'lucide-react'
import { useExtracted } from 'next-intl'
import Image from 'next/image'
import { ControllerRenderProps } from 'react-hook-form'

export default function WallpaperRadioGroup({
    wallpapers,
    value,
    onChange
}: {
    wallpapers: (typeof chatWallpapers)['dark' | 'light']
    value?: string
    onChange: ControllerRenderProps['onChange']
}) {
    const t = useExtracted()

    const getAuthorFromPictureName = (url: string) => {
        const splitted = url.split('/').reverse()[0].split('.')[0]

        return splitted
            .split('-')
            .map((name) => name[0].toUpperCase() + name.slice(1))
            .join(' ')
    }

    return (
        <RadioGroup
            value={value}
            onValueChange={onChange}
            className={'flex flex-row'}
        >
            <FieldLabel className={'w-5'}>
                <Field className={'flex h-full justify-center'}>
                    <Ban className={'text-muted-foreground'} />
                    <RadioGroupItem value={''} className={'sr-only'} />
                </Field>
            </FieldLabel>
            {wallpapers.map((wallpaper) => (
                <Tooltip key={wallpaper}>
                    <TooltipTrigger asChild>
                        <FieldLabel>
                            <Field className={'p-px!'}>
                                <Image
                                    src={wallpaper}
                                    width={256}
                                    height={256}
                                    alt={t('Wallpaper image')}
                                    className={'aspect-square rounded-[7px]'}
                                />

                                <RadioGroupItem
                                    value={wallpaper}
                                    className={'sr-only'}
                                />
                            </Field>
                        </FieldLabel>
                    </TooltipTrigger>

                    <TooltipContent>
                        {getAuthorFromPictureName(wallpaper)}
                    </TooltipContent>
                </Tooltip>
            ))}
        </RadioGroup>
    )
}
