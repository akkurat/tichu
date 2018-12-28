import re

from prompt_toolkit.document import Document
from prompt_toolkit.lexers import SimpleLexer, Lexer, PygmentsLexer
from prompt_toolkit.styles import NAMED_COLORS


class TichuLexer(Lexer):
    """
    idea: having colored input for the CLI-client

    """

    def lex_document(self, document: Document):
        colors = {
            'k': '#000000' ,
            'r': '#ff0000' ,
            'g': '#00ff00' ,
            'b': '#0000ff' ,
        }
        def get_line(lineo):
            line = document.lines[lineo]

            out = []
            for card in re.split(r'( )',line):
                if not card:
                    continue
                elif card[0] in colors:
                    out.append((colors[card[0]], card))
                else:
                    out.append(('#bbbbbb', card))
            return out


        return get_line








class RainbowLexer(Lexer):
    def lex_document(self, document):
        colors = list(sorted(NAMED_COLORS, key=NAMED_COLORS.get))

        def get_line(lineno):
            return [(colors[i % len(colors)], c) for i, c in enumerate(document.lines[lineno])]

        return get_line










