"use client";

import React, { useCallback, useMemo, useRef, useState } from "react";
import { useTranslation } from "@harjs/translation";
import IProps from "./IProps";
import "../../../assets/css/components/navigation/steps/styles.css";
import Button from "../../form/button";
import { Icon } from "../../icons";
import { useValidation } from "../../../libs/core/application/hooks";
import { Errors, ValidationProps } from "../../../libs/infrastructure/types";
import IStepsLocale from "../../../libs/core/application/locales/steps/IStepsLocale";
import StepsTR from "../../../libs/core/application/locales/steps/tr";
import StepsEN from "../../../libs/core/application/locales/steps/en";
import {
  clampStep,
  getStepClickAction,
  getStepStatus,
  getStepsStorageKey,
  getStepsThemeStyle,
  parseStoredStep,
  resolveStepsOrientation,
  StepStatus,
} from "./helpers";

type StepChildProps<TData extends object> = {
  errors?: Errors<TData>;
};

const STATUS_LOCALE: Record<StepStatus, keyof IStepsLocale> = {
  pending: "Steps.Status.Pending",
  "in-progress": "Steps.Status.InProgress",
  completed: "Steps.Status.Completed",
};

const Steps = function <TData extends object = Record<string, never>>({
  children,
  name,
  steps = [],
  currentStep,
  onChange,
  validation,
  config,
  labels,
  variant,
  direction,
}: IProps<TData>) {
  // refs
  const _navigating = useRef(false);

  // variables
  const orientation = resolveStepsOrientation(variant, direction);
  const showHeader = Boolean(config?.header);
  const isVertical = !showHeader && orientation === "vertical";
  const themeStyle = getStepsThemeStyle(config?.theme);
  const isControlled = typeof currentStep === "number";
  const isAutomatic = Boolean(config?.isAutomatic);
  const hasValidation = Boolean(validation);
  const stepCount = steps.length;
  const storageKey = useMemo(() => getStepsStorageKey(name), [name]);

  // states
  const [internalStep, setInternalStep] = useState(() => {
    if (isControlled) return clampStep(currentStep ?? 0, stepCount);
    if (isAutomatic || typeof window === "undefined") return 0;

    return parseStoredStep(window.sessionStorage.getItem(storageKey), stepCount) ?? 0;
  });
  const [isNavigating, setIsNavigating] = useState(false);

  // variables
  const activeStep = clampStep(isControlled ? (currentStep ?? 0) : internalStep, stepCount);

  // hooks
  const { t } = useTranslation<IStepsLocale>(String(config?.locale ?? "tr"), {
    tr: { ...StepsTR },
    en: { ...StepsEN },
  });
  const { errors, onSubmit, setSubmit } = useValidation(
    validation?.data as TData,
    (validation?.rules ?? []) as ValidationProps<TData>[],
    activeStep + 1,
  );

  // methods
  const persistStep = useCallback(
    (step: number) => {
      // Otomatik adımda session'a yazma...
      if (isAutomatic || typeof window === "undefined") return;
      window.sessionStorage.setItem(storageKey, String(step));
    },
    [isAutomatic, storageKey],
  );

  const commitStep = useCallback(
    (step: number) => {
      const next = clampStep(step, stepCount);
      if (!isControlled) setInternalStep(next);
      persistStep(next);
      onChange(next);
      setSubmit(false);
    },
    [isControlled, onChange, persistStep, setSubmit, stepCount],
  );

  const requestStep = useCallback(
    (target: number) => {
      // Navigasyon sürerken tekrar tetiklenmesine izin verme...
      if (_navigating.current || isNavigating) return;

      const next = clampStep(target, stepCount);
      const action = getStepClickAction(next, activeStep, { isAutomatic, hasValidation });

      // Validation varken ileri adıma atlamaya veya çift gönderime izin verme...
      if (action === "blocked" || action === "ignore") return;

      if (action === "commit") {
        commitStep(next);
        return;
      }

      _navigating.current = true;
      setIsNavigating(true);
      onSubmit((result) => {
        _navigating.current = false;
        setIsNavigating(false);
        if (!result) return;
        commitStep(next);
      });
    },
    [activeStep, commitStep, hasValidation, isAutomatic, isNavigating, onSubmit, stepCount],
  );

  const injectErrors = useCallback(
    (node: React.ReactNode) => {
      if (!hasValidation) return node;

      return React.Children.map(node, (child) => {
        if (!React.isValidElement(child)) return child;

        // Adım içeriğine errors enjekte et...
        return React.cloneElement(child as React.ReactElement<StepChildProps<TData>>, {
          errors,
        });
      });
    },
    [errors, hasValidation],
  );

  // variables
  const current = steps[activeStep];
  const backLabel = labels?.back ?? t("Steps.Button.Back");
  const nextLabel = labels?.next ?? t("Steps.Button.Next");
  const stepLabel = labels?.step ?? t("Steps.Step");
  const progressPercent = stepCount > 0 ? ((activeStep + 1) / stepCount) * 100 : 0;

  if (stepCount === 0) return null;

  return (
    <div
      className={`ar-steps ${showHeader ? "is-header" : isVertical ? "is-vertical" : "is-horizontal"}`}
      style={themeStyle as React.CSSProperties}
    >
      <div className="sr-only" aria-live="polite">
        {stepLabel} {activeStep + 1} {t("Steps.Of")} {stepCount}
        {current?.title ? `, ${current.title}` : ""}
      </div>

      {showHeader && current ? (
        <>
          <div className="header">
            {current.icon ? (
              <span className="icon-circle" aria-hidden>
                <Icon icon={current.icon} size={22} fill="currentColor" />
              </span>
            ) : null}
            <span className="header-copy">
              <span className="step">
                {stepLabel} {activeStep + 1}
              </span>
              <span className="title">{current.title}</span>
            </span>
          </div>
          <div className="progress" aria-hidden>
            <span className="track">
              <span className="fill" style={{ width: `${progressPercent}%` }} />
            </span>
          </div>
        </>
      ) : (
        <>
          <nav aria-label={t("Steps.Label")}>
        <ol className="steps">
          {steps.map((step, index) => {
            const status = getStepStatus(activeStep, index);
            const action = getStepClickAction(index, activeStep, { isAutomatic, hasValidation });
            const isCurrent = index === activeStep;
            const isDisabled = isNavigating || action === "blocked";
            const statusText = t(STATUS_LOCALE[status]);

            return (
              <li key={step.key || step.title || index} className={`item ${status}${isCurrent ? " is-current" : ""}`}>
                <button
                  type="button"
                  className="step-trigger"
                  disabled={isDisabled}
                  aria-current={isCurrent ? "step" : undefined}
                  aria-label={`${stepLabel} ${index + 1}: ${step.title}, ${statusText}`}
                  onClick={() => requestStep(index)}
                >
                  <span className={`item-icon ${status}`} aria-hidden>
                    {status === "completed" ? (
                      <Icon className="check" icon="Check" size={16} fill="currentColor" />
                    ) : step.icon ? (
                      <Icon className="glyph" icon={step.icon} size={16} fill="currentColor" />
                    ) : (
                      <span className="index">{index + 1}</span>
                    )}
                  </span>
                  <span className="item-informations">
                    <span className="step">
                      {stepLabel} {index + 1}
                    </span>
                    <span className="title">{step.title}</span>
                  </span>
                </button>
                {index < stepCount - 1 && <span className={`connector ${status}`} aria-hidden />}
              </li>
            );
          })}
        </ol>
      </nav>

          <div className="mobile-progress" aria-hidden>
            <span className="track">
              <span className="fill" style={{ width: `${progressPercent}%` }} />
            </span>
          </div>
        </>
      )}

      <div className="content">
        {current ? (
          <div key={current.key || activeStep} className="panel">
            {injectErrors(current.content)}
          </div>
        ) : null}

        {!isAutomatic && (
          <div className="buttons">
            {activeStep > 0 && (
              <Button
                type="button"
                variant="outlined"
                color="gray"
                disabled={isNavigating}
                onClick={() => requestStep(activeStep - 1)}
              >
                {backLabel}
              </Button>
            )}

            {children}

            {activeStep < stepCount - 1 && (
              <Button
                type="button"
                color="blue"
                loading={isNavigating}
                disabled={isNavigating}
                onClick={() => requestStep(activeStep + 1)}
              >
                {nextLabel}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Steps;
