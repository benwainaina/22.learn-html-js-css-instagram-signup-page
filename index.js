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
const FORM_ERRORS = {};
const mobileOrEmailErrorElement = document.getElementById("mobileOrEmailError");
const passwordErrorElement = document.getElementById("passwordError");
const usernameErrorElement = document.getElementById("usernameError");

const formFieldIds = ["mobileOrEmail", "password", "fullName", "username"];
/**
 * listen for form fields changes
 */
formFieldIds.forEach((fieldId) => {
  document
    .getElementById(fieldId)
    .addEventListener("keyup", (ev) =>
      handleFormFieldChange(ev.target.name, ev.target.value)
    );
});

/**
 * Common method to handle form field changes
 */
const handleFormFieldChange = (fieldName, value) => {
  FORM_FIELDS[fieldName] = value;
  console.log("FORM_FIELDS", FORM_FIELDS);
  switch (fieldName) {
    case "mobile_or_email":
      validateEmail(value);
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
};

/**
 * validate individual form fields
 */
const validateEmail = (value) => {
  console.log("validateEmail.value", value);
};

const validateFullname = (value) => {
  console.log("validateFullname.value", value);
  validatePassword();
};

const validatePassword = (value) => {
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
    appendErrorMessageToElement(passwordErrorElement, errorMessage);
  } else {
    toggelElementVisibility(passwordErrorElement, "none");
  }

  /**
   * You can add other validations here
   */
};

const validateUsername = (value) => {
  console.log("validateUsername.value", value);
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

/**
 * Mock HTTP endpoints
 */
const httpMockCheckIfEmailExists = (email) => {};

const httpMockCheckIfUsernameExists = (username) => {};
