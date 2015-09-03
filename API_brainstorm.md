

1] hide 300 | show 4000

creates a repeating bar that hooks into a central interval. 
(all intervals of 20?)
all numbers are editable (nexusUI numbers with step at 20)
later, to end:

kill 1

2] hear pno

3] 2 move wander _A wander _B 20

4] 2 move any 100-200 1800

5] a grid | a line 2000

6] watch waves

7] 6 load kremlin

8] 6 seek any 0-length 500

9] clarity | break



===========

need to go back to what will really happen:
code these things via static method, see what kind of code is needed...

1
one window in center
five quicktimes opened, skipping small amount
skipping wanders in diff directions on all 5

2
a line of windows
google maps open
some very fast automated writing is sent into the info box
	maybe the scanning of scrambling of a poem

3
a grid of a desktop gif shows across a grid of windows
some text over top -- this is life

4
two windows, side by side
one flickers, one doesn't
inside, an image of an empty browser

5
browser making the famous colorful blank video screen

6
browsing back and forth between wiki art and wiki life
lowlands playing over top

7 
presence

8
dancer video that moves its container window

9
video of piano keyboard scattered around all windows, quiet, through much reverb
	need to make own video of this
	can use guitar for now


notes:
make stage bigger. at least 900 x 550



=======

from dreams....
with (wall)   or     with (red)

-b = beat
-r = remove
-l = loop?
-g = gesture? and what about speed?
loop 


show() | hide() -b 4
piano = hear("piano")
piano.move(r(0,m.stage.w),r(0,m.stage.h)) -b 1


piano[i].move(r0-100,r0-100) -l 10 -b 4
piano[i].skip(_1x,1) -l 10 -b .1

// skip should take (position, duration)

leads to code:

show() | hide() -b 4
piano = hear("piano")
piano.move(r(0,m.stage.w),r(0,m.stage.h)) -b 1

piano[i].move(r0-100,r0-100) -l 10 -b 4
piano[i].skip(_1x,1) -l 10 -b .1




