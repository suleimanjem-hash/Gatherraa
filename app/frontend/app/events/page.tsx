'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Calendar, Star, Users } from 'lucide-react';
import { PublicLayout } from '@/components/layout';
import { Badge, Button, Card, Spinner } from '@/components/ui';
import { Event, eventsApi } from '../../lib/api/events';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const limit = 12;

  useEffect(() => {
    loadEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const loadEvents = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await eventsApi.getEvents(page, limit);
      if (page === 1) {
        setEvents(response.data);
      } else {
        setEvents((prev) => [...prev, ...response.data]);
      }
      setTotal(response.total);
      setHasMore(response.data.length === limit && events.length + response.data.length < response.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDateRange = (start: string, end: string | null) => {
    const startDate = new Date(start);
    const endDate = end ? new Date(end) : null;

    if (endDate && startDate.toDateString() === endDate.toDateString()) {
      return `${formatDate(start)} ${formatTime(start)} - ${formatTime(end!)}`;
    }
    if (endDate) return `${formatDate(start)} - ${formatDate(end!)}`;
    return formatDate(start);
  };

  const getEventStatus = (startTime: string, endTime: string | null) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = endTime ? new Date(endTime) : null;

    if (end && now > end) return { label: 'Ended', variant: 'warning' as const };
    if (now >= start && (!end || now <= end)) return { label: 'Live', variant: 'success' as const };
    if (start.getTime() - now.getTime() < 7 * 24 * 60 * 60 * 1000) {
      return { label: 'Upcoming', variant: 'neutral' as const };
    }
    return { label: 'Scheduled', variant: 'neutral' as const };
  };

  if (loading && events.length === 0) {
    return (
      <PublicLayout title="Events" subtitle="Discover upcoming blockchain events, conferences, and workshops.">
        <div className="flex h-72 items-center justify-center">
          <Spinner size="lg" />
        </div>
      </PublicLayout>
    );
  }

  if (error && events.length === 0) {
    return (
      <PublicLayout title="Events" subtitle="Discover upcoming blockchain events, conferences, and workshops.">
        <Card className="text-center">
          <p className="mb-4 text-danger">{error}</p>
          <Button onClick={loadEvents}>Retry</Button>
        </Card>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout title="Events" subtitle="Discover upcoming blockchain events, conferences, and workshops.">
      {total > 0 ? (
        <p className="mb-6 text-sm text-muted">
          Showing {events.length} of {total} events
        </p>
      ) : null}

      {events.length === 0 ? (
        <Card className="text-center">
          <p className="text-muted">No events found</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => {
            const status = getEventStatus(event.startTime, event.endTime);
            return (
              <Link key={event.id} href={`/events/${event.id}`} className="group">
                <Card className="h-full transition-shadow hover:shadow-md">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <Badge variant={status.variant}>{status.label}</Badge>
                    {event.ratingSummary && event.ratingSummary.totalReviews > 0 ? (
                      <div className="flex items-center gap-1 text-sm text-muted">
                        <Star className="h-4 w-4 fill-warning text-warning" />
                        <span className="font-medium text-foreground">
                          {event.ratingSummary.averageRating.toFixed(1)}
                        </span>
                        <span className="text-xs">({event.ratingSummary.totalReviews})</span>
                      </div>
                    ) : null}
                  </div>

                  <h2 className="mb-2 text-xl font-semibold group-hover:text-primary">{event.name}</h2>

                  {event.description ? (
                    <p className="mb-4 line-clamp-2 text-sm text-muted">{event.description}</p>
                  ) : null}

                  <div className="mb-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDateRange(event.startTime, event.endTime)}</span>
                    </div>
                    {event.ratingSummary && event.ratingSummary.totalReviews > 0 ? (
                      <div className="flex items-center gap-2 text-sm text-muted">
                        <Users className="h-4 w-4" />
                        <span>{event.ratingSummary.totalReviews} reviews</span>
                      </div>
                    ) : null}
                  </div>

                  <div className="flex items-center gap-2 text-sm font-medium text-primary group-hover:gap-3">
                    <span>View Details</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      {hasMore ? (
        <div className="mt-8 text-center">
          <Button onClick={() => setPage((prev) => prev + 1)} disabled={loading}>
            {loading ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      ) : null}
    </PublicLayout>
  );
}
