"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import { CheckCheck } from "lucide-react";
import { StarMark } from "@/components/ui/Logo";

/*
 * An illustrative WhatsApp conversation, abstracted to the site palette: a
 * flat, square-cornered handset in ink, with the customer's reply in blue.
 * The shop and customer are made up.
 */

type Message = { from: "brand" | "customer"; label?: string; text: string; time: string };

const messages: Message[] = [
  {
    from: "brand",
    label: "After the bill",
    text: "Thank you for shopping with us, Priya. Your invoice is attached.",
    time: "11:02",
  },
  { from: "brand", label: "Feedback", text: "How was your visit today?", time: "11:30" },
  { from: "customer", text: "Excellent, very helpful staff.", time: "11:34" },
  {
    from: "brand",
    label: "Birthday greeting",
    text: "Happy birthday, Priya! Enjoy 15% off this week.",
    time: "09:00",
  },
  {
    from: "brand",
    label: "Festival offer",
    text: "Our Diwali collection opens to you first, on Friday.",
    time: "10:15",
  },
];

function Bubble({ m, index, progress }: { m: Message; index: number; progress: MotionValue<number> }) {
  const start = 0.04 + index * 0.18;
  const opacity = useTransform(progress, [start, start + 0.1], [0, 1]);
  const y = useTransform(progress, [start, start + 0.1], [12, 0]);
  const mine = m.from === "customer";

  return (
    <motion.li style={{ opacity, y }} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[84%] border-2 px-3 py-2 text-small leading-snug ${
          mine ? "border-blue bg-blue text-white" : "border-ink bg-white text-ink"
        }`}
      >
        {m.label && <p className="mb-1 text-micro font-bold uppercase tracking-wider text-blue">{m.label}</p>}
        <p>{m.text}</p>
        <p className={`mt-1 flex items-center justify-end gap-1 text-micro ${mine ? "text-white" : "text-muted"}`}>
          {m.time}
          {!mine && <CheckCheck aria-hidden className="size-3.5 text-blue" />}
        </p>
      </div>
    </motion.li>
  );
}

export function PhoneChat({ progress }: { progress: MotionValue<number> }) {
  return (
    <div className="mx-auto w-full max-w-[19rem] lg:ml-auto lg:mr-0">
      <div className="border-4 border-ink bg-ink">
        <div className="flex items-center gap-3 px-4 py-4 text-white">
          <div className="grid size-10 shrink-0 place-items-center bg-white">
            <StarMark className="size-5 text-blue" />
          </div>
          <div>
            <p className="text-small font-bold uppercase tracking-wide">Sharma Jewellers</p>
            <p className="text-micro text-mist">Business account</p>
          </div>
        </div>
        <ul
          aria-label="Example of automated WhatsApp messages"
          className="flex h-[31rem] flex-col justify-end gap-2 overflow-hidden bg-surface p-3 swiss-dots"
        >
          {messages.map((m, i) => (
            <Bubble key={i} m={m} index={i} progress={progress} />
          ))}
        </ul>
      </div>
    </div>
  );
}
