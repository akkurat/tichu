package ch.vifian.tjchu;

public interface Player {

    void receiveServerMessage(String msg, Object payload);

    String getName();
}
