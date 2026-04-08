import json

import click


@click.group()
def cli():
    """flts — flight search agent powered by Claude"""
    pass


@cli.command()
@click.argument("prompt", required=False)
def chat(prompt):
    """Start interactive flight search conversation"""
    from flts.agent.main import main
    main(prompt)


@cli.command()
def monitor():
    """Start price monitoring daemon"""
    from flts.monitor.daemon import run_monitor
    run_monitor()


@cli.command()
@click.option("--port", default=8000, help="Port to listen on")
@click.option("--host", default="127.0.0.1", help="Host to bind to")
def serve(port, host):
    """Start web server (web UI + Telegram webhook)"""
    import uvicorn
    from flts.web.server import app
    uvicorn.run(app, host=host, port=port)


@cli.command()
def watches():
    """List active price watches"""
    from flts.db.models import get_connection, list_watches

    conn = get_connection()
    active = list_watches(conn)
    conn.close()

    if not active:
        click.echo("No active watches.")
        return

    for w in active:
        status = ""
        if w["last_price"]:
            status = f" (last: {w['last_price']} {w['currency']})"
        click.echo(
            f"#{w['id']} {w['origin']}→{w['destination']} "
            f"{w['from_date']}..{w['to_date']} "
            f"≤{w['max_price']} {w['currency']}{status}"
        )


@cli.command()
@click.argument("origin")
@click.argument("destination")
@click.option("--days", default=30, help="Days of history to show")
def history(origin, destination, days):
    """Show price history for a route"""
    from flts.db.models import get_connection, get_price_history

    conn = get_connection()
    records = get_price_history(conn, origin.upper(), destination.upper(), days_back=days)
    conn.close()

    if not records:
        click.echo(f"No price history for {origin.upper()}→{destination.upper()}.")
        return

    prices = [r["price"] for r in records]
    click.echo(f"{origin.upper()}→{destination.upper()} ({len(records)} records, last {days} days)")
    click.echo(f"  Min: {min(prices):.0f}  Max: {max(prices):.0f}  Avg: {sum(prices)/len(prices):.0f}")
    click.echo()
    for r in records[:10]:
        click.echo(f"  {r['checked_at'][:16]}  {r['travel_date']}  {r['price']:.0f} {r['currency']}")
