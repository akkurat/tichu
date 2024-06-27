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

    private SimpMessagingTemplate simpMessagingTemplate;

    ConcurrentHashMap<UUID, TichuGame> games;

    public GameService(SimpMessagingTemplate simpMessagingTemplate) {
        this.simpMessagingTemplate = simpMessagingTemplate;
        games = new ConcurrentHashMap<>();
        // todo: factory
        var game = new TichuGame("Default", simpMessagingTemplate);
        games.put(game.id, game);
    }

    public TichuGame createGame(@Nullable String caption) {
        var game = new TichuGame(caption, simpMessagingTemplate);
        games.put(game.id, game);
        publishGames();
        return game;
    }

    public Collection<TichuGame> listGames() {
        return games.values();
    }


    public void publishGames() {
        simpMessagingTemplate.convertAndSend("/topic/games", games.values());
    }

    public JoinResponse join(String gameid, String username) {
        var game = games.get(UUID.fromString(gameid));
        publishGames();
        return game.join( username );
    }
}
