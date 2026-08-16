"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import useTranslation from "@harjs/translation/dist/libs/core/application/hooks/useTranslation";
import Typography from "../../data-display/typography";
import "../../../assets/css/components/navigation/wizard/styles.css";
import { Errors, ValidationProps } from "../../../libs/infrastructure/types";
import Button from "../../form/button";
import { useValidation } from "../../../libs/core/application/hooks";
import Flex from "../../layout/grid-system/flex/Flex";
import Drawer from "../../feedback/drawer";
import IProps, { IWizardDrawerProps } from "./IProps";
import { Icon } from "../../icons";
import IWizardLocale from "../../../libs/core/application/locales/wizard/IWizardLocale";
import WizardTR from "../../../libs/core/application/locales/wizard/tr";
import WizardEN from "../../../libs/core/application/locales/wizard/en";
import {
  clampStep,
  getStepClickAction,
  getStepStatus,
  getStepsStorageKey as getWizardStorageKey,
  parseStoredStep,
  StepStatus,
} from "../steps/helpers";
import { resolveWizardLocale } from "./helpers";

const { Title, Paragraph } = Typography;

const EMPTY_RULES: ValidationProps<object>[] = [];

const STATUS_LOCALE: Record<StepStatus, keyof IWizardLocale> = {
  pending: "Wizard.Status.Pending",
  "in-progress": "Wizard.Status.InProgress",
  completed: "Wizard.Status.Completed",
};

type StepChildProps<TData extends object> = {
  data?: IProps<TData>["data"];
  errors?: Errors<TData>;
};

