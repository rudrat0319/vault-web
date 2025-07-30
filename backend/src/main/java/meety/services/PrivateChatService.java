package meety.services;

import lombok.RequiredArgsConstructor;
import meety.exceptions.notfound.UserNotFoundException;
import meety.models.PrivateChat;
import meety.models.User;
import meety.repositories.PrivateChatRepository;
import meety.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PrivateChatService {

    @Autowired
    private final PrivateChatRepository privateChatRepository;
    @Autowired
    private final UserRepository userRepository;

    public PrivateChat getOrCreatePrivateChat(String username1, String username2) {
        User user1 = userRepository.findByUsername(username1)
                .orElseThrow(() -> new UserNotFoundException("User1 not found"));
        User user2 = userRepository.findByUsername(username2)
                .orElseThrow(() -> new UserNotFoundException("User2 not found"));

        Optional<PrivateChat> chatOpt = privateChatRepository.findByUser1AndUser2(user1, user2);
        if (chatOpt.isPresent()) return chatOpt.get();

        chatOpt = privateChatRepository.findByUser2AndUser1(user1, user2);
        if (chatOpt.isPresent()) return chatOpt.get();

        PrivateChat privateChat = new PrivateChat();
        privateChat.setUser1(user1);
        privateChat.setUser2(user2);
        return privateChatRepository.save(privateChat);
    }
}

