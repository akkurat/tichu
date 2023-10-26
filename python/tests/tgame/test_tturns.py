# TTurn is rather gonna be a data object
# or might even be left out in python
# due to using dicts
# Hence tests are not too useful
# class TestTTurn():
#     def

# In order for this test to give valid result
# the TPattern Classes must all work expectedly
import pytest
from pytest import mark

from pychu.tgame.validator import CardsValidator
from pychu.tlogic.tcards import tcards
from pychu.tlogic.tcard_names import *


class TestTurnValidator:

    @pytest.fixture
    def deck(self):
        return generate_deck()

    @mark.parametrize('table,played', [
        ({maj}, {k2, r2}),
        ({CardFactory.getCard(rank=1.5, special=Special.phoenix)}, {maj}),
        ({drn}, {phx}),
        ({k5,b5}, {r6}),
        ({k7, r7}, {r9, g9, b9})
    ])
    def test_rejection(self, deck, table, played):
        """
        Give an invalid pattern of cards, e.g.::

            [{mah}, {k2, r2}]
            [{phx}, {mah}]
            [{k14}, {drn}, {phx}]

        or a straight with a different length and so on
        (this should already be checked by in the pattern class)
        should raise a value error

        :param cards:
        :return:
        """
        validator = CardsValidator(table, deck)
        validator.verify(played)
        assert not validator.played_cards

    @mark.parametrize('cards',[
        ('k2 b2|g5 b5'),
        ('mah|phx'),
        ('k14|phx'),

    ])
    def test_valid(self, cards, deck):
        """
        Just give a list of valid patterns

        :param cards:
        :return:
        """
        tc = tcards(cards)
        table = tc[0]
        played = tc[1]
        validator = CardsValidator(table, deck)
        validator.verify(played)
        assert validator.played_cards

        @mark.parametrize('table,played,hand,wish,allowed', [
            ([b2,g2,k2],[k3, b3, g3], [k3, b3, g3, phoenix],3,True),
            ([b2,g2],[ b3, g3], [k3, b3, g3, phoenix],3,True),
            ([b2,g2,k2],[k3, b3, g3], [k3, b3, g3, k5, g5, k5, phoenix],5,False),
            ([b2,g2],[ b3, g3], [k3, b3, g3, g4, phoenix],4,False),
        ])
        def test_wish_allowed(table,played,hand,wish,allowed):
            validator = CardsValidator(table,hand,wish)
            validator.verify()



class TestTurn:
    """
    Not sure if this is testable by a unit test...
    """

    def test_win(self, cards):
        """
        Verify if a "win" of a turn is noted correctly

        :param cards:
        :return:
        """

    def test_bombs(self, cards):
        """
        Verify that bombs are allowed outside normal playing mode
        -> Self bombing
        -> Bombing if it is not the turn
        :param cards:
        :return:
        """



