package ch.vifian.tjchu;

public interface UserPlayer {

    void receiveServerMessage(MessageWrapper payload);

    String getName();
}
