import { SignIn } from "./SignIn";

/**
 * SignUp form - uses SignIn component with sign up as default step.
 */
export function SignUp() {
  return <SignIn defaultStep="signUp" />;
}
