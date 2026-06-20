'use client';

import { useMemo, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle, AlertTriangle, ArrowLeft } from 'lucide-react';
import TicketPreview from '@/components/ticket-preview/TicketPreview';
import FormInput from '@/components/forms/FormInput';
import { Button } from '@/components/ui/atoms/Button/Button';

const transferSchema = z.object({
  recipient: z
    .string()
    .length(56, 'Stellar address must be 56 characters')
    .regex(/^G[A-Z2-7]{55}$/, 'Must be a valid Stellar address starting with G'),
});

type TransferFormValues = z.infer<typeof transferSchema>;

type Ticket = {
  id: string;
  name: string;
  event: string;
  date: string;
  holder: string;
  seat: string;
  qrCodeUrl?: string;
};

const sampleTickets: Ticket[] = [
  {
    id: 'ticket-1',
    name: 'Stellar Summit Pass',
    event: 'Stellar Summit 2026',
    date: 'June 25, 2026 · 7:00 PM',
    holder: 'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    seat: 'Floor A · Row 5 · Seat 12',
  },
  {
    id: 'ticket-2',
    name: 'Launch Party Access',
    event: 'Stellar Summit 2026',
    date: 'June 26, 2026 · 9:00 PM',
    holder: 'GBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
    seat: 'Balcony B · Row 3 · Seat 8',
  },
];

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>(sampleTickets);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [confirmationData, setConfirmationData] = useState<TransferFormValues | null>(null);
  const [step, setStep] = useState<'form' | 'review' | 'success' | 'error'>('form');
  const [statusMessage, setStatusMessage] = useState<string>('');

  const selectedTicket = useMemo(
    () => tickets.find((ticket) => ticket.id === selectedTicketId) ?? null,
    [selectedTicketId, tickets],
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TransferFormValues>({
    resolver: zodResolver(transferSchema),
    mode: 'onBlur',
    defaultValues: { recipient: '' },
  });

  const openTransfer = (ticketId: string) => {
    setSelectedTicketId(ticketId);
    setConfirmationData(null);
    setStep('form');
    setStatusMessage('');
    reset();
  };

  const closeTransfer = () => {
    setSelectedTicketId(null);
    setConfirmationData(null);
    setStep('form');
    setStatusMessage('');
    reset();
  };

  const onSubmit = (values: TransferFormValues) => {
    setConfirmationData(values);
    setStep('review');
  };

  const performTransfer = async () => {
    if (!selectedTicket || !confirmationData) {
      return;
    }

    setStep('form');
    setStatusMessage('Transferring ticket...');

    await new Promise((resolve) => setTimeout(resolve, 800));

    if (confirmationData.recipient.toUpperCase() === selectedTicket.holder.toUpperCase()) {
      setStep('error');
      setStatusMessage('Transfer failed: recipient wallet matches the current ticket holder.');
      return;
    }

    setTickets((previous) =>
      previous.map((ticket) =>
        ticket.id === selectedTicket.id
          ? {
              ...ticket,
              holder: confirmationData.recipient,
            }
          : ticket,
      ),
    );

    setStep('success');
    setStatusMessage(`Success! Ticket transferred to ${confirmationData.recipient}.`);
  };

  const transferPanel = selectedTicket ? (
    <div className="rounded-3xl border border-zinc-200/70 bg-white/90 p-6 shadow-xl shadow-zinc-900/5 backdrop-blur-xl dark:border-zinc-700/60 dark:bg-zinc-950/95">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Transfer Ticket
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">
            {selectedTicket.name}
          </h2>
        </div>
        <Button variant="ghost" size="sm" onClick={closeTransfer}>
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
      </div>

      <div className="space-y-5">
        <TicketPreview ticket={selectedTicket} />

        {step === 'form' && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormInput
              label="Recipient Stellar Wallet"
              name="recipient"
              placeholder="G..."
              error={errors.recipient}
              {...register('recipient')}
              hint="Enter a valid Stellar public key."
              required
            />
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button variant="secondary" type="button" onClick={closeTransfer}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                Review Transfer
              </Button>
            </div>
          </form>
        )}

        {step === 'review' && confirmationData && (
          <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-center gap-3 text-slate-900 dark:text-white">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              <p className="text-sm font-semibold">Review transfer details</p>
            </div>
            <div className="grid gap-3 text-sm text-slate-700 dark:text-slate-300">
              <div>
                <p className="font-semibold">Ticket</p>
                <p>{selectedTicket.name}</p>
              </div>
              <div>
                <p className="font-semibold">Current holder</p>
                <p className="font-mono break-all">{selectedTicket.holder}</p>
              </div>
              <div>
                <p className="font-semibold">Recipient wallet</p>
                <p className="font-mono break-all">{confirmationData.recipient}</p>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button variant="secondary" onClick={() => setStep('form')}>
                Edit
              </Button>
              <Button onClick={performTransfer}>Confirm Transfer</Button>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="rounded-3xl border border-emerald-300/70 bg-emerald-50 p-5 text-emerald-950 dark:border-emerald-500/30 dark:bg-emerald-950/10 dark:text-emerald-200">
            <div className="flex items-start gap-3">
              <CheckCircle className="mt-1 h-5 w-5 text-emerald-500" />
              <div>
                <p className="font-semibold">Transfer completed</p>
                <p className="text-sm text-slate-700 dark:text-slate-300">{statusMessage}</p>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={closeTransfer}>Return to tickets</Button>
            </div>
          </div>
        )}

        {step === 'error' && (
          <div className="rounded-3xl border border-rose-300/70 bg-rose-50 p-5 text-rose-950 dark:border-rose-500/30 dark:bg-rose-950/10 dark:text-rose-200">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-1 h-5 w-5 text-rose-500" />
              <div>
                <p className="font-semibold">Transfer failed</p>
                <p className="text-sm text-slate-700 dark:text-slate-300">{statusMessage}</p>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button variant="secondary" onClick={() => setStep('form')}>
                Try again
              </Button>
              <Button onClick={closeTransfer}>Cancel transfer</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  ) : null;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 dark:bg-slate-950 dark:text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-8 shadow-xl shadow-slate-900/5 backdrop-blur dark:border-slate-700/60 dark:bg-slate-950/95">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
            My Tickets
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Transfer tickets to another Stellar wallet
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            Select a ticket, enter the recipient's Stellar public key, and confirm the transfer. The form validates wallet format and protects against self-transfers.
          </p>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.4fr_0.85fr]">
          <div className="space-y-6">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm shadow-slate-900/5 transition-all duration-200 hover:border-slate-300 dark:border-slate-700/60 dark:bg-slate-950/95"
              >
                <TicketPreview ticket={ticket} />
                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Current Holder: <span className="font-mono text-slate-900 dark:text-slate-100">{ticket.holder}</span>
                  </div>
                  <Button onClick={() => openTransfer(ticket.id)}>
                    Transfer this ticket
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {selectedTicket ? (
            <div>{transferPanel}</div>
          ) : (
            <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-xl shadow-slate-900/5 dark:border-slate-700/60 dark:bg-slate-950/95">
              <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Ready to transfer?</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                Choose a ticket from the list to start a Stellar wallet transfer. The wallet address is validated before you confirm.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
