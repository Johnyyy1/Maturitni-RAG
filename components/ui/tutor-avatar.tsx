"use client";

import { BotAvatar } from "bot-avatars";
import type { ComponentProps } from "react";

/** The tutor's face: one character everywhere. Decorative, the text next to it names the tutor. */
export function TutorAvatar(props: Omit<ComponentProps<typeof BotAvatar>, "type">) {
  return (
    <span aria-hidden className="flex shrink-0">
      <BotAvatar type="clover" {...props} />
    </span>
  );
}
