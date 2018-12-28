from typing import List, Collection

from boltons.setutils import IndexedSet

from pychu.tlogic.tcard_names import phoenix
from pychu.tlogic.tcards import Card, Special
from pychu.tlogic.thelpers import ident_pattern_unique


class CardsValidator:

    def __init__(self, table_cards: List[Card], avail_cards, wish=None):
        self.table_cards = list(table_cards)
        self.available_cards = set(avail_cards)
        self.wish = wish
        self.played_cards = None

    def __repr__(self):
        out = "TableCards: {}".format(self.table_cards)
        if self.wish:
            out += " Wish: {}".format(self.wish)
        out += "\n Move: {}".format(self.played_cards)


    def verify(self, played_cards: Collection[Card]):
        if len(played_cards) == 0: #pass
            if self.pass_allowed():
                self.played_cards = [] #else they stay None
            return self.played_cards

        if self.available_cards.issuperset(played_cards):
            self._check_(played_cards )

        return self.played_cards

    def _check_(self, p_cards):
        played_cards = list(p_cards)
        self.wrap_single_phoenix(played_cards)
        table_pattern = ident_pattern_unique(self.table_cards)
        played_pattern = ident_pattern_unique(played_cards)
        if played_pattern.gt_table(table_pattern):
            self.played_cards = played_cards

    def pass_allowed(self):
        allowed = self.table_cards and (not self.wish_fullfillable())
        if not allowed:
            print("Pass forbidden")
        return allowed

    def wish_fullfillable(self):
        """
        If there is no wish, this function returns False
        :return:
        """
        if self.wish:
            # TODO: check also pattern necessary
            # we also need to check in case of not a single card if
            # it is possible to build this pattern
            le = filter(lambda card: card.rank == self.wish, self.available_cards)
            return le
        else:
            return False

    def wrap_single_phoenix(self, played_cards):
        """
        Wraps a single phoenix into a ranked card (inplace!)
        :param played_cards:
        :return:
        """
        if len(played_cards) == 1 and played_cards[0] == phoenix:
            if len(self.table_cards) == 0:
                played_cards[0] = Card(rank=1.5, special=Special.phoenix)
            elif len(self.table_cards) == 1:
                ph_rank = min(self.table_cards[0].rank + 0.5, 14.5)
                played_cards[0] = Card(rank=ph_rank, special=Special.phoenix)




