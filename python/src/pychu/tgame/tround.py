from __future__ import annotations

import asyncio
import random as r
import time
from typing import Set, List, Dict

from pychu.tgame.tevent import TEventType, TEvent
from pychu.tgame.tplayerproxy import TPlayerProxy
from pychu.tlogic.tcards import Card
from pychu.tlogic.tcard_names import dog, generate_deck
from pychu.tplayer.tplayer import TPlayer


def from_players(players: List[TPlayer]) -> TRound:
    """
    Utility function if the numbers of players is static
    and the proxy player doesn't need to be instantiated customly
    :param players: TPlayer
    :return: a new round
    """
    proxies = [TPlayerProxy(i, p) for i, p in enumerate(players)]
    return proxies


class TRound:
    """
    TRound keeps track of all the cards during a complete Round.
    It distributes the cards at the beginning
    checks if cards are valid (e.g. cheating over remote client)
    """

    # Todo: TRound should only know ProxyPlayer
    def __init__(self, proxy_players: List[TPlayerProxy]):
        # if not all(proxy_players is )
        if len(proxy_players) != 4:
            raise ValueError("4 Players expected!")
        self.card_log: List[Dict[int, Set[Card]]] = []
        self.players: List[TPlayerProxy] = list(proxy_players)

    async def start(self):
        deck = generate_deck()
        shuffled_deck = r.sample(deck, 56)
        for s in range(4):
            oCards = shuffled_deck[s * 14:(s + 1) * 14]
            res = await self.players[s].dist_cards(oCards, s)

        player_number = self.start_player()

        while self.active_players > 1:  # nplayers > 1
            player_number, cards = await self.turn(player_number, 0)
            self.logEventParams(player_number, TEventType.Take, data=cards)
            self.card_log += cards

        print(self.show_cards())

        return self.card_log

    def logEventParams(self, current_pl_number: int, event, data=None, message=None):
        ev = TEvent(event, current_pl_number, data, message)
        self.logEvent(ev)

    def logEvent(self, ev: TEvent):
        from pychu.tplayer.cliplayer import CliPlayer

        if not any(isinstance(pl, CliPlayer) for pl in self.players):
            print(ev)
        # for player in self.players:
        # player.log(ev)

    @property
    def active_players(self):
        pls = [not p.finished() for p in self.players]
        return sum(pls)

    def start_player(self):
        for i, player in enumerate(self.players):
            if player.has_majong():
                return i
        raise Exception("No majong available anymore")

    def finished(self, pid):
        return self.players[pid].finished()

    def show_cards(self):
        out = ''
        for p in self.players:
            out += "Hand: {} | Stash: {}\n".format(p.hand, p.stash)

        return out

    async def turn(self, pid: int, delay=0.3) -> (int, any):
        trick_owner = -1
        table_buffer = []
        last_cards = []
        while pid != trick_owner:
            # todo: move to the end
            if self.finished(pid):
                pid = (pid + 1) % 4
                continue

            time.sleep(delay)

            player: TPlayerProxy = self.players[pid]
            # this move is checked by the proxy player
            ev = await player.play(last_cards)
            # therefore we trust if it was played the new player is owner of the trick
            if (ev.event == TEventType.Plays):
                last_cards = ev.data
                trick_owner = pid
                table_buffer += (last_cards)

                if {dog}.issuperset(last_cards):
                    pid = trick_owner = (pid + 2) % 4  # partner
                    break;
            self.logEvent(ev)

            pid = (pid + 1) % 4

        player.takes(table_buffer)
        return trick_owner, table_buffer


class TTournament:

    # TODO: Team zuordnung
    def __init__(self):
        self.pointsA = 0
        self.pointsB = 0

    async def start(self, proxies: List[TPlayerProxy]):
        # might argue about hardcoding this, but rules are rules...
        while max(self.pointsA, self.pointsB) < 1000:
            print("Before Gathering")
            result = await asyncio.gather(*map(lambda proxy: proxy.ready(), proxies))
            print(result)
            print("Player are all ready")

            tround = TRound(proxies)
            # todo: cumulate points
            await tround.start()
