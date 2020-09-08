\version "2.20.0" 

\header {
	copyright = "楊婕立 改編" 
	encodingdate = "2017-05-05" 
	title = "海阔天空" 
	encodingsoftware = "Sibelius 8.5" 
	composer = \markup \column { \line { "                       黄家驹   曲" } \line { "                       黄家驹   词" } \line { "  杨圣仪(大禾音乐) 改编" } } 
	poet = "洪誠孝 詞" 
}


#(set-global-staff-size 20) 

\paper {
	paper-width = 21\cm 
	paper-height = 29.7\cm 
	top-margin = 1.8\cm 
	bottom-margin = 1.86\cm 
	left-margin = 1.27\cm 
	right-margin = 1.27\cm 
	between-system-space = 2.63\cm 
	page-top-space = 0.9\cm 
	indent = 1.61538461538\cm 
	short-indent = 1.29230769231\cm 
}


\layout {
	\context {
		\Score 
		autoBeaming = ##f 
	}
	
}


PartPOneVoiceOne = \relative bes'' {
	\clef "treble" \key f \major \numericTimeSignature \time 4/4 |
	\tempo 4 = 77 |
	r4 \stemDown bes4 \stemDown a2 |
	\stemDown g8 [ \stemDown f8 \stemDown e8 \stemDown d8 ~ ] \stemUp d8 [ \stemUp bes,8 \stemUp c8 \stemUp f8 ~ ] |
	\stemUp f2 r8 \stemUp bes,8 \stemUp c8 [ \stemUp f8 ~ ] |
	\stemUp f2 r8 \stemUp bes,8 \stemUp c8 [ \stemUp g'8 ] |
	\stemUp f4. \stemUp bes,8 ~ \stemUp bes4 \stemUp f'4 |
	\stemUp e2. \stemUp a8 [ \stemUp g8 ] |
	\stemUp f2. r8 \stemUp g16 [ \stemUp a16 ] |
	\stemDown c8 [ \stemDown c16 \stemDown c16 ~ ] \stemDown c8 [ \stemDown d8 ] \stemDown c4 r8 \stemDown d16 [ \stemDown e16 ] |
	\stemDown f8 [ \stemDown f16 \stemDown f16 ~ ] \stemDown f8 [ \stemDown f8 ] \stemDown f8 [ \stemDown e8 ] \stemDown d16 [ \stemDown c8 \stemDown d16 ~ ] |
	\barNumberCheck #10 \stemDown d2. \stemDown d8 [ \stemDown c8 ] |
	\stemDown c4. \stemDown c8 \stemUp a16 [ \stemUp g16 ] \stemUp f4 \stemUp a16 [ \stemUp bes16 ] |
	\stemUp a8 [ \stemUp g8 ] \stemUp g8 [ \stemUp a16 \stemUp g16 ~ ] \stemUp g4 \stemUp a8 [ \stemUp g16 \stemUp g16 ~ ] |
	\stemUp g8 [ \stemUp f8 ] \stemUp f8 [ \stemUp f16 \stemUp f16 ~ ] \stemUp f4 \stemUp g8 [ \stemUp f8 ] |
	\stemDown f8 [ \stemDown c'8 \stemDown d8 \stemDown e8 ] \stemDown f4 \stemUp a,8 [ \stemUp g8 ] |
	\stemUp f2. r8 \stemUp g16 [ \stemUp a16 ] |
	\stemDown c8 [ \stemDown c16 \stemDown c16 ~ ] \stemDown c8 [ \stemDown d8 ] \stemDown c4 r8 \stemDown d16 [ \stemDown e16 ] |
	\stemDown f8 [ \stemDown f16 \stemDown f16 ~ ] \stemDown f8 [ \stemDown f8 ] \stemDown f8 [ \stemDown e8 ] \stemDown d16 [ \stemDown c8 \stemDown d16 ~ ] |
	\stemDown d2. \stemDown d8 [ \stemDown c8 ] |
	\stemDown c4. \stemDown c8 \stemUp a16 [ \stemUp g16 ] \stemUp f4 \stemUp a16 [ \stemUp bes16 ] |
	\barNumberCheck #20 \stemUp a8 [ \stemUp g8 ] \stemUp g8 [ \stemUp a16 \stemUp g16 ~ ] \stemUp g4 \stemUp a8 [ \stemUp g16 \stemUp g16 ] |
	\stemUp g8 [ \stemUp f8 ] \stemUp f8 [ \stemUp f16 \stemUp f16 ~ ] \stemUp f4 \stemUp g8 [ \stemUp f8 ] |
	\stemDown f8 [ \stemDown c'8 \stemDown d8 \stemDown e8 ] \stemDown f4 \stemDown d8 [ \stemDown e8 ] |
	\stemDown f8 [ \stemDown f16 \stemDown f16 ~ ] \stemDown f16 [ \stemDown f8. ] \stemDown e8 [ \stemDown d8 ] \stemDown c16 [ \stemDown c8. ] |
	\stemDown c4 \stemUp a16 [ \stemUp g8. ] \stemUp f2 |
	r8 \stemDown f'16 [ \stemDown f16 ] \stemDown f8 [ \stemDown f16 \stemDown g16 ~ ] \stemDown g8 [ \stemDown g8 ] \stemDown f16 [ \stemDown g8 \stemDown a16 ~ ] |
	\stemDown a2 \stemDown a4 \stemDown g16 [ \stemDown f8. ] |
	r8 \stemDown f16 [ \stemDown f16 ] \stemDown f8 [ \stemDown f8 ] \stemDown g4. \stemDown c,16 [ \stemDown c16 ] |
	\stemDown a'4 \stemDown g4 \stemDown f2 |
	r8 \stemDown f8 \stemDown f8 [ \stemDown f16 \stemDown g16 ~ ] \stemDown g8 [ \stemDown g16 \stemDown g16 ] \stemDown f16 [ \stemDown e8 \stemDown f16 ~ ] |
	\barNumberCheck #30 f1 |
	\stemUp d,4. \stemUp f8 ~ \stemUp f4 \stemUp d4 |
	\stemUp d4 \stemUp f4 ~ \stemUp f8 [ \stemUp c'8 \stemUp bes8 \stemUp f8 ] |
	\stemUp c2. \stemUp a'8 [ \stemUp g8 ] |
	\stemUp f2. r8 \stemUp g16 [ \stemUp a16 ] |
	\stemDown c8 [ \stemDown c16 \stemDown c16 ~ ] \stemDown c8 [ \stemDown d8 ] \stemDown c4. \stemDown d16 [ \stemDown e16 ] |
	\stemDown f8 [ \stemDown f16 \stemDown f16 ~ ] \stemDown f8 [ \stemDown f8 ] \stemDown f8 [ \stemDown e8 ] \stemDown d16 [ \stemDown c8 \stemDown d16 ~ ] |
	\stemDown d2. \stemDown d8 [ \stemDown c8 ] |
	\stemDown c4. \stemDown c8 \stemUp a16 [ \stemUp g16 ] \stemUp f4 \stemUp a16 [ \stemUp bes16 ] |
	\stemUp a8 [ \stemUp g8 ] \stemUp g8 [ \stemUp a16 \stemUp g16 ~ ] \stemUp g4 \stemUp a8 [ \stemUp g16 \stemUp g16 ~ ] |
	\barNumberCheck #40 \stemUp g8 [ \stemUp f8 ] \stemUp f8 [ \stemUp f16 \stemUp f16 ~ ] \stemUp f4 \stemUp g8 [ \stemUp f8 ] |
	\stemDown f8 [ \stemDown c'8 \stemDown d8 \stemDown e8 ] \stemDown f4. \stemDown d16 [ \stemDown e16 ] |
	\stemDown f8 [ \stemDown f16 \stemDown f16 ~ ] \stemDown f8 [ \stemDown f8 ] \stemDown e8 [ \stemDown d8 ] \stemDown c16 [ \stemDown c8. ] |
	\stemDown c4 \stemUp a16 [ \stemUp g8. ] \stemUp f2 |
	r8 \stemDown f'16 [ \stemDown f16 ] \stemDown f8 [ \stemDown f16 \stemDown g16 ~ ] \stemDown g8 [ \stemDown g8 ] \stemDown f16 [ \stemDown g8 \stemDown a16 ~ ] |
	\stemDown a2 \stemDown a4 \stemDown g16 [ \stemDown f8. ] |
	r8 \stemDown f16 [ \stemDown f16 ] \stemDown f8 [ \stemDown f16 \stemDown g16 ~ ] \stemDown g4. \stemDown c,16 [ \stemDown c16 ] |
	\stemDown a'4 \stemDown g4 \stemDown f2 |
	r8 \stemDown f16 [ \stemDown f16 ] \stemDown f8 [ \stemDown f16 \stemDown g16 ~ ] \stemDown g8 [ \stemDown g16 \stemDown g16 ] \stemDown f16 [ \stemDown e8 \stemDown f16 ] |
	\stemDown f4. \stemDown f8 ~ \stemDown f2 |
	\barNumberCheck #50 \stemDown f4. \stemDown f8 ~ \stemDown f2 |
	\stemUp a,4. \stemUp g16 [ \stemUp a16 ] \stemDown c8. [ \stemDown d16 ~ ] \stemDown d8 [ \stemDown a8 ~ ] |
	a1 |
	\stemUp a4. \stemUp g16 [ \stemUp a16 ] \stemDown c8. [ \stemDown d16 ~ ] \stemDown d8 [ \stemDown a'8 ~ ] |
	a1 |
	\stemUp a,4. \stemUp g16 [ \stemUp a16 ] \stemDown c8. [ \stemDown d16 ~ ] \stemDown d8 [ \stemDown a8 ] |
	\stemDown a8 [ \stemDown d8 ] \stemDown e4 \stemDown f4 r16 \stemDown c16 [ \stemDown d16 \stemDown a'16 ] |
	\stemDown a8. [ \stemDown g16 ~ ] \stemDown g8 [ \stemDown d8 ~ ] \stemDown d4 \stemDown c8 [ \stemDown d8 ] |
	\stemDown a'8. [ \stemDown g16 ~ ] \stemDown g8 [ \stemDown d8 ~ ] \stemDown d4 \stemDown c4 |
	\stemDown a'2 \stemDown g16 [ \stemDown fis16 \stemDown d16 \stemDown a16 ~ ] \stemUp a16 [ \stemUp g8. ] |
	\barNumberCheck #60 \stemUp g16 [ \stemUp fis16 \stemUp d16 \stemUp a16 ~ ] \stemUp a16 [ \stemUp g16 \stemUp fis16 \stemUp g16 ] \stemUp d'4 \stemUp d16 [ \stemUp d8. ] |
	r4 \stemDown d'8 [ \stemDown d8 ] \stemDown e8 [ \stemDown d8 \stemDown e8 \stemDown f8 ~ ] |
	\stemDown f4. \stemDown f16 [ \stemDown f16 ] \stemDown g8 [ \stemDown f8 \stemDown g8 \stemDown a8 ~ ] |
	\stemDown a4. \stemDown a8 \stemDown g4. \stemDown a8 |
	\stemDown f2 \stemDown c'8 [ \stemDown bes8 ] \stemDown a8 [ \stemDown d,16 \stemDown e16 ] |
	\stemDown f8 [ \stemDown f16 \stemDown f16 ~ ] \stemDown f8 [ \stemDown f8 ] \stemDown e8 [ \stemDown d8 ] \stemDown c16 [ \stemDown c8. ] |
	\stemDown c4 \stemUp a16 [ \stemUp g8. ] \stemUp f2 |
	r8 \stemDown f'16 [ \stemDown f16 ] \stemDown f8 [ \stemDown f16 \stemDown g16 ~ ] \stemDown g8 [ \stemDown g8 ] \stemDown f16 [ \stemDown g8 \stemDown a16 ~ ] |
	\stemDown a2 \stemDown a4 \stemDown g16 [ \stemDown f8. ] |
	r8 \stemDown f16 [ \stemDown f16 ] \stemDown f8 [ \stemDown f16 \stemDown g16 ~ ] \stemDown g4. \stemDown c,16 [ \stemDown c16 ] |
	\barNumberCheck #70 \stemDown a'4 \stemDown g4 \stemDown f2 |
	r8 \stemDown f16 [ \stemDown f16 ] \stemDown f8 [ \stemDown f16 \stemDown g16 ~ ] \stemDown g8 [ \stemDown g16 \stemDown g16 ] \stemDown f16 [ \stemDown e8 \stemDown f16 ~ ] |
	f1 |
	r8 \stemDown f16 [ \stemDown f16 ] \stemDown f8 [ \stemDown f16 \stemDown g16 ~ ] \stemDown g4. \stemDown c,16 [ \stemDown c16 ] |
	\stemDown a'4 \stemDown g4 \stemDown f2 |
	r8 \stemDown f16 [ \stemDown f16 ] \stemDown f8 [ \stemDown f16 \stemDown g16 ~ ] \stemDown g8 [ \stemDown g16 \stemDown g16 ] \stemDown f16 [ \stemDown e8 \stemDown f16 ~ ] |
	\stemDown f2 r8 \stemDown a8 \stemDown g16 [ \stemDown f16 \stemDown d16 \stemDown e16 ] |
	\stemDown f8 [ \stemDown f16 \stemDown f16 ~ ] \stemDown f8 [ \stemDown f8 ] \stemDown e8 [ \stemDown d8 ] \stemDown c16 [ \stemDown c8. ] |
	\stemDown c4 \stemUp a16 [ \stemUp g8. ] \stemDown f8 [ \stemDown a'8 ] \stemDown g16 [ \stemDown f8. ] |
	r8 \stemDown f16 [ \stemDown f16 ] \stemDown f8 [ \stemDown f16 \stemDown g16 ~ ] \stemDown g8 [ \stemDown g8 ] \stemDown f16 [ \stemDown g8 \stemDown a16 ~ ] |
	\barNumberCheck #80 \stemDown a2 r8 \stemDown a8 \stemDown g16 [ \stemDown f8. ] |
	r8 \stemDown f16 [ \stemDown f16 ] \stemDown f8 [ \stemDown f16 \stemDown g16 ~ ] \stemDown g4. \stemDown c,16 [ \stemDown c16 ] |
	\stemDown a'4 \stemDown g4 \stemDown f8 [ \stemDown c'8 ] \stemDown a16 [ \stemDown f8. ] |
	r8 \stemDown f16 [ \stemDown f16 ] \stemDown f8 [ \stemDown f16 \stemDown g16 ~ ] \stemDown g8 [ \stemDown g16 \stemDown g16 ] \stemDown f16 [ \stemDown e8 \stemDown f16 ~ ] |
	\stemDown f4. \stemUp g,16 [ \stemUp a16 ] \stemDown c8. [ \stemDown d16 ~ ] \stemDown d8 [ \stemDown a8 ~ ] |
	\stemUp a2. ~ \stemUp a8 [ \stemUp c,8 ] |
	\stemUp a'4. \stemUp g16 [ \stemUp a16 ] \stemDown c8. [ \stemDown d16 ~ ] \stemDown d8 [ \stemDown a'8 ~ ] |
	\stemDown a2. \stemDown c,16 [ \stemDown d16 \stemDown f16 \stemDown g16 ] |
	\stemDown a4. \stemDown g16 [ \stemDown f16 ] \stemDown g16 [ \stemDown a16 \stemDown g16 \stemDown a16 ] \stemDown g8. [ \stemDown f16 ] |
	\stemUp e,16 [ \stemUp f16 \stemUp d16 \stemUp f16 ] \stemUp g16 [ \stemUp f16 \stemUp e16 \stemUp f16 ] \stemUp d16 [ \stemUp f16 \stemUp g16 \stemUp f16 ] \stemUp a4 |
	\barNumberCheck #90 \stemUp c,8. [ \stemUp d16 ~ ] \stemUp d8 [ \stemUp f8 ] \stemUp g,8. [ \stemUp c16 ~ ] \stemUp c8 [ \stemUp bes8 ] |
	\stemUp a16 [ \stemUp bes16 \stemUp c16 \stemUp a16 ] \stemUp d16 [ \stemUp c16 \stemUp e16 \stemUp d16 ] \stemUp f16 [ \stemUp e16 \stemUp g16 \stemUp f16 ] \stemUp a16 [ \stemUp g16 \stemUp c16 \stemUp bes16 ] |
	\stemUp a4. \stemUp g16 [ \stemUp a16 ] \stemDown c8. [ \stemDown d16 ~ ] \stemDown d8 [ \stemDown f8 ~ ] |
	\stemDown f4 \stemDown d8 [ \stemDown c8 ] \stemUp bes16 [ \stemUp a16 \stemUp g16 \stemUp f16 ] \stemUp d16 [ \stemUp g16 \stemUp f8 ] |
	\stemUp a4. \stemUp g16 [ \stemUp a16 ] \stemDown c8. [ \stemDown d16 ~ ] \stemDown d8 [ \stemDown a'8 ] |
	\stemDown a4. \stemDown g16 [ \stemDown f16 ] \stemDown e8 [ \stemDown f16 \stemDown d16 ] \stemDown e8 [ \stemDown c16 \stemDown f16 ] |
	\stemDown f8 [ \stemDown f8 ] \stemDown g4 \stemDown c16 [ \stemDown c,16 \stemDown c'16 \stemDown c,16 ] \stemDown c'8 [ \stemDown e,8 ] |
	\stemDown e4 \stemDown f8 [ \stemDown d16 \stemDown c16 ] \stemDown d2 |
	\stemUp a4. \stemUp g16 [ \stemUp f16 ] \stemUp g16 [ \stemUp a16 ] \stemUp g4 \stemUp f16 [ \stemUp e16 ] |
	\stemUp f4 \stemUp f,16 [ \stemUp g16 \stemUp a16 \stemUp bes16 ] \stemUp c16 [ \stemUp d16 \stemUp e16 \stemUp f16 ] \stemUp g16 [ \stemUp a16 \stemUp g16 \stemUp a16 ] |
	\barNumberCheck #100 \stemUp a4. \stemUp g16 [ \stemUp a16 ] \stemDown c8. [ \stemDown d16 ~ ] \stemDown d8 [ \stemDown c8 ] |
	\stemUp a4. \stemUp g16 [ \stemUp f16 ] \stemUp a8 [ \stemUp c16 \stemUp a16 ] \stemUp g8 [ \stemUp f8 ] |
	\stemUp a4. \stemUp g16 [ \stemUp a16 ] \stemDown c8. [ \stemDown d16 ~ ] \stemDown d8 [ \stemDown c8 ~ ] |
	\stemDown c2 r2 \bar "|." 
}


PartPOneVoiceOneChords =  \chordmode {
    | % 1
    f4:5 s4 s2 | % 2
    g8:m5/+bes s8 s8 s8 s8 s8 s8 s8 | % 3
    es2:5 s8 s8 s8 s8 | % 4
    bes2:5 s8 s8 s8 s8 | % 5
    es4.:5 s8 s4 s4 | % 6
    c2.:5 s8 s8 | % 7
    f2.:5 s8 s16 s16 | % 8
    c8:5 s16 s16 s8 s8 s4 s8 s16 s16 | % 9
    d8:m5 s16 s16 s8 s8 s8 s8 s16 s8 s16 | \barNumberCheck #10
    bes2.:5 s8 s8 | % 11
    f4.:5 s8 s16 s16 s4 s16 s16 | % 12
    c8:5 s8 s8 s16 s16 s4 s8 s16 s16 | % 13
    bes8:5 s8 s8 s16 s16 s4 s8 s8 | % 14
    f8:5 s8 s8 s8 s4 s8 s8 | % 15
    f2.:5 s8 s16 s16 | % 16
    c8:5 s16 s16 s8 s8 s4 s8 s16 s16 | % 17
    d8:m5 s16 s16 s8 s8 s8 s8 s16 s8 s16 | % 18
    bes2.:5 s8 s8 | % 19
    f4.:5 s8 s16 s16 s4 s16 s16 | \barNumberCheck #20
    c8:5 s8 s8 s16 s16 s4 s8 s16 s16 | % 21
    bes8:5 s8 s8 s16 s16 s4 s8 s8 | % 22
    f8:5 s8 s8 s8 s4 s8 s8 | % 23
    bes8:5 s16 s16 s16 s8. c8:5 s8 s16 s8. | % 24
    f4:5 s16 s8. s2 | % 25
    bes8:5 s16 s16 s8 s16 s16 c8:5 s8 s16 s8 s16 | % 26
    f2:5 s4 s16 s8. | % 27
    bes8:5 s16 s16 s8 s8 c4.:5 s16 s16 | % 28
    f4:5 c4:5/+e d2:m5 | % 29
    bes8:5 s8 s8 s16 s16 c8:5 s16 s16 s16 s8 s16 | \barNumberCheck #30
    f1:5/+es | % 31
    bes4.:5 s8 s4 s4 | % 32
    bes4:5 s4 s8 s8 s8 s8 | % 33
    c2.:5 s8 s8 | % 34
    f2.:5 s8 s16 s16 | % 35
    c8:5/+e s16 s16 s8 s8 s4. s16 s16 | % 36
    d8:m5 s16 s16 s8 s8 d8:m5/+c s8 s16 s8 s16 | % 37
    bes2.:5 s8 s8 | % 38
    f4.:5 s8 s16 s16 s4 s16 s16 | % 39
    c8:5 s8 s8 s16 s16 s4 s8 s16 s16 | \barNumberCheck #40
    bes8:5 s8 s8 s16 s16 s4 s8 s8 | % 41
    f8:5 s8 s8 s8 s4. s16 s16 | % 42
    bes8:5 s16 s16 s8 s8 c8:5 s8 s16 s8. | % 43
    f4:5 s16 s8. s2 | % 44
    bes8:5 s16 s16 s8 s16 s16 c8:5 s8 s16 s8 s16 | % 45
    f2:5 s4 s16 s8. | % 46
    bes8:5 s16 s16 s8 s16 s16 c4.:5 s16 s16 | % 47
    f4:5 c4:5/+e d2:m5 | % 48
    bes8:5 s16 s16 s8 s16 s16 c8:5 s16 s16 s16 s8 s16 | % 49
    f4.:5 s8 s2 | \barNumberCheck #50
    f4.:5 s8 s2 | % 51
    bes4.:5 s16 s16 c8.:5 s16 s8 s8 | % 52
    d1:m5 | % 53
    bes4.:5 s16 s16 c8.:5 s16 s8 s8 | % 54
    f1:5 | % 55
    bes4.:5 s16 s16 c8.:5 s16 s8 s8 | % 56
    d8:m5 s8 e4:5 f4:5 g16:m5 s16 s16 s16 | % 57
    g8.:m5 s16 s8 s8 s4 s8 s8 | % 58
    a8.:m5 s16 s8 s8 s4 s4 | % 59
    d2:5 s16 s16 s16 s16 s16 s8. | \barNumberCheck #60
    s16 s16 s16 s16 s16 s16 s16 s16 s4 s16 s8. | % 61
    d4:m5 s8 s8 c8:5 s8 s8 s8 | % 62
    bes4.:5 s16 s16 c8:5 s8 s8 s8 | % 63
    d4.:m5 s8 c4.:5 s8 | % 64
    f2:5 s8 s8 s8 s16 s16 | % 65
    bes8:5 s16 s16 s8 s8 c8:5 s8 s16 s8. | % 66
    f4:5 s16 s8. s2 | % 67
    bes8:5 s16 s16 s8 s16 s16 c8:5 s8 s16 s8 s16 | % 68
    f2:5 s4 s16 s8. | % 69
    bes8:5 s16 s16 s8 s16 s16 c4.:5 s16 s16 | \barNumberCheck #70
    f4:5 c4:5/+e d2:m5 | % 71
    bes8:5 s16 s16 s8 s16 s16 c8:5 s16 s16 s16 s8 s16 | % 72
    f1:5 | % 73
    bes8:5 s16 s16 s8 s16 s16 c4.:5 s16 s16 | % 74
    f4:5 c4:5/+e d2:m5 | % 75
    bes8:5 s16 s16 s8 s16 s16 c8:5 s16 s16 s16 s8 s16 | % 76
    f2:5 s8 s8 s16 s16 s16 s16 | % 77
    bes8:5 s16 s16 s8 s8 c8:5 s8 s16 s8. | % 78
    f4:5 s16 s8. s8 s8 s16 s8. | % 79
    bes8:5 s16 s16 s8 s16 s16 c8:5 s8 s16 s8 s16 | \barNumberCheck #80
    f2:5 s8 s8 s16 s8. | % 81
    bes8:5 s16 s16 s8 s16 s16 c4.:5 s16 s16 | % 82
    f4:5 c4:5/+e d8:m5 s8 s16 s8. | % 83
    bes8:5 s16 s16 s8 s16 s16 c8:5 s16 s16 s16 s8 s16 | % 84
    bes4.:5 s16 s16 c8.:5 s16 s8 s8 | % 85
    d2.:m5 s8 s8 | % 86
    bes4.:5 s16 s16 c8.:5 s16 s8 s8 | % 87
    f2.:5 s16 s16 s16 s16 | % 88
    bes4.:7 s16 s16 c16:5 s16 s16 s16 s8. s16 | % 89
    d16:m5 s16 s16 s16 s16 s16 s16 s16 s16 s16 s16 s16 s4 |
    \barNumberCheck #90
    bes8.:7 s16 s8 s8 c8.:5 s16 s8 s8 | % 91
    f16:5 s16 s16 s16 s16 s16 s16 s16 s16 s16 s16 s16 s16 s16 s16 s16 | % 92
    bes4.:5 s16 s16 c8.:5 s16 s8 s8 | % 93
    d4:m5 s8 s8 s16 s16 s16 s16 s16 s16 s8 | % 94
    bes4.:7 s16 s16 c8.:5 s16 s8 s8 | % 95
    f4.:5 s16 s16 s8 s16 s16 s8 s16 s16 | % 96
    bes8:7 s8 s4 c16:5 s16 s16 s16 s8 s8 | % 97
    d4:m5 s8 s16 s16 s2 | % 98
    bes4.:5 s16 s16 c16:5 s16 s4 s16 s16 | % 99
    f4:5 s16 s16 s16 s16 s16 s16 s16 s16 s16 s16 s16 s16 |
    \barNumberCheck #100
    bes4.:5 s16 s16 c8.:5 s16 s8 s8 | % 101
    d4.:m5 s16 s16 s8 s16 s16 s8 s8 | % 102
    bes4.:7 s16 s16 s8. s16 s8 s8 | % 103
    f2:5 s2 \bar "|."
    }


PartPOneVoiceOneLyricsOne = \lyricmode {
	\set ignoreMelismata = ##t \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 "今" "天" "我," "寒" "夜" "里" "看" "雪" \skip 1 "飘" "过," "怀" "著" "冷" "却" "了" \skip 1 "的" "心" "窝" "飘" "远" "方." \skip 1 "风" "雨" "里," "追" "赶" \skip 1 \skip 1 "雾" "里" "分" "不" "清" "影" "踪," \skip 1 "天" "空" "海" \skip 1 "阔" "你" "与" "我," \skip 1 "可" "会" "变" "(谁" "沒" "在" "变)." "多" "少" "次," "迎" "着" "冷" "眼" "与" \skip 1 "嘲" "笑," "从" "沒" "有" "放" "弃" \skip 1 "过" "心" "中" "的" "理" "想." \skip 1 "一" "剎" "那," "恍" "惚" \skip 1 \skip 1 "若" "有" "所" "失" "的" "感" "觉," \skip 1 "不" "知" \skip 1 "不" "觉" "已" "变" "淡," \skip 1 "心" "里" "爱" "(谁" "明" "白" "我)" "原" "谅" "我" "这" "一" \skip 1 "生" "不" "羁" "放" "纵" "爱" "自" \skip 1 "由." "那" "会" "怕" "有" "一" \skip 1 "天" "会" "跌" "倒." \skip 1 \skip 1 \skip 1 \skip 1 "被" "弃" "了" "理" "想" "谁" "人" "都" "可" "以." "那" "怕" "有" "一" \skip 1 "天" "只" "你" "共" "我." \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 "今" "天" "我," "寒" "夜" "里" "看" "雪" \skip 1 "飘" "过," "怀" "著" "冷" "却" "了" \skip 1 "的" "心" "窝" "飘" "远" "方." \skip 1 "风" "雨" "里," "追" "赶" \skip 1 \skip 1 "雾" "里" "分" "不" "清" "影" "踪," \skip 1 "天" "空" "海" \skip 1 "阔" "你" "与" "我," \skip 1 "可" "会" "变." "(谁" "沒" "在" "变)." "原" "谅" "我" "这" "一" \skip 1 "生" "不" "羁" "放" "纵" "爱" "自" \skip 1 "由," "哪" "会" "怕" "有" "一" \skip 1 "天" "会" "跌" "倒," \skip 1 \skip 1 \skip 1 \skip 1 "被" "弃" "了" "理" "想" \skip 1 "谁" "人" "都" "可" "以," "那" "会" "怕" "有" "一" \skip 1 "天" "只" "你" "共" "我." \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 "仍" "然" "自" "由" "自" "我," \skip 1 "永" "远" "高" "唱" "我" "歌" \skip 1 "走" "遍" "千" "里." \skip 1 \skip 1 \skip 1 "原" "谅" "我" "这" "一" \skip 1 "生" "不" "羁" "放" "纵" "爱" "自" \skip 1 "由," "哪" "会" "怕" "有" "一" \skip 1 "天" "会" "跌" "倒," \skip 1 \skip 1 \skip 1 \skip 1 "被" "弃" "了" "理" "想" \skip 1 "谁" "人" "都" "可" "以," "那" "会" "怕" "有" "一" \skip 1 "天" "只" "你" "共" "我." \skip 1 "被" "弃" "了" "理" "想" \skip 1 "谁" "人" "都" "可" "以," "那" "會" "怕" "有" "一" \skip 1 "天" "只" "你" "共" "我." \skip 1 \skip 1 \skip 1 \skip 1 "原" "谅" "我" "这" "一" \skip 1 "生" "不" "羁" "放" "纵" "爱" "自" \skip 1 "由," \skip 1 \skip 1 \skip 1 "哪" "会" "怕" "有" "一" \skip 1 "天" "会" "跌" "倒," \skip 1 \skip 1 \skip 1 \skip 1 "被" "弃" "了" "理" "想" \skip 1 "谁" "人" "都" "可" "以," \skip 1 \skip 1 \skip 1 "哪" "会" "怕" "有" "一" \skip 1 "天" "只" "你" "共" "我." \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 
}


PartPOneVoiceFive = \relative f {
	\clef "bass" \key f \major \numericTimeSignature \time 4/4 f1 \sustainOn bes,1 |
	es1 \sustainOn bes1 es1 \stemDown g2. r4 f1 c1 d1 bes1 f'1 c1 bes1 f1 f1 c'1 d1 bes1 f'1 c1 bes1 f'1 \stemUp bes,2 \stemUp c2 f1 |
	\stemUp bes,2 \sustainOn \stemUp c2 \sustainOn f1 \stemUp bes,2 \stemUp c2 \stemDown f4 \stemDown e4 \stemDown d2 \stemUp bes2 \stemUp c2 es1 bes1 bes1 c1 f1 e1 \stemDown d2 \stemUp c2 bes1 f'1 c1 bes1 f'1 \stemUp bes,2 \stemUp c2 f1 \stemUp bes,2 \stemUp c2 f1 \stemUp bes,2 \stemUp c2 \stemDown f4 \stemDown e4 \stemDown d2 \stemUp bes2 \stemUp c2 f1 f1 \stemUp bes,2 \stemUp c2 d1 \stemUp bes2 \stemUp c2 f1 \stemUp bes,2 \stemUp c2 \stemDown d4 \stemDown e4 \stemDown f4 \stemDown g4 g1 a1 d,1 d1 \stemDown d2 \stemUp c2 \stemUp bes2 \stemUp c2 \stemDown d2 \stemUp c2 f1 \stemUp bes,2 \stemUp c2 f1 \stemUp bes,2 \stemUp c2 f1 \stemUp bes,2 \stemUp c2 \stemDown f4 \stemDown e4 \stemDown d2 \stemUp bes2 \stemUp c2 f1 \stemUp bes,2 \stemUp c2 \stemDown f4 \stemDown e4 \stemDown d2 \stemUp bes2 \stemUp c2 f1 \stemUp bes,2 \stemUp c2 f1 \stemUp bes,2 \stemUp c2 f1 \stemUp bes,2 \stemUp c2 \stemDown f4 \stemDown e4 \stemDown d2 \stemUp bes2 \stemUp c2 \stemUp bes2 \stemUp c2 d1 \stemUp bes2 \stemUp c2 f1 \stemUp bes,2 \stemUp c2 d1 \stemUp bes2 \stemUp c2 f1 \stemUp bes,2 \stemUp c2 d1 \stemUp bes2 \stemUp c2 f1 \stemUp bes,2 \stemUp c2 d1 \stemUp bes2 \stemUp c2 f1 \stemUp bes,2 \stemUp c2 d1 bes1 \stemDown f'2 r2 \bar "|." 
}


PartPOneVoiceFiveLyricsFive = \lyricmode {
	\set ignoreMelismata = ##t \skip 1 \skip 1 \skip 1 simile \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 
}


\score {
	<<
		\context ChordNames = "PartPOneVoiceOneChords" {
			\PartPOneVoiceOneChords 
		}
		
		\new PianoStaff <<
			\set PianoStaff.instrumentName = "Piano" 
			\set PianoStaff.shortInstrumentName = "Pno." 
			\context Staff = "1" <<
				\mergeDifferentlyDottedOn 
				\mergeDifferentlyHeadedOn 
				\context Voice = "PartPOneVoiceOne" {
					\PartPOneVoiceOne 
				}
				
				\new Lyrics \lyricsto "PartPOneVoiceOne" {
					\set stanza = "1." \PartPOneVoiceOneLyricsOne 
				}
				
			>>
			
			\context Staff = "2" <<
				\mergeDifferentlyDottedOn 
				\mergeDifferentlyHeadedOn 
				\context Voice = "PartPOneVoiceFive" {
					\PartPOneVoiceFive 
				}
				
				\new Lyrics \lyricsto "PartPOneVoiceFive" {
					\set stanza = "1." \PartPOneVoiceFiveLyricsFive 
				}
				
			>>
			
		>>
		
	>>
	
	\layout {
	}
	
	\midi {
		\tempo 4 = 77 
	}
	
}

