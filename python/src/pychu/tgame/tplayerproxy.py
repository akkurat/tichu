import copy
from asyncio import Queue
from typing import Set, List

from boltons.setutils import IndexedSet

from pychu.tgame.tevent import TEvent, TEventType
from pychu.tgame.validator import CardsValidator
from pychu.tlogic.tcard_names import mahjong
from pychu.tlogic.tcards import Card
from pychu.tplayer.tplayer import TPlayer


class TPlayerProxy:
    """
    Meta Player Representation on the server side:
    -> Keeps track of cards played
    -> Tichu announced
    -> Wishes
    -> Communicates with the connected player
    -> Verifies the validity of the movement
    """

    # keep it flat or not?

    def __init__(self, n: int, extplayer=None):
        self.player_number = n
        self.hand = IndexedSet()
        self.stash = list()
        self.extplayer: TPlayer = extplayer
        self.server = None

    async def dist_cards(self, cards: List[Card], player_number: int):
        self.player_number = player_number
        # using intersection & slicing
        self.hand = IndexedSet(cards)
        self.stash = list()
        self.extplayer.init_player(player_number)
        bigTichu = await self.extplayer.dist_first(self.hand[0:8])
        if bigTichu.event == TEventType.BigTichu:
            await self.server.put(bigTichu)
        smallTichu = await self.extplayer.dist_second(self.hand[9:14])
        if smallTichu.event == TEventType.SmallTichu:
            await self.server.put(smallTichu)

    def register_server(self, listener: Queue):
        self.server = listener

    def finished(self):
        return not self.hand

    def remove_from_hand(self, cards):
        if self.hand.issuperset(cards):
            self.hand.difference_update(cards)
        else:
            raise ValueError("This Card is not in your hand anymore!")

    def takes(self, cards):
        self.stash.extend(cards)

    def has_majong(self):
        return mahjong in self.hand

    async def play(self, last_cards) -> TEvent:
        # cards = [] if not table_buffer else table_buffer[-1]
        validator = CardsValidator(last_cards, self.hand)

        for penalty in range(3):
            await self.extplayer.play(last_cards, validator.verify)

            if validator.played_cards is not None:
                if len(validator.played_cards) == 0:
                    return TEvent(TEventType.Pass, self.player_number)
                else:
                    cards = validator.played_cards
                    try:
                        self.remove_from_hand(cards)
                        return TEvent(TEventType.Plays, self.player_number, cards)
                    except ValueError as e:
                        print(e)

            else:
                print("Player {} did wrong!".format(self.player_number))

        print("Player {} had its chance -> Forced passing!".format(self.player_number))
        return TEvent(TEventType.Pass, None)

    def ready(self) -> bool:
        if self.extplayer:
            return self.extplayer.ready()
        else:
            return False

    def register(self, player: TPlayer):
        self.extplayer = player
        self._init_extern()

    def _init_extern(self):
        if self.extplayer:
            return self.extplayer.init_cards(copy.copy(self.hand), self.player_number)
        return False
