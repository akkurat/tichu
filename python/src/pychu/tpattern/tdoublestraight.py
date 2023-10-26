from pychu.tlogic.tcard_names import mahjong, dragon, phx, dog
from pychu.tlogic.tcards import tcard, Card
from pychu.tpattern.tpattern import TPattern
from pychu.tpattern.tpatternfinder import TPatternFinder
from collections import Counter

from typing import Set

class TDoubleStraight( TPattern):

    rank = None
    cardinality = None
    essential_cards = None
    redundant_cards = None

    def __init__(self, cards: list[Card]):
        if mahjong in cards:
            raise ValueError()
        if dragon in cards:
            raise ValueError()
        if dog in cards:
            raise ValueError()
        if len(cards) < 4:
            raise ValueError("Double STraight needs at least 4 Cards!")

        #self.cards seems must come first
        self.cards = c = list( sorted(cards,key=Card.sorter ) )

        length = len(self.cards)

        phx_avail = phx in c
        self.rank = last_rank = c[0].rank
        cardinality = 1
        redundant = []; buf = [c[0]]; essential = [];

        i = 1; same = 0#same rank
        while(i < length):
            if c[i].special:
                i += 1
                continue
            rank = c[i].rank
            if last_rank == rank:
                buf.append(c[i])
                same +=1  # At least two elements with same rank
            elif same:
                #todo: track redundant cards
                #cards or just the rank?
                if same > 2:
                    redundant += buf
                else:
                    essential += buf
                same = 0
                cardinality +=1; buf = [c[i]]
                if rank - last_rank > 1:
                    raise ValueError("No Valid DoubleStraight")
            elif phx_avail:
                phx_avail = False
                buf.append(phx)
                essential += buf
                cardinality += 1
                buf = [c[i]]
            else:
                raise ValueError("No Valid DoubleStraight")

            last_rank = rank
            i+=1

        #very ugly
        if same > 2:
            redundant += buf
        else:
            essential += buf

        if len(redundant) + len(essential) != len(cards):
            raise ValueError("No cards can be left over")

        self.cardinality = cardinality
        self.redundant_cards = redundant
        self.essential_card = essential

    def find(self, cards, higher=True):
        pass

    @property
    def unique(self) -> bool:
        return not self.redundant_cards



class TDoubleStraightFinder(TPatternFinder):


    def recognize(self, cards: Set[Card], phoenix=False):

        # sort carts by height


        # sorted_cards = sorted(cards, lambda card: card.height)

        # put them in a dictionary by height

        by_height = Counter(map(lambda c: c.rank, cards))
        by_height_minpair = [k for k, v in by_height.items() if v >= 2]



        # num_cards = len(sorted_cards)

        lengths = []
        i , j= 0,0
        maxidx = len(by_height_minpair)



        while (i < maxidx - 1):
            j = 0;
            while (i + j < maxidx-1):
                last_val = by_height_minpair[i + j]
                next_val = by_height_minpair[i + j + 1]
                # this only works if we don't want to know
                # details like the lenght or if there
                # is another double straight
                if (next_val - last_val) > 1:
                    break;
                else:
                    j += 1;

            if j>0:
                lengths.append(j+1);

            i += j + 1
        return lengths




        # while (j < maxidx):
        #    j+=1
        #    next_val = by_height_minpair.get(j)
        #    if (next_val-last_val) > 1:
        #        return 0


if __name__ == '__main__':
    cards1 = map(tcard, 'r2 g2 r3 k3 k5 k9'.split(' '))
    cards2 = map(tcard, 'r2 g2 r3 k3 k5 k9 r4 g4'.split(' '))
    cards3 = map(tcard, 'r2 g3 r3 k3 k5 k9'.split(' '))
    cards4 = map(tcard, 'r2 g2 r3 k3 k5 k9 r4 g4 r5 r10 g10 k11 g11'.split(' '))
    pr = TDoubleStraightFinder()

    print(pr.recognize(cards1))
    print(pr.recognize(cards2))
    print(pr.recognize(cards3))
    print(pr.recognize(cards4))
