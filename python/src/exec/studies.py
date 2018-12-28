import click

@click.group()
def cli():
    pass

@cli.command()
def run():

    from pychu.tlogic.tcard_names import generate_deck
    from pychu.tstudies import fullhouse
    from pychu.tstudies import straights, bombs

    deck=generate_deck();
    print (straights.street_my_hand(deck))
    print (straights.street_any_hand(deck))
    print (straights.street_any_hand(deck, ph=True))
    print (fullhouse.full_house_myhand(deck))
    print (fullhouse.full_house_myhand(deck, ph=True))
    bombs.bomb(deck)

@cli.command()
def list():
    click.echo(message='To be implemented')


if __name__ == '__main__':
    cli()
