

 /* LOOP shorthand...

1 ~ pian = [] 
2 ~ -l 10 pian.push(hear("pno"))
3 ~ -l 10 pian[i].play(r(2)) @ 500

1 ~ pian = [] 
2 ~ -l 10 pian.push(hear("pno"))
3 ~ pian.each("play(600)") @ 500

1 ~ [] 
2 ~ -l 10 1 push(hear("pno"))
3 ~ 1 each("play(600)") @ 500

1 ~ []
2 ~ 1 push(hear("piano")) @ 0 10
3 ~ 1 play(r(1,2)) @ 0 10 @ 500


would you ever do -l lineNum code....?

1 ~ explore("montana")
2 ~ 1 info() -l ...






so.....


1 ~ piano = []
2 ~ -l 10 piano[i] = hear("pno")
3 ~ 1 each("play(600)") @ 500




-1 wraps a loop around the code
for (var i=0;i<10;i++) {
	piano[i] = hear("pno"))
}

-1 wraps a loop around the code
every 500ms:
for (var i=0;i<10;i++) {
	piano[i].play(r(1,2))
}

loops cannot be used accurately with: gesture, markov, bounce
*/

