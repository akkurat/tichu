#!/usr/bin/env python

# WS server example that synchronizes state across clients

import asyncio
import json
import logging
from typing import Iterable, Collection, Set, Callable, Dict, List

from boltons.setutils import IndexedSet

from pychu.tgame.tevent import TEvent, TEventType
from pychu.tlogic import tcards
from pychu.tlogic.tcards import Card, CardEncoder, tcards
from pychu.tplayer.tplayer import TPlayer

logging.basicConfig()

def tevent_hook(o):
    if '_event' not in o:
        return o
    _event = o['_event']
    # type
    type = TEventType[_event['type']]
    player = _event.get('player')
    message = _event.get('message')
    # todo: decode cards better
    data = _event.get('data')
    if type == TEventType.Plays:
        data = tcards(data)
    elif type == TEventType.Wish:
        data = tcards(data)

    return TEvent(type, data, message)


class TEventEncode(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, TEvent):
            return {
                "_event":
                    {
                        "type": o.event.name,
                        # "player": o.player,
                        "message": o.message,
                        "data": o.data
                    }
            }
        elif isinstance(o, Card):
            return o.__repr__()
        elif isinstance(o, IndexedSet):
            return list(o)
        else:
            return super().default(o)


class SocketHandler:
    """
    Goal: A Protocoll agnostic message bus.
    Configuration: Setup how many players are necessary

    Mechanism: The message Handler is setup.
    Afterwards the (bound) handler method is handed to the websocket.
    Therefore the handlers are all bound the same class and can use
    shared variables but in a cleaner way than via global variables.

    Although being protocol agnostic, there needs to be an interface
    for the communication between the handler and the players.

    Two ways are possible:

    Player-Player connection: The proxy is directly linked with the
    remote player
    Pros: easy implementation on server level, nothing to do for the server
    Cons: Mapping of proxy user to remote user afterwords

    Player-Server-Player: All messages from the remote players are
    sent to the server, the servers parses the origin (user id) and
    puts it through to the proxy.
    pros: Mapping of remote / proxy player can be changed afterwards (when a player left),
            The message handler is a pure message handler
    cons: more to do on the server sid, however a little bit more general
    cons: cards must be submitted by user :(

    didn't realize this but so far this solution contains only a broadcast mechanism



    Handle external Players (Proxy)
    Nothing speaks against always communicating via websocket.
    However, the idea is that the game comunication runs via TProxyPlayer exclusively
    """

    def __init__(self, remote_users: Collection):
        self.USERS = {}
        self.remote_users = remote_users

    def users_event(self):
        return json.dumps({'type': 'users', 'count': len(self.USERS)})

    def refuse_event(self):
        return json.dumps(
            {'type': 'connection', 'content': 'Connection Refused. Already {} registered!'.format(len(self.USERS))})

    def authenticate(self):
        return json.dumps({'type': 'authentication', 'content': 'credentials'})

    def auth_succ(self, uname):
        return json.dumps({'type': 'authentication', 'content': 'success', 'uname': uname})

    # async def notify_state(self, message):
    #     if self.USERS:       # asyncio.wait doesn't accept an empty list
    #         await asyncio.wait([user.send(message) for user in self.USERS])
    #
    # async def notify_users(self):
    #     if self.USERS:       # asyncio.wait doesn't accept an empty list
    #         message = self.users_event()
    #         await asyncio.wait([user.send(message) for user in self.USERS])

    async def register(self, websocket):
        """
        Checks if there is a proxy avalaible
        :param websocket:
        :return:
        """
        if len(self.USERS) >= len(self.remote_users):
            await websocket.send(self.refuse_event())
            return

        await websocket.send(self.authenticate())

        answer = json.loads(await websocket.recv())
        uname = answer['uname']
        # todo if username already set, then check a passphrase
        # however, for now assume only initial registrations
        available = [p for p in self.remote_users if not p in self.USERS]
        # todo: check for empty
        user = available.pop()
        self.USERS[user] = websocket
        # await self.notify_users()
        # map proxy user
        # proxy.get_user_name()
        await websocket.send(self.auth_succ(uname))
        # await websocket.send(json.dumps(list(user.hand), cls=CardEncoder))
        await user.client_events.put("Success!")
        return user

    async def unregister(self, user):
        self.USERS[user] = None

        # await self.notify_users()

    async def listen_for_game_events(self, user):
        while self.USERS[user]:
            websocket = self.USERS[user]
            server_event = await user.server_events.get()
            # websocket.send(json.dumps(server_event, cls=TEventEncode))
            out = json.dumps(server_event, cls=TEventEncode)
            await websocket.send(out)

    # todo: rename to handle, serve, etc...
    async def handle(self, websocket, path):
        print("path:", path)
        # register(websocket) sends user_event() to websocket
        user = await self.register(websocket)

        asyncio.create_task(self.listen_for_game_events(user))

        try:
            async for message in websocket:
                await user.ext_play(message)

        finally:
            await self.unregister(user)
            print("Unregistered!")


class RemotePlayer(TPlayer):

    async def schupf(self) -> Dict[int, Card]:
        await self.server_events.put(TEvent(TEventType.Schupf, self.player_number))
        schupfed = False
        while not schupfed:
            event: TEvent = await self.client_events.get()
            if event.event == TEventType.Schupf:
                return event.data

    def __init__(self):
        super().__init__()
        self.connected = False
        self.server_events = asyncio.Queue()
        self.client_events = asyncio.Queue()

    def play_event(self):
        self.client_events

    async def play(self, lastcards: Set[Card], card_receiver: Callable[[Set[Card], bool], bool], wish=None) -> Set[
        Card]:
        # get cards from connection
        # await remote action?
        valid = False
        event = TEvent(TEventType.Plays, self.player_number, lastcards)
        while not valid:
            await self.server_events.put(event)
            client_event = await self.client_events.get()
            print(client_event)

    async def ext_play(self, message):
        event = json.loads(message, object_hook=tevent_hook)
        # Todo: decode json
        print(message)
        await self.client_events.put(event)

    async def ready(self):
        while not self.connected:
            client_event = await self.client_events.get()
            # TODO: check event (could also be refused or whatever...
            self.connected = True

        return True

    async def dist_first(self, cards: List[Card]):
        await super().dist_first(cards)
        # super().init_cards(cards, player_number)
        await self.server_events.put(TEvent(TEventType.Dist1, cards))
        while True:
            event = await self.client_events.get()
            if event.event == TEventType.BigTichu or event.event == TEventType.Ack:
                return event

    async def dist_second(self, cards: List[Card]):
        await super().dist_first(cards)
        # super().init_cards(cards, player_number)
        await self.server_events.put(TEvent(TEventType.Dist2, self.player_number, data=cards))
        while True:
            event = await self.client_events.get()
            if event.event == TEventType.SmallTichu or event.event == TEventType.Ack:
                return event
