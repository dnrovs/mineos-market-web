import {
    Avatar,
    AvatarFallback,
    AvatarImage
} from '@/components/ui/shadcn/avatar'
import { useConfig } from '@/hooks/use-config'
import { AvatarProps } from '@radix-ui/react-avatar'

interface ProvidedAvatarProps extends Omit<AvatarProps, 'children'> {
    username: string
}

export default function ProvidedAvatar({
    username,
    ...props
}: ProvidedAvatarProps) {
    const { config } = useConfig()

    return (
        <Avatar {...props}>
            {config.appearance.useAvatarImages && (
                <AvatarImage
                    src={config.appearance.avatarProvider + username}
                />
            )}
            <AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
    )
}
