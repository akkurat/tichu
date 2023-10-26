import pytest
from pytest import mark

from pychu.tlogic.tcards import tcards


#Todo: general mixings for  testing?
from pychu.tpattern.tdoublestraight import TDoubleStraight


class TestDoubleStraights():
    """
    Double Straight starts with 2 pairs
    (not a single one, a single pair should be
    recognized as multi(2), just a convention
    but it will make things easier to be consistent)
    """

    @staticmethod
    def failing_cards(cards):
        tc = tcards(cards)
        with pytest.raises(ValueError):
            TDoubleStraight(tc)

    @staticmethod
    def valid_cards(cards, rank, length):
        tc = tcards(cards)
        ds = TDoubleStraight(tc)
        assert rank == ds.rank
        assert length == ds.cardinality


    @mark.parametrize('cards',[
        'k2',
        '',
        'k2 g3',
        'phx dog',
        'ma phx rk2',
        'kg2 r3 b4',
        '',
        'ma phx kg2',
        'rb14 drn phx',
        'b9 r10',
    ])
    def test_failing(self,cards):
        """
        Pattern that do not even have the necessary cards
        :param c:
        :return:
        """
        self.failing_cards(cards)

    @mark.parametrize('cards', [
        'gk2 bk3 g5 phx',
        'gk2 bk3 gr4 drn phx',
        'gk2 bk3 gr4 phx', #not yet sure if this should be allowed
    ])
    def test_leftovers(self, cards):
        """
        Cards that can build a valid pattern but don't use all cards
        :param c:
        :return:
        """
        self.failing_cards(cards)


    @mark.parametrize('cards, rank, length', [
        ('kg2 bg3 kr4', 2, 3),
        ('kg2 bg3 kr4', 2, 3),
        ('kg2 rg3', 2, 2),
        ('rgb3 kgr4', 3, 2),
        ('rg5 rg6 kg7 bg8 rg9', 5, 5),
    ])
    def test_valid(self, cards, rank, length):
        """
        Verify to accept some simple patterns
        :param c:
        :return:
        """
        self.valid_cards(cards, rank, length)

    @mark.parametrize('cards, rank, length', [
        ('kg2 bg3 k4 phx', 2, 3),
        ('phx k2 bg3 kr4', 2, 3),
        ('rk2 b3 phx kr4', 2, 3),
    ])
    def test_phx(self, cards, rank, length):
        """
        Specifically test patterns including the phx
        :param cards:
        :param rank:
        :param length:
        :return:
        """
        self.valid_cards(cards, rank, length)

    @mark.parametrize('c1, c2, exp', [
        ('kg2 rg3', 'gk4 kr5', True),
        ( 'gk4 kr5','kg2 rg3', False),
        ('kg2 rg3 rb4 kg5', 'gk4 kr5 kb6 gk7', True),
        ('kg2 rg3 rb4 kg5', 'gk4 kbr5 krb6 gk7', True),
        ('kg2 rg3 rb4 kg5', 'gk4 kbr5 krb6 gk7 rb8', False),

    ])
    def test_comparison_table(self, c1, c2, exp):
        """
        Check if the rank of two patterns is evaluated correctly
        :param c1:
        :param c2:
        :param exp:
        :return:
        """
        ds1 = TDoubleStraight(tcards(c1))
        ds2 = TDoubleStraight(tcards(c2))

        assert ds2.gt_table(ds1) is exp

    @mark.parametrize('c1, c2, exp', [
        ('kg2 rg3', 'gk4 kr5', True),
        ( 'gk4 kr5','kg2 rg3', False),
        ('kg2 rg3 rb4 kg5', 'gk4 kr5 kb6 gk7', True),
        ('kg2 rg3 rb4 kg5', 'gk4 kbr5 krb6 gk7', True),
        ('kg2 rg3 rb4 kg5', 'gk4 kbr5 krb6 gk7 rb8', True),

    ])
    def test_comparison_hand(self, c1, c2, exp):
        """
        Check if the rank of two patterns is evaluated correctly
        :param c1:
        :param c2:
        :param exp:
        :return:
        """
        ds1 = TDoubleStraight(tcards(c1))
        ds2 = TDoubleStraight(tcards(c2))

        assert ds2.gt_hand(ds1) is exp




