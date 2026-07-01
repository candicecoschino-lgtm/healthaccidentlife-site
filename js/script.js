const steps = Array.from(document.querySelectorAll(".form-step"));
const nextButton = document.getElementById("nextButton");
const backButton = document.getElementById("backButton");
const submitButton = document.getElementById("submitButton");
const stepCounter = document.getElementById("stepCounter");
const stepTitle = document.getElementById("stepTitle");
const progressFill = document.getElementById("progressFill");
const annualIncome = document.getElementById("annualIncome");
const incomeValue = document.getElementById("incomeValue");

let currentStep = 1;

const stepTitles = {
  1: "Coverage Type",
  2: "Who Needs Coverage",
  3: "Ages",
  4: "Location",
  5: "Annual Income",
  6: "Current Coverage",
  7: "Healthcare Usage",
  8: "Get Your Results"
};

function formatCurrency(value) {
  return Number(value).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  });
}

function updateIncomeDisplay() {
  if (!annualIncome || !incomeValue) return;
  incomeValue.textContent = formatCurrency(annualIncome.value);
}

function showStep(stepNumber) {
  steps.forEach((step) => {
    const isActive = Number(step.dataset.step) === stepNumber;
    step.classList.toggle("active", isActive);
  });

  currentStep = stepNumber;

  stepCounter.textContent = `Step ${currentStep} of ${steps.length}`;
  stepTitle.textContent = stepTitles[currentStep] || "";
  progressFill.style.width = `${(currentStep / steps.length) * 100}%`;

  backButton.style.visibility = currentStep === 1 ? "hidden" : "visible";

  if (currentStep === steps.length) {
    nextButton.style.display = "none";
    submitButton.style.display = "inline-flex";
  } else {
    nextButton.style.display = "inline-flex";
    submitButton.style.display = "none";
  }

  const formTop = document.querySelector(".quote-card");
  if (formTop) {
    formTop.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function getCurrentStepElement() {
  return steps.find((step) => Number(step.dataset.step) === currentStep);
}

function clearStepError(stepElement) {
  const existingError = stepElement.querySelector(".step-error");
  if (existingError) existingError.remove();
}

function showStepError(stepElement, message) {
  clearStepError(stepElement);

  const error = document.createElement("p");
  error.className = "step-error";
  error.textContent = message;

  stepElement.appendChild(error);
}

function validateCurrentStep() {
  const stepElement = getCurrentStepElement();
  if (!stepElement) return true;

  clearStepError(stepElement);

  if (currentStep === 1) {
    const checked = stepElement.querySelectorAll('input[name="coverage_type"]:checked');
    if (checked.length === 0) {
      showStepError(stepElement, "Please select at least one coverage type.");
      return false;
    }
  }

  if (currentStep === 2) {
    const checked = stepElement.querySelector('input[name="who_needs_coverage"]:checked');
    if (!checked) {
      showStepError(stepElement, "Please select who needs coverage.");
      return false;
    }
  }

  if (currentStep === 3) {
    const age = document.getElementById("yourAge");
    if (!age.value || Number(age.value) <= 0) {
      showStepError(stepElement, "Please enter your age.");
      return false;
    }
  }

  if (currentStep === 4) {
    const zip = document.getElementById("zipCode");
    const state = document.getElementById("state");

    if (!zip.value.trim()) {
      showStepError(stepElement, "Please enter your ZIP code.");
      return false;
    }

    if (!state.value) {
      showStepError(stepElement, "Please select your state.");
      return false;
    }
  }

  if (currentStep === 6) {
    const checked = stepElement.querySelector('input[name="current_coverage"]:checked');
    if (!checked) {
      showStepError(stepElement, "Please select your current coverage status.");
      return false;
    }
  }

  if (currentStep === 7) {
    const usage = stepElement.querySelector('input[name="healthcare_usage"]:checked');
    const priority = document.getElementById("planPriority");

    if (!usage) {
      showStepError(stepElement, "Please select how often you typically use healthcare.");
      return false;
    }

    if (!priority.value) {
      showStepError(stepElement, "Please select what matters most to you in a plan.");
      return false;
    }
  }

  return true;
}

function validateFinalSubmit(event) {
  const fullName = document.getElementById("fullName");
  const phoneNumber = document.getElementById("phoneNumber");
  const emailAddress = document.getElementById("emailAddress");
  const consent = document.querySelector('input[name="tcpa_consent"]');
  const finalStep = getCurrentStepElement();

  clearStepError(finalStep);

  if (!fullName.value.trim()) {
    event.preventDefault();
    showStepError(finalStep, "Please enter your full name.");
    return;
  }

  if (!phoneNumber.value.trim()) {
    event.preventDefault();
    showStepError(finalStep, "Please enter your phone number.");
    return;
  }

  if (!emailAddress.value.trim()) {
    event.preventDefault();
    showStepError(finalStep, "Please enter your email address.");
    return;
  }

  if (!consent.checked) {
    event.preventDefault();
    showStepError(finalStep, "Please check the consent box before submitting.");
  }
}

nextButton.addEventListener("click", () => {
  if (!validateCurrentStep()) return;

  if (currentStep < steps.length) {
    showStep(currentStep + 1);
  }
});

backButton.addEventListener("click", () => {
  if (currentStep > 1) {
    showStep(currentStep - 1);
  }
});

if (annualIncome) {
  annualIncome.addEventListener("input", updateIncomeDisplay);
  updateIncomeDisplay();
}

const quoteForm = document.getElementById("quoteForm");
if (quoteForm) {
  quoteForm.addEventListener("submit", validateFinalSubmit);
}

const style = document.createElement("style");
style.textContent = `
  .step-error {
    margin: 18px 0 0;
    padding: 12px 14px;
    border-radius: 10px;
    background: #fff1f0;
    color: #b42318;
    font-weight: 800;
    border: 1px solid #fecdca;
  }
`;
document.head.appendChild(style);

showStep(1);
