package vaultWeb.integration;

import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;

class UserControllerIntegrationTest extends IntegrationTestBase {
  @Test
  void shouldLoadSpringContext() {
    assertNotNull(mockMvc);
    assertNotNull(userRepository);
  }
}
