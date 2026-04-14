# Basic Jumping
Thanks [GrafxKid](https://opengameart.org/content/green-robot) for costume!

Start off in the middle left/right, and quite near the bottom,
to stand on the earth.

We need to remember whether we're currently in the middle of a jump
or not.  We start NOT in the middle of a jump.

Continuously check for left/right keys being pressed, and adjust our
X coordinate if needed.  This simple version does not check for
where the player is on the screen, so you can move the ship right
outside the screen.  It does choose a different costume for moving
left vs moving right, though, to look better.

If we're already in the middle of jumping, quit this script
immediately, so the player can't stack jumps.

Remember that we ARE now jumping.

# Smooth Jumping
To get a smooth jump, start by moving up quite quickly, then reduce 
how much we move up every frame.  At some point, the y_velocity
variable will become NEGATIVE, meaning we will move DOWN.  We stop
this whole process just after we've done the movement with a velociy
equal to the negative of the starting velocity, when we will be
vertically back where we started.

Record the fact that we have finished jumping, and so it's OK to
jump again next time the player presses space.