
\version "2.18.2"
% automatically converted by musicxml2ly from No.043.xml

\header {
    encodingsoftware = "Finale v25 for Mac"
    encodingdate = "2019-04-02"
    composer = "C.Czerny"
    copyright = "©"
    title = "            Exercises
with Rests and other Signs"
    }

#(set-global-staff-size 22.6344518504)
\paper {
    paper-width = 21.0\cm
    paper-height = 29.71\cm
    top-margin = 0.99\cm
    bottom-margin = 1.67\cm
    left-margin = 0.99\cm
    right-margin = 0.89\cm
    between-system-space = 3.54\cm
    page-top-space = 2.66\cm
    }
\layout {
    \context { \Score
        autoBeaming = ##f
        }
    }
PartPOneVoiceOne =  \relative e' {
    \repeat volta 2 {
        \clef "treble" \key c \major \time 4/4 \partial 4 r4 ^\markup{
            \bold {Allegro moderato} } | % 1
        r4 \f <e g c>4 _. r4 <g c e>4 ^. | % 2
        r4 <c e g>4 ^. ^4 <e g c>4 ^. c'8 ( ^5 [ g8 ^2 ] | % 3
        e8 ^1 [ g8 ) ^2 g8 ^. ^3 g8 ^. ^4 ] a8 ( ^5 [ g8 ^4 e8 ^2 c8 )
        ^1 ] \break | % 4
        e2 ( ^2 d4 ) ^1 g16 \p ( ^3 [ b16 ^5 a16 g16 ] | % 5
        fis2. ) ^2 fis16 ( ^1 [ c'16 ^5 a16 ^3 fis16 ^2 ] | % 6
        g2. ) ^1 g16 ( ^1 [ d'16 ^4 b16 ^2 g16 ^1 ] \break | % 7
        e'4 ) r8 \< <e, c'>8 ^5 <d b'>8 ^5 [ <c a'>8 ^5 <b g'>8 ^5 <a
            fis'>8 \! ^4 ] | % 8
        <b g'>4 \f ^. <b d g>4 ^. <b d g>4 ^. }
    s4 \repeat volta 2 {
        | % 9
        a'16 ( ^4 [ g16 \p a16 g16 ] s2. | \barNumberCheck #10
        d2. ) a'16 ( ^4 [ g16 a16 g16 ] \pageBreak e2. ) ^1 a16 ( ^5 [ g16
        ^4 a16 g16 ] b,4 ) ^. ^1 <g b>4 _. ^1 ^2 <g c>4 _. <g e'>4 ^. | % 13
        <g d'>4 ^. r4 _\markup{ \bold\italic {cresc.} } r2 | % 14
        <e g c>4 \f _. ^5 <g c e>4 ^. ^5 <c e g>4 ^. ^4 <e g c>4 ^. ^3
        ^5 \break | % 15
        <c f a>4 ^. ^2 ^4 <f a c>2 ^> ^5 b16 ( ^4 [ a16 g16 f16 ] | % 16
        e4 ) ^2 a16 ( ^5 [ g16 a16 g16 ] d4 ) a'16 ( ^4 [ g16 a16 g16 ]
        | % 17
        c,4 ) <e, g c>4 _. <e g c>4 _. }
    }

PartPOneVoiceTwo =  \relative c {
    \repeat volta 2 {
        \clef "bass" \key c \major \time 4/4 \partial 4 r4 | % 1
        <c e g>4 ^. r4 <c e g>4 ^. r4 | % 2
        <c e g>4 ^. <c e g>4 ^. <c e g>4 ^. r4 | % 3
        <c e g>4 ^. r4 <e g c>4 ^. _5 r4 \break | % 4
        r4 <g c>4 ^. _4 <g b>4 ^. r4 | % 5
        r4 <a c d>4 ^. <a c d>4 ^. r4 | % 6
        r4 <b d>4 ^. <b d>4 ^. r4 \break | % 7
        <c, e g>4 ^. c4 _. _2 d4 ^. ^1 d,4 _. | % 8
        g4 _. _3 <g b d>4 _. _4 <g b d>4 _. }
    s4 \repeat volta 2 {
        | % 9
        r4 s2. | \barNumberCheck #10
        r4 <g' b f'>4 ^. <g b f'>4 ^. r4 \pageBreak | % 11
        \clef "treble" r4 <c e g>4 _. _4 <c e g>4 _. r4 | % 12
        \clef "bass" <g d' f>4 ^. <g d' f>4 \< ^. <g c e>4 ^. <g c e>4
        \! ^. | % 13
        <g b d>4 ^. g,8 ( _5 [ b8 _4 ] d8 \< _2 [ g8 _1 f8 _2 d8 \! ) ]
        | % 14
        <c e g>4 ^. <c e g>4 ^. <c e g>4 ^. <c e g>4 ^. \break | % 15
        <f a c>4 ^. _4 <f a c>4 ^. <f a c>4 ^. r4 | % 16
        <g, c e>4 _. r4 <g b f'>4 _. r4 | % 17
        <c e>4 ^. _2 <c e g>4 ^. _1 _5 <c e g>4 ^. }
    }


% The score definition
\score {
    <<
        \new PianoStaff <<
            \context Staff = "1" << 
                \context Voice = "PartPOneVoiceOne" { \PartPOneVoiceOne }
                >> \context Staff = "2" <<
                \context Voice = "PartPOneVoiceTwo" { \PartPOneVoiceTwo }
                >>
            >>
        
        >>
    \layout {}
    % To create MIDI output, uncomment the following line:
    %  \midi {}
    }
