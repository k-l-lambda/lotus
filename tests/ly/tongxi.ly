\version "2.20.0"
% automatically converted by musicxml2ly from ./temp/xml2ly-4OTE5NjIyMD.xml
\pointAndClickOff

\header {
    encodingsoftware =  "Finale 2014.5 for Mac"
    encodingdate =  "2017-11-23"
    composer =  "朱践耳曲"
    title =  "（四）童    嬉"
    }

#(set-global-staff-size 22.7288571429)
\paper {
    
    paper-width = 21.0\cm
    paper-height = 29.71\cm
    top-margin = 0.99\cm
    bottom-margin = 1.67\cm
    left-margin = 0.99\cm
    right-margin = 0.89\cm
    between-system-space = 3.72\cm
    page-top-space = 2.63\cm
    }
\layout {
    \context { \Score
        skipBars = ##t
        autoBeaming = ##f
        }
    }
PartPOneVoiceOne =  \relative d''' {
    \clef "treble" \key c \major \time 2/4 | % 1
    \grace { \stemUp d16 ( [ \stemUp a16 \stemUp as16 ] } {} | % 1
    \ottava #1 \stemUp es'8 ) ^> _\f ^\markup{ \bold {Moderato} }
    \ottava #0 b8 \rest b,4 \rest ^\fermata | % 2
    \grace { \stemUp d'16 ( [ \stemUp a16 \stemUp as16 ] } {} | % 2
    \stemUp es8 ) ^> _\mp b8 \rest b4 \rest ^\fermata | % 3
    \time 3/4  | % 3
    \acciaccatura { \stemUp d'8 ( } {} | % 3
    \ottava #1 \stemUp es8 ) ^> _\f a,8 \rest \acciaccatura { \stemUp d'8
        ( } \stemUp es,8 ) ^> \ottava #0 b8 \rest _\f b,4 \rest
    ^\fermata | % 4
    \time 2/4  | % 4
    \acciaccatura { \stemUp d'8 ( } {} | % 4
     \stemUp es,8 ) ^> _\p b8 \rest b4 \rest ^\fermata | % 5
    \ottava #1 | % 5
    \stemUp d''16 [ _\f \stemUp a16 \stemUp as16 \stemUp es16 ]
    \stemDown d16 [ \stemDown a16 \stemDown as16 \stemDown es16 ]
    \ottava #0 \break | % 6
    \stemUp d16 [ \stemUp a16 \stemUp as16 \stemUp es16 ] \change
    Staff="2" \stemDown d16 [ \stemDown a16 ] \stemUp as16 [ \stemUp es16
    ] | % 7
    \time 3/4  \change Staff="1" | % 7
    R2. | % 8
    R2.*2 | \barNumberCheck #10
    \time 2/4  | \barNumberCheck #10
    \stemDown d''4. ^> _\> -\! _\mp \stemDown c8 | % 11
    \stemDown d8 r8 r4 | % 12
    \stemDown e8 [ \stemDown c8 \stemDown d8 \stemDown e8 ] \break | % 13
    \stemDown d2 ^- | % 14
    \stemDown a8 [ \stemDown d8 \stemDown a8 \stemDown c8 ] | % 15
    \stemDown d8 r8 \grace { \stemUp as''16 ( [ \stemUp es16 \stemUp d16
        ] } \stemDown a8 ) ( ^> r8 _\f | % 16
    \stemDown a,8 ) [ _\mp \stemDown c8 \stemDown d8 \stemDown c8 ] | % 17
    \stemUp a2 _- | % 18
    \stemDown a8 [ \stemDown c8 \stemDown d8 \stemDown e8 ] \break | % 19
    \stemUp a,8 r8 \grace { \stemUp as''16 ( [ \stemUp es16 \stemUp d16
        ] } \stemDown a8 ) ( ^> r8 _\f | \barNumberCheck #20
    \time 3/4  | \barNumberCheck #20
    \stemDown a,8 ) [ _\mp \stemDown c8 \stemDown d8 \stemDown c8
    \stemDown a8 \stemDown e'8 ] | % 21
    \stemDown d8 [ \stemDown e8 \stemDown d8 \stemDown c8 \stemDown a8
    \stemDown a8 ] | % 22
    \time 2/4  | % 22
    \stemDown d4. ^> _\mf \stemDown c8 | % 23
    \time 3/4  | % 23
    \stemDown d8 r8 \grace { \stemUp as''16 ( [ \stemUp es16 \stemUp d16
        ] } \stemDown a8 ) ^> r8 _\f \grace { \stemUp as'16 ( [ \stemUp
        es16 \stemUp d16 ] } \stemDown a8 ) ~ ^> r8 \pageBreak | % 24
    \time 2/4  | % 24
    \stemUp a,8 [ \stemUp c8 \stemUp d8 \stemUp c8 ] | % 25
    \stemUp d8 [ \stemUp c8 \stemUp a8 \stemUp c8 ] | % 26
    \stemUp a8 [ _\< \stemUp e'8 \stemUp c8 \stemUp d8 ] | % 27
    \stemUp d8 [ \stemUp c8 \stemUp a8 \stemUp a8 ] | % 28
    \stemUp d4. ^> _\f \stemUp c8 | % 29
    \stemUp d8 _\p b8 \rest b4 \rest | \barNumberCheck #30
    \time 3/4  | \barNumberCheck #30
    R2. \break | % 31
    \time 2/4  \change Staff="2" | % 31
    \stemUp a,,8 [ \stemUp d8 \stemUp es8 \stemUp as8 ] \change
    Staff="1" | % 32
    \stemDown a8 [ \stemDown d8 _\markup{ \bold\italic {l.h.} }
    \stemDown es8 \stemDown as8 ] | % 33
    \stemUp a8 [ \stemUp d8 ] ^\markup{ \bold\italic {r.h.} } \stemDown
    es8 [ _\markup{ \bold\italic {l.h.} } _\p \stemDown as8 ] | % 34
    \ottava #1 | % 34
    \stemUp es''16 [ _\ff \stemUp bes16 _\markup{ \bold\italic {sub.} }
    \stemUp a16 \stemUp e16 ] a,4 \rest | % 35
    \time 3/4  | % 35
    \stemUp es'16 [ \stemUp bes16 \stemUp a16 \stemUp e16 ] a4 \rest a4
    \rest | % 36
    \ottava #1 | % 36
    \stemUp es''8 [ _\mp \stemUp e,8 ] \ottava #0 b4 \rest b,4 \rest
    \break | % 37
    \time 2/4  \change Staff="2" | % 37
    \stemDown g,16 [ \stemDown c16 \stemDown des16 \stemDown ges16 ]
    \change Staff="1" \stemUp g16 [ \stemUp c16 \stemUp des16 \stemUp
    ges16 ] | % 38
    \time 3/4  | % 38
    \ottava #1 | % 38
    \stemDown g16 ^> [ \stemDown c16 ^> ] \stemUp des16 ^> [ _\fff
    \stemUp ges16 ^> ] r4 r4 | % 39
    \time 2/4  | % 39
    \grace { \stemUp e16 ( [ \stemUp a16 \stemUp bes16 ] } {} | % 39
    \stemUp es8 ) [ _\p _\ff \stemUp bes8 \stemUp a8 \stemUp e8 ] |
    \barNumberCheck #40
    \stemUp es8 [ \stemUp bes8 \stemUp a8 \stemUp e8 ] | % 41
    \stemUp es8 [ \stemUp bes8 \stemUp a8 \stemUp e8 ] _\< \change
    Staff="2" | % 42
    \stemUp es8 [ \stemUp bes8 \stemUp a8 \stemUp e8 ] \change Staff="1"
    \break | % 43
    \stemUp d'4. _> -\! _\f \stemUp c8 | % 44
    \stemUp d8 r8 r4 | % 45
    \stemUp e8 [ \stemUp c8 \stemUp d8 \stemUp e8 ] | % 46
    \stemUp d2 _- | % 47
    \stemUp a8 [ \stemUp d8 \stemUp a8 \stemUp c8 ] | % 48
    \stemUp d8 r8 r4 | % 49
    \stemUp a8 [ \stemUp c8 \stemUp d8 \stemUp c8 ] \pageBreak |
    \barNumberCheck #50
    \stemUp a2 _- | % 51
    \stemUp a8 [ \stemUp c8 \stemUp d8 \stemUp e8 ] | % 52
    \stemUp a,8 r8 r4 | % 53
    \time 3/4  | % 53
    \stemUp a8 [ _\mp \stemUp c8 \stemUp d8 \stemUp c8 \stemUp a8
    \stemUp e'8 ] | % 54
    \stemUp d8 [ \stemUp e8 \stemUp d8 _\< \stemUp c8 \stemUp a8 \stemUp
    a8 ] | % 55
    \time 2/4  | % 55
    \stemUp d4. _> \stemUp c8 -\! \break | % 56
    \stemUp d8 _\f r8 r4 | % 57
    \time 3/4  | % 57
    \ottava #1 | % 57
    \stemUp <e'' f bes>8 ^> [ _\f \stemUp <e f bes>8 ] \stemDown <f, b>8
    \stemUp <e' f bes>8 ^> \stemDown <f, b>8 [ \stemDown <f b>8 ]
    \ottava #0 | % 58
    \stemUp <e f bes>8 ^> [ \stemUp <e f bes>8 ] \stemDown <f, b>8
    \stemUp <e' f bes>8 ^> \stemDown <f, b>8 [ \stemDown <f b>8 ] | % 59
    \time 2/4  | % 59
    \stemUp <e f bes>8 [ \stemUp <e f bes>8 ] \change Staff="2"
    \stemDown <f, b>8 [ _\> \stemDown <f b>8 ] \change Staff="1" s2 | % 61
    \stemUp a8 [ -\! _\p \stemUp c8 \stemUp d8 \stemUp c8 ] \pageBreak | % 62
    \stemUp d8 [ \stemUp c8 \stemUp a8 \stemUp c8 ] | % 63
    \stemUp a8 [ \stemUp e'8 \stemUp c8 \stemUp d8 ] | % 64
    \stemUp d8 [ \stemUp c8 \stemUp a8 _\markup{ \bold\italic {poco} }
    \stemUp a'8 ] | % 65
    \stemUp e8 [ \stemUp g8 \stemUp a8 \stemUp g8 ] _\markup{
        \bold\italic {a} } | % 66
    \stemUp a8 [ \stemUp g8 \stemUp e8 _\markup{ \bold\italic {poco} }
    \stemUp g8 ] | % 67
    \stemUp e8 [ \stemUp b'8 \stemUp g8 \stemUp a8 ] | % 68
    \stemUp a8 [ \stemUp g8 _\markup{ \bold\italic {cresc.} } \stemUp e8
    \stemUp e'8 ] \break | % 69
    \stemUp b8 [ \stemUp d8 \stemUp e8 \stemUp d8 ] | \barNumberCheck
    #70
    \stemUp e8 [ \stemUp d8 \stemUp b8 \stemUp d8 ] | % 71
    \stemUp b8 [ \stemUp fis'8 \stemUp d8 \stemUp e8 ] | % 72
    \stemUp e8 [ \stemUp d8 \stemUp b8 \stemUp b8 ] | % 73
    \time 3/4  | % 73
    \stemUp d8 [ \stemUp e8 \stemUp e8 \stemUp d8 \stemUp b8 \stemUp b8
    ] | % 74
    \stemUp d8 [ \stemUp e8 \stemUp e8 \stemUp d8 \stemUp b8 \stemUp b8
    ] \break | % 75
    \stemUp d8 [ \stemUp e8 \stemUp e8 \stemUp d8 _\< \stemUp b8 \stemUp
    b8 ] | % 76
    \time 2/4  | % 76
    \stemUp e4. ^> \stemUp d8 | % 77
    \time 3/4  | % 77
    \stemUp e8 _\ff b8 \rest b4 \rest b4 \rest | % 78
    R2. | % 79
    \numericTimeSignature\time 4/4  | % 79
    R1 | \barNumberCheck #80
    \stemDown <a es' a>4 ( \arpeggio \arpeggio \arpeggio _\> -\! _\mp
    \stemDown <d as' d>4 \arpeggio \arpeggio \arpeggio _\< _\markup{
        \bold\italic {espress.} } \stemDown <f b f'>4 \arpeggio
    \arpeggio \arpeggio -\! \stemDown <c ges' c>4 ) \arpeggio \arpeggio
    \arpeggio _\> \break | % 81
    \time 3/4  | % 81
    \stemDown <a es' a>2. ( \arpeggio \arpeggio \arpeggio -\! _\> | % 82
    \stemDown d8 ) -\! _\pp r8 r4 r4 | % 83
    \stemDown <d as' d>8 ( \arpeggio [ \arpeggio \arpeggio _\mp
    \stemDown c'8 _\< \stemDown d8 ) -\! \stemDown <f, b f'>8 (
    \arpeggio \arpeggio \arpeggio \stemDown d'8 \stemDown c8 ) ] _\> | % 84
    \stemDown <a, es' a>2. ( \arpeggio \arpeggio \arpeggio -\! _\> | % 85
    \stemDown d8 ) -\! _\pp r8 r4 r4 | % 86
    \time 5/4  | % 86
    \stemDown <a es' a>4 ( \arpeggio \arpeggio \arpeggio _\mp \stemDown
    <c ges' c>4 \arpeggio \arpeggio \arpeggio _\< \stemDown <a es' a>4
    \arpeggio \arpeggio \arpeggio \stemDown <d as' d>4 \arpeggio
    \arpeggio \arpeggio \stemDown <f b f'>8 \arpeggio [ \arpeggio
    \arpeggio -\! \stemDown c'8 ) ] \pageBreak | % 87
    \time 3/4  | % 87
    \stemDown <a, es' a>2. ( \arpeggio \arpeggio \arpeggio | % 88
    \time 2/4  | % 88
    \stemDown d8 ) _\> -\! _\pp r8 r4 | % 89
    \stemUp a'8 ( [ _\mp \stemUp d8 _\< \stemUp f8 \stemUp c8 ) ] |
    \barNumberCheck #90
    \time 3/4  | \barNumberCheck #90
    \stemDown <a, es' a>2. ( \arpeggio \arpeggio \arpeggio | % 91
    \stemDown d8 ) _\pp r8 r4 r4 | % 92
    \time 2/4  | % 92
    \stemUp d'8 ( [ _\mp \stemUp c8 \stemUp d8 \stemUp c8 ) ] \break | % 93
    \numericTimeSignature\time 4/4  | % 93
    \stemDown <es, a>4 ( _\< \stemDown <as, d>4 -\! \stemDown <des g>4
    \stemDown <ces f>4 ) | % 94
    \time 3/4  | % 94
    \stemDown <g des' g>2 ( \arpeggio \arpeggio \arpeggio _\> \stemDown
    a'4 ) -\! | % 95
    \stemDown <c, ges' c>2 ( \arpeggio \arpeggio \arpeggio _\> \stemDown
    a'4 ) | % 96
    \stemUp <d,, as' d>2 ( \arpeggio \arpeggio \arpeggio -\! _\>
    \stemDown <c' c'>4 ) -\! | % 97
    b4 \rest \stemUp a'8 ( [ _\< \stemUp c8 \stemUp a8 \stemUp c8 ) ]
    -\! | % 98
    \numericTimeSignature\time 4/4  | % 98
    \stemDown <d, as' d>4 ( \arpeggio \arpeggio \arpeggio _\mf \stemDown
    <f b f'>4 \arpeggio \arpeggio \arpeggio \stemDown <d as' d>4
    \arpeggio \arpeggio \arpeggio \stemDown <c ges' c>4 ) \arpeggio
    \arpeggio \arpeggio \pageBreak | % 99
    \time 3/4  | % 99
    \stemDown <a es' a>2. ( \arpeggio \arpeggio \arpeggio _\> |
    \barNumberCheck #100
    \time 5/8  | \barNumberCheck #100
    \stemDown d8 ) -\! _\pp r8 r8 r8 r8 | % 101
    R8*5 _\markup{ \bold\italic {cresc.} } | % 102
    \time 4/8  | % 102
    R2*2 | % 104
    \time 3/8  | % 104
    R4.*2 | % 106
    \time 2/8  | % 106
    R4*2 \break | % 108
    \time 3/4  | % 108
    R2. | % 109
    R2. | \barNumberCheck #110
    \stemUp a,8 [ _\< -\! _\ff _\> -\! _\mf \stemUp c8 \stemUp a8
    \stemUp c8 \stemUp a8 \stemUp a8 ] | % 111
    \time 2/4  | % 111
    \stemUp a8 [ \stemUp c8 \stemUp e8 \stemUp a,8 ] | % 112
    \time 3/4  | % 112
    \stemUp c2. | % 113
    \stemUp d8 \ottava #1 g'8 \rest \grace { \stemUp e'16 ( [ \stemUp a16
        \stemUp bes16 ] } \stemUp es8 ) [ \stemUp bes8 _\f \stemUp a8
    \stemUp e8 ] \break | % 114
    \time 2/4  | % 114
    \stemUp es8 [ \stemUp bes8 \stemUp a8 \stemUp e8 ] | % 115
    \stemUp es8 [ \stemUp bes8 \stemUp a8 \stemUp e8 ] \change Staff="2"
    | % 116
    \stemUp es8 [ \stemUp bes8 \stemUp a8 \stemUp e8 ] \change Staff="1"
    | % 117
    R2 | % 118
    \stemDown d''8 [ _\p \stemDown c8 \stemDown a8 \stemDown c8 ] | % 119
    \stemDown a8 [ \stemDown a'8 \stemDown a,8 \stemDown e'8 ] |
    \barNumberCheck #120
    \stemDown d8 [ \stemDown c8 \stemDown a8 \stemDown c8 ] \break | % 121
    \stemUp a8 [ \stemUp e'8 \stemUp d8 \stemUp c8 ] | % 122
    \time 3/4  | % 122
    \stemUp a8 \stemUp e'4. ~ \stemUp e4 _\< | % 123
    \numericTimeSignature\time 4/4  | % 123
    \stemUp d8 _\mf -\! b8 \rest \ottava #1 s2. _\f | % 124
    \time 3/4  | % 124
    \stemDown <bes' es>16 [ \change Staff="2" \stemUp <e, a>16 \change
    Staff="1" \stemDown <bes' es>8 ] \stemDown <f bes>16 [ \change
    Staff="2" \stemUp <b, e>16 \change Staff="1" \stemDown <f' bes>8 ] r4
    | % 125
    \time 2/4  | % 125
    \stemDown <bes es>16 [ \change Staff="2" \stemUp <e, a>16 \change
    Staff="1" \stemDown <bes' es>8 ] \stemDown <f bes>16 [ \change
    Staff="2" \stemUp <b, e>16 \change Staff="1" \stemDown <f' bes>8 ]
    \pageBreak | % 126
    \stemDown <bes, es>16 [ \change Staff="2" \stemUp <e, a>16 \change
    Staff="1" \stemDown <bes' es>8 ] \stemDown <f bes>16 [ \change
    Staff="2" \stemUp <b, e>16 \change Staff="1" \stemDown <f' bes>8 ] | % 127
    \stemDown <bes, es>16 [ ^\> \change Staff="2" \stemUp <e, a>16
    \change Staff="1" \stemDown <bes' es>8 ] \stemDown <f bes>16 [
    \change Staff="2" \stemUp <b, e>16 \change Staff="1" \stemDown <f'
        bes>8 ] | % 128
    \time 3/4  | % 128
    a4 \rest -\! \stemDown <f bes>16 [ \change Staff="2" \stemUp <b, e>16
    \change Staff="1" \stemDown <f' bes>8 ] a4 \rest | % 129
    \time 2/4  | % 129
    \stemDown <g' a>8 [ _\mf \stemDown c8 \stemDown a'8 \stemDown c,8 ]
    | \barNumberCheck #130
    \stemDown <g a>8 [ \stemDown e'8 \stemDown e8 \stemDown c8 ] | % 131
    \time 3/4  | % 131
    \stemDown <g a>8 [ \stemDown c8 \stemDown <g a>8 \stemDown c8
    \stemDown d8 \stemDown c8 ] \break | % 132
    \stemUp a8 _\< \stemUp e'4. ~ \stemUp e4 | % 133
    \time 1/4  | % 133
    \stemUp d8 ^> -\! b8 \rest | % 134
    \time 5/8  | % 134
    \ottava #1 | % 134
    \stemDown <e' a bes es>8 ^> [ _\f \change Staff="2" \stemUp <f, b>8
    \change Staff="1" \stemDown <e' a bes es>8 ^> \change Staff="2"
    \stemUp <f, b>8 \stemUp <f b>8 ] \change Staff="1" \ottava #0
    \change Staff="2" \ottava #1 \ottava #0 \change Staff="1" | % 135
    \stemDown <e a bes es>8 ^> [ \change Staff="2" \stemUp <f, b>8
    \change Staff="1" \stemDown <e' a bes es>8 ^> \change Staff="2"
    \stemUp <f, b>8 \stemUp <f b>8 ] \change Staff="1" | % 136
    \stemDown <e a bes es>8 ^> [ \change Staff="2" \stemUp <f, b>8
    \change Staff="1" \stemDown <e' a bes es>8 ^> _\markup{ \bold\italic
        {cresc.} } \change Staff="2" \stemUp <f, b>8 \stemUp <f b>8 ]
    \change Staff="1" | % 137
    \stemDown <e a bes es>8 ^> [ \change Staff="2" \stemUp <f, b>8
    \change Staff="1" \stemDown <e' a bes es>8 ^> \change Staff="2"
    \stemUp <f, b>8 \stemUp <f b>8 ] \break | % 138
    \time 2/4  \change Staff="1" | % 138
    \stemUp <e' b'>8 _> [ _\sff \stemUp <g d'>8 \stemUp b8 _\mp \stemUp
    d8 ] | % 139
    \stemUp b8 [ \stemUp fis'8 \stemUp fis8 \stemUp d8 ] |
    \barNumberCheck #140
    \time 3/4  | \barNumberCheck #140
    \stemUp b8 [ \stemUp d8 \stemUp b8 \stemUp d8 \stemUp e8 \stemUp d8
    ] | % 141
    \time 2/4  | % 141
    \stemUp e8 [ \stemUp g8 \stemUp e8 \stemUp g8 ] | % 142
    \stemUp e8 [ _\< \stemUp <fis b>8 \stemUp <fis b>8 -\! \stemUp <d g>8
    ] | % 143
    \time 3/4  | % 143
    \stemUp e8 [ \stemUp g8 _\> \stemUp e8 \stemUp g8 -\! \stemUp <e a>8
    \stemUp g8 ] \pageBreak | % 144
    \time 2/4  | % 144
    \stemUp <e a>8 [ \stemUp <g c>8 \stemUp <e a>8 _\< \stemUp <g c>8 ]
    | % 145
    \stemUp <e a>8 [ \stemUp <b' e>8 \stemUp <b e>8 \stemUp <g c>8 ] -\!
    | % 146
    \time 3/4  | % 146
    \stemUp <e a>8 [ _\> \stemUp <g c>8 \stemUp <e a>8 \stemUp <g c>8
    \stemUp <a d>8 -\! \stemUp <g c>8 ] | % 147
    \stemUp <e a>8 [ \stemUp <g c>8 _\markup{ \bold\italic {cresc.} }
    \stemUp <e a>8 \stemUp <g c>8 \stemUp <a d>8 \stemUp <g c>8 ] | % 148
    \stemUp <e a>8 _> [ \stemUp <g c>8 _\markup{ \bold\italic {poco} }
    \stemUp <e a>8 \stemUp <g c>8 \stemUp <a d>8 \stemUp <g c>8 ] | % 149
    \stemUp <e a>8 [ \stemUp <g c>8 \stemUp <e a>8 \stemUp <g c>8
    _\markup{ \bold\italic {a} } \stemUp <a d>8 \stemUp <g c>8 ] \break
    | \barNumberCheck #150
    \stemUp <e a>8 _> [ \stemUp <g c>8 \stemUp <e a>8 \stemUp <g c>8
    \stemUp <a d>8 \stemUp <g c>8 ] | % 151
    \stemUp <e a>8 [ \stemUp <g c>8 \stemUp <e a>8 \stemUp <g c>8
    \stemUp <a d>8 \stemUp <g c>8 ] | % 152
    \stemUp <e a>8 [ \stemUp <g c>8 \stemUp <e a>8 \stemUp <g c>8
    \stemUp <a d>8 \stemUp <g c>8 ] | % 153
    \stemUp <e a>8 [ \stemUp <g c>8 \stemUp <e a>8 \stemUp <g c>8
    \stemUp <a d>8 \stemUp <g c>8 ] | % 154
    \stemUp <e a>8 [ \stemUp <g c>8 \stemUp <e a>8 \stemUp <g c>8
    \stemUp <a d>8 \stemUp <g c>8 ] \break | % 155
    \stemUp <e a>8 [ \stemUp <g c>8 \stemUp <e a>8 \stemUp <g c>8
    \stemUp <a d>8 \stemUp <g c>8 ] | % 156
    \numericTimeSignature\time 4/4  | % 156
    \stemUp <e a>8 [ _\ff \stemUp <g c>8 \stemUp <a d>8 \stemUp <g c>8 ]
    \stemUp <e a>8 [ \stemUp <g c>8 \stemUp <a d>8 \stemUp <g c>8 ] | % 157
    \stemUp <e a>8 [ \stemUp <g c>8 \stemUp <a d>8 \stemUp <g c>8 ]
    \stemUp <e a>8 [ \stemUp <g c>8 _\< \stemUp <a d>8 \stemUp <g c>8 ]
    | % 158
    \stemUp <e a>8 _> [ \stemUp <g c>8 _> -\! \stemUp <a d>8 _> \stemUp
    <g c>8 _> ] r2 \break | % 159
    r4 _\fff \once \omit TupletNumber
    \times 8/13  {
        \stemDown <e' b' e>32 [ ^ "1£©" \stemDown <\tweak style ##f e
            \tweak style ##f b' \tweak style ##f e>32 \stemDown <\tweak
            style ##f e \tweak style ##f b' \tweak style ##f e>32 \once
        \override NoteHead.style = ##f \stemDown e'32 \once \override
        NoteHead.style = ##f \stemDown e32 \once \override
        NoteHead.style = ##f \stemDown e32 _\> \once \override
        NoteHead.style = ##f \stemDown e32 \once \override
        NoteHead.style = ##f \stemDown e32 \stemDown <\tweak style ##f
            e, \tweak style ##f b' \tweak style ##f e>32 \stemDown
        <\tweak style ##f e \tweak style ##f b' \tweak style ##f e>32
        \stemDown <\tweak style ##f e \tweak style ##f b' \tweak style
            ##f e>32 \stemDown <\tweak style ##f e \tweak style ##f b'
            \tweak style ##f e>32 \stemDown <\tweak style ##f e \tweak
            style ##f b' \tweak style ##f e>32 ] }
    -\! \once \omit TupletBracket
    \once \omit TupletNumber
    \times 2/8  {
         \once \override NoteHead.style = ##f \stemDown d'4 _\mp \once
        \override NoteHead.style = ##f \stemDown d4 ^\markup{
            \bold\italic {molto} } \once \override NoteHead.style = ##f
        \stemDown d4 \once \override NoteHead.style = ##f \stemDown d4
        _\> \once \override NoteHead.style = ##f \stemDown d4 ^\markup{
            \bold\italic {rit.} } \once \override NoteHead.style = ##f
        \stemDown d4 \once \override NoteHead.style = ##f \stemDown d4
        \once \override NoteHead.style = ##f \stemDown d4 }
    | \barNumberCheck #160
    \ottava #1 | \barNumberCheck #160
    <d a' d>1 \arpeggio \arpeggio \arpeggio -\! _\pp \ottava #0 \bar
    "|."
    }

PartPOneVoiceThree =  \relative a, {
    \clef "bass" \key c \major \time 2/4 s2 \sustainOn s2 \sustainOff
    \sustainOn | % 3
    \time 3/4  s2. \sustainOff \sustainOn | % 4
    \time 2/4  s2 \sustainOff \sustainOn s2 \sustainOff \sustainOn
    \break s2 | % 7
    \time 3/4  | % 7
    \stemDown a8 ^> [ \sustainOff _\markup{ \bold\italic {sempre
            staccato} } ^\ff \stemDown d8 \stemDown es8 \stemDown as8
    \stemDown es8 \stemDown d8 ] \stemDown a8 [ \stemDown d8 \stemDown
    es8 \stemDown as8 \stemDown es8 \stemDown d8 ] \stemDown a8 [
    \stemDown d8 \stemDown es8 \stemDown as8 \stemDown es8 \stemDown d8
    ] | \barNumberCheck #10
    \time 2/4  \stemDown a8 [ \stemDown d8 \stemDown es8 \stemDown as8 ]
    \stemUp es8 [ \stemUp d8 \stemUp a8 \stemUp d8 ] \stemDown es8 [
    \stemDown as8 \stemDown es8 \stemDown d8 ] \break \stemDown a8 [
    \stemDown d8 \stemDown es8 \stemDown as8 ] \stemDown es8 [ \stemDown
    d8 \stemDown a8 \stemDown d8 ] \stemDown es8 [ \stemDown as8
    \stemDown es8 \stemDown d8 ] \stemDown a8 [ \stemDown d8 \stemDown
    es8 \stemDown as8 ] \stemDown es8 [ \stemDown d8 \stemDown a8
    \stemDown d8 ] \stemDown es8 [ \stemDown as8 \stemDown es8 \stemDown
    d8 ] \break \stemDown a8 [ \stemDown d8 \stemDown es8 \stemDown as8
    ] | \barNumberCheck #20
    \time 3/4  \stemDown es8 [ \stemDown d8 \stemDown a8 \stemDown d8
    \stemDown es8 \stemDown as8 ] | % 21
    \stemDown es8 [ ^\< \stemDown d8 \stemDown a8 \stemDown d8 \stemDown
    es8 \stemDown as8 ] | % 22
    \time 2/4  \stemDown es8 [ -\! \stemDown d8 \stemDown a8 \stemDown d8
    ] | % 23
    \time 3/4  \stemDown es8 r8 \clef "treble" \stemDown <as' a d>8 r8
    \stemDown <as a d>8 r8 \pageBreak | % 24
    \clef "bass" \time 2/4 \stemDown a,,8 [ \stemDown d8 \stemDown es8
    \stemDown as8 ] \stemDown es8 [ \stemDown d8 \stemDown a8 \stemDown
    d8 ] \stemDown es8 [ \stemDown as8 \stemDown es8 \stemDown d8 ]
    \stemDown a8 [ \stemDown d8 \stemDown es8 \stemDown as8 ] \stemDown
    es8 [ \stemDown d8 \stemDown a8 \stemDown d8 ] \stemDown es8 _\sf
    _\f r8 \stemUp <d,, d'>4 ~ _- ~ | \barNumberCheck #30
    \time 3/4  \stemUp <d d'>8 \stemUp a'4 _> \stemUp d8 _. ^\> \stemUp
    es8 _. [ \stemUp as8 _. ] \break | % 31
    \time 2/4  | % 31
    s1. _\markup{ \bold\italic {r.h.} } s2 -\! | % 35
    \time 3/4  s1. \break | % 37
    \time 2/4  | % 37
    s2 \sustainOn | % 38
    \time 3/4  s2. | % 39
    \time 2/4  \change Staff="1" s2 \sustainOff \stemDown b''4 _.
    \stemDown f4 _. \change Staff="2" \stemDown b,4 ^. \stemDown f4 ^.
    \stemDown b,4 _. \stemDown f4 _. \break r4 \stemUp <c c'>4 ~ _> ~
    \stemUp <c c'>8 [ \stemUp <bes bes'>8 ] \stemUp <c c'>8 r8 r4
    \stemUp <d d'>8 [ \stemUp bes'8 ] \stemUp <c, c'>8 [ \stemUp <d d'>8
    ] \stemUp <c c'>4 ~ _- ~ \stemUp <c c'>4 \stemUp g'8 [ \stemUp <c,
        c'>8 ] \stemUp g'8 [ \stemUp <bes, bes'>8 ] \stemUp <c c'>8 r8 r4
    \stemUp g'8 [ \stemUp <bes, bes'>8 ] \pageBreak \stemUp <c c'>8 [
    \stemUp <bes bes'>8 ] \stemUp <g g'>4 ~ ~ \stemUp <g g'>4 \stemUp g'8
    [ \stemUp <bes, bes'>8 ] \stemUp <c c'>8 [ \stemUp <d d'>8 ] \stemUp
    <g, g'>8 r8 | % 53
    \time 3/4  r4 \stemUp g'8 [ \stemUp bes8 \stemUp c8 \stemUp bes8 ]
    \stemUp g8 [ \stemUp d'8 \stemUp c8 \stemUp <d, d'>8 \stemUp <c c'>8
    \stemUp <bes bes'>8 ] | % 55
    \time 2/4  \stemUp <g g'>8 [ \stemUp g'8 ] \stemUp <c, c'>4 ~ _> ~
    \break \stemUp <c c'>8 [ \stemUp <bes bes'>8 ] \stemUp <c c'>8 r8 | % 57
    \time 3/4  s1. | % 59
    \time 2/4  s2 \stemUp <e' f bes>8 [ \stemUp <e f bes>8 ] \stemDown
    <f, b>8 [ \stemDown <f b>8 ] r4 \stemDown <c' g'>8 r8 \pageBreak r8
    \stemDown <bes f'>8 r4 \stemUp <a e'>8 r8 \stemUp <g d'>8 r8 r8
    \stemUp <f c'>8 r4 \stemDown <f' c' d>8 r8 r8 \stemDown <e b' c>8 r4
    \stemDown <d a' b>8 r8 r8 \stemDown <c g' a>8 r4 \stemDown <b fis'
        g>8 r8 \stemUp <a e' fis>8 r8 \break r8 \stemUp <gis gis'>4
    \stemUp <fis fis'>8 ~ ~ \stemUp <fis fis'>8 \stemUp <e e'>4 \stemUp
    <es es'>8 ~ ~ \stemUp <es es'>8 \stemUp <d d'>4 \stemUp <cis cis'>8
    ~ ~ \stemUp <cis cis'>8 \stemUp <c c'>4 r8 | % 73
    \time 3/4  \stemUp <b b'>4. _> \stemUp <f' f'>4. _> r4 \stemUp <a,
        a'>8 _> r8 \stemUp <es' es'>8 _> r8 \break r8 \stemUp <fis,
        fis'>4. ~ _> ~ \stemUp <fis fis'>4 | % 76
    \time 2/4  r4 \stemUp <f f'>4 _> | % 77
    \time 3/4  \stemUp <es es'>8 _> [ \stemUp es''8 ] \stemUp es8 [
    \stemUp es8 \stemUp es8 \stemUp es8 ] \stemDown es8 ^> [ \stemDown
    es'8 ] \stemDown es8 [ \stemDown es8 \stemDown es8 \stemDown es8 ] | % 79
    \clef "treble" \numericTimeSignature\time 4/4 \stemUp es8 [ \stemUp
    es8 \stemUp es8 \stemUp es8 ] \stemUp es8 [ \stemUp es8 \stemUp es8
    \stemUp es8 ] \stemUp es8 [ \stemUp es8 \stemUp es8 \stemUp es8 ]
    \stemUp es8 [ \stemUp es8 \stemUp es8 \stemUp es8 ] \break | % 81
    \time 3/4  \stemUp es8 ( [ \stemUp es8 \stemUp es8 \stemUp es8
    \stemUp es8 \stemUp es8 ] \stemUp d8 ) r8 r4 r4 \stemUp es8 [
    \stemUp es8 \stemUp es8 \stemUp es8 \stemUp es8 \stemUp es8 ]
    \stemUp es8 ( [ \stemUp es8 \stemUp es8 \stemUp es8 \stemUp es8
    \stemUp es8 ] \stemUp d8 ) r8 r4 r4 | % 86
    \time 5/4  \stemUp es8 [ \stemUp es8 \stemUp es8 \stemUp es8 ]
    \stemUp es8 [ \stemUp es8 \stemUp es8 \stemUp es8 \stemUp es8
    \stemUp es8 ] \pageBreak | % 87
    \time 3/4  \stemUp es8 ( [ \stemUp es8 \stemUp es8 \stemUp es8
    \stemUp es8 \stemUp es8 ] | % 88
    \time 2/4  \stemUp d8 ) r8 r4 \stemUp es8 [ \stemUp es8 \stemUp es8
    \stemUp es8 ] | \barNumberCheck #90
    \time 3/4  \stemUp es8 ( [ \stemUp es8 ^\> \stemUp es8 \stemUp es8
    \stemUp es8 \stemUp es8 ] \stemUp d8 ) -\! r8 r4 r4 | % 92
    \time 2/4  \stemUp es8 [ \stemUp es8 \stemUp es8 \stemUp es8 ]
    \break | % 93
    \numericTimeSignature\time 4/4  \stemUp es8 [ \stemUp es8 \stemUp es8
    \stemUp es8 ] \stemUp es8 [ \stemUp es8 \stemUp es8 \stemUp es8 ] | % 94
    \time 3/4  \stemUp es8 [ \stemUp es8 \stemUp es8 \stemUp es8 \stemUp
    es8 \stemUp es8 ] \stemUp des8 [ \stemUp des8 \stemUp des8 \stemUp
    des8 \stemUp des8 \stemUp des8 ] | % 96
    \clef "bass" \stemDown b8 [ \stemDown b8 \stemDown b8 \stemDown b8
    \stemDown b8 \stemDown b8 ] \stemDown bes8 [ \stemDown bes8
    \stemDown bes8 \stemDown bes8 \stemDown bes8 \stemDown bes8 ] | % 98
    \numericTimeSignature\time 4/4  \stemDown bes8 [ \stemDown bes8
    \stemDown bes8 \stemDown bes8 ] \stemDown bes8 [ \stemDown bes8
    \stemDown bes8 \stemDown bes8 ] \pageBreak | % 99
    \time 3/4  \stemDown bes8 [ \stemDown bes8 \stemDown bes8 \stemDown
    bes8 \stemDown bes8 \stemDown bes8 ] | \barNumberCheck #100
    \time 5/8  \stemDown as8 ^> [ \stemDown as8 \stemDown as8 \stemDown
    as8 \stemDown as8 ] \stemDown ges8 ^> [ \stemDown ges8 \stemDown ges8
    \stemDown ges8 \stemDown ges8 ] | % 102
    \time 4/8  \stemDown e8 ^> [ \stemDown e8 \stemDown e8 \stemDown e8
    ] \stemDown d8 ^> [ \stemDown d8 \stemDown d8 \stemDown d8 ] | % 104
    \time 3/8  \stemUp c8 _> [ \stemUp c8 \stemUp c8 ] \stemUp bes8 _> [
    \stemUp bes8 \stemUp bes8 ] | % 106
    \time 2/8  \stemUp f8 _> [ \stemUp f8 ] \stemUp e8 _> [ \stemUp e8 ]
    \break | % 108
    \time 3/4  \stemUp a,8 ^> [ \stemUp es'8 \stemUp as8 \stemUp d8
    \stemUp as8 \stemUp es8 ] \stemUp a,8 [ \stemUp es'8 \stemUp as8
    \stemUp d8 \stemUp as8 \stemUp es8 ] \stemUp a,8 [ \stemUp es'8
    \stemUp as8 \stemUp d8 \stemUp as8 \stemUp es8 ] | % 111
    \time 2/4  \stemUp a,8 [ \stemUp es'8 \stemUp as8 \stemUp d8 ] | % 112
    \time 3/4  \stemUp as8 [ \stemUp es8 \stemUp a,8 \stemUp es'8
    \stemUp as8 \stemUp d8 ] \stemUp as8 r8 s2 \break | % 114
    \time 2/4  \change Staff="1" \stemDown b''4 _. \stemDown f4 _.
    \change Staff="2" \stemDown b,4 ^. \stemDown f4 ^. \stemDown b,4 _.
    \stemDown f4 _. | % 117
    \stemUp a,8 ^> [ ^\> \stemUp es'8 \stemUp as8 \stemUp d8 ] \stemUp
    as8 [ -\! \stemUp es8 \stemUp a,8 \stemUp es'8 ] \stemUp as8 [
    \stemUp d8 \stemUp as8 \stemUp es8 ] \stemUp a,8 [ \stemUp es'8
    \stemUp as8 \stemUp d8 ] \break \stemUp as8 [ \stemUp es8 \stemUp a,8
    \stemUp es'8 ] | % 122
    \time 3/4  \stemUp as8 [ \stemUp d8 \stemUp as8 \stemUp es8 ]
    \stemUp a,8 [ \stemUp es'8 ] | % 123
    \numericTimeSignature\time 4/4  \stemUp as8 r8 \clef "treble"
    \ottava #1 \change Staff="1" \stemDown <bes'''' es>16 [ \change
    Staff="2" \stemUp <e, a>16 \change Staff="1" \stemDown <bes' es>8 ]
    \stemDown <f bes>16 [ \change Staff="2" \stemUp <b, e>16 \change
    Staff="1" \stemDown <f' bes>8 ] \change Staff="2" \ottava #0 r4 | % 124
    \time 3/4  s2. | % 125
    \time 2/4  s2 \pageBreak s2 | % 127
    \clef "bass" s2 | % 128
    \time 3/4  s2. | % 129
    \time 2/4  \stemUp a,,,,,8 [ \stemUp es'8 \stemUp as8 \stemUp d8 ]
    \stemUp as8 [ \stemUp es8 \stemUp a,8 \stemUp es'8 ] | % 131
    \time 3/4  \stemUp as8 [ \stemUp d8 \stemUp as8 \stemUp es8 ]
    \stemUp a,8 [ \stemUp es'8 ] \break \stemUp as8 [ \stemUp d8 \stemUp
    as8 \stemUp es8 ] \stemUp a,8 [ \stemUp es'8 ] | % 133
    \time 1/4  \stemUp as8 _> r8 | % 134
    \clef "treble" \time 5/8 s4*5 | % 136
    \clef "bass" s4*5 \break | % 138
    \time 2/4  \stemUp <f, f'>4 _> \stemDown e''8 [ \stemDown g8 ]
    \stemDown e8 [ \stemDown b'8 \stemDown b8 \stemDown g8 ] |
    \barNumberCheck #140
    \time 3/4  \stemDown e8 [ \stemDown g8 \stemDown e8 \stemDown g8
    \stemDown a8 \stemDown g8 ] | % 141
    \time 2/4  \stemDown <fis b>8 [ \stemDown <a d>8 \stemDown <fis b>8
    \stemDown <a d>8 ] \stemDown <fis b>8 [ \stemDown cis'8 \stemDown
    cis8 \stemDown a8 ] | % 143
    \time 3/4  \stemDown <fis b>8 [ \stemDown <a d>8 \stemDown <fis b>8
    \stemDown <a d>8 \stemDown b8 \stemDown <a d>8 ] \pageBreak | % 144
    \time 2/4  \stemDown <cis, fis>8 [ \stemDown <e a>8 \stemDown <cis
        fis>8 \stemDown <e a>8 ] \stemDown <cis fis>8 [ \stemDown <e a>8
    \stemDown <cis fis>8 \stemDown <e a>8 ] | % 146
    \time 3/4  \stemDown <cis fis>8 [ \stemDown <e a>8 \stemDown <cis
        fis>8 \stemDown <e a>8 \stemDown <cis fis>8 \stemDown <e a>8 ]
    \stemDown <cis fis>8 [ \stemDown <e a>8 \stemDown <cis fis>8
    \stemDown <e a>8 \stemDown <cis fis>8 \stemDown <e a>8 ] \stemDown
    <d g>8 ^> [ \stemDown <f bes>8 \stemDown <d g>8 \stemDown <f bes>8
    \stemDown <d g>8 \stemDown <f bes>8 ] \stemDown <d g>8 [ \stemDown
    <f bes>8 \stemDown <d g>8 \stemDown <f bes>8 \stemDown <d g>8
    \stemDown <f bes>8 ] \break \stemDown <c f>8 ^> [ \stemDown <es as>8
    \stemDown <c f>8 \stemDown <es as>8 \stemDown <c f>8 \stemDown <es
        as>8 ] \stemDown <c f>8 [ \stemDown <es as>8 \stemDown <c f>8
    \stemDown <es as>8 \stemDown <c f>8 \stemDown <es as>8 ] \stemUp
    <gis, dis'>8 _> [ \stemUp gis'8 ] \stemUp <f, cis'>8 _> [ \stemUp
    fis'8 ] \stemUp <dis, ais'>8 _> [ \stemUp dis'8 ] \stemUp <gis,
        dis'>8 _> [ \stemUp gis'8 ] \stemUp <fis, cis'>8 _> [ \stemUp
    fis'8 ] \stemUp <dis, ais'>8 _> [ \stemUp dis'8 ] \stemUp <gis,
        dis'>8 _> [ \stemUp gis'8 ] \stemUp <fis, cis'>8 _> [ \stemUp
    fis'8 ] \stemUp <dis, ais'>8 _> [ \stemUp dis'8 ] \break \stemUp
    <gis, dis'>8 _> [ \stemUp gis'8 ] \stemUp <fis, cis'>8 _> [ \stemUp
    fis'8 ] \stemUp <dis, ais'>8 _> [ \stemUp dis'8 ] | % 156
    \numericTimeSignature\time 4/4  \stemUp <fis, cis'>8 _> [ \stemUp
    fis'8 ] \stemUp <dis, ais'>8 _> [ \stemUp dis'8 ] \stemUp <fis,
        cis'>8 _> [ \stemUp fis'8 ] \stemUp <dis, ais'>8 _> [ \stemUp
    dis'8 ] \stemUp <fis, cis'>8 _> [ \stemUp fis'8 ] \stemUp <dis,
        ais'>8 _> [ \stemUp dis'8 ] \stemUp <fis, cis'>8 _> [ \stemUp
    fis'8 ] \stemUp <dis, ais'>8 _> [ \stemUp dis'8 ] \stemUp <fis,
        cis'>8 _> [ \stemUp fis'8 _> ] \stemUp <dis, ais'>8 _> [ \stemUp
    dis'8 _> ] r2 \break f4 \rest \clef "treble" \once \omit
    TupletNumber
    \times 8/13  {
        \stemUp <f' bes c>32 [ _
        "1）按同音反复演奏，逐渐渐慢。" \stemUp <\tweak
            style ##f bes \tweak style ##f c>32 \stemUp <\tweak style
            ##f bes \tweak style ##f c>32 \stemUp <\tweak style ##f bes
            \tweak style ##f c>32 \once \override NoteHead.style = ##f
        \stemUp b32 \once \override NoteHead.style = ##f \stemUp b32
        \once \override NoteHead.style = ##f \stemUp b32 \once \override
        NoteHead.style = ##f \stemUp b32 \once \override NoteHead.style
        = ##f \stemUp b32 \stemUp <\tweak style ##f bes \tweak style ##f
            c>32 \stemUp <\tweak style ##f bes \tweak style ##f c>32
        \stemUp <\tweak style ##f bes \tweak style ##f c>32 \stemUp
        <\tweak style ##f bes \tweak style ##f c>32 ] }
    \stemUp <f bes c>2 ^\fermata ^\markup{ \bold\italic {lunga} }
    \ottava #1 <as' es'>1 \ottava #0 \bar "|."
    }

PartPOneVoiceTwo =  \relative a'' {
    \clef "treble" \key c \major \time 2/4 \stemDown <a d>8 _> s4.
    \stemDown <a, d>8 _> s4. | % 3
    \time 3/4  \stemDown <as' a d>8 _> s8 \stemDown <as a d>8 _> s4. | % 4
    \time 2/4  \stemDown <as, a d>8 _> s8*7 \break s2 | % 7
    \time 3/4  s4*9 | \barNumberCheck #10
    \time 2/4  s1. \break s1*3 \break s2 | \barNumberCheck #20
    \time 3/4  s1. | % 22
    \time 2/4  s2 | % 23
    \time 3/4  s2. \pageBreak | % 24
    \time 2/4  \stemDown g2 \stemDown f2 \stemDown e2 \stemDown f2
    \stemDown fis4. -\! \stemDown g8 \stemDown a8 s4. | \barNumberCheck
    #30
    \time 3/4  s2. \break | % 31
    \time 2/4  s1. \stemDown <a' bes es>8 e8 \rest \stemDown b'8 _. [
    \stemDown f8 _. ] \ottava #0 | % 35
    \time 3/4  \stemDown <a, bes es>8 c,8 \rest \stemDown b'8 _. [
    \stemDown f8 _. ] c4 \rest \stemDown b''8 _. [ \stemDown f8 _. ] s2
    \break | % 37
    \time 2/4  s2 | % 38
    \time 3/4  s2. | % 39
    \time 2/4  \stemDown b4 _. \stemDown f4 _. \ottava #0 s1. \break
    s2*7 \pageBreak s1. | % 53
    \time 3/4  s1. | % 55
    \time 2/4  s2 \break s2 | % 57
    \time 3/4  s1. | % 59
    \time 2/4  s1. \pageBreak s2*7 \break \stemDown a,2 \stemDown gis2
    \stemDown g2 \stemDown fis2 | % 73
    \time 3/4  \stemDown f4. \stemDown e4. \stemDown f4. \stemDown fis4.
    \break \stemDown g4. \stemDown gis4 s8 | % 76
    \time 2/4  \stemDown a2 | % 77
    \time 3/4  \stemDown b8 -\! s8*11 | % 79
    \numericTimeSignature\time 4/4  s1*2 \break | % 81
    \time 3/4  s4*15 | % 86
    \time 5/4  s4*5 \pageBreak | % 87
    \time 3/4  s2. | % 88
    \time 2/4  s2 \stemDown des2 | \barNumberCheck #90
    \time 3/4  s1. -\! | % 92
    \time 2/4  \stemDown as'4 \stemDown ges4 \break | % 93
    \numericTimeSignature\time 4/4  s1 | % 94
    \time 3/4  s2*5 \stemDown es2 | % 98
    \numericTimeSignature\time 4/4  s1 \pageBreak | % 99
    \time 3/4  s2. | \barNumberCheck #100
    \time 5/8  s4*5 | % 102
    \time 4/8  s1 | % 104
    \time 3/8  s2. | % 106
    \time 2/8  s2 \break | % 108
    \time 3/4  s4*9 | % 111
    \time 2/4  s2 | % 112
    \time 3/4  s1 \stemDown b'4 _. \stemDown f4 _. \ottava #0 \break | % 114
    \time 2/4  s2*7 \break \stemDown e,2 | % 122
    \time 3/4  \stemDown f2. | % 123
    \numericTimeSignature\time 4/4  \stemDown g8 s8*7 \ottava #0 | % 124
    \time 3/4  s2. | % 125
    \time 2/4  s2 \pageBreak s1 | % 128
    \time 3/4  s2. | % 129
    \time 2/4  s1 | % 131
    \time 3/4  s2. \break \stemDown fis2. | % 133
    \time 1/4  \stemDown a8 _> s8 | % 134
    \time 5/8  s2*5 \break | % 138
    \time 2/4  s1 | \barNumberCheck #140
    \time 3/4  s2. | % 141
    \time 2/4  s1 | % 143
    \time 3/4  s2. \pageBreak | % 144
    \time 2/4  s1 | % 146
    \time 3/4  s1*3 \break s4*15 \break s2. | % 156
    \numericTimeSignature\time 4/4  s1*3 \break s1*2 \bar "|."
    }

PartPOneVoiceFour =  \relative e,, {
    \clef "bass" \key c \major \time 2/4 s1 | % 3
    \time 3/4  s2. | % 4
    \time 2/4  s1 \break s2 | % 7
    \time 3/4  s4*9 | \barNumberCheck #10
    \time 2/4  s1. \break s1*3 \break s2 | \barNumberCheck #20
    \time 3/4  s1. | % 22
    \time 2/4  s2 | % 23
    \time 3/4  s4 \clef "treble" s2 \pageBreak | % 24
    \clef "bass" \time 2/4 s1*3 | \barNumberCheck #30
    \time 3/4  s2. \break | % 31
    \time 2/4  s1*2 | % 35
    \time 3/4  s1. \break | % 37
    \time 2/4  s2 | % 38
    \time 3/4  s2. | % 39
    \time 2/4  s1*2 \break s2*7 \pageBreak s1. | % 53
    \time 3/4  s1. | % 55
    \time 2/4  s2 \break s2 | % 57
    \time 3/4  s1. | % 59
    \time 2/4  s1. \pageBreak s2*7 \break s1*2 | % 73
    \time 3/4  s1. \break s2. | % 76
    \time 2/4  s2 | % 77
    \time 3/4  s1. | % 79
    \clef "treble" \numericTimeSignature\time 4/4 s1*2 \break | % 81
    \time 3/4  s4*15 | % 86
    \time 5/4  s4*5 \pageBreak | % 87
    \time 3/4  s2. | % 88
    \time 2/4  s1 | \barNumberCheck #90
    \time 3/4  s1. | % 92
    \time 2/4  s2 \break | % 93
    \numericTimeSignature\time 4/4  s1 | % 94
    \time 3/4  s1. | % 96
    \clef "bass" s1. | % 98
    \numericTimeSignature\time 4/4  s1 \pageBreak | % 99
    \time 3/4  s2. | \barNumberCheck #100
    \time 5/8  s4*5 | % 102
    \time 4/8  s1 | % 104
    \time 3/8  s2. | % 106
    \time 2/8  s2 \break | % 108
    \time 3/4  s4*9 | % 111
    \time 2/4  s2 | % 112
    \time 3/4  s1. \break | % 114
    \time 2/4  s2*7 \break s2 | % 122
    \time 3/4  s2. | % 123
    \numericTimeSignature\time 4/4  s4 \clef "treble" s2. | % 124
    \time 3/4  s2. | % 125
    \time 2/4  s2 \pageBreak s2 | % 127
    \clef "bass" s2 | % 128
    \time 3/4  s2. | % 129
    \time 2/4  s1 | % 131
    \time 3/4  s2. \break s2. | % 133
    \time 1/4  s4 | % 134
    \clef "treble" \time 5/8 s4*5 | % 136
    \clef "bass" s4*5 \break | % 138
    \time 2/4  s1 | \barNumberCheck #140
    \time 3/4  s2. | % 141
    \time 2/4  s1 | % 143
    \time 3/4  s2. \pageBreak | % 144
    \time 2/4  s1 | % 146
    \time 3/4  s1*3 \break s4*15 \break s2. | % 156
    \numericTimeSignature\time 4/4  s1*3 \break s4 _\fermata _^ \clef
    "treble" s4*7 \bar "|."
    }


% The score definition
\score {
    <<
        
        \new PianoStaff
        <<
            
            \context Staff = "1" << 
                \mergeDifferentlyDottedOn\mergeDifferentlyHeadedOn
                \context Voice = "PartPOneVoiceOne" {  \voiceOne \PartPOneVoiceOne }
                \context Voice = "PartPOneVoiceTwo" {  \voiceTwo \PartPOneVoiceTwo }
                >> \context Staff = "2" <<
                \mergeDifferentlyDottedOn\mergeDifferentlyHeadedOn
                \context Voice = "PartPOneVoiceThree" {  \voiceOne \PartPOneVoiceThree }
                \context Voice = "PartPOneVoiceFour" {  \voiceTwo \PartPOneVoiceFour }
                >>
            >>
        
        >>
    \layout {}
    % To create MIDI output, uncomment the following line:
    %  \midi {\tempo 4 = 120 }
    }
