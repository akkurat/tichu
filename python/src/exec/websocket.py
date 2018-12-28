#!/usr/bin/python3
from __future__ import annotations

import warnings

import click

import asyncio

import websockets

from pychu.tgame.tround import TTournament, from_players

port_option = click.option('-p', '--port', type=int, default=6789, show_default=True)

# TODO: Start a server with proxies beforehand (that is already possible)
# and find a mechanism to register afterwards...
@click.group()
def cli():
    pass

@cli.command()
@port_option
@click.option('-b', '--background', default=False, type=bool, show_default=True)
def start(port, background):
    from pychu.tgame.tichu_websocket import SocketHandler, RemotePlayer
    from pychu.tplayer.stupidai import StupidAI
    print('Welcome to Pichu'
          'Listen and repeat...')


    human = RemotePlayer()
    players = [human, StupidAI(), StupidAI(), StupidAI()]

    socket_handler = SocketHandler([human]);

    proxies = from_players(players)

    tour = TTournament()

    event_loop = asyncio.get_event_loop()

    event_loop.set_debug(True)
    warnings.simplefilter('always', ResourceWarning)

    event_loop.run_until_complete(websockets.serve(socket_handler.handle, 'localhost', port))
    event_loop.create_task( tour.start(proxies) )
    #todo: pack both servers into an event loop
    event_loop.run_forever()

@cli.command()
@port_option
def stop(port):
    pass


if __name__ == '__main__':
    cli()
