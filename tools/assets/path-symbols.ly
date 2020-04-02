
\paper {
    paper-width = 2000\cm
    paper-height = 100\cm
    %#(layout-set-staff-size 20)
}


\new PianoStaff <<
	\context Staff = "1" <<
	\relative c'{
		\clef "treble"  \time 4/4
		( c8 ^1 ^2 ^3 ^4 ^5 ^6 ^7 ^8 ^9 ^0 bis' bes bisis beses b4. b8.. )
	}
	>>
	\context Staff = "2"<<
	\relative c,{
		\clef "bass" _\p
		(c1 |  \time 3/4 d2 e4 | \time 2/2 f8 g16 a32 b64) r1 r2 r4 r8 r16 r32 r64 r128
	}
	>>
	\context Staff = "3"<<
	\relative c{
		\clef "tenor" _\f 
		(c64 d) e f g a b b b b b b b b b b b b b b b b b b b b b b b b b b b b b b b b b b b b b b b b b b b b b b b b b b b b b b b b b b b b b b b b \grace e16 b \compoundMeter #'((10 2 5 6 7 9 8) (3 4))
	}
	>>
>>
