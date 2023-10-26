from typing import List

from pychu.tlogic.tcards import Card, Special, tcard, Color, CardFactory

# TODO: maybe move to its own file
dog = CardFactory.getCard(special=Special.dog)
drn = dragon = CardFactory.getCard(special=Special.dragon)
# That will be problematic when played onto a single card
phx = phoenix = CardFactory.getCard(special=Special.phoenix)
maj = mahjong = CardFactory.getCard(special=Special.mahjong)

### For convenience reasons (especially testing) have an explicit instance of each card
# ranks = map(str, range(2, 15))
# colors = 'rgbk'
# simple_card_strings = map(''.join, itertools.product(colors, ranks))

r2 = tcard('r2')
r3 = tcard('r3')
r4 = tcard('r4')
r5 = tcard('r5')
r6 = tcard('r6')
r7 = tcard('r7')
r8 = tcard('r8')
r9 = tcard('r9')
r10 = tcard('r10')
r11 = tcard('r11')
r12 = tcard('r12')
r13 = tcard('r13')
r14 = tcard('r14')
g2 = tcard('g2')
g3 = tcard('g3')
g4 = tcard('g4')
g5 = tcard('g5')
g6 = tcard('g6')
g7 = tcard('g7')
g8 = tcard('g8')
g9 = tcard('g9')
g10 = tcard('g10')
g11 = tcard('g11')
g12 = tcard('g12')
g13 = tcard('g13')
g14 = tcard('g14')
b2 = tcard('b2')
b3 = tcard('b3')
b4 = tcard('b4')
b5 = tcard('b5')
b6 = tcard('b6')
b7 = tcard('b7')
b8 = tcard('b8')
b9 = tcard('b9')
b10 = tcard('b10')
b11 = tcard('b11')
b12 = tcard('b12')
b13 = tcard('b13')
b14 = tcard('b14')
k2 = tcard('k2')
k3 = tcard('k3')
k4 = tcard('k4')
k5 = tcard('k5')
k6 = tcard('k6')
k7 = tcard('k7')
k8 = tcard('k8')
k9 = tcard('k9')
k10 = tcard('k10')
k11 = tcard('k11')
k12 = tcard('k12')
k13 = tcard('k13')
k14 = tcard('k14')


def generate_deck() -> List[Card]:
    deck = []
    for color in Color:
        for i in range(2, 15):
            # print (i, color)
            deck.append(CardFactory.getCard(color=color, rank=i))

    deck.append(dragon)
    deck.append(phoenix)
    deck.append(mahjong)
    deck.append(dog)

    # for i, card in enumerate(deck):
    #     print (i,card)
    # print card.height, card.color
    return deck;