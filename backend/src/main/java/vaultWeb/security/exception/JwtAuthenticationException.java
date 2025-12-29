package vaultWeb.security.exception;

import org.springframework.security.core.AuthenticationException;

/** Raised when JWT authentication fails (missing, expired, or invalid token). */
public class JwtAuthenticationException extends AuthenticationException {
  public JwtAuthenticationException(String message) {
    super(message);
  }
}
