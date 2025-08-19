package vaultWeb.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import vaultWeb.models.Poll;

import java.util.List;

public interface PollRepository extends JpaRepository<Poll, Long> {
    List<Poll> findByGroupId(Long groupId);
}
