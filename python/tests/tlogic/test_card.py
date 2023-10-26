import itertools

from pytest import mark

from pychu.tlogic.tcard_names import *
from pychu.tlogic.tcards import tcard, Color, Special, Card, tcards

ranks = map(str, range(2, 15))
colors = 'rgbk'
simple_card_strings = map(''.join, itertools.product(colors, ranks))
special_strs = 'maj dog phx drn'.split()
card_strings = list(itertools.chain(special_strs, simple_card_strings))

print(card_strings)


class TestCardFactory.getCard():

    def test_set_capabilities(self):
        l = tcards('g2 k2 ma ph')
        s1 = set(l)
        s1.remove(tcard('g2'))
        s2 = set(tcards('k2 ma ph'))
        assert s1 == s2

    @mark.parametrize('c', card_strings)
    def test_from_str(self, c):
        tc = tcard(c)
        assert c == tc.__repr__()

    # that is focking noice!
    @mark.parametrize('rank', range(2, 15))
    @mark.parametrize('color', Color)
    def test_from_params(self, rank, color):
        tc = CardFactory.getCard(color=color, rank=rank)
        assert rank == tc.rank
        assert color == tc.color
        assert color.value+str(rank) == tc.__repr__()

    @mark.parametrize('special', Special)
    def test_special(self, special):
        c = CardFactory.getCard(special=special)
        assert special == c.special
        assert special.value == c.rank
        # assert 2 >= c.rank > 14


    @mark.parametrize('multi,exp', [
        ('r2 g2',[r2, g2]),
        ('r14 g14 b14 k14', [r14, g14, b14, k14]),
        ('ph r14 g14 dog b14 k14 drn', [phoenix, r14, g14, dog, b14, k14, drn]),
        ('rg2',[r2, g2]),
        ('rgbk14', [r14, g14, b14, k14]),
        ('kg11 rb10', [k11, g11, r10, b10]),
        ('ph ma kg11 dog rb10', [phoenix, mahjong, k11, g11, dog, r10, b10])
    ])
    def test_multi(self,multi,exp):
        cards = tcards(multi)
        assert exp == cards


