'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { PublicLayout } from '@/components/layout';
import { Button, Card, Modal, Spinner } from '@/components/ui';
import RatingDisplay from '../../../components/reviews/rating-display';
import ReviewForm from '../../../components/reviews/review-form';
import ReviewList from '../../../components/reviews/review-list';
import { Event, eventsApi } from '../../../lib/api/events';

export default function EventDetailPage() {
  const params = useParams();
  const eventId = params.id as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const loadEvent = async () => {
      setLoading(true);
      setError(null);

      try {
        const eventData = await eventsApi.getEvent(eventId);
        setEvent(eventData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load event');
      } finally {
        setLoading(false);
      }
    };

    if (eventId) loadEvent();
  }, [eventId]);

  const handleReviewSubmit = () => {
    setShowReviewForm(false);
    setRefreshKey((prev) => prev + 1);
    if (eventId) {
      eventsApi.getEvent(eventId).then(setEvent).catch(console.error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <PublicLayout title="Event Details">
        <div className="flex h-72 items-center justify-center">
          <Spinner size="lg" />
        </div>
      </PublicLayout>
    );
  }

  if (error || !event) {
    return (
      <PublicLayout title="Event Details">
        <Card className="text-center">
          <p className="mb-4 text-danger">{error || 'Event not found'}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </Card>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout title={event.name} subtitle={event.description || 'Event details and community reviews.'}>
      <Link href="/events" className="mb-6 inline-flex items-center gap-2 text-sm text-muted hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Back to Events
      </Link>

      <Card className="mb-6">
        <div className="flex flex-wrap gap-4 text-sm text-muted">
          <div>
            <span className="font-medium text-foreground">Start:</span> {formatDate(event.startTime)}
          </div>
          {event.endTime ? (
            <div>
              <span className="font-medium text-foreground">End:</span> {formatDate(event.endTime)}
            </div>
          ) : null}
          <div>
            <span className="font-medium text-foreground">Contract:</span>{' '}
            <span className="font-mono text-xs">{event.contractAddress}</span>
          </div>
        </div>
      </Card>

      {event.ratingSummary ? (
        <div className="mb-6">
          <RatingDisplay
            averageRating={event.ratingSummary.averageRating}
            totalReviews={event.ratingSummary.totalReviews}
            ratingDistribution={event.ratingSummary.ratingDistribution}
          />
        </div>
      ) : null}

      <div className="mb-6">
        <Button onClick={() => setShowReviewForm(true)}>Write a Review</Button>
      </div>

      <Modal
        open={showReviewForm}
        onClose={() => setShowReviewForm(false)}
        title={`Review ${event.name}`}
        description="Share your experience with this event."
      >
        <ReviewForm eventId={eventId} onSubmit={handleReviewSubmit} onCancel={() => setShowReviewForm(false)} />
      </Modal>

      <div key={refreshKey}>
        <ReviewList eventId={eventId} />
      </div>
    </PublicLayout>
  );
}
