export function StepIndicator({ currentStep, totalSteps, steps }) {
  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <div className="flex items-center justify-between">
        {steps.map((_, index) => (
          <div key={index} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                index + 1 <= currentStep
                  ? "bg-primary border-primary text-primary-foreground"
                  : "border-muted-foreground text-muted-foreground"
              }`}
            >
              {index + 1}
            </div>
            {index < totalSteps - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 transition-colors ${
                  index + 1 < currentStep ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-2">
        {steps.map((step, index) => (
          <span
            key={index}
            className={`text-sm transition-colors ${
              index + 1 <= currentStep
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          >
            {step}
          </span>
        ))}
      </div>
    </div>
  );
}
