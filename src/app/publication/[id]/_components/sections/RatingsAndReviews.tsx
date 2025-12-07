'use client'

import { clsx } from 'clsx'
import { Pencil, Star, ThumbsDown, ThumbsUp } from 'lucide-react'
import { Publication, Review as ReviewT } from 'mineos-market-client'
import { useExtracted, useFormatter } from 'next-intl'
import Link from 'next/link'
import { notFound, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import ProvidedAvatar from '@/components/ui/provided-avatar'
import { Avatar, AvatarFallback } from '@/components/ui/shadcn/avatar'
import { Button } from '@/components/ui/shadcn/button'
import { Card } from '@/components/ui/shadcn/card'
import { Item, ItemActions, ItemTitle } from '@/components/ui/shadcn/item'
import { Progress } from '@/components/ui/shadcn/progress'
import { Separator } from '@/components/ui/shadcn/separator'
import { Spinner } from '@/components/ui/shadcn/spinner'
import { Textarea } from '@/components/ui/shadcn/textarea'
import { useMarket } from '@/context/MarketProvider'
import handleFetchError from '@/hooks/use-handle-request-error'
import useHandleRequestError from '@/hooks/use-handle-request-error'

interface RatingSummaryProps {
    averageRating?: number
    reviews: ReviewT[]
}

function RatingSummary({ reviews, averageRating = 0 }: RatingSummaryProps) {
    const t = useExtracted()

    const counts = [5, 4, 3, 2, 1].map((rating) => ({
        rating,
        count: reviews.filter((r) => r.rating === rating).length
    }))

    const total = reviews.length || 1

    return (
        <div className={'flex w-full justify-between gap-8'}>
            <div className={'text-muted-foreground flex flex-col items-center'}>
                <span className={'text-5xl font-semibold'}>
                    {averageRating.toFixed(1)}
                </span>
                <span>{t('out of 5')}</span>
            </div>
            <div className="flex w-full max-w-xs gap-2">
                <div className="flex flex-col justify-between">
                    {counts.map(({ rating }) => (
                        <div key={rating} className="flex justify-end gap-1">
                            {Array.from({ length: rating }).map((_, i) => (
                                <Star
                                    key={i}
                                    className="text-muted-foreground size-3 fill-current"
                                />
                            ))}
                        </div>
                    ))}
                </div>

                <div className={'flex w-full flex-col justify-between py-0.5'}>
                    {counts.map(({ rating, count }) => (
                        <Progress
                            key={rating}
                            value={(count / total) * 100}
                            className="h-2 w-full"
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

type RatingStarsProps = {
    value?: number
    onChange?: (value: number) => void
    compact?: boolean
}

export function RatingStars({
    value,
    onChange,
    compact = false
}: RatingStarsProps) {
    const [internalValue, setInternalValue] = useState<number>(0)
    const [hoverValue, setHoverValue] = useState<number | null>(null)

    useEffect(() => {
        if (typeof value === 'number') setInternalValue(value)
    }, [value])

    const displayed = hoverValue !== null ? hoverValue : internalValue

    function handleSelect(i: number) {
        if (typeof value !== 'number') setInternalValue(i)
        onChange?.(i)
    }

    return (
        <div className={'flex'}>
            {Array.from({ length: 5 }).map((_, idx) => {
                const i = idx + 1
                const fill =
                    i <= (hoverValue ?? displayed)
                        ? 'currentcolor'
                        : 'transparent'

                return (
                    <div
                        key={i}
                        onClick={() => handleSelect(i)}
                        onMouseEnter={() => setHoverValue(i)}
                        onMouseLeave={() => setHoverValue(null)}
                        className={clsx(
                            'cursor-pointer rounded',
                            compact ? 'not-first:pl-0.5' : 'not-first:pl-4'
                        )}
                    >
                        <Star fill={fill} size={compact ? 19 : 28} />
                    </div>
                )
            })}
        </div>
    )
}

interface ReviewProps {
    review: ReviewT
    publication: Publication
}

function Review({ review, publication }: ReviewProps) {
    const { client, user } = useMarket()
    const handleRequestError = useHandleRequestError()

    const t = useExtracted()
    const format = useFormatter()

    const router = useRouter()

    const [reviewState, setReviewState] = useState(review)

    const [voted, setVoted] = useState<'positive' | 'negative' | null>(null)
    const [loadingVote, setLoadingVote] = useState<
        'positive' | 'negative' | null
    >(null)

    const [editing, setEditing] = useState(false)
    const [editText, setEditText] = useState(reviewState.comment)
    const [editRating, setEditRating] = useState<number>(reviewState.rating)
    const [saving, setSaving] = useState(false)

    const ownReview = user?.name === reviewState.userName

    const updateReview = async () => {
        try {
            const reviews = await client.reviews.getReviews({
                fileId: publication.fileId
            })

            const review = reviews.find(
                (r) => r.userName === reviewState.userName
            )

            if (!review) {
                toast.error(t('Tried to update a review that does not exist.'))
                return null
            }

            setReviewState(review)
            return review
        } catch (error) {
            handleRequestError(error, t('while updating a review'))
            return null
        }
    }

    const voteReview = (helpful: boolean) => {
        if (!user) return router.push('/login')

        if (loadingVote) return

        const type = helpful ? 'positive' : 'negative'

        setLoadingVote(type)

        client.reviews
            .voteReview({ reviewId: reviewState.id, helpful })
            .then(async () => {
                const votesBefore = JSON.stringify(reviewState.votes)

                const updatedReview = await updateReview()

                if (!updatedReview) return

                const votesAfter = JSON.stringify(updatedReview.votes)

                if (votesBefore === votesAfter) {
                    toast.info(t('Already voted!'))
                }

                setVoted(type)
            })
            .catch((error) =>
                handleRequestError(error, t('while voting a review'))
            )
            .finally(() => setLoadingVote(null))
    }

    const saveEdit = async () => {
        if (!client.getToken() || !ownReview || !publication) return
        setSaving(true)

        const saveEditPromise = client.reviews
            .postReview({
                fileId: publication.fileId,
                rating: editRating as 1 | 2 | 3 | 4 | 5,
                comment: editText
            })
            .then(() => {
                setEditing(false)
                updateReview()
            })
            .catch((error) => {
                throw new Error(
                    handleRequestError(
                        error,
                        t('while updating a review'),
                        true
                    )
                )
            })
            .finally(() => setSaving(false))

        toast.promise(saveEditPromise, {
            loading: t('Updating review...'),
            success: t('Review updated successfully!'),
            error: (error: Error) => error.message
        })
    }

    return (
        <>
            <div className="flex flex-col gap-2 border-l-3 pl-3">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <Link
                            className="group flex items-center gap-2"
                            href={`/user/${reviewState.userName}`}
                        >
                            <ProvidedAvatar
                                username={reviewState.userName}
                                className="size-10"
                            />
                            <span
                                className={
                                    'underline-offset-2 group-hover:underline'
                                }
                            >
                                {reviewState.userName}
                            </span>
                        </Link>
                        <span className="text-muted-foreground text-sm">
                            {format.dateTime(
                                new Date(reviewState.timestamp * 1000),
                                {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                }
                            )}
                        </span>
                    </div>
                    {editing ? (
                        <RatingStars
                            compact={!editing}
                            value={editRating}
                            onChange={(value) => setEditRating(value)}
                        />
                    ) : (
                        <div className="flex gap-0.5">
                            {Array.from({ length: 5 }, (_, i) => (
                                <Star
                                    key={i}
                                    size={19}
                                    fill={
                                        i < reviewState.rating
                                            ? 'currentcolor'
                                            : 'none'
                                    }
                                />
                            ))}
                        </div>
                    )}
                </div>

                {editing ? (
                    <Textarea
                        value={editText}
                        onInput={(e) => setEditText(e.currentTarget.value)}
                    />
                ) : (
                    <span>{reviewState.comment}</span>
                )}

                <div className="flex gap-2">
                    {!ownReview ? (
                        <>
                            <Button
                                variant="secondary"
                                onClick={() => voteReview(true)}
                                disabled={loadingVote !== null}
                            >
                                {loadingVote === 'positive' ? (
                                    <Spinner className="h-4 w-4" />
                                ) : (
                                    <ThumbsUp
                                        className={clsx(
                                            voted === 'positive' &&
                                                'fill-current'
                                        )}
                                    />
                                )}
                                {reviewState.votes?.positive &&
                                reviewState.votes.positive > 0
                                    ? reviewState.votes.positive
                                    : null}
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={() => voteReview(false)}
                                disabled={loadingVote !== null}
                            >
                                {loadingVote === 'negative' ? (
                                    <Spinner className="h-4 w-4" />
                                ) : (
                                    <ThumbsDown
                                        className={clsx(
                                            voted === 'negative' &&
                                                'fill-current'
                                        )}
                                    />
                                )}
                                {reviewState.votes &&
                                    reviewState.votes.total -
                                        (reviewState.votes.positive ?? 0) >
                                        0 &&
                                    reviewState.votes.total -
                                        (reviewState.votes.positive ?? 0)}
                            </Button>
                        </>
                    ) : !editing ? (
                        <Button
                            variant="secondary"
                            onClick={() => setEditing(true)}
                        >
                            <Pencil />
                            {t('Edit')}
                        </Button>
                    ) : (
                        <>
                            <Button onClick={saveEdit} disabled={saving}>
                                {saving && <Spinner className="h-4 w-4" />} Save
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={() => {
                                    setEditing(false)
                                    setEditText(reviewState.comment)
                                }}
                                disabled={saving}
                            >
                                {t('Cancel')}
                            </Button>
                        </>
                    )}
                </div>
            </div>
            {ownReview && <Separator />}
        </>
    )
}

interface RatingsAndReviewsProps {
    publication: Publication
    reviews: ReviewT[]
    updateData: () => void
}

export default function RatingsAndReviews({
    publication,
    reviews,
    updateData
}: RatingsAndReviewsProps) {
    const { client, user } = useMarket()
    const handleRequestError = useHandleRequestError()
    const t = useExtracted()
    const [stars, setStars] = useState<number>(0)
    const [reviewText, setReviewText] = useState<string>('')

    const reviewed = reviews.some((r) => user?.name === r.userName)

    const postReview = async () => {
        if (!user) return

        const postReviewPromise = client.reviews
            .postReview({
                fileId: publication.fileId,
                rating: stars as 1 | 2 | 3 | 4 | 5,
                comment: reviewText
            })
            .then(() => {
                setStars(0)
                setReviewText('')
                updateData()
            })
            .catch((error) => {
                throw new Error(
                    handleRequestError(error, t('while posting a review'), true)
                )
            })

        toast.promise(postReviewPromise, {
            loading: t('Posting review...'),
            success: t('Review posted successfully!'),
            error: (error: Error) => error.message
        })
    }

    const sortedReviews = [...reviews].sort((a, b) => {
        if (user?.name === a.userName) return -1
        if (user?.name === b.userName) return 1
        return 0
    })

    return (
        <section className="flex flex-col gap-3">
            <h2 className="text-xl font-bold">{t('Ratings & Reviews')}</h2>

            <div className={'flex flex-col gap-5'}>
                <RatingSummary
                    averageRating={publication?.averageRating}
                    reviews={reviews}
                />

                {!user && (
                    <div className="text-muted-foreground text-center">
                        {t(
                            'Login or register to rate publications and reviews'
                        )}
                    </div>
                )}

                {!reviewed && user && (
                    <>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between border-l-3 pl-3">
                                <span className="text-muted-foreground pr-3">
                                    {t('Tap to rate this:')}
                                </span>
                                <RatingStars
                                    onChange={(stars) => setStars(stars)}
                                    value={stars}
                                />
                            </div>
                            {stars > 0 && (
                                <>
                                    <Textarea
                                        placeholder={t('Write a review...')}
                                        onInput={(e) =>
                                            setReviewText(e.currentTarget.value)
                                        }
                                        value={reviewText}
                                    />
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={postReview}
                                            disabled={reviewText.length === 0}
                                        >
                                            {t('Rate publication')}
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            onClick={() => {
                                                setStars(0)
                                                setReviewText('')
                                            }}
                                        >
                                            {t('Cancel')}
                                        </Button>
                                    </div>
                                </>
                            )}
                        </div>
                    </>
                )}

                <div className="flex flex-col gap-5">
                    {sortedReviews.map((review) => (
                        <Review
                            key={review.id}
                            review={review}
                            publication={publication}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}
