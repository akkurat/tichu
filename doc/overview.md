# Tichu


![Eplaining a Game of Tichu](./tichu.png)


# Theory
## Course of the Game
As illustrated in the flow chart the game already starts during 
distribution of the cards.

* Before the 9th card is distributed every player can announce a *Big Tichu*.
* Before Schupfen every player can announce a *Small Tichu*
* After Schupfen every player can announce a *Small Tichu*

Now the course of the game starts. The player with the **mahjong** can start; 
he doesn't need to include the **mahjong (aka 1)** in his first move.




### Bombing
Bombing is possible at any time.
This yields a bit of a problem since this implies an *asynchronous
bidirectional* communication between players and the the game logic.
Without bombs the server can just ask one after another what they 
would like to play.

# Implementation
## Protocol
Even for this tiny python script a protocol is needed for naming the
cards and events during a game.
Starting with the cards and their colors
### Cards Representation
The colors of tichu are red, blue, green and black.
in the tradition of RGB this stick and adding the Karbon from CMYK
we end up with RGBK.
```python
red = 'star' = s
blue = 'pagode' = p (house)
green = 'jade' = j
black = 'sworD' = d (degen in german)
```
For the sake of simplicity the ranks are just numbers between 
2 and 14. However, we can lateron replace the int by an enum 
that can print out King for 13 or Ace for 14.
However, this is imho a concern for the GUI.

The 4 special cards:
```python
class Special(Enum):
    mahjong = 1, 'maj'
    dog = 0, 'dog'
    dragon = 15, 'drn'
    phoenix = 14.5, 'phx'
``` 
The decision to ship the phoenix with 14.5 rank is not
a proud one, but it enables the cards to be sorted by rank.
-> TODO: phoenix rank should be a special object that implements
__eq__ and __gt__ ad __lt__ enabling it to sort
yet not having any specific value.

## Course of the Game
### TRound
This class should keep the necessary info for the turn but not the 
details of one round. It checks if the game is still on (#players > 1).
### TTurn
* Ends the round after 3 players have passed (cards_owner == player)
### TProxyPlayer
* Comunicates with the Player implementation:
    * Via network
    * Directly via console
    * directly to the AI
* Checks if the cards played are valid
Since the Proxy is running locally we can trust it.
### TBombloop
-> Maybe implement procedural and not as an object
* Somehow magically gets involved if a player feels the urge to play
it's bomb.

## Pattern Recognition
Available Patterns
### 

## Problems occurred during development

### Phoenix as single Card
When the phoenix is not used togher with other cards (e.g. in a Full
House 2,2 phx kk), the rank of the phoenix depends on the preceding
card on the table. The phoenix is always a half rank higher than the
card on the table. Only exception: Starting Value of the phoenix 
is 1.5 meaning the mahjong can't be played on to the phoenix.

This implies in order tho validate a move after a phoenix
the move before the phoenix needs to be known as well. However,
this would seem rather asymmetric and unelegant and therefore including
the cards of the complete turn makes more sense.










