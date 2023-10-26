from pytest import mark

from pychu.tlogic.tcards import *



# test string same memory:

st1 = tcard('k2')
st2 = tcard('k2')
st3 = 'c'
st4 = 'c'


print(st2)

# st2.rank = 5

print(st1)

print(hex(id(st1)), hex(id(st2)))
print(hex(id(st3)), hex(id(st4)))


@mark.parametrize('inp, exp', [
    ('phx', phoenix),
    ('drn', dragon),
    ('mah', mahjong),
    ('dog', dog),
    ('k14', CardFactory.getCard(Color.black, rank=14))
])
def test_tcard(inp, exp):
    assert exp == tcard(inp)