const WizardInner = function <TData extends object>({
  data,
  name,
  title,
  description,
  steps = [],
  currentStep,
  onChange,
  onCompleted,
  validation,
  config,
}: IProps<TData>) {
  // refs
  const _navigating = useRef(false);

  // variables
  const isControlled = typeof currentStep === "number";
  const hasValidation = Boolean(validation);
  const stepCount = steps.length;
  const storageKey = getWizardStorageKey(name);

  // states
  const [internalStep, setInternalStep] = useState(() => {
    if (isControlled) return clampStep(currentStep ?? 0, stepCount);
    if (typeof window === "undefined") return 0;
    return parseStoredStep(window.sessionStorage.getItem(storageKey), stepCount) ?? 0;
  });
  const [isNavigating, setIsNavigating] = useState(false);

  // variables
  const activeStep = clampStep(isControlled ? (currentStep ?? 0) : internalStep, stepCount);

  // hooks
  const { t } = useTranslation<IWizardLocale>(resolveWizardLocale(config?.locale), {
    tr: { ...WizardTR },
    en: { ...WizardEN },
  });
  const { errors, onSubmit, setSubmit } = useValidation(
    validation?.data as TData,
    (validation?.rules ?? EMPTY_RULES) as ValidationProps<TData>[],
    activeStep + 1,
  );

  // methods
  const persistStep = useCallback(
    (step: number) => {
      if (typeof window === "undefined") return;
      window.sessionStorage.setItem(storageKey, String(step));
    },
    [storageKey],
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
      const action = getStepClickAction(next, activeStep, { hasValidation });

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
    [activeStep, commitStep, hasValidation, isNavigating, onSubmit, stepCount],
  );

  const completeWizard = useCallback(() => {
    const finish = () => {
      if (typeof window !== "undefined") {
        window.sessionStorage.removeItem(storageKey);
      }
      if (!isControlled) setInternalStep(0);
      setSubmit(false);
      onCompleted?.();
    };

    if (!hasValidation) {
      finish();
      return;
    }

    // Navigasyon sürerken tekrar tamamlamaya izin verme...
    if (_navigating.current || isNavigating) return;
    _navigating.current = true;
    setIsNavigating(true);
    onSubmit((result) => {
      _navigating.current = false;
      setIsNavigating(false);
      if (!result) return;
      finish();
    });
  }, [hasValidation, isControlled, isNavigating, onCompleted, onSubmit, setSubmit, storageKey]);

  const injectChild = useCallback(
    (node: React.ReactNode) => {
      return React.Children.map(node, (child) => {
        if (!React.isValidElement(child) || typeof child.type === "string") return child;

        const injected: StepChildProps<TData> = { data };
        if (hasValidation) injected.errors = errors;

        // Adım içeriğine data ve errors enjekte et...
        return React.cloneElement(child as React.ReactElement<StepChildProps<TData>>, injected);
      });
    },
    [data, errors, hasValidation],
  );

  // useEffects
  useEffect(() => {
    if (isControlled || typeof window === "undefined") return;
    const stored = parseStoredStep(window.sessionStorage.getItem(storageKey), stepCount);
    if (stored !== null) setInternalStep(stored);
  }, [isControlled, stepCount, storageKey]);

  useEffect(() => {
    if (!isControlled) return;
    persistStep(activeStep);
  }, [activeStep, isControlled, persistStep]);

  // variables
  const current = steps[activeStep];
  const flowTitle = title ?? t("Wizard.Title");
  const panelTitle = current?.title ?? flowTitle;
  const progressPercent = stepCount > 0 ? ((activeStep + 1) / stepCount) * 100 : 0;

  return (
    <div className="har-wizard">
      <div className="sr-only" aria-live="polite">
        {stepCount > 0 ? `${activeStep + 1}/${stepCount}${current?.title ? `, ${current.title}` : ""}` : t("Wizard.Empty")}
      </div>
      <aside className="side-bar">
        <Flex flexDirection="column" gap="var(--space-16)">
          <Title size="lg" fontWeight="600">
            {flowTitle}
          </Title>

          {description ? <Paragraph size="sm">{description}</Paragraph> : null}

          <div className="divider" />

          {stepCount === 0 ? (
            <Paragraph size="sm">{t("Wizard.Empty")}</Paragraph>
          ) : (
            <ol className="steps" aria-label={t("Wizard.Steps")}>
              {steps.map((step, index) => {
                const status = getStepStatus(activeStep, index);
                const action = getStepClickAction(index, activeStep, { hasValidation });
                const isCurrent = index === activeStep;
                const isDisabled = isNavigating || action === "blocked";
                const statusText = t(STATUS_LOCALE[status]);

                return (
                  <li key={step.key || step.title || index} className={`step-item ${status}${isCurrent ? " is-current" : ""}`}>
                    <button
                      type="button"
                      className="step-trigger"
                      disabled={isDisabled}
                      aria-current={isCurrent ? "step" : undefined}
                      aria-label={`${step.title}, ${statusText}`}
                      onClick={() => requestStep(index)}
                    >
                      <span className={`status-icon ${status}`} aria-hidden>
                        {status === "completed" ? (
                          <Icon icon="CheckCircle-Fill" size={16} fill="var(--green-500)" />
                        ) : status === "in-progress" ? (
                          step.icon ? (
                            <Icon icon={step.icon} size={16} fill="var(--blue-500)" />
                          ) : (
                            <Icon className="is-spinning" icon="Spinner" size={16} fill="var(--blue-500)" />
                          )
                        ) : step.icon ? (
                          <Icon icon={step.icon} size={16} fill="var(--gray-400)" />
                        ) : (
                          <Icon icon="Circle" size={16} fill="var(--gray-300)" />
                        )}
                      </span>
                      <span className="step-title">{step.title}</span>
                      {isCurrent ? (
                        <span className="caret" aria-hidden>
                          <Icon icon="CaretRight" size={16} fill="var(--gray-300)" />
                        </span>
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ol>
          )}
        </Flex>
      </aside>

      <div className="panel">
        <div className="header">
          <Title size="lg">{panelTitle}</Title>

          <div className="header-right">
            <div
              className="progress"
              role="progressbar"
              aria-label={t("Wizard.Progress")}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progressPercent)}
            >
              <div className="track">
                <div className="fill" style={{ width: `${progressPercent}%` }} />
              </div>
              <span>
                {stepCount > 0 ? activeStep + 1 : 0}/{stepCount} {t("Wizard.Title.Complete")}
              </span>
            </div>
          </div>
        </div>

        <div className="content">
          {current ? (
            <div key={current.key || activeStep} className="panel-body">
              {injectChild(current.content)}
            </div>
          ) : (
            <Paragraph size="sm">{t("Wizard.Empty")}</Paragraph>
          )}
        </div>

        {stepCount > 0 && (
          <div className="footer">
            <Flex flexDirection="row" gap="var(--space-12)">
              {activeStep > 0 && (
                <Button
                  type="button"
                  variant="outlined"
                  color="gray"
                  disabled={isNavigating}
                  onClick={() => requestStep(activeStep - 1)}
                >
                  {t("Wizard.Button.Back")}
                </Button>
              )}

              {activeStep < stepCount - 1 && (
                <Button
                  type="button"
                  color="blue"
                  loading={isNavigating}
                  disabled={isNavigating}
                  onClick={() => requestStep(activeStep + 1)}
                >
                  {t("Wizard.Button.NextStep")}
                </Button>
              )}

              {activeStep === stepCount - 1 && (
                <Button
                  type="button"
                  color="blue"
                  loading={isNavigating}
                  disabled={isNavigating}
                  onClick={completeWizard}
                >
                  {t("Wizard.Button.Complete")}
                </Button>
              )}
            </Flex>
          </div>
        )}
      </div>
    </div>
  );
};

const WizardDrawer = <TData extends object>({
  open,
  placement,
  config,
  size,
  ...wizardProps
}: IWizardDrawerProps<TData>) => (
  <Drawer
    open={open}
    placement={placement}
    size={size}
    config={{ freeContent: config?.freeContent }}
    aria-label={wizardProps.title}
  >
    <WizardInner {...wizardProps} config={{ locale: config?.locale }} />
  </Drawer>
);

WizardDrawer.displayName = "Wizard.Drawer";

type WizardComponent = typeof WizardInner & {
  Drawer: typeof WizardDrawer;
};

const Wizard = WizardInner as WizardComponent;
Wizard.Drawer = WizardDrawer;

export default Wizard;
