# Version 1
Keep the speed in a variable.  Even though we don't change the value, giving it a name makes the code easier to read and easier to
change.

Continuously check for movement keys being pressed, and adjust our X
or Y coordinate if needed.  This simple version does not check for
where the player is on the screen, so you can move the ship right
outside the screen.

# Version 2
## `x_limit`, `y_limit`
Likewise, keep the X and Y coordinate limits (the furthest we want the player to be able to go left and right, and up 
and down) in variables.

# Version 3
## `x_velocity`, `y_velocity`
These variables DO change as the player plays the game.  They track
the current speed of the player in each dimension.

## `accel`
This variable doesn't change value, but (as above) it's useful to
give it a name.  This is the acceleration, which says how quickly 
the player's speed changes.

### Drift
Continuously check for movement keys being pressed, and adjust our X
or Y velocity if needed, up to the "speed" limit.  <mark>If neither
left/right key is pressed, drift the horizontal velocity
(x_velocity) towards zero.  And if neither up/down key is pressed,
drift the vertical velocity (y_velocity) towards zero.  Then update
the position according to the velocity, making sure we don't go
outside the screen limits.</mark>

It might also be nice to eventually have a pytch filetype if the project structure become more complex and we ever ended 
up needing different filetypes for different purposes (like maybe for raspberry pi projects or )
