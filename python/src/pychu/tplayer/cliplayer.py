import sys
from typing import Set

from prompt_toolkit import prompt

from pychu.tgame.lexer import RainbowLexer, TichuLexer
from pychu.tgame.tevent import TEvent
from pychu.tplayer.tplayer import TPlayer
from pychu.tlogic.tcards import Card, tcards
from prompt_toolkit import print_formatted_text as print


#TODO: rename to console player
class CliPlayer(TPlayer):
    """
    A simple human player taking commands from stdin
    """

    # This might make testability already difficult
    async def init_cards(self, cards: Set[Card], player_number: int):
        super().init_cards(cards, player_number)
        print("You are player {}".format(self.player_number))
        return player_number

    def play(self, lastcards: Set[Card], cards_validator):
        """
        :rtype: Set[Card]
        :param lastcards:
        """
        validpattern = None
        while validpattern is None:
            inp = prompt("What would you like to play on {}\n"
                        "Write 'pass' for pass\n"
                        "Your Cards: {}\n".format(lastcards or '{}', sorted(self.hand, key=lambda c: c.rank)),
                         lexer=TichuLexer())
            try:
                if inp == "pass" or inp == "p":
                    print( 'You pass...')
                    cards = []
                else:
                    cards = tcards(inp)

                validpattern = cards_validator(cards)
                if validpattern is None:
                    print("Invalid pattern, try again...")

            except Exception as e:
                print(sys.exc_info())
                print("'{}' is invalid! Try again!".format(e))

        self.hand.difference_update(cards)

    def log(self, e: TEvent):
        print(e)

