package ch.vifian.tjchu.config;

import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.support.ChannelInterceptor;

public class MyChannelInterceptor implements ChannelInterceptor {
    @Override
    public void afterReceiveCompletion(Message<?> message, MessageChannel channel, Exception ex) {

        System.out.println(channel);
    }

    @Override
    public void afterSendCompletion(Message<?> message, MessageChannel channel, boolean sent, Exception ex) {
        System.out.println(channel);
    }

}
