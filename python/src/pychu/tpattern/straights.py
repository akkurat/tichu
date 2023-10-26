from typing import Set, Collection, List

from boltons.setutils import IndexedSet

from pychu.tlogic.tcard_names import dog, phoenix
from pychu.tlogic.tcards import Card, Special, has_phoenix
from pychu.tpattern.tpattern import TPattern, TPatternEmpty
from pychu.tpattern.tpatternfinder import TPatternFinder


class TStraight(TPattern):

    cardinality = None
    rank = None
    redundant_cards = None
    essential_cards = None

    def __init__(self, cards: Collection[Card]):
        self.cards: IndexedSet = IndexedSet(cards)
        le = len(cards)
        if le < 5:
            raise ValueError('At least five cards are needed for a '
                             'straight. Only {} were given'.format(le))
        if dog in cards:
            raise ValueError('Dog not usable in Patterns')

        self.cardinality = len(cards)

        # Check consistency of given cards!

        sorted_cards = sorted(cards, key=Card.sorter)
        sorted_cards_iter = iter(sorted_cards)
        first_card = next(sorted_cards_iter)
        self.rank = first_card.rank
        phx_avail = has_phoenix(sorted_cards)

        redundant_ranks = []
        self.phx_rank = None

        last_rank = self.rank
        buf = []
        for current_card in sorted_cards_iter:
            if current_card.special == Special.phoenix:
                continue
            diff = current_card.rank - last_rank
            if diff == 0:
                redundant_ranks.append(current_card.rank)
            elif diff == 1:
                last_rank = current_card.rank
            elif diff == 2 and phx_avail:
                phx_avail = False
                last_rank = current_card.rank
            else:
                raise ValueError("Inconsistent Straight")

        # if phx was not used to build the straight
        # it can make the straight longer
        if phx_avail:
            # append phx to the end (if not already ace)
            if last_rank < 14:
                last_rank += 1
                self.phx_rank = last_rank
            elif self.rank > 2:
                self.rank -= 1
                self.phx_rank = self.rank

        self.redundant_cards = []; self.essential_cards = []
        for c in cards:
            if c.rank in redundant_ranks:
                self.redundant_cards.append(c)
            else:
                self.essential_cards.append(c)
        self.highest = last_rank
        self.cardinality = self.highest - self.rank + 1

    def find(self, cards, higher=True):
        pr = TStraightFinder()
        rec = pr.recognize(cards, True)
        out = [st for st in map(TStraight, rec) if st.gt_hand(self)]

        return out

    def __eq__(self, other):
        if(isinstance(other, TStraight)):
            if other.cards == self.cards:
                return True
        return False


    def gt_table(self, other: TPattern):
        if isinstance(other, TStraight):
            if other.cardinality != self.cardinality:
                return False
            else:
                return self.highest > other.highest
        # Maybe this is too complicated
        elif isinstance(other, TPatternEmpty):
            return True
        else:
            return False

    def gt_hand(self, other: TPattern):
        if isinstance(other, TStraight):
            if self.cardinality < other.cardinality:
                return False
            else:
                return self.highest > other.highest

        elif isinstance(other, TPatternEmpty):
            return True
        else:
            return False



class TStraightFinder(TPatternFinder):

    @classmethod
    def recognize(self, cards: Set[Card], phoenix=True) -> List[TPattern]:
        return TStraightFinder.__find_straight_phoenix__(cards)

    @staticmethod
    def __find_straight_phoenix__(c):
        cards = list(c)
        out = []
        i = 1;
        phx_avail = has_phoenix(cards)
        if phx_avail:
            cards.remove(phoenix)
        lastcard = cards[0]
        buffer = [lastcard]
        rank = lastcard.rank
        while i < len(cards):
            card = cards[i]
            if card == phoenix:
                i+=1; continue
            if (card.rank - lastcard.rank) == 2:
                if phx_avail:
                    buffer.append(phoenix)
                    buffer.append(card)
                else:
                    if len(buffer) >= 5:
                        out.append(buffer)
                    # print buffer, "reset"
                    buffer = [card, ]

            elif (card.rank - lastcard.rank) == 1:
                buffer.append(card)
            # print "appending", card
            elif (card.rank - lastcard.rank) == 0:
                # redundant card
                pass
            else:
                if len(buffer) >= 5:
                    out.append( buffer)
                # print buffer, "reset"
                buffer = [card]
                rank = card.rank

            lastcard = card
            i += 1
        if len(buffer) >= 5:
            out.append( buffer)

        return out

