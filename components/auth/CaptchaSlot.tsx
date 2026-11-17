"use client";

import { forwardRef } from "react";
import {
  GoogleRecaptcha,
  type GoogleRecaptchaRef,
  type GoogleRecaptchaProps,
} from "./GoogleRecaptcha";

export type CaptchaSlotRef = GoogleRecaptchaRef;
export type CaptchaSlotProps = GoogleRecaptchaProps;

export const CaptchaSlot = forwardRef<CaptchaSlotRef, CaptchaSlotProps>(
  function CaptchaSlot(props, ref) {
    return <GoogleRecaptcha ref={ref} {...props} />;
  }
);
