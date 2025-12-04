import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from '@/components/ui/shadcn/pagination'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/shadcn/select'
import { useExtracted } from 'next-intl'

const perPageVariants = [25, 50, 75, 100]

interface FooterProps {
    isNextPage: boolean

    currentPage: number
    showPerPage: number

    setCurrentPage: (currentPage: number) => void
    setShowPerPage: (showPerPage: number) => void
}

export default function Footer({
    showPerPage,
    setShowPerPage,
    currentPage,
    setCurrentPage,
    isNextPage
}: FooterProps) {
    const t = useExtracted()

    return (
        <div
            className={
                'bg-background bottom-0 flex w-full items-center justify-between px-3 py-3'
            }
        >
            <div className={'flex items-center gap-2.5'}>
                <span>{t('Show')}</span>
                <Select
                    defaultValue={String(perPageVariants[0])}
                    onValueChange={(value) => setShowPerPage(Number(value))}
                    value={String(showPerPage)}
                >
                    <SelectTrigger className={'w-20'}>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {perPageVariants.map((variant) => (
                            <SelectItem key={variant} value={String(variant)}>
                                {variant}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <Pagination>
                <PaginationContent>
                    {currentPage > 1 && (
                        <>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() =>
                                        setCurrentPage(currentPage - 1)
                                    }
                                />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink
                                    onClick={() =>
                                        setCurrentPage(currentPage - 1)
                                    }
                                >
                                    {currentPage - 1}
                                </PaginationLink>
                            </PaginationItem>
                        </>
                    )}
                    <PaginationItem>
                        <PaginationLink isActive={true}>
                            {currentPage}
                        </PaginationLink>
                    </PaginationItem>
                    {isNextPage && (
                        <>
                            <PaginationItem>
                                <PaginationLink
                                    onClick={() =>
                                        setCurrentPage(currentPage + 1)
                                    }
                                >
                                    {currentPage + 1}
                                </PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationNext
                                    onClick={() =>
                                        setCurrentPage(currentPage + 1)
                                    }
                                />
                            </PaginationItem>
                        </>
                    )}
                </PaginationContent>
            </Pagination>
        </div>
    )
}
