/**
 * Uses:
 *
 * 1. Validation of valid signup form.
 * 2. Cross-check with the server if the entered email and username are
 * available for use
 * 3. Handling click events
 */

/**
 * Redirect the user to login with facebook
 */
document.getElementById("loginWithFacebook").addEventListener("click", () => {
  window.location = "https://www.facebook.com/dialog/oauth";
});

const FORM_FIELDS = {};
const FORM_FIELD_ERRORS = {};
const ERROR_IMAGE = "/assets/close-error.png";
const SUCCESS_IMAGE = "/assets/successful-input.png";
const mobileOrEmailErrorElement = document.getElementById("mobileOrEmailError");
const mobileOrEmailSuccessOrErrorImageElement = document.getElementById(
  "mobileOrEmailSuccessOrErrorImage"
);
const passwordErrorElement = document.getElementById("passwordError");
const passwordErrorOrSuccessImageElement = document.getElementById(
  "passwordErrorOrSuccessImage"
);
const usernameErrorElement = document.getElementById("usernameError");
const usernameErrorOrRegenerateImageElement = document.getElementById(
  "usernameErrorOrRegenerateImage"
);
const fullNameErrorOrSuccessImageElement = document.getElementById(
  "fullNameErrorOrSuccessImage"
);
const submitFormButtonElement = document.getElementById("submitFormButton");

const mobileOrEmailInputField = document.getElementById("mobileOrEmail");
const passwordInputField = document.getElementById("password");
const fullNameInputField = document.getElementById("fullName");
const usernameInputField = document.getElementById("username");
const showPasswordTriggerElement = document.getElementById(
  "showPasswordTrigger"
);

const formFieldIds = [
  mobileOrEmailInputField,
  passwordInputField,
  fullNameInputField,
  usernameInputField,
];

/**
 * listen for form fields changes
 */
formFieldIds.forEach((inputFieldElement) => {
  inputFieldElement.addEventListener("keyup", (ev) =>
    handleFormFieldChange(ev.target.name, ev.target.value)
  );
});

/**
 * listen for regenerating a new username
 */
document
  .getElementById("usernameErrorOrRegenerateImage")
  .addEventListener("click", (ev) => {
    if (FORM_FIELD_ERRORS["username"]) {
      const randomUsername = `username-${Math.round(
        Math.random() * 1000
      ).toString()}`;
      document.getElementById("username").value = randomUsername;
      validateUsername(randomUsername);
    }
  });

/**
 * listen for clearing input fields when an error occurs
 */
mobileOrEmailSuccessOrErrorImageElement.addEventListener("click", () => {
  if (FORM_FIELD_ERRORS["mobile_or_email"]) {
    mobileOrEmailInputField.value = "";
    mobileOrEmailSuccessOrErrorImageElement.src = "";
    toggelElementVisibility(mobileOrEmailErrorElement, "none");
  }
});

/**
 * trigger show password
 */
showPasswordTriggerElement.addEventListener("click", (ev) => {
  if (ev.target.innerText.toLowerCase() === "show") {
    showPasswordTriggerElement.innerHTML = "hide";
    passwordInputField.setAttribute("type", "text");
  } else {
    showPasswordTriggerElement.innerHTML = "show";
    passwordInputField.setAttribute("type", "password");
  }
});

/**
 * submit signup form handler
 */
submitFormButtonElement.addEventListener("click", () => {
  console.log("FORM", FORM_FIELDS);
  alert("And you are not part of instagram!");
});

/**
 * Common method to handle form field changes
 */
const handleFormFieldChange = (fieldName, value) => {
  FORM_FIELDS[fieldName] = value;
  switch (fieldName) {
    case "mobile_or_email":
      validateMobileOrEmail(value);
      break;
    case "password":
      validatePassword(value);
      break;
    case "fullname":
      validateFullname(value);
      break;
    case "username":
      validateUsername(value);
      break;
  }
  validateWholeForm();
};

