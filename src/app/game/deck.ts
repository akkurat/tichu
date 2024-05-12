export function generate_deck(): Record<string, number> {
    const cards: Record<string, number> = { "dog": -1, "mah": 1, phx: 15, drg: 16 }

    let height = 2;
    for (const value of ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"]) {

        for (const color of ["s", "d", "j", "p"]) {
            cards[(color + value)] = height
            height += .25
        }
    }
    return cards
}