package ch.vifian.tjchu;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import javax.annotation.Nullable;
import java.util.Collection;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class GameService {
    ConcurrentHashMap<UUID, TichuGame> games;

    public GameService() {
        games = new ConcurrentHashMap<>();
        var game = new TichuGame("Default");
        games.put(game.id, game);
    }

    public TichuGame createGame(@Nullable String caption) {
        var game = new TichuGame(caption);
        games.put(game.id, game);
        publishGames();
        return game;
    }

    public Collection<TichuGame> listGames() {
        return games.values();
    }

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    public void publishGames() {
        simpMessagingTemplate.convertAndSend("/topic/games", games.values());
    }
}
