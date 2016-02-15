# composition material


## audio

----

piano = []

-l 10 piano.push(hear("pno"))

-l 10 piano[i].move(0,random(10)*20) @ 100

----

1 ~ hear("pno")

2 ~ bp.freq(50,700,.1) @ 200

----

echo.time(1,0.05,10)

-

47 ~ hear("symmetry")

62 ~ echo.fb(0.9)

70 ~ 47 skip(0,8)

73 ~ echo.time(0.1,0.2,10) @ 11000

bp.freq(50,1000,15) @ 200

-

30 ~ pitch.to(-12)

40 ~ siri.say("oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo") @ 2000

42 ~ bp.q(20)

51 ~ bp.freq(1820,5)

have some other audio file below it
show siri screen?

-----

1 ~ hear("pno")

3 ~ pitch.to(pick(0,2,4,5,7,9)) @ 200

4 ~ echo.time(.2)

5 ~ echo.wet(0,1,10)

6 ~ echo.fb(0.8,1)

-

30 ~ vol.to(-100,random(0,-30),-100,0.1) @ 150

-----

3 ~ hear("pno")

8 ~ 3 skip(3,4)

14 ~ hall.size(0.95)

15 ~ bp.freq(50,700,10)

16 ~ bp.wet(1,1)

17 ~ bp.q(10,1)

18 ~ hear("symmetry")

24 ~ 18 move(0,25)

19 ~ 18 skip(0,9)

20 ~ echo.time(.5)

21 ~ echo.fb(0.8)




## maps

----

explore("montana")

xray()

scramble() @ 70

----


## images

----

1 ~ see("mcluhan")

2 ~ 1 glitch()

3 ~ scramble() @ 100

----


## hack

----

1 ~ hack("en.wikipedia.org")

2 ~ 1 load("en.wikipedia.org/wiki/life") @ 5000

3 ~ 1 load("en.wikipedia.org/wiki/art") @ 5000

----

Others..

text
sms
voice






