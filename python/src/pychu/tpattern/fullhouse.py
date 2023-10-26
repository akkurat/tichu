import operator
from functools import reduce

import boltons
from boltons.iterutils import remap
from more_itertools import flatten

from pychu.tpattern.multiples import TMultiFinder, TMultiFinder
from pychu.tpattern.tpattern import TPattern
from pychu.tpattern.tpatternfinder import TPatternFinder
from pychu.tlogic.tcards import Card, has_phoenix, tcard
from typing import Set, Dict


class TFullHouse(TPattern):
    redundant_cards = None
    essential_cards = None
    rank = None
    cardinality = 5


    def find(self, cards, higher=True):
        pairRec = TMultiFinder(2, True)
        tripleRec = TMultiFinder(3, True)
        pairs,a = pairRec.recognize(cards)
        triples,b = tripleRec.recognize(cards)

        lipairs = list(pairs.values())
        ltriples = list(triples.values())
        li = list(flatten(lipairs+ltriples))
        try:
            fh = TFullHouse(li)
            return [fh]
        except:
            return []




    def __init__(self, cards: Set[Card]):
        if len(cards) != 5:
            raise ValueError("Fullhouse takes exactly 5 Cards")

        triples, le3 = TMultiFinder(3, False).recognize(cards, True)
        pairs, le2 = TMultiFinder(2, True).recognize(le3, True)

        if le2:
            raise ValueError("{} are leftover.\nNo card should left behind. Use the "
                             "Finder class for that purpose...".format(le2))

        if len(triples) > 0 and len(triples) + len(pairs) > 1:
            # Everything ok, a Fullhouse is buildable
            self.triples = triples
            self.pairs = pairs
        else:
            raise ValueError("Not a valid fullhouse")

        self.rank = max(self.triples)

        self.redundant_cards = []
        self.essential_cards = []
        if len(triples) > 1 and len(pairs) > 0:
            self.redundant_cards += triples.items()
        else:
            self.essential_cards += triples.items()

        if len(pairs) > 1 or len(triples):
            self.redundant_cards += pairs.items()
        else:
            self.essential_cards += pairs.items()



    def __repr__(self):
        return "TFullHouse {} {}".format(self.pairs, self.triples)

    def __eq__(self, other):
        if isinstance(other, TFullHouse):
            return other.__repr__() == self.__repr__()
        else:
            return False











class TFullHouseFinder(TPatternFinder):
    # Only pairs (not if cont. >2 matching)

    def recognize(self, cards: Set[Card], phoenix=True) -> bool:

        if phoenix:
            return TFullHouseFinder.__find_fullhouse_phoenix__(cards)
        else:
            return TFullHouseFinder.__find_fullhouse__(cards)

    @staticmethod
    def __find_fullhouse_phoenix__(cards: Set[Card]) -> bool:
        if has_phoenix(cards):
            # special
            pass
        else:
            return TFullHouseFinder.__find_fullhouse__(cards);

    # Max. number of full houses with 14 cards is 2 anyways...
    # but this should be a general solution
    @staticmethod
    def __find_fullhouse__(cards: Set[Card]):
        pairRec = TMultiFinder(2, True)
        tripleRec = TMultiFinder(3, True)
        pairs,a = pairRec.recognize(cards)
        triples,b = tripleRec.recognize(cards)
        num_pairs = len(pairs)
        num_triples = len(triples)

        if (num_triples > 0):
            diff = num_pairs - num_triples;
            if (diff) >= 0:
                return min(num_pairs, num_triples);
            else:
                matching = num_pairs  # because num_triples < num_pairs, ergo num_pairs is the number of matching pairs
                # print('matching', matching)
                additional = (num_triples - num_pairs) // 2;
                # print('additional', additional)
                return matching + additional


def pr(num: int):
    print("Number of full houses", num)


if __name__ == '__main__':

    cards = [];
    cards.append(list(map(tcard, ['r4', 'g4', 'b4', 'r2', 'g2', 'k2'])))
    cards.append(list(map(tcard, ['r4', 'g4', 'b4', 'r2', 'g2'])))
    cards.append(list(map(tcard, ['r4', 'g4', 'b4', 'r2', 'g2', 'k2', 'r3', 'k3', 'r5', 'g5', 'k5'])))
    cards.append(list(map(tcard, ['r4', 'g4', 'b4', 'r2', 'g2', 'k2', 'r3', 'k3', 'g5', 'k5', 'r8', 'g8', 'b8'])))

    fhr = FullhouseMatch()
    for cardset in cards:
        print(cardset)
        pr(fhr.recognize(cardset))
