from collections import __getattr__
from dataclasses import dataclass
from enum import Enum, auto
from idlelib.delegator import Delegator


class TStateList(Enum):
    PreSchupfing = auto()
    Schupfing = auto()
    PostSchupfing = auto()
    Playing = auto()


@dataclass()
class TState():
    tstate: TStateList
    round: int


# maybe say player 0 is server?
class TEventType(Enum):
    Ack = auto(), 'Acknowledge'
    SmallTichu = auto(), 'announces a tiny tichu'
    BigTichu = auto(), 'announces a fat tichu'
    Dist1 = auto(), '8 Cards. Big Tichu?'
    Dist2 = auto(), '6 Rest Cards. Small Tichu?'
    Schupf = auto(), 'Schupf'
    ToPlay = auto, 'toplay'
    Plays = auto(), 'plays'
    Pass = auto(), 'passes'
    # is take necessary?
    # it's more a commenting function
    Take = auto(), 'takes'
    Wish = auto(), 'wishes'

    # ok, one thing that is nicer in java
    # but at least we can tweak it
    def __new__(cls, keycode, third_person):
        enum = object.__new__(cls)
        enum._value_ = keycode
        enum.third_person = third_person
        return enum


class TEvent():
    """
    Extern Event without player number
    """

    def __init__(self, type: TEventType, data=None, message=''):
        #todo: rename to 'type'
        self.event = type
        # player: int
        self.data = data
        self.message = message

    def __repr__(self):
        if self.data:
            return "P{} {} {}".format(self.player, self.event.third_person, self.data)
        else:
            return "P{} {}".format(self.player, self.event.third_person)


class _TEvent():
    """
    Internal Event also having player number
    """
    def __init__(self, event: TEvent, player: int):
        self.player = player
        self.event = event

    # python way of delegation, just a real life test
    def __getattr__(self, attr):
        getattr(self.event, attr)
