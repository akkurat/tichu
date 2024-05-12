package ch.vifian.tjchu;

public interface Player {

    void receiveServerMessage(MessageWrapper payload);

    String getName();
}
