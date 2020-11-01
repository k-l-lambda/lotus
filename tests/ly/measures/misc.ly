
\include "lotus.ly"

{
	r1 r

	\lotusRepeatABA {
		{
			\mark \markup { \musicglyph #"scripts.segno" }
			\repeat volta 2 {
				r r r r
			}
			\alternative {
				{r}
				{r}
			}

			r r r r
			\mark \markup {\musicglyph #"scripts.coda"}
		}
		\bar "|."

		r r r r r r
		_\markup {D. S. al Coda}
	}
}

measureLayoutI = "1, 2, <[2*[3..6]{7, 8}, 9..12], 13..18>"
measureLayoutS = "s: 2 <[2*[4]{1 1} 4] 6>"

% 1 2 | 3 4 5 6 | 7 | 3 4 5 6 | 8 | 9 10 11 12 | 13 14 15 16 17 18 | 3 4 5 6 | 8 | 9 10 11 12
