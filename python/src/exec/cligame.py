import click


@click.group()
def cli():
    pass

@cli.command()
def start():
    from pychu.tgame.tround import TRound
    from pychu.tplayer.cliplayer import CliPlayer
    from pychu.tplayer.stupidai import StupidAI
    human = CliPlayer()

    players = [human, StupidAI(), StupidAI(), StupidAI()]

    tround = TRound.from_players(players)

    tround.start()

if __name__ == '__main__':
    cli()

