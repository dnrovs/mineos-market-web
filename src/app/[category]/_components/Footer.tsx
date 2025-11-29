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

interface FooterProps {
    isNextPage: boolean

    currentPage: number
    showPerPage: string

    setCurrentPage: (currentPage: number) => void
    setShowPerPage: (showPerPage: string) => void
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
                    defaultValue={'25'}
                    onValueChange={setShowPerPage}
                    value={showPerPage}
                >
                    <SelectTrigger className={'w-20'}>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="75">75</SelectItem>
                        <SelectItem value="100">100</SelectItem>
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
