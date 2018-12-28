from typing import Set, Callable, Dict

# noinspection PyUnresolvedReferences
from pychu.tlogic.tcards import Card
from pychu.tlogic.thelpers import ident_pattern_unique
from pychu.tpattern.fullhouse import TFullHouseFinder
from pychu.tpattern.multiples import TMultiFinder, TMultiFinder
from pychu.tpattern.straights import TStraightFinder
from pychu.tpattern.tdoublestraight import TDoubleStraight, TDoubleStraightFinder
from pychu.tplayer.tplayer import TPlayer


class StupidAI(TPlayer):

    async def schupf(self) -> Dict[int, Card]:
        n = self.player_number
        back = {}
        cards = list(sorted(self.hand))
        # partner
        back[(n+2)%4] = cards[-1]
        back[(n+1)%4] = cards[0]
        back[(n+3)%4] = cards[1]

        self.hand.difference_update(back.items())

        return back

    async def ready(self):
        return True

    async def play(self, table_cards: Set[Card], card_receiver: Callable[[Set[Card]], bool], wish=None) -> None:
        cards = []
        if self.hand:
            if len(table_cards) == 0:
                cards = self.start()
            else :
                cards = self.react(table_cards)

        card_receiver(cards)
        self.hand.difference_update(cards)

    def react(self, table_cards):
        pattern = ident_pattern_unique(table_cards)
        possible_cards, unusable_cards = pattern.find(self.hand)
        try:
            first = next(iter(possible_cards))

            cards = set(possible_cards[first])

        except Exception as e:
            print(e)
            cards = set()

        return cards

    def start(self):

        doublestr = TDoubleStraightFinder().recognize(self.hand, True)
        straights = TStraightFinder().recognize(self.hand, True)
        fh = TFullHouseFinder().recognize(self.hand,True)

        triples, l3 = TMultiFinder(3, True).recognize(self.hand)
        pairs, l2 = TMultiFinder(2, True).recognize(self.hand)
        singles, l1 = TMultiFinder(1, True).recognize(self.hand)
        tmin = min(triples.items()) if triples else (100,set())
        pmin = min(pairs.items()) if pairs else (99,set())
        smin = min(singles.items()) if singles else (98,set())



        cards = min((tmin,pmin,smin))

        card = min(self.hand, key=lambda c: c.rank)
        # cards = {card}
        return cards[1]
