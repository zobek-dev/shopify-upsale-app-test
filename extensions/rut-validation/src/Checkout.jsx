import {
  reactExtension,
  TextField,
  useExtensionCapability,
  useBuyerJourneyIntercept,
} from "@shopify/ui-extensions-react/checkout";
import validateRut from "./libs/validateRut";
import { useState } from "react";
// Set the entry point for the extension
export default reactExtension("purchase.checkout.contact.render-after", () => <App />);

function App() {
  // Set up the app state
  const [rut, setRut] = useState("");
  const [validationError, setValidationError] = useState("");
  // Merchants can toggle the `block_progress` capability behavior within the checkout editor
  const canBlockProgress = useExtensionCapability("block_progress");
  const label = canBlockProgress ? "Ingresa tu RUT" : "Ingresa tu RUT (opcional)";
  // Use the `buyerJourney` intercept to conditionally block checkout progress
  useBuyerJourneyIntercept(({ canBlockProgress }) => {
    // Validate that the age of the buyer is known, and that they're old enough to complete the purchase
    if (canBlockProgress && !isRutSet()) {
      return {
        behavior: "block",
        reason: "El rut es requerido",
        perform: (result) => {
          // If progress can be blocked, then set a validation error on the custom field
          if (result.behavior === "block") {
            setValidationError("Ingresa un rut válido para continuar");
          }
        },
      };
    }

    if (canBlockProgress && !isRutValid()) {
      return {
        behavior: "block",
        reason: `Tienes que ingresar un rut válido`,
        errors: [
          {
            // Show a validation error on the page
            message:
              "El rut que ingresaste no es válido, por favor ingresa uno válido.",
          },
        ],
      };
    }

    return {
      behavior: "allow",
      perform: () => {
        // Ensure any errors are hidden
        clearValidationErrors();
      },
    };
  });

  function isRutSet() {
    return rut !== "";
  }

  function isRutValid() {
    return validateRut(rut);
  }

  function clearValidationErrors() {
    setValidationError("");
  }
  // Render the extension
  return (

    <TextField
      label={label}
      type="text"
      value={rut}
      onChange={setRut}
      onInput={clearValidationErrors}
      required={canBlockProgress}
      error={validationError}
    />
  );
}
