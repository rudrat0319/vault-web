package vaultWeb.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import vaultWeb.repositories.RefreshTokenRepository;
import vaultWeb.repositories.UserRepository;

@SpringBootTest
@ActiveProfiles("test")
@AutoConfigureMockMvc
abstract class IntegrationTestBase {
  @Autowired protected MockMvc mockMvc;
  @Autowired protected ObjectMapper objectMapper;
  @Autowired protected UserRepository userRepository;
  @Autowired protected RefreshTokenRepository refreshTokenRepository;

  @BeforeEach
  void setUp() {
    // Clear database before each test
    refreshTokenRepository.deleteAll();
    userRepository.deleteAll();
  }
}
