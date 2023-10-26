import pytest
from pytest import mark

from pychu.tlogic.tcard_names import *
from pychu.tlogic.tcards import tcards
from pychu.tpattern.straights import TStraight
from tpattern.test_pattern import _find_


class TestStraightRec():
    @mark.parametrize('cards, rank, cardinality', [
        ('r2 g3 r4 k5 b6', 2, 5),
        ('ma r2 g3 r4 k5 b6', 1, 6),
        ('ma r2 g3 r4 k5', 1, 5),
        ('ma r2 g3 r4 phx k6',1,6),
    ])
    def test_valid(self, cards, rank, cardinality):
        tc = tcards(cards)
        s = TStraight(tc)

        assert rank == s.rank
        assert cardinality == s.cardinality
    @mark.parametrize('cards, red', [
        ('r2 r3 g3 r4 g5 g6', [r3, g3]),
        ('r2 rg3 r4 g5 gr6', [r3, g3, g6, r6]),
    ])
    def test_redundant(self, cards, red):
        tc = tcards(cards)
        s = TStraight(tc)
        assert red == s.redundant_cards

    @mark.parametrize('c1,c2,exp', [
        ('r2 r3 r4 r5 g6', 'r2 r3 r4 r5 g6 g7', False),
        ('r2 r3 r4 r5 g6', 'r2 r3 r4 r5 g6 phx', False),
        ('r2 r3 r4 r5 g6', 'r3 r4 r5 g6 g7', True),
        ('r2 r3 r4 r5 g6', 'r3 r4 r5 g6 phx', True),
        ('r2 r3 r4 r5 g6', 'r3 r4 r5 g6 phx', True),
        ('r3 r4 r5 g6 phx','r2 r3 r4 r5 g6',  False),
        ('r10 b11 g12 r13 g14', 'r10 b11 g12 r13 g14 ph', False),
        ('k9 r10 b11 g12 r13', 'r10 b11 r13 g14 ph', True)
    ])
    def test_compare_table(self, c1, c2, exp):
        st1 = TStraight(tcards(c1))
        st2 = TStraight(tcards(c2))
        assert st2.gt_table(st1) is exp

    @mark.parametrize('c1,c2,exp', [
        ('r2 r3 r4 r5 g6', 'r2 r3 r4 r5 g6 g7', True),
        ('r2 r3 r4 r5 g6', 'r2 r3 r4 r5 g6 phx', True),
        ('r2 r3 r4 r5 g6', 'r3 r4 r5 g6 phx', True),
        ('r3 r4 r5 g6 phx','r2 r3 r4 r5 g6',  False),
        ('r10 b11 g12 r13 g14', 'r10 b11 g12 r13 g14 ph', False),
        ('k9 r10 b11 g12 r13', 'r10 b11 g12 r13 g14 ph', True)
    ])
    def test_compare_hand(self, c1, c2, exp):
        st1 = TStraight(tcards(c1))
        st2 = TStraight(tcards(c2))
        assert st2.gt_hand(st1) is exp

    @mark.parametrize('c', [
        'b11 g12 r13 g14',
        'r8 b11 g12 r13 g14 ',
        'r8 phx b11 g12 r13 g14 '
    ])
    def test_illegal_straight(self, c):
        with pytest.raises(ValueError):
            st1 = TStraight(tcards(c))

    # Well, Straights are a bit of a nuisance
    # since they tend to become rather long
    # random straight generator?
    @mark.parametrize('table,hand,exp',[
        ('r3 g4 b5 k6 k7','r3 g4 b5 k6 k7 g8', ['r3 g4 b5 k6 k7 g8']),
        ('r3 g4 b5 k6 k7','r3 g4 b5 k7 g8 ', []),
        ('r3 g4 b5 k6 k7','r3 g4 b5 k6 k7 g8 k10 g11 b12 b13 g14', ['r3 g4 b5 k6 k7 g8', 'k10 g11 b12 b13 g14']),
        ('r3 g4 b5 k6 k7','phx r3 g4 b5 k6 k7 g8 k10 g11 b12 b13 g14', ['r3 g4 b5 k6 k7 g8 phx k10 g11 b12 b13 g14']),
    ])
    def test_find(self, hand, table, exp):
        _find_(TStraight, hand, table, exp)