const validateWholeForm = () => {
  /**
   * check if there is an error in any form field and update action
   * button disbled status accordingly
   */
  let formIsValid = true;

  /**
   * check if the user has input all the form fields
   */
  if (Object.keys(FORM_FIELDS).length !== 4) {
    formIsValid = false;
  }

  if (formIsValid) {
    /**
     * if the user has input all the required fields, which deem
     * the form as valid, proceed to check if there is an error
     * in any of the form fields
     */
    for (const key in FORM_FIELD_ERRORS) {
      if (FORM_FIELD_ERRORS[key]) {
        formIsValid = false;
        break;
      }
    }
  }

  if (formIsValid) {
    submitFormButtonElement.removeAttribute("disabled");
  } else {
    submitFormButtonElement.setAttribute("disabled", true);
  }
};

/**
 * validate individual form fields
 */
const validateMobileOrEmail = (value) => {
  if (httpMockCheckIfEmailExists()) {
    mobileOrEmailSuccessOrErrorImageElement.src = ERROR_IMAGE;
    toggelElementVisibility(mobileOrEmailErrorElement, "block");
    appendErrorMessageToElement(
      mobileOrEmailErrorElement,
      "Another account is using the same email."
    );
    FORM_FIELD_ERRORS["mobile_or_email"] = true;
  } else {
    mobileOrEmailSuccessOrErrorImageElement.src = value ? SUCCESS_IMAGE : "";
    toggelElementVisibility(mobileOrEmailErrorElement, "none");
    FORM_FIELD_ERRORS["mobile_or_email"] = false;
  }
};

const validateFullname = (value) => {
  /**
   * add any fullname validations that are needed here
   */
  fullNameErrorOrSuccessImageElement.src = "";

  /**
   * now, because password validation depends on the fullname value,
   * a call is made here with the most recent value of the password
   * from from fields
   */
  validatePassword(FORM_FIELDS["password"]);
};

const validatePassword = (value) => {
  /**
   * if the password has a value, then we can display the option to show
   * it
   */
  if (value) {
    showPasswordTriggerElement.style.display = "block";
    showPasswordTriggerElement.innerText = "show";
  }

  const mockObviousPasswords = ["1", "1234", "password"];
  let errorMessage;

  /**
   * password validation 1
   */
  if (mockObviousPasswords.includes(value)) {
    errorMessage =
      "This password is too easy to guess. Please create a new one.";
  }

  /**
   * password validation 2
   */
  const mobileOrEmailHasPassword =
    FORM_FIELDS["mobile_or_email"] &&
    FORM_FIELDS["mobile_or_email"].toLowerCase().includes(value?.toLowerCase());
  const fullNameHasPassword =
    FORM_FIELDS["fullname"] &&
    FORM_FIELDS["fullname"].toLowerCase().includes(value?.toLowerCase());

  if ((mobileOrEmailHasPassword || fullNameHasPassword) && !errorMessage) {
    errorMessage =
      "Your password can’t have parts of your name. Please create a new one.";
  }
  if (errorMessage) {
    toggelElementVisibility(passwordErrorElement, "block");
    passwordErrorOrSuccessImageElement.src = ERROR_IMAGE;
    appendErrorMessageToElement(passwordErrorElement, errorMessage);
    FORM_FIELD_ERRORS["password"] = true;
  } else {
    toggelElementVisibility(passwordErrorElement, "none");
    passwordErrorOrSuccessImageElement.src = value ? SUCCESS_IMAGE : "";
    FORM_FIELD_ERRORS["password"] = false;
  }

  /**
   * You can add other validations here
   */
};

const validateUsername = (value) => {
  if (httpMockCheckIfUsernameExists()) {
    toggelElementVisibility(usernameErrorElement, "block");
    usernameErrorOrRegenerateImageElement.src =
      "/assets/regenerate-new-username.png";
    FORM_FIELD_ERRORS["username"] = true;
  } else {
    toggelElementVisibility(usernameErrorElement, "none");
    usernameErrorOrRegenerateImageElement.src = value ? SUCCESS_IMAGE : "";
    FORM_FIELD_ERRORS["username"] = false;
  }
};

/**
 * common methods
 */
const toggelElementVisibility = (element, display) => {
  element.style.display = display;
};

const appendErrorMessageToElement = (element, message) => {
  element.innerText = message;
};

const hideMobileOrEmailErrors = () => {};

/**
 * Mock HTTP endpoints
 */
const httpMockCheckIfEmailExists = (email) => {
  return Math.random() * 10 > 5 ? true : false;
};

const httpMockCheckIfUsernameExists = (username) => {
  return Math.random() * 10 < 5 ? true : false;
};
