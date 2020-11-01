
{
	s1 s

	\lotusRepeatABA {
		{
			\repeat volta 2 {
				s s s s
			}
			\alternative {
				{s}
				{c}
			}

			s s s s
		}
		\bar "|."

		s s s s s s
	}
}

measureLayoutI = "i: 1, 2, <[2*[3, 4, 5, 6]{7, 8}, 9, 10, 11, 12], 13, 14, 15, 16, 17, 18>"
measureLayoutS = "s: 2 <[2*[4]{1 1} 4] 6>"

% 1 2 | 3 4 5 6 | 7 | 3 4 5 6 | 8 | 9 10 11 12 | 13 14 15 16 17 18 | 3 4 5 6 | 8 | 9 10 11 12
