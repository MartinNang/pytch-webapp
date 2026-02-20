# Basic Firing
## Player
The script for the player isn't very important for this example.
Just glide left and right across the bottom of the screen.

## Bullet 
### When green start button is pressed
The bullet can be in one of two states.  Either we're waiting to be fired, or we're in the middle of being fired up the screen.  Keep
track of which state we're in, by remembering whether we're in the middle of being fired.  At the start, we're NOT in the middle of
being fired.

While we're waiting to be fired, we don't want to be visible.

### When "space" key is pressed
Once we've started being fired up the screen, we want pressing space
to have no effect.  So quit this script before doing any real work
if we are already in the middle of being fired.

Once we get here, we ARE in the middle of being fired.  Remember
that fact.

Find the player sprite and move ourselves to its location, except a bit higher ("+20" for the Y coordinate) so the bullet appears at the top of the ship.

Become visible.

Move quite quickly up the screen, until we're well off the top.

We are no longer in the middle of being fired, so remember that.

# Advanced Firing
## Player
The script for the player isn't very important for this example.
Just glide left and right across the bottom of the screen.

## Bullet
### When green start button is pressed
This variable doesn't change, but it's helpful to have a named value
for the maximum number of Bullet clones we want to be allowed to
exist at one time.

### When "space" key is pressed
Make sure that only the original (hidden) Bullet responds to the
keypress.  Without this, every clone makes a new clone and we soon
have thousands of clones.

If there are already the maximum number of Bullet clones being fired, stop here.

Make the new Bullet clone; the "when I start as a clone" script below does the rest of the work.

### When bullet starts as a clone
Find the player sprite and move ourselves to its location, except a bit higher ("+20" for the Y coordinate) so the bullet appears at the top of the ship.

Become visible.

Move quite quickly up the screen, until we're well off the top.

This clone has finished its job, so delete it to avoid cluttering up
the game with lots of clones.