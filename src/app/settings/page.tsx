'use client'

import { useExtracted } from 'next-intl'
import { parseAsStringLiteral, useQueryState } from 'nuqs'

import ResetSettingsAlertDialogTrigger from '@/app/settings/_components/reset-settings-alert-dialog-trigger'
import AccountTab from '@/app/settings/_tabs/account'
import BehaviourTab from '@/app/settings/_tabs/behaviour'
import DeveloperTab from '@/app/settings/_tabs/developer'
import Header from '@/components/layout/header'
import { Button } from '@/components/ui/shadcn/button'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from '@/components/ui/shadcn/card'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from '@/components/ui/shadcn/tabs'
import { Tooltip, TooltipContent } from '@/components/ui/shadcn/tooltip'
import { Config, useConfig } from '@/hooks/use-config'
import { TooltipTrigger } from '@radix-ui/react-tooltip'
import { RotateCcw } from 'lucide-react'
import { toast } from 'sonner'

export function useSaveSettings() {
    const { setConfig } = useConfig()
    const t = useExtracted()

    return <T extends keyof Config>(tab: T, value: Partial<Config[T]>) => {
        setConfig({ [tab]: value })

        toast.success(t('Settings saved successfully.'))
    }
}

export default function Settings() {
    const t = useExtracted()

    const tabs = [
        {
            name: t('Account'),
            value: 'account',
            content: <AccountTab />
        },
        {
            name: t('Behaviour'),
            value: 'behaviour',
            content: <BehaviourTab />
        },
        { name: t('Developer'), value: 'developer', content: <DeveloperTab /> }
    ]

    const [tab, setTab] = useQueryState(
        'tab',
        parseAsStringLiteral(tabs.map((t) => t.value)).withDefault(
            tabs[0].value
        )
    )

    return (
        <main className={'flex h-svh w-full flex-col overflow-auto'}>
            <Header />
            <div className={'flex h-full items-center justify-center'}>
                <Tabs
                    defaultValue={tab}
                    onValueChange={(value) => setTab(value)}
                    className={
                        'm-3 flex h-full w-full items-center justify-center sm:m-0 sm:max-w-md'
                    }
                >
                    <TabsList className={'w-full'}>
                        {tabs.map((tab) => (
                            <TabsTrigger key={tab.value} value={tab.value}>
                                {tab.name}
                            </TabsTrigger>
                        ))}

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <ResetSettingsAlertDialogTrigger asChild>
                                    <Button size={'icon'} variant={'ghost'}>
                                        <RotateCcw />
                                    </Button>
                                </ResetSettingsAlertDialogTrigger>
                            </TooltipTrigger>
                            <TooltipContent side={'bottom'}>
                                {t('Reset settings')}
                            </TooltipContent>
                        </Tooltip>
                    </TabsList>
                    {tabs.map((tab) => (
                        <TabsContent
                            key={tab.value}
                            value={tab.value}
                            className={'flex w-full sm:items-center'}
                        >
                            <Card className={'h-fit w-full pt-4.5'}>
                                <CardHeader
                                    className={
                                        'gap-0 border-b text-center [.border-b]:pb-4.5'
                                    }
                                >
                                    <CardTitle>{tab.name}</CardTitle>
                                </CardHeader>
                                <CardContent>{tab.content}</CardContent>
                            </Card>
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
        </main>
    )
}
