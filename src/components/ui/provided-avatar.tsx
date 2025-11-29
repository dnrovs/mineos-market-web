import { useConfig } from '@/hooks/use-config'
import {
    Avatar,
    AvatarFallback,
    AvatarImage
} from '@/components/ui/shadcn/avatar'
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
            {config.behaviour.useAvatarImages && (
                <AvatarImage src={config.behaviour.avatarProvider + username} />
            )}
            <AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
    )
}
