import sys

import pytest
from pytest import mark

from pychu.tpattern.multiples import TMultiFinder, TMulti

print(sys.path)
print(sys.executable)

from pychu.tlogic.tcards import tcards


class TestMultiRec():
    def test_4simple(self):
        cards = tcards('k2 r2 b2 g2')
        pr = TMultiFinder(4,True)
        out, le = pr.recognize(cards)
        assert {2:(cards)} == out

    def test_4simpleph(self):
        cards = tcards('k2 r2 b2 b3')
        pr = TMultiFinder(4,True)
        out, le = pr.recognize(cards)
        assert out == {}

    def test_trix2(self):
        tri2 = tcards('k2 r2 b2')
        tri3 = tcards('r3 g3 b3')
        distraction = tcards('g5 b8 r9 k10 k11 k13')
        cards = distraction + tri2 + tri3
        pr = TMultiFinder(3, True)
        out, le = pr.recognize(cards)
        pytest.assume(len(out) == 2)
        pytest.assume(tri2 == out[2])
        pytest.assume(tri3 == out[3])

    def test_3fail(self):
        cards = tcards('k2 r2 b3 g3')
        pr = TMultiFinder(3, True)
        out, le = pr.recognize(cards)
        assert out == {}

    def test_2x2(self):
        cards = tcards('k2 r2 b3 g3')
        pr = TMultiFinder(2, True)
        out, le = pr.recognize(cards)
        assert out == {2:(tcards('k2 r2')), 3:(tcards('b3 g3'))}

    def test_2ph(self):
        cards = tcards('k2 g2 ph b3 g3')
        pr = TMultiFinder(2, True)
        out, le = pr.recognize(cards, True)
        assert {2:(tcards('k2 g2')), 3:(tcards('b3 g3'))} == out

    def test_3ph(self):
        cards = tcards('k2 g2 ph b3 g3')
        pr = TMultiFinder(3, False)
        out, le = pr.recognize(cards, True)
        assert {2:(tcards('k2 g2 ph')), 3:(tcards('b3 g3 ph'))} == out

    @mark.parametrize('c1,c2,exp', [
        ('ma', 'k9', True),
        ('k2 g2', 'k3 r3', True),
        ('k2 g2 r2', 'k3 r3', False),
        ('k2 g2 r2', 'k3 r3 g3', True),
        ('k2 g2 r2', 'k3 r3 ph', True),
        ('r2 g2 b2 k2', 'k13 r13 g13', False),  # Bomb
        ('k13 r13 g13', 'r2 g2 b2 k2', True)  # Bomb

    ])
    def test_compare(self, c1, c2, exp):
        m1 = TMulti(tcards(c1))
        m2 = TMulti(tcards(c2))
        assert m2.gt_table(m1) is exp

    @mark.parametrize('c', [
        'k2 r2 b3 ph',
        'do r4',
        'k2 r2 g4',
        '',
        'g4 drn',
        'g5 r7',
    ])
    def test_illegal_multi(self, c):
        with pytest.raises(ValueError):
            cards = tcards(c)
            TMulti(cards)

    @mark.parametrize('c, rank, numberof', [
        ('k2 r2 b2 ph', 2, 3),
        ('k2 r2 b2 g2', 2, 4),
        ('r5 k5 ph', 5, 3),
        ('r5 ph', 5, 2),
        ('r5', 5, 1),
    ])
    def test_rank_numberof(self, rank, c, numberof):
        cards = tcards(c)
        tm = TMulti(cards)
        assert rank == tm.rank
        assert numberof == tm.cardinality




